import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";

interface Spotlight {
  id: string;
  category: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
}

const CATEGORIES = ["Brands", "Beverages", "Food", "Giveaways & Swag"];

const AfterPartySpotlightsAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Spotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    const { data } = await (supabase as any)
      .from("afterparty_spotlights")
      .select("*")
      .order("display_order");
    setItems((data as Spotlight[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    if (!name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    setSaving(true);
    let logo_url: string | null = null;
    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const path = `afterparty-spotlights/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("event-photos").upload(path, logoFile);
      if (uploadErr) {
        toast({ title: "Upload failed", description: uploadErr.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      logo_url = supabase.storage.from("event-photos").getPublicUrl(path).data.publicUrl;
    }
    const nextOrder = (items[items.length - 1]?.display_order ?? -1) + 1;
    const { error } = await (supabase as any).from("afterparty_spotlights").insert({
      category,
      name: name.trim(),
      description: description.trim() || null,
      website_url: websiteUrl.trim() || null,
      logo_url,
      display_order: nextOrder,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    setName(""); setDescription(""); setWebsiteUrl(""); setLogoFile(null);
    if (fileRef.current) fileRef.current.value = "";
    toast({ title: "Spotlight added" });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this spotlight?")) return;
    const { error } = await (supabase as any).from("afterparty_spotlights").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    fetchItems();
  };

  const grouped = CATEGORIES.map((c) => ({
    category: c,
    list: items.filter((i) => i.category === c),
  })).concat(
    Array.from(new Set(items.map((i) => i.category)))
      .filter((c) => !CATEGORIES.includes(c))
      .map((c) => ({ category: c, list: items.filter((i) => i.category === c) }))
  );

  return (
    <div className="rounded-xl border border-events-cream/10 p-4 space-y-4">
      <div>
        <h3 className="font-display font-bold text-events-cream">Brand spotlights</h3>
        <p className="text-xs text-events-cream/50 mt-1">
          Highlight Brands, Beverages, Food, and Giveaways & Swag with a description and a link.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-black/30 border border-events-cream/20 text-events-cream rounded-md px-3 h-10 text-sm"
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <Input
          placeholder="Brand / item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-black/30 border-events-cream/20 text-events-cream"
        />
        <Input
          placeholder="Website URL (optional)"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className="bg-black/30 border-events-cream/20 text-events-cream"
        />
        <label className="cursor-pointer inline-flex items-center justify-center px-3 h-10 rounded-md text-sm bg-events-cream/10 text-events-cream hover:bg-events-cream/20">
          <Upload className="w-4 h-4 mr-2" />
          {logoFile ? logoFile.name.slice(0, 18) : "Logo image"}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>
      <Textarea
        placeholder="Short description: how attendees engage with them or what they're contributing"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="bg-black/30 border-events-cream/20 text-events-cream min-h-[60px]"
      />
      <div className="flex justify-end">
        <Button onClick={handleAdd} disabled={saving} className="bg-events-coral text-events-cream">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          Add spotlight
        </Button>
      </div>

      {loading ? (
        <p className="text-xs text-events-cream/50">Loading…</p>
      ) : !items.length ? (
        <p className="text-xs text-events-cream/50">No spotlights yet.</p>
      ) : (
        <div className="space-y-4">
          {grouped.map(({ category: cat, list }) => (
            list.length > 0 && (
              <div key={cat}>
                <div className="text-[11px] uppercase tracking-wider text-events-cream/60 mb-1.5">{cat}</div>
                <div className="space-y-1.5">
                  {list.map((s) => (
                    <div key={s.id} className="flex items-start gap-3 px-3 py-2 rounded-md bg-events-cream/5 border border-events-cream/10">
                      {s.logo_url ? (
                        <img src={s.logo_url} alt={s.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-events-cream/10 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-events-cream">{s.name}</div>
                        {s.description && (
                          <div className="text-xs text-events-cream/60 mt-0.5">{s.description}</div>
                        )}
                        {s.website_url && (
                          <div className="text-xs text-events-cream/40 truncate mt-0.5">{s.website_url}</div>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default AfterPartySpotlightsAdmin;
