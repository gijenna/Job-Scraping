import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  candidateMe, candidateSignupCreate, candidateSignupLookup, candidateSignupCreateBasics,
  candidateUpdateProfile, candidateUploadSignedUrl, candidateAttachUpload,
} from "@/lib/connect-session";
import {
  POACHABLE_STATUS, CAREER_STAGE, FIELDS, FOCUSES_BY_FIELD,
  JOB_TYPES, REMOTE_PREFERENCES, WORKPLACE_TYPES,
  SKILL_CATEGORIES, SKILL_CATEGORY_KEYS, NICHES, US_STATES,
} from "@/lib/taxonomies";
import ImpersonationGate from "@/components/connect/ImpersonationGate";
import BubbleLogoPicker from "@/components/connect/BubbleLogoPicker";
import ConnectShell from "@/components/connect/ConnectShell";
import ConnectBottomNav from "@/components/connect/ConnectBottomNav";
import { EditableTextProvider, useEditableTextContext } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import HookExamples, { HOOK_EXAMPLE_PLACEHOLDER, PITCH_EXAMPLE_PLACEHOLDER } from "@/components/connect/HookExamples";
import BrandContactConsentCheckbox from "@/components/connect/BrandContactConsentCheckbox";
import { useEventSettings } from "@/hooks/useEventSettings";
import { calcProfileCompleteness } from "@/lib/profile-completeness";

// ----- Required-field map -----
const REQUIRED: { key: string; section: string; label: string; labelKey: string }[] = [
  { key: "first_name", section: "about", label: "First name", labelKey: "full_first_name_label" },
  { key: "last_name", section: "about", label: "Last name", labelKey: "full_last_name_label" },
  { key: "email", section: "about", label: "Email", labelKey: "full_email_label" },
  { key: "phone", section: "about", label: "Phone", labelKey: "full_phone_label" },
  { key: "career_stage", section: "about", label: "Career stage", labelKey: "full_career_stage_label" },
  { key: "poachable_status", section: "about", label: "Poachable status", labelKey: "full_poachable_status_label" },
  { key: "field", section: "what", label: "Field", labelKey: "full_field_label" },
  { key: "focus", section: "what", label: "Focus", labelKey: "full_focus_label" },
  { key: "the_hook", section: "hook", label: "The Hook", labelKey: "full_hook_label" },
];

const CompletenessBar = ({ pct }: { pct: number }) => (
  <div className="w-full h-2 bg-events-cream/10 rounded-full overflow-hidden">
    <div className="h-full bg-events-coral transition-all" style={{ width: `${Math.min(100, pct)}%` }} />
  </div>
);

const slugifyKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
const cleanCopy = (value: string) => value.replace(/\s*\*\s*$/, "").trim();

