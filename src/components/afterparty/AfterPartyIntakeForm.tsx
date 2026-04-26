import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { resolveLogoSrc } from "@/lib/url-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import BrandActivateButton from "./BrandActivateButton";

const NICHES = ["Hiking", "Climbing", "Fishing", "Hunting", "Surfing", "Skiing", "Snowboarding", "Trail Running", "Cycling", "Camping", "Kayaking", "Mountain Biking", "Backpacking", "Photography"];
const CREATOR_TYPES = ["videographer", "photographer", "influencer", "writer", "podcaster", "athlete"];
const PLATFORMS = ["Instagram", "TikTok", "YouTube", "LinkedIn", "Substack", "Twitch", "X / Twitter", "Podcast"];

// Unified intent chips for ALL roles
const PRO_INTENTS = [
  "Find brand deals",
  "Find creators to work with",
  "Collab with another creator",
  "Hire talent",
];
const SOCIAL_INTENTS = [
  "Make friends in the industry",
  "Find a travel partner",
  "Just here to vibe",
];

const BRAND_LOOKING_FOR = ["videographers", "photographers", "influencers", "writers", "athletes", "ambassadors", "friends/connections", "talent pipeline"];
const AUDIENCE_SIZES = ["< 1K", "1K – 10K", "10K – 50K", "50K – 250K", "250K – 1M", "1M+"];
const BUDGET_RANGES = ["No budget yet", "< $1K / project", "$1K – $5K", "$5K – $25K", "$25K+"];

