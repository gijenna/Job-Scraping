import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Row = { email: string; name: string };

const parseCsv = (text: string): Row[] => {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];
  // Detect header
  const first = lines[0].toLowerCase();
  const hasHeader = first.includes("email");
  const rows: Row[] = [];
  const seen = new Set<string>();
  const start = hasHeader ? 1 : 0;
  // Determine column indices
  let emailIdx = 0, nameIdx = 1;
  if (hasHeader) {
    const cols = lines[0].split(",").map((c) => c.trim().toLowerCase().replace(/"/g, ""));
    emailIdx = cols.findIndex((c) => c === "email" || c.includes("email"));
    nameIdx = cols.findIndex((c) => c === "name" || c.includes("name") || c.includes("first"));
    if (emailIdx < 0) emailIdx = 0;
  }
  for (let i = start; i < lines.length; i++) {
    const parts = lines[i].split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
    const email = (parts[emailIdx] || "").toLowerCase();
    if (!email.includes("@")) continue;
    if (seen.has(email)) continue;
    seen.add(email);
    const name = nameIdx >= 0 ? (parts[nameIdx] || "") : "";
    rows.push({ email, name });
  }
  return rows;
};

export const OutsideDays26ThanksSender = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;
    const text = await f.text();
    const parsed = parseCsv(text);
    setRows(parsed);
    setFileName(f.name);
    toast({ title: "CSV loaded", description: `${parsed.length} unique emails` });
  };

  const send = async (mode: "test" | "all") => {
    if (mode === "all") {
      if (!rows.length) {
        toast({ title: "No recipients", description: "Upload a CSV first.", variant: "destructive" });
        return;
      }
      const typed = prompt(`Send the OutsideDays26 thank-you to ${rows.length} recipients? Type SEND to confirm.`);
      if (typed !== "SEND") return;
    }
    setWorking(true);
    const { data, error } = await supabase.functions.invoke("send-outsidedays26-thanks", {
      body: { mode, recipients: rows },
    });
    setWorking(false);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    const d = data as any;
    toast({
      title: mode === "test" ? "Test sent to Jenna" : "OutsideDays26 emails queued",
      description: `Total: ${d?.total ?? 0} · Sponsors in email: ${d?.sponsorCount ?? "?"}`,
    });
  };

  const preview = useMemo(() => rows.slice(0, 5), [rows]);

  return (
    <div className="rounded-xl border border-events-coral/30 bg-events-coral/5 p-4">
      <h3 className="font-display font-bold text-events-cream mb-1">
        OutsideDays26 Career Fair thank-you
      </h3>
      <p className="text-xs text-events-cream/60 mb-3">
        Upload a CSV of attendees (columns: <code>email,name</code>) to send the thank-you + KUMA chair
        giveaway (feedback-survey entry). Pulls career-fair sponsors from the event map and the Edges
        First spotlight live.
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-events-cream/30 text-events-cream px-3 py-1.5 text-sm hover:bg-events-cream/10">
          <Upload className="w-4 h-4" />
          {fileName ? fileName : "Upload CSV"}
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] || null)}
          />
        </label>
        {rows.length > 0 && (
          <button
            onClick={() => { setRows([]); setFileName(null); }}
            className="inline-flex items-center gap-1 text-xs text-events-cream/60 hover:text-events-cream"
          >
            <X className="w-3 h-3" /> clear
          </button>
        )}
        <span className="text-xs text-events-cream/60 ml-auto">
          {rows.length} recipients
        </span>
      </div>

      {preview.length > 0 && (
        <div className="text-xs text-events-cream/60 mb-3 font-mono">
          Preview: {preview.map((r) => r.email).join(", ")}{rows.length > preview.length ? `, … +${rows.length - preview.length} more` : ""}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => send("test")} disabled={working} variant="outline" className="border-events-cream/30 text-events-cream">
          {working ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
          Send test to Jenna
        </Button>
        <Button onClick={() => send("all")} disabled={working || !rows.length} className="bg-events-coral text-events-cream">
          <Mail className="w-4 h-4 mr-2" />
          Send to all ({rows.length})
        </Button>
      </div>
    </div>
  );
};