const ConnectFull = () => {
  const nav = useNavigate();
  const { toast } = useToast();
  const { settings: copy } = useEventSettings("outsidedays26-connect");
  const [loading, setLoading] = useState(true);
  const [c, setC] = useState<any>({
    signup_mode: "full",
    first_name: "", last_name: "", email: "", phone: "",
    poachable_status: "", career_stage: "",
    field: "", focus: "", field_other: "", years_in_current_field: 0,
    the_hook: "", the_pitch: "",
    areas_of_expertise: [], niche_experience: [], prior_careers: [],
    job_types_seeking: [], workplace_type_preference: [],
    dream_companies: [],
  });
  const [hasAccount, setHasAccount] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [savingNow, setSavingNow] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hookFocused, setHookFocused] = useState(false);
  const [pitchFocused, setPitchFocused] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);
  const resumeInput = useRef<HTMLInputElement>(null);
  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Load existing candidate if logged in
  useEffect(() => {
    (async () => {
      try {
        const { session } = await candidateMe();
        if (session?.subject) {
          setHasAccount(true);
          setC((prev: any) => ({ ...prev, ...session.subject, signup_mode: session.subject.signup_mode || "full" }));
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  // Tick for "Saved Xs ago"
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  // Debounced auto-save when account exists
  const debounceRef = useRef<number | null>(null);
  useEffect(() => {
    if (!hasAccount || loading) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
        setSavingNow(true);
        const payload = sanitizeForSave(c);
        const { candidate } = await candidateUpdateProfile(payload);
        setC((prev: any) => ({ ...prev, ...candidate }));
        setSavedAt(new Date());
      } catch {
        // silent; user will see on submit
      } finally {
        setSavingNow(false);
      }
    }, 30_000);
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
  }, [c, hasAccount, loading]);

  const set = (k: string, v: any) => setC((p: any) => ({ ...p, [k]: v }));

  const completeness = useMemo(() => calcProfileCompleteness(c), [c]);

  const sanitizeForSave = (data: any) => {
    const out = { ...data };
    if (out.the_hook === HOOK_EXAMPLE_PLACEHOLDER) out.the_hook = "";
    if (out.the_pitch === PITCH_EXAMPLE_PLACEHOLDER) out.the_pitch = "";
    return out;
  };

  const saveBasics = async () => {
    const errs: Record<string, string> = {};
    if (!c.first_name?.trim()) errs.first_name = "First name is required.";
    if (!c.last_name?.trim()) errs.last_name = "Last name is required.";
    if (!c.email || !/\S+@\S+\.\S+/.test(c.email)) errs.email = "Use a valid email.";
    if (!c.phone || c.phone.replace(/[^0-9]/g, "").length < 10) errs.phone = "Phone needs 10+ digits.";
    setErrors(errs);
    const firstErr = Object.keys(errs)[0];
    if (firstErr) {
      const el = fieldRefs.current[firstErr];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      toast({ title: "Almost there", description: errs[firstErr], variant: "destructive" });
      return;
    }
    try {
      const { exists } = await candidateSignupLookup({ first_name: c.first_name, last_name: c.last_name, email: c.email });
      if (exists) {
        toast({ title: "Account exists", description: "Try signing in from the start screen.", variant: "destructive" });
        return;
      }
      const { session } = await candidateSignupCreateBasics({
        first_name: c.first_name, last_name: c.last_name, email: c.email, phone: c.phone,
        brand_contact_consent: !!c.brand_contact_consent,
      });
      setHasAccount(true);
      setSavedAt(new Date());
      setC((prev: any) => ({ ...prev, ...session.subject }));
      toast({ title: "Basics saved", description: "You can now upload a photo or resume." });
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    }
  };

  const upload = async (kind: "photo" | "resume", file: File) => {
    if (!hasAccount) {
      toast({ title: "Save your basics first", description: "Tap Save basics under your phone number, then upload." });
      return;
    }
    if (kind === "resume" && file.type !== "application/pdf") {
      toast({ title: "PDF only", description: "Resume must be a PDF.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB.", variant: "destructive" });
      return;
    }
    try {
      const { upload_url, storage_path } = await candidateUploadSignedUrl(kind, file.name, file.type);
      const put = await fetch(upload_url, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!put.ok) throw new Error("Upload failed");
      const { candidate } = await candidateAttachUpload(kind, storage_path);
      setC((prev: any) => ({ ...prev, ...candidate }));
      toast({ title: kind === "photo" ? "Photo uploaded" : "Resume uploaded" });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    }
  };

  const submit = async () => {
    // Validate
    const errs: Record<string, string> = {};
    for (const r of REQUIRED) {
      const v = (c as any)[r.key];
      const isEmpty = v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
      if (isEmpty) errs[r.key] = `${cleanCopy(copy[r.labelKey] || r.label)} is required.`;
      if (r.key === "the_hook" && v === HOOK_EXAMPLE_PLACEHOLDER) errs[r.key] = "Make The Hook your own.";
    }
    if (c.field === "Other" && !c.field_other?.trim()) errs.field_other = "Tell us what you do.";
    if (c.phone && c.phone.replace(/[^0-9]/g, "").length < 10) errs.phone = "Phone needs 10+ digits.";
    if (c.email && !/\S+@\S+\.\S+/.test(c.email)) errs.email = "Use a valid email.";
    setErrors(errs);
    const firstErr = Object.keys(errs)[0];
    if (firstErr) {
      const el = fieldRefs.current[firstErr];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      toast({ title: "Almost there", description: errs[firstErr], variant: "destructive" });
      return;
    }

    try {
      const payload = sanitizeForSave(c);
      if (!hasAccount) {
        const { exists } = await candidateSignupLookup({
          first_name: c.first_name, last_name: c.last_name, email: c.email,
        });
        if (exists) {
          toast({ title: "Account exists", description: "Try signing in from the start screen.", variant: "destructive" });
          return;
        }
        await candidateSignupCreate(payload);
      } else {
        await candidateUpdateProfile(payload);
      }
      nav("/outsidedays26/connect/home");
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    }
  };

  const savedLabel = (() => {
    if (savingNow) return "Saving...";
    if (!savedAt) return hasAccount ? "Auto-saves as you type" : "Sign-in created on submit";
    const s = Math.max(1, Math.round((now - savedAt.getTime()) / 1000));
    if (s < 60) return `Saved ${s}s ago`;
    return `Saved ${Math.round(s / 60)}m ago`;
  })();

  if (loading) {
    return (
      <EditableTextProvider pageSlug="outsidedays26-connect">
        <div className="min-h-screen bg-events-teal text-events-cream flex items-center justify-center font-body">
          <EditableText settingKey="full_loading_label" defaultText="Loading..." as="span" />
        </div>
      </EditableTextProvider>
    );
  }

  const setRef = (key: string) => (el: HTMLDivElement | null) => { fieldRefs.current[key] = el; };
  const label = (settingKey: string, defaultText: string) => (
    <EditableText settingKey={settingKey} defaultText={defaultText} as="span" />
  );

  return (
    <EditableTextProvider pageSlug="outsidedays26-connect">
      <ImpersonationGate>
        <ConnectShell maxWidth="2xl">
          {/* Sticky progress */}
          <div className="sticky top-0 -mx-4 px-4 py-3 bg-events-teal/95 backdrop-blur z-30 border-b border-events-cream/10 mb-6">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <EditableText
                settingKey="full_progress_label"
                defaultText="Profile completeness"
                as="span"
                className="text-xs font-body uppercase tracking-wider text-events-cream/70"
              />
              <span className="text-xs font-body text-events-cream/70">
                {completeness}% · <span className="text-events-cream/50">{savedLabel}</span>
              </span>
            </div>
            <CompletenessBar pct={completeness} />
          </div>

          <header className="text-center space-y-2 mb-6">
            <EditableText
              settingKey="full_title"
              defaultText="Build your profile"
              as="h1"
              className="font-afterparty text-3xl md:text-5xl text-events-cream"
            />
            <EditableText
              settingKey="full_intro_p1"
              defaultText="Brands have hundreds of candidates to look at. They'll filter by specific things, like field, experience, and what kind of role you want. The more your profile says, the more filters you show up in."
              as="p"
              className="font-body text-sm md:text-base text-events-cream/75 max-w-xl mx-auto"
            />
            <EditableText
              settingKey="full_intro_p2"
              defaultText="Required fields have an asterisk. The rest is up to you."
              as="p"
              className="font-body text-sm md:text-base text-events-cream/75 max-w-xl mx-auto"
            />
            <EditableText
              settingKey="full_intro_p3"
              defaultText="But blanks aren't searchable."
              as="p"
              className="font-body text-sm md:text-base text-events-cream/90 italic max-w-xl mx-auto pt-1"
            />
          </header>

          {/* Section 1: About you */}
          <SectionBlock keyId="about" titleKey="full_s1_title" defaultTitle="About you *">
            <Row>
              <FieldRow refSetter={setRef("first_name")} label={label("full_first_name_label", "First name *")} error={errors.first_name}>
                <Input value={c.first_name || ""} onChange={(e) => set("first_name", e.target.value)} />
              </FieldRow>
              <FieldRow refSetter={setRef("last_name")} label={label("full_last_name_label", "Last name *")} error={errors.last_name}>
                <Input value={c.last_name || ""} onChange={(e) => set("last_name", e.target.value)} />
              </FieldRow>
            </Row>
            <FieldRow refSetter={setRef("email")} label={label("full_email_label", "Email *")} error={errors.email}>
              <Input type="email" value={c.email || ""} onChange={(e) => set("email", e.target.value)} />
            </FieldRow>
            <FieldRow
              refSetter={setRef("phone")}
              label={label("full_phone_label", "Phone *")}
              error={errors.phone}
              hint={<EditableText settingKey="full_phone_hint" defaultText="Hidden from everyone except admin. Used to verify it's you when you log in." as="span" />}
            >
              <EditableInput inputMode="tel" value={c.phone || ""} onChange={(e) => set("phone", e.target.value)} placeholderKey="full_phone_placeholder" defaultPlaceholder="555 123 4567" />
            </FieldRow>
            {!hasAccount && (
              <div className="bg-events-coral/10 border border-events-coral/30 rounded-xl p-3 flex flex-col gap-3">
                <p className="text-xs font-body text-events-cream/80">
                  <EditableText
                    settingKey="full_save_basics_hint"
                    defaultText="Save your basics so you can upload a photo or resume right away. You can finish the rest of your profile after."
                    as="span"
                  />
                </p>
                <BrandContactConsentCheckbox
                  checked={!!c.brand_contact_consent}
                  onChange={(v) => set("brand_contact_consent", v)}
                />
                <Button
                  type="button"
                  onClick={saveBasics}
                  className="bg-events-coral hover:bg-events-coral/90 text-events-cream self-start"
                >
                  <EditableText settingKey="full_save_basics_button" defaultText="Save basics" as="span" />
                </Button>
              </div>
            )}
            <div>
              <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1.5 block">
                <EditableText settingKey="full_photo_label" defaultText="Photo" as="span" />
              </Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-events-cream/10 overflow-hidden flex items-center justify-center text-events-cream/40 font-body text-xs">
                  {c.photo_url ? <img src={c.photo_url} alt="You" className="w-full h-full object-cover" /> : <EditableText settingKey="full_no_photo_label" defaultText="No photo" as="span" />}
                </div>
                <div className="space-y-1">
                  <input ref={photoInput} type="file" accept="image/*" capture="user" hidden
                    onChange={(e) => e.target.files?.[0] && upload("photo", e.target.files[0])} />
                  <Button type="button" onClick={() => photoInput.current?.click()} className="bg-events-coral hover:bg-events-coral/90 text-events-cream">
                    {c.photo_url ? <EditableText settingKey="full_replace_photo_button" defaultText="Replace photo" as="span" /> : <EditableText settingKey="full_upload_photo_button" defaultText="Upload photo" as="span" />}
                  </Button>
                  <EditableText settingKey="full_photo_hint" defaultText="A face makes you 10 times more memorable on the floor." as="p" className="text-[11px] text-events-cream/50 font-body" />
                </div>
              </div>
            </div>
            <FieldRow refSetter={setRef("career_stage")} label={label("full_career_stage_label", "Career stage *")} error={errors.career_stage}>
              <SelectBox value={c.career_stage || ""} onChange={(v) => set("career_stage", v)} options={CAREER_STAGE as any} optionKeyPrefix="full_career_stage_option" />
            </FieldRow>
            <FieldRow refSetter={setRef("poachable_status")} label={label("full_poachable_status_label", "Poachable status *")} error={errors.poachable_status}>
              <SelectBox value={c.poachable_status || ""} onChange={(v) => set("poachable_status", v)} options={POACHABLE_STATUS as any} optionKeyPrefix="full_poachable_status_option" />
            </FieldRow>
          </SectionBlock>

          {/* Section 2: What you do */}
          <SectionBlock keyId="what" titleKey="full_s2_title" defaultTitle="What you do *">
            <Row>
              <FieldRow refSetter={setRef("field")} label={label("full_field_label", "Field *")} error={errors.field}>
                <SelectBox value={c.field || ""} onChange={(v) => { set("field", v); set("focus", ""); }} options={FIELDS} optionKeyPrefix="full_field_option" />
              </FieldRow>
              <FieldRow refSetter={setRef("focus")} label={label("full_focus_label", "Focus *")} error={errors.focus}>
                <SelectBox value={c.focus || ""} onChange={(v) => set("focus", v)} options={c.field === "Other" ? ["Other"] : (FOCUSES_BY_FIELD[c.field] || [])} optionKeyPrefix="full_focus_option" />
              </FieldRow>
            </Row>
            {c.field === "Other" && (
              <FieldRow refSetter={setRef("field_other")} label={label("full_field_other_label", "Tell us what you do *")} error={errors.field_other}>
                <EditableInput value={c.field_other || ""} onChange={(e) => set("field_other", e.target.value)} placeholderKey="full_field_other_placeholder" defaultPlaceholder="e.g. Outdoor industrial design" />
              </FieldRow>
            )}
            <FieldRow label={label("full_years_current_field_label", "Years in current field *")}>
              <Input type="number" min={0} value={c.years_in_current_field ?? 0}
                onChange={(e) => set("years_in_current_field", Number(e.target.value || 0))} />
            </FieldRow>
            <SkillsPicker value={Array.isArray(c.areas_of_expertise) ? c.areas_of_expertise : []} onChange={(v) => set("areas_of_expertise", v)} />
            <NichePicker value={Array.isArray(c.niche_experience) ? c.niche_experience : []} onChange={(v) => set("niche_experience", v)} />
          </SectionBlock>

          {/* Section 3: Where you're going */}
          <SectionBlock keyId="going" titleKey="full_s3_title" defaultTitle="Where you're going">
            <FieldRow label={label("full_dream_role_title_label", "Dream role title")}>
              <Input value={c.dream_role_title || ""} onChange={(e) => set("dream_role_title", e.target.value)} />
            </FieldRow>
            <FieldRow label={label("full_job_types_label", "Job types open to")}>
              <MultiPills value={c.job_types_seeking || []} options={JOB_TYPES as any} onChange={(v) => set("job_types_seeking", v)} optionKeyPrefix="full_job_type_option" />
            </FieldRow>
            <Row>
              <FieldRow label={label("full_min_pay_rate_label", "Min pay rate")}>
                <EditableInput value={c.min_pay_rate || ""} onChange={(e) => set("min_pay_rate", e.target.value)} placeholderKey="full_min_pay_rate_placeholder" defaultPlaceholder="e.g. 85k or 45/hr" />
              </FieldRow>
              <FieldRow label={label("full_current_location_label", "Current location")}>
                <Input value={c.current_location || ""} onChange={(e) => set("current_location", e.target.value)} />
              </FieldRow>
            </Row>
            <Row>
              <FieldRow label={label("full_open_relocation_label", "Open to relocation?")}>
                <SelectBox
                  value={c.open_to_relocation === true ? "Yes" : c.open_to_relocation === false ? "No" : ""}
                  onChange={(v) => set("open_to_relocation", v === "Yes")}
                  options={["Yes", "No"]}
                  optionKeyPrefix="full_yes_no_option"
                />
              </FieldRow>
              {c.open_to_relocation === true && (
                <FieldRow label={label("full_relocation_where_label", "Where to?")}>
                  <EditableInput value={c.relocation_locations || ""} onChange={(e) => set("relocation_locations", e.target.value)} placeholderKey="full_relocation_where_placeholder" defaultPlaceholder="e.g. PNW, CO, anywhere" />
                </FieldRow>
              )}
            </Row>
            <FieldRow
              label={label("full_open_to_retail_label", "Open to retail work?")}
              hint={<EditableText settingKey="full_open_to_retail_hint" defaultText="Retail roles in stores or showrooms. Includes ambassador, sales, and in-person customer-facing work." as="span" />}
            >
              <SelectBox
                value={c.open_to_retail === true ? "Yes" : c.open_to_retail === false ? "No" : ""}
                onChange={(v) => set("open_to_retail", v === "Yes")}
                options={["Yes", "No"]}
                optionKeyPrefix="full_yes_no_option"
              />
            </FieldRow>
            <FieldRow label={label("full_remote_preference_label", "Remote preference")}>
              <SelectBox value={c.remote_preference || ""} onChange={(v) => set("remote_preference", v)} options={REMOTE_PREFERENCES as any} optionKeyPrefix="full_remote_preference_option" />
            </FieldRow>
            <FieldRow label={label("full_workplace_types_label", "Workplace types open to")}>
              <MultiPills value={c.workplace_type_preference || []} options={WORKPLACE_TYPES as any} onChange={(v) => set("workplace_type_preference", v)} optionKeyPrefix="full_workplace_type_option" />
            </FieldRow>
          </SectionBlock>

          {/* Section 4: Your story */}
          <SectionBlock keyId="story" titleKey="full_s4_title" defaultTitle="Your story">
            <FieldRow label={label("full_total_years_label", "Total years professional experience")} hint={<EditableText settingKey="full_total_years_hint" defaultText="Across your whole career, all fields combined." as="span" />}>
              <Input type="number" min={0} value={c.total_years_professional ?? ""}
                onChange={(e) => set("total_years_professional", e.target.value === "" ? null : Number(e.target.value))} />
            </FieldRow>
            <PriorCareersPicker value={Array.isArray(c.prior_careers) ? c.prior_careers : []} onChange={(v) => set("prior_careers", v)} />
            <Row>
              <FieldRow label={label("full_outdoor_experience_label", "Outdoor industry experience")}>
                <SelectBox
                  value={c.outdoor_industry_experience === true ? "Yes" : c.outdoor_industry_experience === false ? "No" : ""}
                  onChange={(v) => {
                    const yes = v === "Yes";
                    set("outdoor_industry_experience", yes);
                    if (!yes) set("outdoor_industry_years", null);
                  }}
                  options={["Yes", "No"]}
                  optionKeyPrefix="full_yes_no_option"
                />
              </FieldRow>
              {c.outdoor_industry_experience === true && (
                <FieldRow label={label("full_outdoor_years_label", "Years in outdoor industry")}>
                  <Input type="number" min={0} value={c.outdoor_industry_years ?? ""}
                    onChange={(e) => set("outdoor_industry_years", e.target.value === "" ? null : Number(e.target.value))} />
                </FieldRow>
              )}
            </Row>
            <Row>
              <FieldRow label={label("full_management_experience_label", "Management experience")}>
                <SelectBox
                  value={c.management_experience === true ? "Yes" : c.management_experience === false ? "No" : ""}
                  onChange={(v) => {
                    const yes = v === "Yes";
                    set("management_experience", yes);
                    if (!yes) set("management_years", null);
                  }}
                  options={["Yes", "No"]}
                  optionKeyPrefix="full_yes_no_option"
                />
              </FieldRow>
              {c.management_experience === true && (
                <FieldRow label={label("full_management_years_label", "Years managing people")}>
                  <Input type="number" min={0} value={c.management_years ?? ""}
                    onChange={(e) => set("management_years", e.target.value === "" ? null : Number(e.target.value))} />
                </FieldRow>
              )}
            </Row>
          </SectionBlock>

          {/* Section 5: The Hook */}
          <SectionBlock keyId="hook" titleKey="full_s5_title" defaultTitle="The Hook *">
            <FieldRow
              refSetter={setRef("the_hook")}
              label={label("full_hook_label", "The Hook *")}
              error={errors.the_hook}
              hint={<EditableText settingKey="full_hook_prompt" defaultText="In one sentence, why should a brand hire you ASAP?" as="span" />}
            >
              <Textarea
                value={c.the_hook || HOOK_EXAMPLE_PLACEHOLDER}
                onFocus={(e) => {
                  if (!hookFocused) {
                    setHookFocused(true);
                    if (!c.the_hook) {
                      set("the_hook", HOOK_EXAMPLE_PLACEHOLDER);
                      setTimeout(() => e.target.select(), 0);
                    }
                  }
                }}
                onChange={(e) => set("the_hook", e.target.value.slice(0, 100))}
                maxLength={100}
                rows={3}
                className={c.the_hook && c.the_hook !== HOOK_EXAMPLE_PLACEHOLDER ? "" : "italic text-events-cream/60"}
              />
              <p className="text-[11px] text-events-cream/50 mt-1 font-body">
                {100 - (c.the_hook?.length || 0)} <EditableText settingKey="full_hook_chars_left" defaultText="chars left. Write over the example." as="span" />
              </p>
            </FieldRow>
            <HookExamples onPick={(t) => { set("the_hook", t.slice(0, 100)); setHookFocused(true); }} maxLen={100} />
          </SectionBlock>

          {/* Section 6: The Pitch */}
          <SectionBlock keyId="pitch" titleKey="full_s6_title" defaultTitle="The Pitch">
            <FieldRow
              label={label("full_pitch_label", "The Pitch")}
              hint={<EditableText settingKey="full_pitch_prompt" defaultText="A few sentences brands can read before they meet you. What do you do, what's working, what are you looking for?" as="span" />}
            >
              <Textarea
                value={c.the_pitch || PITCH_EXAMPLE_PLACEHOLDER}
                onFocus={(e) => {
                  if (!pitchFocused) {
                    setPitchFocused(true);
                    if (!c.the_pitch) {
                      set("the_pitch", PITCH_EXAMPLE_PLACEHOLDER);
                      setTimeout(() => e.target.select(), 0);
                    }
                  }
                }}
                onChange={(e) => set("the_pitch", e.target.value.slice(0, 500))}
                maxLength={500}
                rows={6}
                className={c.the_pitch && c.the_pitch !== PITCH_EXAMPLE_PLACEHOLDER ? "" : "italic text-events-cream/60"}
              />
              <p className="text-[11px] text-events-cream/50 mt-1 font-body">
                {500 - (c.the_pitch?.length || 0)} <EditableText settingKey="full_pitch_chars_left" defaultText="chars left." as="span" />
              </p>
            </FieldRow>
          </SectionBlock>

          {/* Section 7: Round it out */}
          <SectionBlock keyId="extras" titleKey="full_s7_title" defaultTitle="Round it out">
            <Row>
              <FieldRow label={label("full_current_title_label", "Current title")}><Input value={c.current_title || ""} onChange={(e) => set("current_title", e.target.value)} /></FieldRow>
              <FieldRow label={label("full_current_company_label", "Current company")}><Input value={c.current_company || ""} onChange={(e) => set("current_company", e.target.value)} /></FieldRow>
            </Row>
            <FieldRow label={label("full_linkedin_url_label", "LinkedIn URL")}>
              <EditableInput value={c.linkedin_url || ""} onChange={(e) => set("linkedin_url", e.target.value)} placeholderKey="full_linkedin_placeholder" defaultPlaceholder="https://linkedin.com/in/..." />
            </FieldRow>
            <FieldRow label={label("full_portfolio_url_label", "Portfolio URL")}>
              <EditableInput value={c.portfolio_url || ""} onChange={(e) => set("portfolio_url", e.target.value)} placeholderKey="full_portfolio_placeholder" defaultPlaceholder="https://..." />
            </FieldRow>
            <div>
              <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1.5 block"><EditableText settingKey="full_dream_companies_label" defaultText="Dream companies" as="span" /></Label>
              <EditableText settingKey="full_dream_companies_hint" defaultText="Type a company name. Brands at this event show first." as="p" className="text-[11px] text-events-cream/55 font-body mb-2" />
              {(() => {
                const dc = c.dream_companies;
                const names: string[] = Array.isArray(dc)
                  ? dc.map((x: any) => (typeof x === "string" ? x : x?.name)).filter(Boolean)
                  : (dc?.names || []);
                const domains: Record<string, string> = Array.isArray(dc)
                  ? Object.fromEntries(dc.filter((x: any) => x?.name && x?.domain).map((x: any) => [x.name, x.domain]))
                  : (dc?.domains || {});
                return (
                  <EditableBubbleLogoPicker
                    value={names}
                    domains={domains}
                    suggestionEventSlug="denver26"
                    onChange={(n, d) => set("dream_companies", n.map((name) => ({ name, domain: d[name] || null })))}
                    placeholderKey="full_dream_companies_placeholder"
                    defaultPlaceholder="Patagonia, Yeti, REI..."
                  />
                );
              })()}
            </div>
            <div>
              <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1.5 block"><EditableText settingKey="full_resume_label" defaultText="Resume (PDF, 5MB max)" as="span" /></Label>
              <div className="flex items-center gap-3 flex-wrap">
                {c.resume_url ? (
                  <a href={c.resume_url} target="_blank" rel="noreferrer" className="text-events-coral underline font-body text-sm"><EditableText settingKey="full_view_resume_link" defaultText="View current resume" as="span" /></a>
                ) : <span className="text-events-cream/50 font-body text-sm"><EditableText settingKey="full_no_resume_label" defaultText="No resume uploaded." as="span" /></span>}
                <input ref={resumeInput} type="file" accept="application/pdf" hidden
                  onChange={(e) => e.target.files?.[0] && upload("resume", e.target.files[0])} />
                <Button variant="secondary" onClick={() => resumeInput.current?.click()}><EditableText settingKey="full_upload_pdf_button" defaultText="Upload PDF" as="span" /></Button>
              </div>
            </div>
          </SectionBlock>

          {/* Submit */}
          <div className="sticky bottom-16 sm:bottom-0 -mx-4 px-4 py-4 bg-events-teal/95 backdrop-blur border-t border-events-cream/10 mt-6 space-y-3">
            <label className="flex items-start gap-3 text-sm text-events-cream font-body cursor-pointer leading-snug">
              <input
                type="checkbox"
                checked={!!c.data_portability_consent}
                onChange={(e) => set("data_portability_consent", e.target.checked)}
                className="mt-0.5 h-6 w-6 flex-shrink-0 rounded-md border-2 border-events-cream/70 bg-transparent accent-events-coral cursor-pointer"
              />
              <span>
                I'm interested in{" "}
                <a href="https://basecampjobs.com" target="_blank" rel="noreferrer" className="underline hover:text-events-cream">
                  Basecamp Jobs
                </a>
                {" "}when it launches. You can use my profile data here so I don't have to start from scratch.
              </span>
            </label>
            <Button
              onClick={submit}
              className="w-full h-12 bg-events-coral hover:bg-events-coral/90 text-events-cream"
            >
              <EditableText settingKey="full_submit_label" defaultText="Submit and see the map" as="span" />
            </Button>
            <EditableText
              settingKey="full_submit_secondary"
              defaultText="You can always come back and edit your profile."
              as="p"
              className="text-center text-[11px] text-events-cream/50 font-body"
            />
          </div>
        </ConnectShell>
        <ConnectBottomNav />
      </ImpersonationGate>
    </EditableTextProvider>
  );
};

// ----- Reusable bits -----

const SectionBlock = ({
  keyId, titleKey, defaultTitle, children,
}: { keyId: string; titleKey: string; defaultTitle: string; children: any }) => (
  <section className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-5 md:p-6 space-y-4 mb-6" id={`section-${keyId}`}>
    <EditableText
      settingKey={titleKey}
      defaultText={defaultTitle}
      as="h2"
      className="font-display text-xl md:text-2xl text-events-cream"
    />
    {children}
  </section>
);

const Row = ({ children }: any) => <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>;

const FieldRow = ({ label, hint, error, children, refSetter }: any) => (
  <div ref={refSetter}>
    <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1.5 block">{label}</Label>
    {children}
    {error && <p className="text-[11px] text-red-300 mt-1 font-body">{error}</p>}
    {hint && !error && <p className="text-[11px] text-events-cream/50 mt-1 font-body">{hint}</p>}
  </div>
);

const EditableInput = ({ placeholderKey, defaultPlaceholder, ...props }: any) => {
  const { settings, isAdmin } = useEditableTextContext();
  return (
    <div className="space-y-1">
      <Input {...props} placeholder={settings[placeholderKey] || defaultPlaceholder} />
      {isAdmin && <EditableText settingKey={placeholderKey} defaultText={defaultPlaceholder} as="span" className="inline-block text-[10px] text-events-cream/50" />}
    </div>
  );
};

const EditableBubbleLogoPicker = ({ placeholderKey, defaultPlaceholder, ...props }: any) => {
  const { settings, isAdmin } = useEditableTextContext();
  return (
    <div className="space-y-1">
      <BubbleLogoPicker {...props} placeholder={settings[placeholderKey] || defaultPlaceholder} />
      {isAdmin && <EditableText settingKey={placeholderKey} defaultText={defaultPlaceholder} as="span" className="inline-block text-[10px] text-events-cream/50" />}
    </div>
  );
};

const SelectBox = ({ value, onChange, options, optionKeyPrefix }: { value: string; onChange: (v: string) => void; options: string[]; optionKeyPrefix?: string }) => {
  const { settings, isAdmin } = useEditableTextContext();
  const optionKey = (o: string) => `${optionKeyPrefix || "full_select_option"}_${slugifyKey(o)}`;
  const labelFor = (o: string) => (optionKeyPrefix ? settings[optionKey(o)] || o : o);
  return (
    <div className="space-y-2">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-events-cream/5 border border-events-cream/15 text-events-cream rounded-md h-10 px-3 text-sm font-body">
        <option value="">{settings.full_select_placeholder || "Select..."}</option>
        {options.map((o) => (<option key={o} value={o}>{labelFor(o)}</option>))}
      </select>
      {isAdmin && <EditableText settingKey="full_select_placeholder" defaultText="Select..." as="span" className="inline-block text-[10px] text-events-cream/50" />}
      {isAdmin && optionKeyPrefix && options.length > 0 && (
        <div className="flex flex-wrap gap-1.5 rounded-md border border-events-cream/10 bg-events-cream/5 p-2">
          {options.map((o) => (
            <EditableText key={o} settingKey={optionKey(o)} defaultText={o} as="span" className="px-2 py-1 rounded-full border border-events-cream/15 text-[10px] normal-case tracking-normal text-events-cream/75" />
          ))}
        </div>
      )}
    </div>
  );
};

const MultiPills = ({ value, options, onChange, optionKeyPrefix }: { value: string[]; options: string[]; onChange: (v: string[]) => void; optionKeyPrefix?: string }) => {
  const { settings, isAdmin } = useEditableTextContext();
  const toggle = (o: string) => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
  const optionKey = (o: string) => `${optionKeyPrefix || "full_pill_option"}_${slugifyKey(o)}`;
  const labelFor = (o: string) => (optionKeyPrefix ? settings[optionKey(o)] || o : o);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button type="button" key={o} onClick={() => toggle(o)}
              className={`px-3 py-1.5 rounded-full text-xs font-body border transition ${on ? "bg-events-coral text-events-cream border-events-coral" : "bg-transparent text-events-cream/70 border-events-cream/20 hover:border-events-cream/40"}`}>
              {labelFor(o)}
            </button>
          );
        })}
      </div>
      {isAdmin && optionKeyPrefix && options.length > 0 && (
        <div className="flex flex-wrap gap-1.5 rounded-md border border-events-cream/10 bg-events-cream/5 p-2">
          {options.map((o) => (
            <EditableText key={o} settingKey={optionKey(o)} defaultText={o} as="span" className="px-2 py-1 rounded-full border border-events-cream/15 text-[10px] normal-case tracking-normal text-events-cream/75" />
          ))}
        </div>
      )}
    </div>
  );
};