interface Props {
  attendeeId: string | null;
  initial?: any;
  onSaved: (id: string, isFirstSave?: boolean) => void;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Role color tokens
const ROLE = {
  creator: { fill: "#4A1B0C", border: "#D85A30", text: "#F5C4B3" },
  brand: { fill: "#1a1830", border: "#7F77DD", text: "#CECBF6" },
  industry_expert: { fill: "#04342C", border: "#1D9E75", text: "#9FE1CB" },
};

// DiceBear-style deterministic SVG fallback
const hashStr = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};
const buildAvatarSvg = (name: string) => {
  const h = hashStr(name || "anon");
  const skins = ["#F5C9A6", "#E0A57A", "#B07A52", "#8B5A36"];
  const hairs = ["#2B1B12", "#5C3A21", "#A0522D", "#D4A017", "#1D9E75"];
  const bgs = ["#4A1B0C", "#1a1830", "#04342C", "#412402"];
  const skin = skins[h % skins.length];
  const hair = hairs[(h >> 3) % hairs.length];
  const bg = bgs[(h >> 5) % bgs.length];
  const smile = (h >> 7) % 2 === 0;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><rect width='80' height='80' fill='${bg}'/><circle cx='40' cy='44' r='22' fill='${skin}'/><path d='M18 38c0-14 10-22 22-22s22 8 22 22v2H18z' fill='${hair}'/><circle cx='32' cy='42' r='2.2' fill='#111'/><circle cx='48' cy='42' r='2.2' fill='#111'/><path d='M32 ${smile ? 52 : 54} q8 ${smile ? 6 : -2} 16 0' stroke='#111' stroke-width='2' fill='none' stroke-linecap='round'/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const CompanyLogoField = ({
  company,
  companyUrl,
  onChange,
  inputStyle,
}: {
  company: string;
  companyUrl: string;
  onChange: (v: string) => void;
  inputStyle: React.CSSProperties;
}) => {
  const [logoBroken, setLogoBroken] = useState(false);
  // Prefer the explicit URL if provided; otherwise guess from the company name.
  const guessedFromName = (() => {
    const c = (company || "").trim();
    if (!c) return null;
    const slug = c.toLowerCase().replace(/[^a-z0-9]+/g, "");
    if (!slug) return null;
    return `${slug}.com`;
  })();
  const effectiveUrl = (companyUrl || "").trim() || guessedFromName;
  const logoSrc = resolveLogoSrc(null, effectiveUrl);
  useEffect(() => { setLogoBroken(false); }, [logoSrc]);

  return (
    <div className="rounded-lg p-3 flex items-center gap-3" style={{ border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.03)" }}>
      <div
        className="w-12 h-12 rounded-md flex items-center justify-center shrink-0 overflow-hidden"
        style={{ backgroundColor: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}
      >
        {logoSrc && !logoBroken ? (
          <img src={logoSrc} alt="" className="w-full h-full object-contain" onError={() => setLogoBroken(true)} />
        ) : (
          <span className="text-[14px] font-semibold" style={{ color: "#080808" }}>
            {(company || "?").charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Label className="text-[12px]">Company website</Label>
        <Input
          value={companyUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type hyperlink if your logo doesn't populate (e.g. yourbrand.com)"
          style={inputStyle}
        />
      </div>
    </div>
  );
};

const AfterPartyIntakeForm = ({ attendeeId, initial, onSaved }: Props) => {
  const { toast } = useToast();
  const [extraNiches, setExtraNiches] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any)
        .from("event_settings")
        .select("setting_value")
        .eq("event_slug", "afterparty")
        .eq("setting_key", "afterparty.extra_niches")
        .maybeSingle();
      const list = (data?.setting_value || "").split(",").map((v: string) => v.trim()).filter(Boolean);
      setExtraNiches(list);
    })();
  }, []);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cartoonPolling, setCartoonPolling] = useState(false);
  const [otherNiche, setOtherNiche] = useState("");
  const [pendingNiches, setPendingNiches] = useState<string[]>([]);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);
  const [activationSent, setActivationSent] = useState(false);
  const [form, setForm] = useState<any>({
    role: "creator",
    full_name: "",
    email: "",
    phone: "",
    photo_url: "",
    cartoon_url: "",
    social_links: { instagram: "", linkedin: "" },
    show_instagram: true,
    show_linkedin: true,
    niches: [],
    looking_for: [],
    creator_types: [],
    audience_size: "",
    platforms: [],
    brands_wishlist: "",
    mind_blowing_fact: "",
    company: "",
    company_url: "",
    company_role: "",
    brand_seeking: [],
    budget_range: "",
    brand_fit_notes: "",
  });

  const [savedSnapshot, setSavedSnapshot] = useState<string>("");
  useEffect(() => {
    if (initial) {
      const merged = { ...form, ...initial, social_links: initial.social_links || { instagram: "", linkedin: "" } };
      setForm(merged);
      setSavedSnapshot(JSON.stringify(merged));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial?.id]);

  const isDirty = attendeeId ? JSON.stringify(form) !== savedSnapshot : false;

  const fallbackAvatar = useMemo(() => buildAvatarSvg(form.full_name || "anon"), [form.full_name]);

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
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("event-photos").getPublicUrl(path);
    const photoUrl = urlData.publicUrl;
    setForm((f: any) => ({ ...f, photo_url: photoUrl, cartoon_url: "" }));
    setUploading(false);

    // Kick off cartoon generation immediately (no attendee_id needed)
    setCartoonPolling(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("generate-cartoon-avatar", {
        body: { photo_url: photoUrl, attendee_id: attendeeId || null },
      });
      if (fnErr) throw fnErr;
      if (data?.cartoon_url) {
        setForm((f: any) => ({ ...f, cartoon_url: data.cartoon_url }));
      } else if (data?.error) {
        toast({ title: "Avatar generation failed", description: data.error, variant: "destructive" });
      }
    } catch (e: any) {
      console.warn("cartoon generation failed", e);
      toast({ title: "Avatar generation failed", description: e?.message || "Try again", variant: "destructive" });
    }
    setCartoonPolling(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    const emailTrimmed = (form.email || "").trim();
    if (!emailTrimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      toast({ title: "Email required", description: "Please enter a valid email so we can send your card link.", variant: "destructive" });
      return;
    }
    // Phone is required whenever the card does not already have one.
    // Invited shells already have an attendeeId, so attendeeId alone is not
    // enough to decide whether edit access will work later.
    const phoneDigits = (form.phone || "").replace(/\D/g, "");
    const existingPhoneDigits = (initial?.phone || "").replace(/\D/g, "");
    if (phoneDigits.length < 4 && existingPhoneDigits.length < 4) {
      toast({ title: "Phone number required", description: "We use the last 4 digits as your password to edit your card.", variant: "destructive" });
      return;
    }
    setSaving(true);

    // Duplicate guard — only on first RSVP (no attendeeId yet).
    // If the same name OR email already exists, send the user to that
    // existing card so they can sign in via PIN instead of creating a dup.
    if (!attendeeId) {
      const nameTrim = form.full_name.trim();
      const emailTrim = (form.email || "").trim().toLowerCase();
      const orParts: string[] = [`full_name.ilike.${nameTrim}`];
      if (emailTrim) orParts.push(`email.ilike.${emailTrim}`);
      const { data: existing } = await (supabase as any)
        .from("afterparty_attendees")
        .select("id, slug, full_name, email")
        .or(orParts.join(","))
        .limit(1)
        .maybeSingle();
      if (existing?.slug) {
        setSaving(false);
        const matchedOn =
          existing.email && emailTrim && existing.email.toLowerCase() === emailTrim
            ? "email"
            : "name";
        toast({
          title: "Card already exists",
          description: `We found a card with that ${matchedOn}. Sending you there to sign in.`,
        });
        setTimeout(() => {
          window.location.href = `/afterparty/${existing.slug}`;
        }, 900);
        return;
      }
    }

    const { data: authData } = await supabase.auth.getUser();
    let authUserId = authData.user?.id || null;
    if (!authUserId) {
      const { data: anonData, error: anonErr } = await supabase.auth.signInAnonymously({
        options: { data: { afterparty_slug: initial?.slug || null, afterparty_attendee_id: attendeeId || null } },
      });
      if (anonErr || !anonData.user?.id) {
        toast({ title: "Save failed", description: "Could not create secure edit access. Please try again.", variant: "destructive" });
        setSaving(false);
        return;
      }
      authUserId = anonData.user.id;
    }
    const payload: any = {
      full_name: form.full_name.trim(),
      slug: slugify(form.full_name) + (attendeeId ? "" : `-${Date.now().toString(36).slice(-4)}`),
      auth_user_id: authUserId,
      // Defense-in-depth: never overwrite an existing email/phone with null
      // when the form field is empty (e.g. on an edit where these fields
      // weren't pre-populated because the public view doesn't expose them).
      ...((form.email && form.email.trim()) ? { email: form.email.trim() } : (attendeeId ? {} : { email: null })),
      ...((form.phone && form.phone.trim()) ? { phone: form.phone.trim() } : (attendeeId ? {} : { phone: null })),
      photo_url: form.photo_url || null,
      cartoon_url: form.cartoon_url || null,
      social_links: form.social_links,
      show_instagram: form.show_instagram !== false,
      show_linkedin: form.show_linkedin !== false,
      role: form.role,
      niches: form.niches,
      looking_for: form.looking_for,
      creator_types: form.role === "creator" ? form.creator_types : [],
      audience_size: form.role === "creator" ? form.audience_size || null : null,
      platforms: form.role === "creator" ? form.platforms : [],
      brands_wishlist: form.role === "creator" ? form.brands_wishlist || null : null,
      mind_blowing_fact: form.mind_blowing_fact || null,
      company: form.role === "brand" ? form.company || null : (form.role === "industry_expert" ? form.company || null : null),
      company_url: form.role === "brand" || form.role === "industry_expert" ? (form.company_url || null) : null,
      company_role: form.role === "brand" || form.role === "industry_expert" ? form.company_role || null : null,
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
      const { data, error } = await (supabase as any).from("afterparty_attendees").insert(payload).select("id, slug").single();
      if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); setSaving(false); return; }
      id = data.id;

      // Fire-and-forget RSVP confirmation email (only on first RSVP, only if email)
      if (form.email) {
        const base = (typeof window !== "undefined" ? window.location.origin : "https://basecampoutdoorevents.com");
        supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "afterparty-rsvp-confirmation",
            recipientEmail: form.email,
            idempotencyKey: `afterparty-rsvp-${id}`,
            templateData: {
              recipientName: (form.full_name || "").trim().split(/\s+/)[0] || "there",
              inviteUrl: `${base}/afterparty/${data.slug}`,
              guestsUrl: `${base}/guests`,
              matchesUrl: `${base}/afterparty/${data.slug}#matches`,
              brandActivated: false,
              role: form.role,
            },
          },
        });
      }
    }
    setSaving(false);
    setSavedSnapshot(JSON.stringify(form));
    toast({ title: attendeeId ? "Saved ✓" : "You're in.", description: attendeeId ? "Your card is updated." : "Look out for your matches below." });

    const allSuggestions = [
      ...pendingNiches,
      ...(otherNiche.trim() ? [otherNiche.trim()] : []),
    ];
    if (allSuggestions.length) {
      await (supabase as any).from("afterparty_suggestions").insert(
        allSuggestions.map((value) => ({
          kind: "niche",
          value,
          attendee_id: id,
          attendee_name: payload.full_name,
        })),
      );
      setOtherNiche("");
      setPendingNiches([]);
    }

    if (id) {
      // For brand reps on first save, surface the activation CTA inline
      // before the parent navigates them to the card view.
      if (!attendeeId && form.role === "brand") {
        setJustSavedId(id);
        setTimeout(() => {
          document
            .getElementById("brand-activate-cta")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      } else {
        onSaved(id);
      }
    }
  };

  // Allow brand reps to dismiss the inline CTA and continue to their card view
  const continueToCard = () => {
    if (justSavedId) onSaved(justSavedId);
  };

  // Pill helpers, themed via inline style
  const pillStyle = (active: boolean, color: { fill: string; border: string; text: string }) => ({
    backgroundColor: active ? color.fill : "transparent",
    border: `1px solid ${active ? color.border : "rgba(255,255,255,0.18)"}`,
    color: active ? color.text : "rgba(255,255,255,0.75)",
  });
  const pillBase = "px-3 py-2 rounded-full text-[13px] cursor-pointer transition-colors min-h-[36px] inline-flex items-center";

  const inputStyle = {
    backgroundColor: "#080808",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
  } as const;

  const roleColor = ROLE[(form.role as keyof typeof ROLE)] || ROLE.brand;
  const charCount = (form.mind_blowing_fact || "").length;

  return (
    <form onSubmit={submit} className="space-y-6" style={{ color: "#fff" }}>
      {/* Role */}
      <div>
        <Label className="mb-2 block" style={{ color: "rgba(255,255,255,0.85)" }}>I am a…</Label>
        <div className="flex flex-wrap gap-2">
          {([
            { v: "creator", label: "Creator", c: ROLE.creator },
            { v: "brand", label: "Brand rep", c: ROLE.brand },
            { v: "industry_expert", label: "Industry expert", c: ROLE.industry_expert },
          ] as const).map((r) => (
            <button
              type="button"
              key={r.v}
              onClick={() => setForm({ ...form, role: r.v })}
              className={pillBase}
              style={pillStyle(form.role === r.v, r.c)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Full name *</Label>
          <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <Label>Email *</Label>
          <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
        </div>
      </div>

      <div>
        <Label>Phone {attendeeId ? "" : "*"}</Label>
        <Input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="(555) 123-4567"
          style={inputStyle}
        />
        <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
          The last 4 digits become your password to edit this card later. Easy to remember, no email codes.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Instagram handle</Label>
          <div className="flex items-stretch rounded-md overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
            <span
              className="px-2 flex items-center text-[13px] select-none"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", borderRight: "1px solid rgba(255,255,255,0.12)" }}
            >
              @
            </span>
            <Input
              value={(form.social_links.instagram || "").replace(/^@+/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/$/, "")}
              onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, instagram: e.target.value.replace(/^@+/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/$/, "") } })}
              placeholder="yourhandle"
              className="border-0 rounded-none"
              style={{ ...inputStyle, border: "none" }}
            />
          </div>
          <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>
            <input
              type="checkbox"
              checked={form.show_instagram !== false}
              onChange={(e) => setForm({ ...form, show_instagram: e.target.checked })}
              className="accent-[#ED7660]"
            />
            Show on the public guest list
          </label>
        </div>
        <div>
          <Label>LinkedIn handle</Label>
          <div className="flex items-stretch rounded-md overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
            <span
              className="px-2 flex items-center text-[13px] select-none whitespace-nowrap"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", borderRight: "1px solid rgba(255,255,255,0.12)" }}
            >
              linkedin.com/in/
            </span>
            <Input
              value={(form.social_links.linkedin || "").replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "").replace(/\/$/, "")}
              onChange={(e) => setForm({ ...form, social_links: { ...form.social_links, linkedin: e.target.value.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "").replace(/\/$/, "") } })}
              placeholder="jennafrombasecamp"
              className="border-0 rounded-none"
              style={{ ...inputStyle, border: "none" }}
            />
          </div>
          <label className="flex items-center gap-2 mt-1.5 cursor-pointer text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>
            <input
              type="checkbox"
              checked={form.show_linkedin !== false}
              onChange={(e) => setForm({ ...form, show_linkedin: e.target.checked })}
              className="accent-[#ED7660]"
            />
            Show on the public guest list
          </label>
        </div>
      </div>

      {/* Photo + dual avatar preview */}
      <div>
        <Label className="mb-2 block">Add your photo</Label>
        <p className="text-[12px] mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>
          We'll show your real photo and generate a little illustrated avatar.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center">
            <div className="text-[10px] uppercase mb-1" style={{ letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)" }}>Your photo</div>
            <div className="aspect-square rounded-full overflow-hidden mx-auto" style={{ width: 96, backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.12)" }}>
              {form.photo_url ? (
                <img src={form.photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>No photo</div>
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase mb-1" style={{ letterSpacing: "0.08em", color: "rgba(255,255,255,0.5)" }}>Your avatar</div>
            <div className="aspect-square rounded-full overflow-hidden mx-auto relative" style={{ width: 96, backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.12)" }}>
              {cartoonPolling ? (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#D85A30" }} />
                </div>
              ) : form.cartoon_url ? (
                <img src={form.cartoon_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <img src={fallbackAvatar} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        </div>
        <label className="inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded text-[13px]" style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)" }}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {form.photo_url ? "Replace photo" : "Upload photo"}
          <input type="file" accept="image/*" hidden onChange={handlePhoto} />
        </label>
      </div>

      {/* Niches */}
      <div>
        <Label className="mb-2 block">Niches</Label>
        <div className="flex flex-wrap gap-2">
          {[...NICHES, ...extraNiches.filter((n) => !NICHES.includes(n))].map((n) => (
            <button type="button" key={n} onClick={() => toggle("niches", n)} className={pillBase} style={pillStyle(form.niches.includes(n), ROLE.creator)}>{n}</button>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Input
            value={otherNiche}
            onChange={(e) => setOtherNiche(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const v = otherNiche.trim();
                if (!v) return;
                if (!pendingNiches.includes(v)) setPendingNiches([...pendingNiches, v]);
                setOtherNiche("");
              }
            }}
            placeholder="Other niche? Suggest one (we'll review)"
            style={inputStyle}
          />
          <Button
            type="button"
            onClick={() => {
              const v = otherNiche.trim();
              if (!v) return;
              if (!pendingNiches.includes(v)) setPendingNiches([...pendingNiches, v]);
              setOtherNiche("");
            }}
            disabled={!otherNiche.trim()}
            style={{ backgroundColor: ROLE.creator.fill, color: "#fff" }}
          >
            Suggest
          </Button>
        </div>
        {pendingNiches.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {pendingNiches.map((n) => (
              <span
                key={n}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs"
                style={{ backgroundColor: ROLE.creator.fill, color: "#fff" }}
              >
                {n}
                <button
                  type="button"
                  onClick={() => setPendingNiches(pendingNiches.filter((p) => p !== n))}
                  aria-label={`Remove ${n}`}
                  className="ml-1 opacity-80 hover:opacity-100"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Creator-only block */}
      {form.role === "creator" && (
        <>
          <div>
            <Label className="mb-2 block">I'm a…</Label>
            <div className="flex flex-wrap gap-2">
              {CREATOR_TYPES.map((t) => (
                <button type="button" key={t} onClick={() => toggle("creator_types", t)} className={pillBase} style={pillStyle(form.creator_types.includes(t), ROLE.creator)}>{t}</button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Audience size</Label>
              <Select value={form.audience_size} onValueChange={(v) => setForm({ ...form, audience_size: v })}>
                <SelectTrigger style={inputStyle}><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>{AUDIENCE_SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Primary platforms</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button type="button" key={p} onClick={() => toggle("platforms", p)} className={pillBase} style={pillStyle(form.platforms.includes(p), ROLE.creator)}>{p}</button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label>Brands you'd love to work with</Label>
            <Textarea value={form.brands_wishlist} onChange={(e) => setForm({ ...form, brands_wishlist: e.target.value })} placeholder="Patagonia, Yeti, Cotopaxi…" style={inputStyle} />
          </div>
        </>
      )}

      {/* Brand-only block */}
      {form.role === "brand" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <Label>Your role</Label>
              <Input value={form.company_role} onChange={(e) => setForm({ ...form, company_role: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <CompanyLogoField
            company={form.company}
            companyUrl={form.company_url}
            onChange={(v) => setForm({ ...form, company_url: v })}
            inputStyle={inputStyle}
          />

          <div>
            <Label className="mb-2 block">We're looking for…</Label>
            <div className="flex flex-wrap gap-2">
              {BRAND_LOOKING_FOR.map((l) => (
                <button type="button" key={l} onClick={() => toggle("brand_seeking", l)} className={pillBase} style={pillStyle(form.brand_seeking.includes(l), ROLE.brand)}>{l}</button>
              ))}
            </div>
          </div>

          <div>
            <Label>Budget range for creator work</Label>
            <Select value={form.budget_range} onValueChange={(v) => setForm({ ...form, budget_range: v })}>
              <SelectTrigger style={inputStyle}><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>{BUDGET_RANGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <Label>What makes a creator a great fit for you?</Label>
            <Textarea value={form.brand_fit_notes} onChange={(e) => setForm({ ...form, brand_fit_notes: e.target.value })} style={inputStyle} />
          </div>
        </>
      )}

      {/* Industry expert block */}
      {form.role === "industry_expert" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Company / org</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <Label>Your role</Label>
              <Input value={form.company_role} onChange={(e) => setForm({ ...form, company_role: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <CompanyLogoField
            company={form.company}
            companyUrl={form.company_url}
            onChange={(v) => setForm({ ...form, company_url: v })}
            inputStyle={inputStyle}
          />
        </>
      )}

      {/* Unified intent chips */}
      <div>
        <Label className="mb-2 block">I'm here to…</Label>
        <div className="flex flex-wrap gap-2">
          {PRO_INTENTS.map((l) => (
            <button type="button" key={l} onClick={() => toggle("looking_for", l)} className={pillBase} style={pillStyle(form.looking_for.includes(l), roleColor)}>{l}</button>
          ))}
        </div>
        <div className="my-3" style={{ height: 1, backgroundColor: "rgba(255,255,255,0.09)" }} />
        <div className="flex flex-wrap gap-2">
          {SOCIAL_INTENTS.map((l) => (
            <button
              type="button"
              key={l}
              onClick={() => toggle("looking_for", l)}
              className={pillBase}
              style={pillStyle(form.looking_for.includes(l), { fill: "#412402", border: "#BA7517", text: "#FAC775" })}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* The question, single, 280 chars */}
      <div>
        <Label>What's something you've made that you're proud of, and why did it work?</Label>
        <div className="relative">
          <Textarea
            value={form.mind_blowing_fact}
            onChange={(e) => setForm({ ...form, mind_blowing_fact: e.target.value.slice(0, 280) })}
            placeholder="A 60-second reel I shot at 4am on a frozen lake. It worked because it was real, no script, just the moment."
            rows={4}
            maxLength={280}
            style={inputStyle}
          />
          <div
            className="absolute bottom-2 right-3 text-[11px] tabular-nums"
            style={{ color: charCount >= 280 ? "#D85A30" : "rgba(255,255,255,0.5)" }}
          >
            {charCount}/280
          </div>
        </div>
      </div>

      {(attendeeId || justSavedId) ? (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {attendeeId && (
            <Button
              type="submit"
              disabled={saving || !isDirty}
              className={`w-full sm:w-auto hover:opacity-90 ${isDirty ? "animate-pulse" : ""}`}
              style={
                isDirty
                  ? {
                      backgroundColor: "#D85A30",
                      color: "#fff",
                      fontWeight: 600,
                      boxShadow: "0 0 0 0 rgba(216,90,48,0.7), 0 0 24px rgba(216,90,48,0.55)",
                      border: "1px solid #F5C4B3",
                    }
                  : {
                      backgroundColor: "rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.55)",
                      fontWeight: 500,
                      border: "1px solid rgba(255,255,255,0.15)",
                    }
              }
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isDirty ? "Save changes" : "Saved ✓"}
            </Button>
          )}
          <Link
            to="/guests"
            onClick={() => {
              const slug = (form as any).slug;
              if (slug) {
                try { sessionStorage.setItem("afterparty:return_slug", slug); } catch {}
              }
            }}
            className="inline-flex items-center justify-center w-full sm:w-auto rounded-md px-4 py-2 hover:opacity-90"
            style={{
              backgroundColor: attendeeId ? "transparent" : "#fff",
              color: attendeeId ? "rgba(255,255,255,0.75)" : "#080808",
              fontWeight: 500,
              border: attendeeId ? "1px solid rgba(255,255,255,0.18)" : "none",
            }}
          >
            See who's coming →
          </Link>
        </div>
      ) : (
        <Button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto hover:opacity-90"
          style={{ backgroundColor: "#fff", color: "#080808", fontWeight: 500 }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Secure my spot →
        </Button>
      )}

      {form.role === "brand" && (attendeeId || justSavedId) && (
        <div id="brand-activate-cta" className="pt-4 space-y-3">
          <BrandActivateButton
            attendeeId={attendeeId || justSavedId}
            fullName={form.full_name}
            company={form.company}
            email={form.email}
            variant="full"
            onSubmitted={() => setActivationSent(true)}
          />
          {justSavedId && !attendeeId && (
            <button
              type="button"
              onClick={continueToCard}
              className="text-[13px] underline"
              style={{ color: "rgba(245,230,211,0.7)" }}
            >
              {activationSent ? "See my card" : "Skip for now → see my card"}
            </button>
          )}
        </div>
      )}
    </form>
  );
};

export default AfterPartyIntakeForm;
