import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { adminMintImpersonation } from "@/lib/connect-session";

const ImpersonatePanel = () => {
  const { toast } = useToast();
  const [type, setType] = useState<"candidate" | "brand_rep">("candidate");
  const [lookup, setLookup] = useState("");
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  const mint = async () => {
    setBusy(true); setUrl(null);
    try {
      const res = await adminMintImpersonation({ subject_type: type, lookup });
      setUrl(res.url);
    } catch (e: any) {
      toast({ title: "Couldn't impersonate", description: e.message, variant: "destructive" });
    }
    setBusy(false);
  };

  return (
    <section className="bg-events-card border border-events-cream/10 rounded-2xl p-5 space-y-3">
      <h3 className="font-display text-events-cream text-lg">Impersonate user</h3>
      <p className="text-events-cream/60 font-body text-xs">View the candidate or brand rep experience as them. A banner shows on every page.</p>
      <div className="flex gap-2">
        <select value={type} onChange={(e) => setType(e.target.value as any)}
          className="bg-events-cream/5 border border-events-cream/15 text-events-cream rounded-md h-10 px-3 text-sm font-body">
          <option value="candidate">Candidate</option>
          <option value="brand_rep">Brand rep</option>
        </select>
        <Input value={lookup} onChange={(e) => setLookup(e.target.value)} placeholder={type === "candidate" ? "email or 'first last'" : "'first last'"} />
        <Button onClick={mint} disabled={busy || !lookup} className="bg-events-coral text-events-cream">Mint link</Button>
      </div>
      {url && (
        <div className="text-xs font-body text-events-cream/80 break-all">
          <Label className="text-events-cream/60 uppercase tracking-wider mb-1 block">One-time URL</Label>
          <a href={url} target="_blank" rel="noreferrer" className="text-events-coral underline">{url}</a>
        </div>
      )}
    </section>
  );
};

export default ImpersonatePanel;
