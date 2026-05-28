import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  candidateMe, candidateSignupLookup, candidateSignupCreate, candidateLogin,
  candidateSignupCreateBasics,
  candidateUploadSignedUrl, candidateAttachUpload, candidateUpdateProfile,
} from "@/lib/connect-session";
import { POACHABLE_STATUS, CAREER_STAGE, FIELDS, FOCUSES_BY_FIELD } from "@/lib/taxonomies";
import ImpersonationGate from "@/components/connect/ImpersonationGate";
import ConnectShell from "@/components/connect/ConnectShell";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import HookExamples, { HOOK_EXAMPLE_PLACEHOLDER } from "@/components/connect/HookExamples";
import BrandContactConsentCheckbox from "@/components/connect/BrandContactConsentCheckbox";
import RegisterReminderBanner from "@/components/connect/RegisterReminderBanner";
import { useEventMode } from "@/lib/connect-event-mode";
import { supabase } from "@/integrations/supabase/client";

type Mode = "branch" | "choice" | "new" | "returning" | "quick" | "done";


const Connect = () => {
  const nav = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("branch");
  const [createdCandidate, setCreatedCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { session } = await candidateMe();
        if (session?.subject) { nav("/outsidedays26/connect/home"); return; }
      } catch {}
      setLoading(false);
    })();
  }, [nav]);

  if (loading) {
    return (
      <div className="min-h-screen bg-events-teal text-events-cream flex items-center justify-center font-body">
        Loading...
      </div>
    );
  }

  return (
    <EditableTextProvider pageSlug="outsidedays26-connect">
      <ImpersonationGate>
        <ConnectShell maxWidth="md">
          {mode !== "done" && <RegisterReminderBanner />}
          {mode === "branch" && (
            <>
              <ValueProp />
              <BranchPicker
                onFull={() => nav("/outsidedays26/connect/full")}
                onEssentials={() => setMode("choice")}
                onReturning={() => setMode("returning")}
              />
            </>
          )}
          {mode === "choice" && (
            <NewSignup
              toast={toast}
              onDone={(c: any) => { setCreatedCandidate(c); setMode("done"); }}
              onBack={() => setMode("branch")}
            />
          )}
          {mode === "returning" && (
            <Returning
              toast={toast}
              onDone={() => nav("/outsidedays26/connect/home")}
              onBack={() => setMode("branch")}
            />
          )}
          {mode === "done" && (
            <CompletionScreen
              candidate={createdCandidate}
              onAddRest={() => nav("/outsidedays26/connect/full")}
              onSkip={() => nav("/outsidedays26/connect/home")}
            />
          )}
        </ConnectShell>
      </ImpersonationGate>
    </EditableTextProvider>
  );
};

const ValueProp = () => {
  const bullets = [
    { key: "stand_out_b1", text: "See exactly who's coming and which brands are hiring" },
    { key: "stand_out_b2", text: "Research reps so you walk up to their table prepared" },
    { key: "stand_out_b3", text: "Star brands you want to visit so lines feel shorter on the day" },
    { key: "stand_out_b4", text: "Reach out ahead of the event if you want them to know who you are" },
  ];
  return (
    <section className="px-2 py-8 mb-6 text-center">
      <EditableText
        settingKey="stand_out_title"
        defaultText="Stand out before you walk in."
        as="h2"
        className="font-afterparty text-3xl md:text-4xl text-events-cream mb-5"
      />
      <ul className="space-y-2.5 text-left max-w-md mx-auto">
        {bullets.map((b) => (
          <li key={b.key} className="flex gap-3 items-start text-events-cream font-body text-sm md:text-base leading-relaxed">
            <span className="text-events-coral font-bold flex-shrink-0">✓</span>
            <EditableText settingKey={b.key} defaultText={b.text} as="span" className="flex-1" />
          </li>
        ))}
      </ul>
    </section>
  );
};

