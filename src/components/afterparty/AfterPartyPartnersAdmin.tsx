import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { resolveLogoSrc } from "@/lib/url-logo";

interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
  category: string | null;
  description: string | null;
  title: string | null;
  expanded_description: string | null;
  photo_url: string | null;
  value: string | null;
  show_in_icon_grid: boolean | null;
}

const CATEGORIES = [
  "Brands",
  "Beverages",
  "Food",
  "Giveaways & Swag",
  // Party Features categories — drive the 6-icon grid modals
  "Noms",
  "DJ",
  "Giveaways",
  "Swag",
  "Experiences",
  "Guest List Description",
];

const uploadImage = async (file: File, folder: string): Promise<string | null> => {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("event-photos").upload(path, file);
  if (error) return null;
  return supabase.storage.from("event-photos").getPublicUrl(path).data.publicUrl;
};

const AfterPartyPartnersAdmin = () => {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [expandedDescription, setExpandedDescription] = useState("");
  const [value, setValue] = useState("");
  const [showInIconGrid, setShowInIconGrid] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

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
    const logo_url = logoFile ? await uploadImage(logoFile, "afterparty-partners") : null;
    const photo_url = photoFile ? await uploadImage(photoFile, "afterparty-partners-photos") : null;
    const nextOrder = (partners[partners.length - 1]?.display_order ?? -1) + 1;
    const { error } = await (supabase as any).from("afterparty_partners").insert({
      name: name.trim(),
      website_url: websiteUrl.trim() || null,
      logo_url,
      display_order: nextOrder,
      category: category || null,
      description: description.trim() || null,
      title: title.trim() || null,
      expanded_description: expandedDescription.trim() || null,
      photo_url,
      value: value.trim() || null,
      show_in_icon_grid: showInIconGrid,
    });
    setSaving(false);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    setName(""); setWebsiteUrl(""); setCategory(""); setDescription("");
    setTitle(""); setExpandedDescription(""); setValue(""); setShowInIconGrid(false);
    setLogoFile(null); setPhotoFile(null);
    if (fileRef.current) fileRef.current.value = "";
    if (photoRef.current) photoRef.current.value = "";
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

  const updateField = async (id: string, patch: Partial<Partner>) => {
    const { error } = await (supabase as any).from("afterparty_partners").update(patch).eq("id", id);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    fetchPartners();
  };

  const handleRowPhoto = async (id: string, file: File) => {
    const url = await uploadImage(file, "afterparty-partners-photos");
    if (!url) {
      toast({ title: "Photo upload failed", variant: "destructive" });
      return;
    }
    updateField(id, { photo_url: url });
  };

  return (
    <div className="rounded-xl border border-events-cream/10 p-4 space-y-4">
      <div>
        <h3 className="font-display font-bold text-events-cream">Partners &amp; Party Features</h3>
        <p className="text-xs text-events-cream/50 mt-1">
          Every partner shows as a bubble logo. Add a category + description for the
          "Community Partners" section. Check "Show in 6-icon grid" to surface it
          inside the corresponding Party Features modal (Noms, DJ, Giveaways, Swag,
          Experiences, or Guest List).
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-2">
        <Input
          placeholder="Partner / brand name"
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
        <Input
          placeholder='Title (e.g. "Win a Backcountry Tent" or "DJ Klutch")'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-black/30 border-events-cream/20 text-events-cream"
        />
        <Input
          placeholder='Value (e.g. "$500" or "$200 retail")'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-black/30 border-events-cream/20 text-events-cream"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-black/30 border border-events-cream/20 text-events-cream rounded-md px-3 h-10 text-sm"
        >
          <option value="">Bubble only (no category)</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="cursor-pointer inline-flex items-center justify-center px-3 h-10 rounded-md text-sm bg-events-cream/10 text-events-cream hover:bg-events-cream/20">
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
        <label className="cursor-pointer inline-flex items-center justify-center px-3 h-10 rounded-md text-sm bg-events-cream/10 text-events-cream hover:bg-events-cream/20 sm:col-span-2">
          <Upload className="w-4 h-4 mr-2" />
          {photoFile ? photoFile.name.slice(0, 22) : "Photo (product / scene, optional)"}
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>
      <Textarea
        placeholder="Short description (shown in Community Partners expanded view)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="bg-black/30 border-events-cream/20 text-events-cream min-h-[60px]"
      />
      <Textarea
        placeholder="Expanded description (longer copy for the Party Features modal)"
        value={expandedDescription}
        onChange={(e) => setExpandedDescription(e.target.value)}
        className="bg-black/30 border-events-cream/20 text-events-cream min-h-[60px]"
      />
      <label className="flex items-center gap-2 text-sm text-events-cream">
        <input
          type="checkbox"
          checked={showInIconGrid}
          onChange={(e) => setShowInIconGrid(e.target.checked)}
        />
        Show in 6-icon grid
      </label>
      <div className="flex justify-end">
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
              <div key={p.id} className="flex items-start gap-3 px-3 py-2 rounded-md bg-events-cream/5 border border-events-cream/10">
                {previewSrc ? (
                  <img src={previewSrc} alt={p.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-events-cream/10 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="text-sm text-events-cream truncate">{p.name}</div>
                  {p.website_url && (
                    <div className="text-xs text-events-cream/50 truncate">{p.website_url}</div>
                  )}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <select
                      value={p.category || ""}
                      onChange={(e) => updateField(p.id, { category: e.target.value || null })}
                      className="bg-black/40 border border-events-cream/20 text-events-cream rounded px-2 h-7 text-xs"
                    >
                      <option value="">Bubble only</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <label className="flex items-center gap-1 text-[11px] text-events-cream/80">
                      <input
                        type="checkbox"
                        checked={!!p.show_in_icon_grid}
                        onChange={(e) => updateField(p.id, { show_in_icon_grid: e.target.checked })}
                      />
                      In 6-icon grid
                    </label>
                  </div>
                  <Input
                    defaultValue={p.title || ""}
                    placeholder="Title"
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if ((p.title || "") !== v) updateField(p.id, { title: v || null });
                    }}
                    className="bg-black/40 border-events-cream/20 text-events-cream text-xs h-7"
                  />
                  <Input
                    defaultValue={p.value || ""}
                    placeholder='Value (e.g. "$500")'
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if ((p.value || "") !== v) updateField(p.id, { value: v || null });
                    }}
                    className="bg-black/40 border-events-cream/20 text-events-cream text-xs h-7"
                  />
                  <Textarea
                    defaultValue={p.description || ""}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if ((p.description || "") !== v) updateField(p.id, { description: v || null });
                    }}
                    placeholder="Short description"
                    className="bg-black/40 border-events-cream/20 text-events-cream text-xs min-h-[40px]"
                  />
                  <Textarea
                    defaultValue={p.expanded_description || ""}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if ((p.expanded_description || "") !== v) updateField(p.id, { expanded_description: v || null });
                    }}
                    placeholder="Expanded description (modal)"
                    className="bg-black/40 border-events-cream/20 text-events-cream text-xs min-h-[40px]"
                  />
                  <div className="flex items-center gap-2">
                    {p.photo_url && (
                      <img src={p.photo_url} alt="" className="w-10 h-10 rounded object-cover" />
                    )}
                    <label className="cursor-pointer inline-flex items-center px-2 h-7 rounded text-[11px] bg-events-cream/10 text-events-cream hover:bg-events-cream/20">
                      <Upload className="w-3 h-3 mr-1" />
                      {p.photo_url ? "Replace photo" : "Upload photo"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleRowPhoto(p.id, f);
                        }}
                      />
                    </label>
                    {p.photo_url && (
                      <button
                        type="button"
                        onClick={() => updateField(p.id, { photo_url: null })}
                        className="text-[11px] text-events-cream/60 underline"
                      >
                        clear
                      </button>
                    )}
                  </div>
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
