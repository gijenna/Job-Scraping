import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { resolveLogoSrc } from "@/lib/url-logo";

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
}

const AfterPartyPartnersAdmin = () => {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPartners = async () => {
    const { data } = await (supabase as any)
      .from("afterparty_partners")
      .select("*")
      .order("display_order");
    setPartners((data as Partner[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPartners(); }, []);

  const handleAdd = async () => {
    if (!name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    setSaving(true);
    let logo_url: string | null = null;
    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const path = `afterparty-partners/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("event-photos").upload(path, logoFile);
      if (uploadErr) {
        toast({ title: "Upload failed", description: uploadErr.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      logo_url = supabase.storage.from("event-photos").getPublicUrl(path).data.publicUrl;
    }
    const nextOrder = (partners[partners.length - 1]?.display_order ?? -1) + 1;
    const { error } = await (supabase as any).from("afterparty_partners").insert({
      name: name.trim(),
      website_url: websiteUrl.trim() || null,
      logo_url,
      display_order: nextOrder,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    setName(""); setWebsiteUrl(""); setLogoFile(null);
    if (fileRef.current) fileRef.current.value = "";
    toast({ title: "Partner added" });
    fetchPartners();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this partner?")) return;
    const { error } = await (supabase as any).from("afterparty_partners").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    fetchPartners();
  };

  return (
    <div className="rounded-xl border border-events-cream/10 p-4 space-y-4">
      <div>
        <h3 className="font-display font-bold text-events-cream">Partners (bubble logos)</h3>
        <p className="text-xs text-events-cream/50 mt-1">
          Once at least one is added, the invite page shows "Thanks to our partners".
        </p>
      </div>

      <div className="grid sm:grid-cols-4 gap-2">
        <Input
          placeholder="Partner name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-black/30 border-events-cream/20 text-events-cream"
        />
        <Input
          placeholder="Website URL (auto-pulls logo)"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className="bg-black/30 border-events-cream/20 text-events-cream"
        />
        <label className="cursor-pointer inline-flex items-center justify-center px-3 py-2 rounded-md text-sm bg-events-cream/10 text-events-cream hover:bg-events-cream/20">
          <Upload className="w-4 h-4 mr-2" />
          {logoFile ? logoFile.name.slice(0, 16) : "Custom logo (optional)"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          />
        </label>
        <Button onClick={handleAdd} disabled={saving} className="bg-events-coral text-events-cream">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Add
        </Button>
      </div>

      {loading ? (
        <p className="text-xs text-events-cream/50">Loading…</p>
      ) : !partners.length ? (
        <p className="text-xs text-events-cream/50">No partners yet.</p>
      ) : (
        <div className="space-y-1.5">
          {partners.map((p) => {
            const previewSrc = resolveLogoSrc(p.logo_url, p.website_url);
            return (
            <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded-md bg-events-cream/5 border border-events-cream/10">
              {previewSrc ? (
                <img src={previewSrc} alt={p.name} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-events-cream/10" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-events-cream truncate">{p.name}</div>
                {p.website_url && (
                  <div className="text-xs text-events-cream/50 truncate">{p.website_url}</div>
                )}
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AfterPartyPartnersAdmin;
