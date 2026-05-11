import { useEffect, useState } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { dashboardSaveCard } from "@/lib/connect-session";
import { NICHE_OPTIONS } from "@/lib/expert-types";

interface Props {
  open: boolean;
  onClose: () => void;
  rep: any;
  brand: any | null;
  isBrandRep: boolean;
  onSaved: (rep: any, brand: any | null) => void;
}

const REMOTE_OPTIONS = [
  "Yes, fully remote",
  "Hybrid",
  "In-person only",
  "Open to either",
  "No",
];
const HIRING_OPTIONS = [
  "Yes, actively hiring",
  "Always open to great people",
  "Not actively hiring",
];

export default function EditMyCardModal({ open, onClose, rep, brand, isBrandRep, onSaved }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Personal
  const [photoUrl, setPhotoUrl] = useState(rep?.photo_url || "");
  const [jobTitle, setJobTitle] = useState(rep?.job_title || "");
  const [askMeAbout, setAskMeAbout] = useState(rep?.ask_me_about || "");
  const [linkedinUrl, setLinkedinUrl] = useState(rep?.linkedin_url || "");
  const [previousCompanies, setPreviousCompanies] = useState(rep?.previous_companies || "");
  const [niches, setNiches] = useState<string[]>(rep?.niche_interests || []);

  // Brand
  const [websiteUrl, setWebsiteUrl] = useState(brand?.website_url || "");
  const [offersRemote, setOffersRemote] = useState(brand?.offers_remote || "");
  const [currentlyHiring, setCurrentlyHiring] = useState(brand?.currently_hiring || "");
  const [whyVisit, setWhyVisit] = useState(brand?.why_visit_text || brand?.culture_blurb || "");

  // Lead question
  const [lqIntro, setLqIntro] = useState(brand?.lead_question_intro || "");
  const [lqText, setLqText] = useState(brand?.lead_question_text || "");
  const [lqOpt1, setLqOpt1] = useState(brand?.lead_question_option_1 || "");
  const [lqOpt2, setLqOpt2] = useState(brand?.lead_question_option_2 || "");
  const [lqOpt3, setLqOpt3] = useState(brand?.lead_question_option_3 || "");
  const [lqActive, setLqActive] = useState(!!brand?.lead_question_active);

  useEffect(() => {
    if (!open) return;
    setPhotoUrl(rep?.photo_url || "");
    setJobTitle(rep?.job_title || "");
    setAskMeAbout(rep?.ask_me_about || "");
    setLinkedinUrl(rep?.linkedin_url || "");
    setPreviousCompanies(rep?.previous_companies || "");
    setNiches(rep?.niche_interests || []);
    setWebsiteUrl(brand?.website_url || "");
    setOffersRemote(brand?.offers_remote || "");
    setCurrentlyHiring(brand?.currently_hiring || "");
    setWhyVisit(brand?.why_visit_text || brand?.culture_blurb || "");
    setLqIntro(brand?.lead_question_intro || "");
    setLqText(brand?.lead_question_text || "");
    setLqOpt1(brand?.lead_question_option_1 || "");
    setLqOpt2(brand?.lead_question_option_2 || "");
    setLqOpt3(brand?.lead_question_option_3 || "");
    setLqActive(!!brand?.lead_question_active);
  }, [open, rep, brand]);

  if (!open) return null;

  const toggleNiche = (n: string) => {
    setNiches((prev) => prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `expert-photos/expert-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("email-assets").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("email-assets").getPublicUrl(path);
      setPhotoUrl(data.publicUrl);
      toast({ title: "Photo uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const rep_patch: any = {
        photo_url: photoUrl || null,
        job_title: jobTitle.trim() || null,
        ask_me_about: askMeAbout.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        previous_companies: previousCompanies.trim() || null,
        niche_interests: niches,
      };
      const brand_patch: any = isBrandRep ? {
        website_url: websiteUrl.trim() || null,
        offers_remote: offersRemote || null,
        currently_hiring: currentlyHiring || null,
        why_visit_text: whyVisit.trim() || null,
        lead_question_intro: lqIntro.trim() || null,
        lead_question_text: lqText.trim() || null,
        lead_question_option_1: lqOpt1.trim() || null,
        lead_question_option_2: lqOpt2.trim() || null,
        lead_question_option_3: lqOpt3.trim() || null,
        lead_question_active: !!(lqActive && lqText.trim() && lqOpt1.trim()),
      } : {};
      const r = await dashboardSaveCard({ rep_patch, brand_patch });
      toast({ title: "Card updated" });
      onSaved(r.rep, r.brand);
      onClose();
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-2 sm:p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl max-h-[92vh] bg-events-teal text-events-cream rounded-2xl overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-events-teal/95 backdrop-blur z-10 px-6 py-4 border-b border-events-cream/10 flex items-center justify-between">
          <h2 className="font-display text-lg">Edit my card</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-events-cream/10 hover:bg-events-cream/20 flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Section A: My card */}
          <section className="space-y-4">
            <h3 className="font-display text-sm uppercase tracking-wider text-events-coral">My card</h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-events-cream/10 shrink-0">
                {photoUrl ? (
                  <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-events-cream/40 text-xs">No photo</div>
                )}
              </div>
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-events-cream/10 hover:bg-events-cream/20 text-xs font-display uppercase tracking-wider">
                  {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                  {uploading ? "Uploading" : "Change photo"}
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
            </div>

            <Field label="Job title">
              <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
            </Field>
            <Field label="Ask me about" hint="Short prompt for candidates. What do you love talking about?">
              <Textarea value={askMeAbout} onChange={(e) => setAskMeAbout(e.target.value)} rows={3} maxLength={300} />
            </Field>
            <Field label="LinkedIn URL">
              <Input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
            </Field>
            <Field label="Previous companies" hint="Comma-separated">
              <Input value={previousCompanies} onChange={(e) => setPreviousCompanies(e.target.value)} />
            </Field>
            <Field label="Niches">
              <div className="flex flex-wrap gap-1.5">
                {NICHE_OPTIONS.map((n) => {
                  const active = niches.includes(n);
                  return (
                    <button
                      type="button"
                      key={n}
                      onClick={() => toggleNiche(n)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-body border transition-colors ${
                        active
                          ? "bg-events-coral text-events-cream border-events-coral"
                          : "bg-events-cream/5 text-events-cream/70 border-events-cream/15 hover:border-events-cream/40"
                      }`}
                    >{n}</button>
                  );
                })}
              </div>
            </Field>
          </section>

          {isBrandRep && brand && (
            <>
              {/* Section B: Brand info */}
              <section className="space-y-4 pt-4 border-t border-events-cream/10">
                <h3 className="font-display text-sm uppercase tracking-wider text-events-coral">Brand info</h3>
                <p className="text-[11px] text-events-cream/50 font-body">Shared with all reps at {brand.name}.</p>
                <Field label="Brand website">
                  <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." />
                </Field>
                <Field label="Remote status">
                  <Select value={offersRemote || undefined} onValueChange={setOffersRemote}>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {REMOTE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Currently hiring">
                  <Select value={currentlyHiring || undefined} onValueChange={setCurrentlyHiring}>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {HIRING_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field
                  label="Why visit our table"
                  hint="Examples: 'Actively hiring marketers' / 'Opening a new store in Boulder soon' / 'Seeking ambassadors and IT positions'"
                >
                  <Textarea value={whyVisit} onChange={(e) => setWhyVisit(e.target.value.slice(0, 280))} rows={3} maxLength={280} />
                  <p className="text-[10px] text-events-cream/40 mt-1">{whyVisit.length}/280</p>
                </Field>
              </section>

              {/* Section C: Lead question */}
              <section className="space-y-4 pt-4 border-t border-events-cream/10">
                <h3 className="font-display text-sm uppercase tracking-wider text-events-coral">Lead question (optional)</h3>
                <p className="text-[11px] text-events-cream/60 font-body">
                  Add a custom question to capture leads from candidates interested in something specific.
                  Examples: 'Interested in our new retail store?' / 'Want to be considered for ambassador roles?'
                </p>
                <Field label="Intro text (optional)">
                  <Textarea value={lqIntro} onChange={(e) => setLqIntro(e.target.value.slice(0, 200))} rows={2} maxLength={200} />
                  <p className="text-[10px] text-events-cream/40 mt-1">{lqIntro.length}/200</p>
                </Field>
                <Field label="Question">
                  <Input value={lqText} onChange={(e) => setLqText(e.target.value.slice(0, 150))} maxLength={150} />
                </Field>
                <Field label="Option 1">
                  <Input value={lqOpt1} onChange={(e) => setLqOpt1(e.target.value.slice(0, 100))} maxLength={100} />
                </Field>
                <Field label="Option 2 (optional)">
                  <Input value={lqOpt2} onChange={(e) => setLqOpt2(e.target.value.slice(0, 100))} maxLength={100} />
                </Field>
                <Field label="Option 3 (optional)">
                  <Input value={lqOpt3} onChange={(e) => setLqOpt3(e.target.value.slice(0, 100))} maxLength={100} />
                </Field>
                {lqText.trim() && lqOpt1.trim() && (
                  <div className="flex items-center justify-between bg-events-cream/5 rounded-lg p-3">
                    <div>
                      <Label className="text-events-cream text-sm">Active</Label>
                      <p className="text-[11px] text-events-cream/50">Show this question on your brand card.</p>
                    </div>
                    <Switch checked={lqActive} onCheckedChange={setLqActive} />
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        <div className="sticky bottom-0 bg-events-teal/95 backdrop-blur border-t border-events-cream/10 px-6 py-4 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose} className="text-events-cream/70">Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-events-coral hover:bg-events-coral/90 text-events-cream"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1.5 block">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-events-cream/50 mt-1 font-body">{hint}</p>}
    </div>
  );
}