const BranchPicker = ({ onFull, onEssentials, onReturning }: any) => (
  <div className="space-y-5">
    <div className="text-center space-y-2">
      <EditableText
        settingKey="branch_title"
        defaultText="How much time do you have right now?"
        as="h1"
        className="font-afterparty text-3xl md:text-4xl text-events-cream"
      />
      <EditableText
        settingKey="branch_subtitle"
        defaultText="Either way, you can edit and add more anytime."
        as="p"
        className="font-body text-sm text-events-cream/70"
      />
    </div>

    <button
      onClick={onFull}
      className="w-full text-left bg-events-coral hover:bg-events-coral/90 text-events-cream rounded-2xl p-5 transition-colors shadow-lg"
    >
      <div className="text-3xl mb-1">📋</div>
      <EditableText
        settingKey="branch_full_heading"
        defaultText="I'll do the full profile"
        as="h2"
        className="font-display text-xl mb-1"
      />
      <EditableText
        settingKey="branch_full_subtext"
        defaultText="About 5 to 7 minutes. Brands can fully filter and find you."
        as="p"
        className="text-sm font-body text-events-cream/90"
      />
    </button>

    <button
      onClick={onEssentials}
      className="w-full text-left bg-events-cream/10 hover:bg-events-cream/15 border border-events-cream/20 text-events-cream rounded-2xl p-5 transition-colors"
    >
      <div className="text-3xl mb-1">⚡</div>
      <EditableText
        settingKey="branch_essentials_heading"
        defaultText="Just the essentials for now"
        as="h2"
        className="font-display text-xl mb-1"
      />
      <EditableText
        settingKey="branch_essentials_subtext"
        defaultText="About 90 seconds. You'll come back and finish later."
        as="p"
        className="text-sm font-body text-events-cream/80"
      />
    </button>

    <div className="text-center pt-2">
      <button
        onClick={onReturning}
        className="text-events-cream/70 hover:text-events-cream font-body text-sm underline underline-offset-4"
      >
        <EditableText
          settingKey="branch_returning_link"
          defaultText="I already have an account"
          as="span"
        />
      </button>
    </div>
  </div>
);

const CompletionScreen = ({ candidate, onAddRest, onSkip }: any) => (
  <div className="space-y-5 bg-events-cream/5 border border-events-cream/10 rounded-2xl p-6 text-center">
    <EditableText
      settingKey="essentials_done_title"
      defaultText="You're in! 🎉"
      as="h1"
      className="font-afterparty text-3xl md:text-4xl text-events-cream"
    />
    <EditableText
      settingKey="essentials_done_body"
      defaultText="You can head to the map now. Brands are way more likely to follow up if your profile is complete though. Want to add the rest now?"
      as="p"
      className="font-body text-events-cream/80"
    />
    <div className="space-y-2 pt-2">
      <Button
        onClick={onAddRest}
        className="w-full h-12 bg-events-coral hover:bg-events-coral/90 text-events-cream"
      >
        <EditableText settingKey="essentials_done_primary" defaultText="Add the rest now" as="span" />
      </Button>
      <Button onClick={onSkip} variant="ghost" className="w-full text-events-cream/70">
        <EditableText settingKey="essentials_done_secondary" defaultText="Take me to the map" as="span" />
      </Button>
    </div>
    {candidate?.first_name && (
      <p className="text-xs text-events-cream/50 font-body">Logged in as {candidate.first_name}.</p>
    )}
  </div>
);

const Returning = ({ toast, onDone, onBack }: any) => {
  const [first, setFirst] = useState(""); const [last, setLast] = useState(""); const [last4, setLast4] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true);
    try {
      const r: any = await candidateLogin({ first_name: first, last_name: last, phone_last_four: last4 });
      if (r?.ambiguous) {
        toast({ title: "Multiple accounts found", description: "Please contact jenna@wearetheoutdoorindustry.com to resolve.", variant: "destructive" });
      } else if (r?.session) {
        onDone(r.session.subject);
      } else {
        toast({ title: "Account not found", description: "We couldn't find that account. Try signing up?", variant: "destructive" });
      }
    } catch (e: any) { toast({ title: "Sign-in failed", description: e.message, variant: "destructive" }); }
    setBusy(false);
  };
  return (
    <div className="space-y-3 bg-events-cream/5 border border-events-cream/10 rounded-2xl p-5">
      <Field label="First name"><Input value={first} onChange={(e) => setFirst(e.target.value)} /></Field>
      <Field label="Last name"><Input value={last} onChange={(e) => setLast(e.target.value)} /></Field>
      <Field label="Last 4 of your phone"><Input inputMode="numeric" maxLength={4} value={last4} onChange={(e) => setLast4(e.target.value.replace(/[^0-9]/g, ""))} /></Field>
      <Button onClick={submit} disabled={busy || !first || !last || last4.length !== 4} className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream">Sign in</Button>
      <Button variant="ghost" onClick={onBack} className="w-full text-events-cream/60">Back</Button>
    </div>
  );
};

