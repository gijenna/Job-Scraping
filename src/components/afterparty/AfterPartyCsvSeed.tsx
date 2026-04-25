import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Mail, Loader2, Trash2 } from "lucide-react";

interface ParsedRow {
  full_name: string;
  email: string;
  role: "creator" | "brand";
  company?: string;
  invited_by?: string;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Tiny CSV parser, handles quoted values + commas in quotes.
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cur += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n" || c === "\r") {
        if (cur || row.length) { row.push(cur); rows.push(row); row = []; cur = ""; }
        if (c === "\r" && text[i + 1] === "\n") i++;
      } else cur += c;
    }
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}

const AfterPartyCsvSeed = ({ onImported }: { onImported: () => void }) => {
  const { toast } = useToast();
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [sending, setSending] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCsv(text);
    if (!parsed.length) {
      toast({ title: "Empty CSV", variant: "destructive" });
      return;
    }
    // Detect header
    const header = parsed[0].map((h) => h.toLowerCase().trim());
    const dataRows = header.includes("name") || header.includes("full_name") || header.includes("email")
      ? parsed.slice(1) : parsed;
    const idxName = Math.max(header.indexOf("name"), header.indexOf("full_name"));
    const idxEmail = header.indexOf("email");
    const idxRole = header.indexOf("role");
    const idxCompany = header.indexOf("company");
    const idxInvitedBy = Math.max(header.indexOf("invited_by"), header.indexOf("invited by"));

    const out: ParsedRow[] = dataRows
      .map((r) => ({
        full_name: (idxName >= 0 ? r[idxName] : r[0])?.trim() || "",
        email: (idxEmail >= 0 ? r[idxEmail] : r[1])?.trim() || "",
        role: ((idxRole >= 0 ? r[idxRole] : r[2])?.trim().toLowerCase() === "brand" ? "brand" : "creator") as "creator" | "brand",
        company: (idxCompany >= 0 ? r[idxCompany] : r[3])?.trim() || undefined,
        invited_by: (idxInvitedBy >= 0 ? r[idxInvitedBy] : undefined)?.trim() || undefined,
      }))
      .filter((r) => r.full_name);
    setRows(out);
    e.target.value = "";
  };

  const commit = async () => {
    if (!rows.length) return;
    setImporting(true);
    const inserts = rows.map((r) => ({
      full_name: r.full_name,
      email: r.email || null,
      role: r.role,
      company: r.company || null,
      invited_by: r.invited_by || null,
      slug: slugify(r.full_name),
      status: "invited",
    }));
    const { error, count } = await (supabase as any)
      .from("afterparty_attendees")
      .insert(inserts, { count: "exact" });
    setImporting(false);
    if (error) {
      toast({ title: "Import failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Imported", description: `${count ?? rows.length} attendees added.` });
    setRows([]);
    onImported();
  };

  const sendInvites = async () => {
    if (!confirm("Send invite emails to all attendees with status='invited'?")) return;
    setSending(true);
    const { data, error } = await supabase.functions.invoke("send-afterparty-invites", {
      body: { only_invited: true },
    });
    setSending(false);
    if (error) {
      toast({ title: "Send failed", description: error.message, variant: "destructive" });
      return;
    }
    const r = data as any;
    toast({
      title: "Invites sent",
      description: `Sent: ${r?.sent ?? 0} · Skipped: ${r?.skipped ?? 0}${r?.errors?.length ? ` · Errors: ${r.errors.length}` : ""}`,
    });
  };

  return (
    <div className="rounded-xl border border-events-cream/10 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-events-cream">Seed invitees from CSV</h3>
          <p className="text-xs text-events-cream/50 mt-1">
            Columns: <code>name, email, role, company</code> (role = creator|brand)
          </p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
            <span className="inline-flex items-center px-3 py-2 rounded-md text-sm bg-events-cream/10 text-events-cream hover:bg-events-cream/20">
              <Upload className="w-4 h-4 mr-2" /> Choose CSV
            </span>
          </label>
          <Button
            onClick={sendInvites}
            disabled={sending}
            variant="outline"
            className="border-events-cream/30 text-events-cream"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
            Send invites to all "invited"
          </Button>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-events-cream/70">{rows.length} rows ready to import</p>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setRows([])} className="text-events-cream/60">
                <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
              </Button>
              <Button
                size="sm"
                onClick={commit}
                disabled={importing}
                className="bg-events-coral text-events-cream"
              >
                {importing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Commit {rows.length} attendees
              </Button>
            </div>
          </div>
          <div className="max-h-48 overflow-auto rounded border border-events-cream/10">
            <table className="w-full text-xs text-events-cream">
              <thead className="bg-events-cream/5 sticky top-0">
                <tr>
                  <th className="text-left px-2 py-1">Name</th>
                  <th className="text-left px-2 py-1">Email</th>
                  <th className="text-left px-2 py-1">Role</th>
                  <th className="text-left px-2 py-1">Company</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-events-cream/10">
                    <td className="px-2 py-1">{r.full_name}</td>
                    <td className="px-2 py-1 text-events-cream/70">{r.email || ", "}</td>
                    <td className="px-2 py-1 capitalize">{r.role}</td>
                    <td className="px-2 py-1 text-events-cream/70">{r.company || ", "}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AfterPartyCsvSeed;
