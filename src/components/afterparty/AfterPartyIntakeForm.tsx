import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

const NICHES = ["Hiking", "Climbing", "Fishing", "Hunting", "Surfing", "Skiing", "Snowboarding", "Trail Running", "Cycling", "Camping", "Kayaking", "Mountain Biking", "Backpacking", "Photography"];
const CREATOR_TYPES = ["videographer", "photographer", "influencer", "writer", "podcaster", "athlete"];
const PLATFORMS = ["Instagram", "TikTok", "YouTube", "LinkedIn", "Substack", "Twitch", "X / Twitter", "Podcast"];
const CREATOR_LOOKING_FOR = ["Brand partnerships", "Paid work", "Friends", "Mentors", "Fellow creators"];
const BRAND_LOOKING_FOR = ["videographers", "photographers", "influencers", "writers", "athletes", "ambassadors", "friends/connections", "talent pipeline"];
const AUDIENCE_SIZES = ["< 1K", "1K – 10K", "10K – 50K", "50K – 250K", "250K – 1M", "1M+"];
const BUDGET_RANGES = ["No budget yet", "< $1K / project", "$1K – $5K", "$5K – $25K", "$25K+"];

interface Props {
  attendeeId: string | null;
  initial?: any;
  onSaved: (id: string) => void;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AfterPartyIntakeForm = ({ attendeeId, initial, onSaved }: Props) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [otherNiche, setOtherNiche] = useState("");
  const [otherLookingFor, setOtherLookingFor] = useState("");
  const [form, setForm] = useState<any>({
    role: "creator",
    full_name: "",
    email: "",
    photo_url: "",
    social_links: { instagram: "", linkedin: "" },
    niches: [],
    looking_for: [],
    creator_types: [],
    audience_size: "",
    platforms: [],
    brands_wishlist: "",
    mind_blowing_fact: "",
    company: "",
    company_role: "",
    brand_seeking: [],
    budget_range: "",
    brand_fit_notes: "",
  });