const TOTAL_STEPS = 7; // 0..6: name -> phone -> career -> poachable -> field -> hook -> photo

const NewSignup = ({ toast, onDone, onBack }: any) => {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [d, setD] = useState<any>({
    first_name: "", last_name: "", email: "", phone: "",
    poachable_status: "", career_stage: "", field: "", focus: "", field_other: "",
    years_in_current_field: 0, the_hook: "",
    signup_mode: "essentials",
    data_portability_consent: false,
    brand_contact_consent: false,
    open_to_retail: null,
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const selfieRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [hookFocused, setHookFocused] = useState(false);
  const set = (k: string, v: any) => setD((p: any) => ({ ...p, [k]: v }));

  useEffect(() => {
    return () => { if (photoPreview) URL.revokeObjectURL(photoPreview); };
  }, [photoPreview]);

  const onPhotoPicked = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Image required", description: "Please choose a photo file.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Photo too large", description: "Please choose an image under 5MB.", variant: "destructive" });
      return;
    }
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const stepValid = () => {
    if (step === 0) return d.first_name && d.last_name && /\S+@\S+\.\S+/.test(d.email);
    if (step === 1) return d.phone.replace(/[^0-9]/g, "").length >= 10;
    if (step === 2) return !!d.career_stage;
    if (step === 3) return !!d.poachable_status;
    if (step === 4) {
      if (!d.field || !d.focus || d.years_in_current_field < 0) return false;
      if (d.field === "Other" && !d.field_other?.trim()) return false;
      return true;
    }
    if (step === 5) {
      const v = (d.the_hook || "").trim();
      return v.length > 0 && v !== HOOK_EXAMPLE_PLACEHOLDER && v.length <= 100;
    }
    if (step === 6) return true; // photo optional
    return true;
  };

  const submit = async (createdAlreadyPhoto?: boolean) => {
    setBusy(true);
    try {
      const payload = { ...d };
      // If user never edited the example hook, it shouldn't be saved as their answer
      if (payload.the_hook === HOOK_EXAMPLE_PLACEHOLDER) payload.the_hook = "";
      const { session } = await candidateSignupCreate(payload);
      if (photoFile && !createdAlreadyPhoto) {
        try {
          const { upload_url, storage_path } = await candidateUploadSignedUrl("photo", photoFile.name, photoFile.type);
          const putRes = await fetch(upload_url, { method: "PUT", headers: { "Content-Type": photoFile.type }, body: photoFile });
          if (!putRes.ok) throw new Error("upload failed");
          await candidateAttachUpload("photo", storage_path);
        } catch {
          toast({ title: "Photo upload failed", description: "You can add it from your profile.", variant: "destructive" });
        }
      }
      onDone(session.subject);
    } catch (e: any) { toast({ title: "Signup failed", description: e.message, variant: "destructive" }); }
    setBusy(false);
  };

  const next = async () => {
    if (step === 0) {
      setBusy(true);
      try {
        const { exists } = await candidateSignupLookup({ first_name: d.first_name, last_name: d.last_name, email: d.email });
        if (exists) {
          toast({ title: "Account exists", description: "An account with that email exists. Try signing in instead." });
          setBusy(false); return;
        }
      } catch (e: any) { toast({ title: "Error", description: e.message, variant: "destructive" }); setBusy(false); return; }
      setBusy(false);
    }
    if (step < TOTAL_STEPS - 1) { setStep(step + 1); return; }
    await submit();
  };

  return (
    <div className="space-y-4 bg-events-cream/5 border border-events-cream/10 rounded-2xl p-5">
      <div className="flex gap-1">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-events-coral" : "bg-events-cream/15"}`} />
        ))}
      </div>

      {step === 0 && (
        <>
          <Field label={<EditableText settingKey="quiz_first_name" defaultText="First name" as="span" />}>
            <Input value={d.first_name} onChange={(e) => set("first_name", e.target.value)} />
          </Field>
          <Field label={<EditableText settingKey="quiz_last_name" defaultText="Last name" as="span" />}>
            <Input value={d.last_name} onChange={(e) => set("last_name", e.target.value)} />
          </Field>
          <Field label={<EditableText settingKey="quiz_email" defaultText="Email" as="span" />}>
            <Input type="email" value={d.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
        </>
      )}
      {step === 1 && (
        <Field
          label={<EditableText settingKey="quiz_phone_label" defaultText="Phone (full number)" as="span" />}
          hint={<EditableText settingKey="quiz_phone_hint" defaultText="Hidden from everyone except admin. Used to verify it's you when you log in." as="span" />}
        >
          <Input inputMode="tel" value={d.phone} onChange={(e) => set("phone", e.target.value)} placeholder="555 123 4567" />
        </Field>
      )}
      {step === 2 && (
        <Field label={<EditableText settingKey="quiz_career_stage" defaultText="Career stage" as="span" />}>
          <SelectBox value={d.career_stage} onChange={(v) => set("career_stage", v)} options={CAREER_STAGE as any} />
        </Field>
      )}
      {step === 3 && (
        <Field label={<EditableText settingKey="quiz_poachable" defaultText="Poachable status" as="span" />}>
          <SelectBox value={d.poachable_status} onChange={(v) => set("poachable_status", v)} options={POACHABLE_STATUS as any} />
        </Field>
      )}
      {step === 4 && (
        <>
          <Field label={<EditableText settingKey="quiz_field" defaultText="Field" as="span" />}>
            <SelectBox value={d.field} onChange={(v) => { set("field", v); set("focus", ""); }} options={FIELDS} />
          </Field>
          {d.field === "Other" && (
            <Field
              label={<EditableText settingKey="quiz_field_other" defaultText="Tell us what you do" as="span" />}
              hint={<EditableText settingKey="quiz_field_other_hint" defaultText="A few words is fine. Brands can search this." as="span" />}
            >
              <Input value={d.field_other} onChange={(e) => set("field_other", e.target.value)} placeholder="e.g. Outdoor industrial design" />
            </Field>
          )}
          {d.field && d.field !== "Other" && (
            <Field label={<EditableText settingKey="quiz_focus" defaultText="Focus" as="span" />}>
              <SelectBox value={d.focus} onChange={(v) => set("focus", v)} options={FOCUSES_BY_FIELD[d.field] || []} />
            </Field>
          )}
          {d.field === "Other" && (
            <Field label={<EditableText settingKey="quiz_focus" defaultText="Focus" as="span" />}>
              <SelectBox value={d.focus} onChange={(v) => set("focus", v)} options={["Other"]} />
            </Field>
          )}
          <Field label={<EditableText settingKey="quiz_years" defaultText="Years in your current field" as="span" />}>
            <Input type="number" min={0} value={d.years_in_current_field} onChange={(e) => set("years_in_current_field", Number(e.target.value || 0))} />
          </Field>
          <Field
            label={<EditableText settingKey="quiz_open_to_retail" defaultText="Open to retail work?" as="span" />}
            hint={<EditableText settingKey="quiz_open_to_retail_hint" defaultText="Retail roles in stores or showrooms. Includes ambassador, sales, and in-person customer-facing work." as="span" />}
          >
            <div className="flex gap-2">
              {["Yes", "No"].map((opt) => {
                const isYes = opt === "Yes";
                const selected = d.open_to_retail === isYes;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set("open_to_retail", isYes)}
                    className={`flex-1 py-2 rounded-lg font-body text-sm border transition-colors ${
                      selected
                        ? "bg-events-coral text-events-cream border-events-coral"
                        : "bg-events-cream/5 text-events-cream/80 border-events-cream/20 hover:bg-events-cream/10"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </Field>
        </>
      )}
      {step === 5 && (
        <div className="space-y-2">
          <Field
            label={<EditableText settingKey="quiz_hook_label" defaultText="The Hook" as="span" />}
            hint={
              <EditableText
                settingKey="quiz_hook_prompt"
                defaultText="In one sentence, why should a brand hire you ASAP?"
                as="span"
              />
            }
          >
            <Textarea
              value={d.the_hook || HOOK_EXAMPLE_PLACEHOLDER}
              onFocus={(e) => {
                if (!hookFocused) {
                  setHookFocused(true);
                  if (!d.the_hook) {
                    set("the_hook", HOOK_EXAMPLE_PLACEHOLDER);
                    setTimeout(() => e.target.select(), 0);
                  }
                }
              }}
              onChange={(e) => set("the_hook", e.target.value.slice(0, 100))}
              maxLength={100}
              rows={3}
              className={d.the_hook && d.the_hook !== HOOK_EXAMPLE_PLACEHOLDER ? "" : "italic text-events-cream/60"}
            />
            <p className="text-[11px] text-events-cream/50 mt-1 font-body">
              {100 - (d.the_hook?.length || 0)} chars left. Write over the example.
            </p>
          </Field>
          <HookExamples
            onPick={(t) => { set("the_hook", t.slice(0, 100)); setHookFocused(true); }}
            maxLen={100}
          />
        </div>
      )}
      {step === 6 && (
        <div className="space-y-4">
          <div>
            <EditableText
              settingKey="quiz_photo_title"
              defaultText="Add your photo"
              as="p"
              className="font-display text-lg text-events-cream"
            />
            <EditableText
              settingKey="quiz_photo_body"
              defaultText="Snap a quick selfie or upload a headshot. Recruiters meet 600 people in one day. A face makes you 10 times more memorable."
              as="p"
              className="text-sm text-events-cream/70 font-body mt-1"
            />
          </div>
          {photoPreview && (
            <div className="flex justify-center">
              <img src={photoPreview} alt="Your selected photo" className="w-20 h-20 rounded-full object-cover border border-events-cream/20" />
            </div>
          )}
          <input ref={selfieRef} type="file" accept="image/*" capture="user" className="hidden"
            onChange={(e) => onPhotoPicked(e.target.files?.[0] || null)} />
          <input ref={uploadRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => onPhotoPicked(e.target.files?.[0] || null)} />
          <div className="space-y-2">
            <Button type="button" onClick={() => selfieRef.current?.click()} className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream">
              {photoFile ? "Retake selfie" : "Take selfie"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => uploadRef.current?.click()} className="w-full">
              {photoFile ? "Choose a different photo" : "Upload from device"}
            </Button>
          </div>
          <label className="flex items-start gap-3 pt-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!d.data_portability_consent}
              onChange={(e) => set("data_portability_consent", e.target.checked)}
              className="mt-0.5 h-6 w-6 flex-shrink-0 rounded-md border-2 border-events-cream/70 bg-transparent accent-events-coral cursor-pointer"
            />
            <span className="text-sm text-events-cream font-body leading-snug">
              I'd like my profile to be portable to{" "}
              <a href="https://basecampjobs.com" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-events-cream">
                Basecamp Jobs
              </a>{" "}
              so brands can find me year-round.
            </span>
          </label>
        </div>
      )}

      {step === TOTAL_STEPS - 1 && (
        <BrandContactConsentCheckbox
          checked={!!d.brand_contact_consent}
          onChange={(v) => set("brand_contact_consent", v)}
          className="pt-3 border-t border-events-cream/10"
        />
      )}

      <div className="flex gap-2 pt-2">
        <Button variant="ghost" onClick={() => (step === 0 ? onBack() : setStep(step - 1))} className="flex-1 text-events-cream/70">Back</Button>
        <Button onClick={next} disabled={busy || !stepValid()} className="flex-1 bg-events-coral hover:bg-events-coral/90 text-events-cream">
          {step < TOTAL_STEPS - 1 ? "Continue" : (photoFile ? "Create account" : "Skip and create account")}
        </Button>
      </div>
    </div>
  );
};

const Field = ({ label, hint, children }: any) => (
  <div>
    <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1.5 block">{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-events-cream/50 mt-1 font-body">{hint}</p>}
  </div>
);

const SelectBox = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-events-cream/5 border border-events-cream/15 text-events-cream rounded-md h-10 px-3 text-sm font-body"
  >
    <option value="">Select...</option>
    {options.map((o) => (<option key={o} value={o}>{o}</option>))}
  </select>
);

export default Connect;