const SkillsPicker = ({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) => {
  const { settings, isAdmin } = useEditableTextContext();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const selected = new Set(value);
  const toggle = (skill: string) => {
    if (selected.has(skill)) onChange(value.filter((s) => s !== skill));
    else onChange([...value, skill]);
  };
  const q = search.trim().toLowerCase();
  const filteredCats = useMemo(() => {
    return SKILL_CATEGORY_KEYS.map((cat) => {
      const skills = SKILL_CATEGORIES[cat].filter((s) => !q || s.toLowerCase().includes(q));
      return { cat, skills };
    }).filter((c) => c.skills.length > 0);
  }, [q]);

  return (
    <div className="space-y-3 pt-2 border-t border-events-cream/10">
      <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider block">
        <EditableText settingKey="full_areas_expertise_label" defaultText="Skills" as="span" />
      </Label>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((s) => (
            <button type="button" key={s} onClick={() => toggle(s)}
              className="px-3 py-1.5 rounded-full text-xs font-body border bg-events-coral text-events-cream border-events-coral inline-flex items-center gap-1.5">
              {settings[`full_skill_option_${slugifyKey(s)}`] || s}<X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={settings.full_search_skills_placeholder || "Search skills..."} />
      {isAdmin && <EditableText settingKey="full_search_skills_placeholder" defaultText="Search skills..." as="span" className="inline-block text-[10px] text-events-cream/50" />}
      <div className="space-y-1.5">
        {filteredCats.map(({ cat, skills }) => {
          const count = skills.filter((s) => selected.has(s)).length;
          const isOpen = !!q || open[cat];
          return (
            <Collapsible key={cat} open={isOpen} onOpenChange={(o) => setOpen((p) => ({ ...p, [cat]: o }))}>
              <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-events-cream/5 border border-events-cream/10 text-sm font-body text-events-cream hover:bg-events-cream/10">
                <span>{settings[`full_skill_category_${slugifyKey(cat)}`] || cat} {count > 0 && <span className="text-events-coral">({count})</span>}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 px-3 py-2">
                  {skills.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm font-body text-events-cream/80 cursor-pointer py-1">
                      <Checkbox checked={selected.has(s)} onCheckedChange={() => toggle(s)} />
                      <span>{settings[`full_skill_option_${slugifyKey(s)}`] || s}</span>
                    </label>
                  ))}
                </div>
                {isAdmin && (
                  <div className="flex flex-wrap gap-1.5 px-3 pb-3">
                    <EditableText settingKey={`full_skill_category_${slugifyKey(cat)}`} defaultText={cat} as="span" className="px-2 py-1 rounded-full border border-events-coral/30 text-[10px] normal-case tracking-normal text-events-coral" />
                    {skills.map((s) => (
                      <EditableText key={s} settingKey={`full_skill_option_${slugifyKey(s)}`} defaultText={s} as="span" className="px-2 py-1 rounded-full border border-events-cream/15 text-[10px] normal-case tracking-normal text-events-cream/75" />
                    ))}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

type NicheEntry = { niche: string; years: number | null };
const NichePicker = ({ value, onChange }: { value: NicheEntry[]; onChange: (v: NicheEntry[]) => void }) => {
  const { settings, isAdmin } = useEditableTextContext();
  const map = new Map<string, number | null>();
  for (const e of value) if (e?.niche) map.set(e.niche, e.years ?? null);
  const setEntries = (m: Map<string, number | null>) =>
    onChange(Array.from(m.entries()).map(([niche, years]) => ({ niche, years })));
  const toggle = (n: string) => { const m = new Map(map); m.has(n) ? m.delete(n) : m.set(n, null); setEntries(m); };
  const setYears = (n: string, raw: string) => {
    const m = new Map(map);
    if (raw === "") m.set(n, null);
    else { const y = parseInt(raw, 10); m.set(n, Number.isFinite(y) && y >= 0 ? y : null); }
    setEntries(m);
  };
  const selected = Array.from(map.keys());
  return (
    <div className="space-y-3 pt-2 border-t border-events-cream/10">
      <div>
        <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider block">
          <EditableText settingKey="full_niche_experience_label" defaultText="Niche work experience" as="span" />
        </Label>
        <p className="text-[11px] text-events-cream/55 font-body mt-1">
          Tap niches you have actual <strong className="font-semibold text-events-cream/85">paid work experience</strong> in (not just interests). Add years for each.
        </p>
      </div>
      {/* Compact chip grid, fits all options on one phone screen */}
      <div className="flex flex-wrap gap-1.5">
        {NICHES.map((n) => {
          const on = map.has(n);
          return (
            <button
              type="button"
              key={n}
              onClick={() => toggle(n)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-body border transition leading-tight ${
                on
                  ? "bg-events-coral text-events-cream border-events-coral"
                  : "bg-transparent text-events-cream/70 border-events-cream/20 hover:border-events-cream/40"
              }`}
            >
              {settings[`full_niche_option_${slugifyKey(n)}`] || n}
            </button>
          );
        })}
      </div>
      {isAdmin && (
        <div className="flex flex-wrap gap-1.5 rounded-md border border-events-cream/10 bg-events-cream/5 p-2">
          {NICHES.map((n) => (
            <EditableText key={n} settingKey={`full_niche_option_${slugifyKey(n)}`} defaultText={n} as="span" className="px-2 py-1 rounded-full border border-events-cream/15 text-[10px] normal-case tracking-normal text-events-cream/75" />
          ))}
        </div>
      )}
      {selected.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <Label className="text-events-cream/60 text-[10px] font-body uppercase tracking-wider block">
            <EditableText settingKey="full_niche_years_label" defaultText="Years of experience" as="span" />
          </Label>
          {selected.map((n) => (
            <div key={n} className="flex items-center gap-2">
              <span className="text-xs font-body text-events-cream/80 flex-1 truncate">{settings[`full_niche_option_${slugifyKey(n)}`] || n}</span>
              <Input
                type="number"
                min={0}
                value={map.get(n) ?? ""}
                onChange={(e) => setYears(n, e.target.value)}
                placeholder={settings.full_years_placeholder || "yrs"}
                className="w-16 h-7 text-xs"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

type PriorCareer = { field: string; focus: string; years: number | null };
const PriorCareersPicker = ({ value, onChange }: { value: PriorCareer[]; onChange: (v: PriorCareer[]) => void }) => {
  const { settings } = useEditableTextContext();
  const entries = value.map((e: any) => ({ field: e?.field || "", focus: e?.focus || "", years: e?.years ?? null }));
  const update = (i: number, patch: Partial<PriorCareer>) =>
    onChange(entries.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const remove = (i: number) => onChange(entries.filter((_, idx) => idx !== i));
  const add = () => { if (entries.length < 3) onChange([...entries, { field: "", focus: "", years: null }]); };
  return (
    <div className="space-y-3 pt-2 border-t border-events-cream/10">
      <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider block">
        <EditableText settingKey="full_prior_careers_label" defaultText="Prior careers" as="span" />
      </Label>
      <EditableText settingKey="full_prior_careers_hint" defaultText="Add up to 3 prior careers so brands see your full story." as="p" className="text-[11px] text-events-cream/55 font-body" />
      {entries.map((e, i) => (
        <div key={i} className="relative bg-events-cream/5 border border-events-cream/10 rounded-lg p-3 pr-10 space-y-2">
          <button type="button" onClick={() => remove(i)} aria-label={settings.full_remove_prior_career_label || "Remove"} className="absolute top-2 right-2 text-events-cream/60 hover:text-events-coral">
            <X className="w-4 h-4" />
          </button>
          <Row>
            <FieldRow label={<EditableText settingKey="full_prior_field_label" defaultText="Field" as="span" />}><SelectBox value={e.field} onChange={(v) => update(i, { field: v, focus: "" })} options={FIELDS} optionKeyPrefix="full_field_option" /></FieldRow>
            <FieldRow label={<EditableText settingKey="full_prior_focus_label" defaultText="Focus" as="span" />}><SelectBox value={e.focus} onChange={(v) => update(i, { focus: v })} options={FOCUSES_BY_FIELD[e.field] || []} optionKeyPrefix="full_focus_option" /></FieldRow>
          </Row>
          <FieldRow label={<EditableText settingKey="full_prior_years_label" defaultText="Years" as="span" />}>
            <Input type="number" min={0} value={e.years ?? ""} onChange={(ev) => update(i, { years: ev.target.value === "" ? null : Number(ev.target.value) })} />
          </FieldRow>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={add} disabled={entries.length >= 3}>
        <EditableText settingKey="full_add_prior_career_button" defaultText="Add another prior career" as="span" />
      </Button>
    </div>
  );
};

export default ConnectFull;