  useEffect(() => {
    if (initial) setForm({ ...form, ...initial, social_links: initial.social_links || { instagram: "", linkedin: "" } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.id]);

  const toggle = (field: string, value: string) => {
    setForm((f: any) => {
      const arr: string[] = f[field] || [];
      return { ...f, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `afterparty/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("event-photos").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      const { data: urlData } = supabase.storage.from("event-photos").getPublicUrl(path);
      setForm((f: any) => ({ ...f, photo_url: urlData.publicUrl }));
    }
    setUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    setSaving(true);

    const payload: any = {
      full_name: form.full_name.trim(),
      slug: slugify(form.full_name) + (attendeeId ? "" : `-${Date.now().toString(36).slice(-4)}`),
      email: form.email || null,
      photo_url: form.photo_url || null,
      social_links: form.social_links,
      role: form.role,
      niches: form.niches,
      looking_for: form.looking_for,
      creator_types: form.role === "creator" ? form.creator_types : [],
      audience_size: form.role === "creator" ? form.audience_size || null : null,
      platforms: form.role === "creator" ? form.platforms : [],
      brands_wishlist: form.role === "creator" ? form.brands_wishlist || null : null,
      mind_blowing_fact: form.role === "creator" ? form.mind_blowing_fact || null : null,
      company: form.role === "brand" ? form.company || null : null,
      company_role: form.role === "brand" ? form.company_role || null : null,
      brand_seeking: form.role === "brand" ? form.brand_seeking : [],
      budget_range: form.role === "brand" ? form.budget_range || null : null,
      brand_fit_notes: form.role === "brand" ? form.brand_fit_notes || null : null,
      status: "confirmed",
    };

    let id = attendeeId;
    if (attendeeId) {
      delete payload.slug;
      const { error } = await (supabase as any).from("afterparty_attendees").update(payload).eq("id", attendeeId);
      if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); setSaving(false); return; }
    } else {
      const { data, error } = await (supabase as any).from("afterparty_attendees").insert(payload).select("id").single();
      if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); setSaving(false); return; }
      id = data.id;
    }
    setSaving(false);
    toast({ title: "Saved!", description: "Your card is live. Check your matches below." });

    // Submit any "other" suggestions for admin approval
    const suggestions: any[] = [];
    const niche = otherNiche.trim();
    const lf = otherLookingFor.trim();
    if (niche) suggestions.push({ kind: "niche", value: niche, attendee_id: id, attendee_name: payload.full_name });
    if (lf) suggestions.push({ kind: "looking_for", value: lf, attendee_id: id, attendee_name: payload.full_name });
    if (suggestions.length) {
      await (supabase as any).from("afterparty_suggestions").insert(suggestions);
      setOtherNiche("");
      setOtherLookingFor("");
      toast({ title: "Thanks!", description: "Your suggestion was sent for review." });
    }

    if (id) onSaved(id);
  };

  const pill = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-sm border transition-colors cursor-pointer ${
      active ? "bg-events-coral text-events-cream border-events-coral" : "bg-transparent border-events-cream/30 text-events-cream/80 hover:border-events-coral/50"
    }`;

  return (
    <form onSubmit={submit} className="space-y-6 text-events-cream">
      {/* Role */}
      <div>
        <Label className="text-events-cream mb-2 block">I'm a…</Label>
        <div className="flex gap-2">
          {(["creator", "brand"] as const).map((r) => (
            <button type="button" key={r} onClick={() => setForm({ ...form, role: r })} className={pill(form.role === r)}>
              {r === "creator" ? "Creator" : "Brand"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Full name *</Label>
          <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="bg-black/20 border-events-cream/20 text-events-cream" />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-black/20 border-events-cream/20 text-events-cream" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Instagram (handle or URL)</Label>
          <Input value={form.social_links.instagram} onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, instagram: e.target.value } })} className="bg-black/20 border-events-cream/20 text-events-cream" />
        </div>
        <div>
          <Label>LinkedIn URL</Label>
          <Input value={form.social_links.linkedin} onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, linkedin: e.target.value } })} className="bg-black/20 border-events-cream/20 text-events-cream" />
        </div>
      </div>

      <div>
        <Label>Photo</Label>
        <div className="flex items-center gap-3">
          {form.photo_url && <img src={form.photo_url} alt="" className="w-16 h-16 rounded-full object-cover" />}
          <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded border border-events-cream/30 hover:border-events-coral text-sm">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {form.photo_url ? "Replace" : "Upload"}
            <input type="file" accept="image/*" hidden onChange={handlePhoto} />
          </label>
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Niches</Label>
        <div className="flex flex-wrap gap-2">
          {NICHES.map((n) => (
            <button type="button" key={n} onClick={() => toggle("niches", n)} className={pill(form.niches.includes(n))}>{n}</button>
          ))}
        </div>
        <Input
          value={otherNiche}
          onChange={(e) => setOtherNiche(e.target.value)}
          placeholder="Other niche? Suggest one (we'll review)"
          className="mt-2 bg-black/20 border-events-cream/20 text-events-cream"
        />
      </div>

      {form.role === "creator" ? (
        <>
          <div>
            <Label className="mb-2 block">I'm a…</Label>
            <div className="flex flex-wrap gap-2">
              {CREATOR_TYPES.map((t) => (
                <button type="button" key={t} onClick={() => toggle("creator_types", t)} className={pill(form.creator_types.includes(t))}>{t}</button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Audience size</Label>
              <Select value={form.audience_size} onValueChange={(v) => setForm({ ...form, audience_size: v })}>
                <SelectTrigger className="bg-black/20 border-events-cream/20 text-events-cream"><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>{AUDIENCE_SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Primary platforms</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button type="button" key={p} onClick={() => toggle("platforms", p)} className={pill(form.platforms.includes(p))}>{p}</button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">I'm looking for…</Label>
            <div className="flex flex-wrap gap-2">
              {CREATOR_LOOKING_FOR.map((l) => (
                <button type="button" key={l} onClick={() => toggle("looking_for", l)} className={pill(form.looking_for.includes(l))}>{l}</button>
              ))}
            </div>
            <Input
              value={otherLookingFor}
              onChange={(e) => setOtherLookingFor(e.target.value)}
              placeholder="Looking for something else? Suggest one (we'll review)"
              className="mt-2 bg-black/20 border-events-cream/20 text-events-cream"
            />
          </div>

          <div>
            <Label>Brands you'd love to work with</Label>
            <Textarea value={form.brands_wishlist} onChange={(e) => setForm({ ...form, brands_wishlist: e.target.value })} placeholder="Patagonia, Yeti, Cotopaxi…" className="bg-black/20 border-events-cream/20 text-events-cream" />
          </div>

          <div>
            <Label>One mind-blowing thing about you</Label>
            <Textarea value={form.mind_blowing_fact} onChange={(e) => setForm({ ...form, mind_blowing_fact: e.target.value })} className="bg-black/20 border-events-cream/20 text-events-cream" />
          </div>
        </>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="bg-black/20 border-events-cream/20 text-events-cream" />
            </div>
            <div>
              <Label>Your role</Label>
              <Input value={form.company_role} onChange={(e) => setForm({ ...form, company_role: e.target.value })} className="bg-black/20 border-events-cream/20 text-events-cream" />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">We're looking for…</Label>
            <div className="flex flex-wrap gap-2">
              {BRAND_LOOKING_FOR.map((l) => (
                <button type="button" key={l} onClick={() => toggle("brand_seeking", l)} className={pill(form.brand_seeking.includes(l))}>{l}</button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">What we (also) want from the night</Label>
            <div className="flex flex-wrap gap-2">
              {CREATOR_LOOKING_FOR.map((l) => (
                <button type="button" key={l} onClick={() => toggle("looking_for", l)} className={pill(form.looking_for.includes(l))}>{l}</button>
              ))}
            </div>
          </div>

          <div>
            <Label>Budget range for creator work</Label>
            <Select value={form.budget_range} onValueChange={(v) => setForm({ ...form, budget_range: v })}>
              <SelectTrigger className="bg-black/20 border-events-cream/20 text-events-cream"><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>{BUDGET_RANGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <Label>What makes a creator a great fit for you?</Label>
            <Textarea value={form.brand_fit_notes} onChange={(e) => setForm({ ...form, brand_fit_notes: e.target.value })} className="bg-black/20 border-events-cream/20 text-events-cream" />
          </div>
        </>
      )}

      <Button type="submit" disabled={saving} className="bg-events-coral hover:bg-events-coral/90 text-events-cream w-full sm:w-auto">
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        {attendeeId ? "Update my card" : "Save my card & see matches"}
      </Button>
    </form>
  );
};

export default AfterPartyIntakeForm;
