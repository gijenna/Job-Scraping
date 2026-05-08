import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  candidateMe, candidateSignupLookup, candidateSignupCreate, candidateLogin,
} from "@/lib/connect-session";
import { POACHABLE_STATUS, CAREER_STAGE, FIELDS, FOCUSES_BY_FIELD } from "@/lib/taxonomies";
import ImpersonationGate from "@/components/connect/ImpersonationGate";

type Mode = "choice" | "new" | "returning" | "signed_in";

const Connect = () => {
  const nav = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("choice");
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { session } = await candidateMe();
        if (session?.subject) { setMe(session.subject); setMode("signed_in"); }
      } catch {}
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="min-h-screen bg-events-teal text-events-cream flex items-center justify-center font-body">Loading...</div>;

  return (
    <ImpersonationGate>
      <div className="min-h-screen bg-events-teal text-events-cream px-4 py-8 md:py-16">
        <div className="max-w-md mx-auto">
          <h1 className="font-afterparty text-4xl md:text-5xl text-events-cream mb-2 text-center">Outside Days</h1>
          <p className="text-center font-body text-events-cream/70 mb-8 text-sm">Career fair connections, Denver 26.</p>

          {mode === "signed_in" && me && <SignedIn me={me} onEdit={() => nav("/outsidedays26/connect/profile")} />}
          {mode === "choice" && <Choice onNew={() => setMode("new")} onReturning={() => setMode("returning")} />}
          {mode === "new" && <NewSignup toast={toast} onDone={(c) => { setMe(c); setMode("signed_in"); }} onBack={() => setMode("choice")} />}
          {mode === "returning" && <Returning toast={toast} onDone={(c) => { setMe(c); setMode("signed_in"); }} onBack={() => setMode("choice")} />}
        </div>
      </div>
    </ImpersonationGate>
  );
};

const SignedIn = ({ me, onEdit }: any) => (
  <div className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-6 space-y-4 text-center">
    <p className="font-display text-xl">Welcome back, {me.first_name}.</p>
    <p className="text-sm text-events-cream/60 font-body">Profile completeness: {me.profile_completeness_score || 0} optional fields.</p>
    <Button onClick={onEdit} className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream">Edit your profile</Button>
  </div>
);

const Choice = ({ onNew, onReturning }: any) => (
  <div className="space-y-3">
    <Button onClick={onNew} className="w-full h-14 bg-events-coral hover:bg-events-coral/90 text-events-cream text-base">Create my account</Button>
    <Button onClick={onReturning} variant="secondary" className="w-full h-14 text-base">I already have an account</Button>
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

const NewSignup = ({ toast, onDone, onBack }: any) => {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [d, setD] = useState<any>({
    first_name: "", last_name: "", email: "", phone: "",
    poachable_status: "", career_stage: "", field: "", focus: "", years_in_current_field: 0, the_hook: "",
  });
  const set = (k: string, v: any) => setD((p: any) => ({ ...p, [k]: v }));

  const stepValid = () => {
    if (step === 0) return d.first_name && d.last_name && /\S+@\S+\.\S+/.test(d.email);
    if (step === 1) return d.phone.replace(/[^0-9]/g, "").length >= 10;
    if (step === 2) return d.poachable_status && d.career_stage;
    if (step === 3) return d.field && d.focus && d.years_in_current_field >= 0;
    if (step === 4) return d.the_hook && d.the_hook.length <= 100;
    return true;
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
    if (step < 4) { setStep(step + 1); return; }
    setBusy(true);
    try {
      const { session } = await candidateSignupCreate(d);
      onDone(session.subject);
    } catch (e: any) { toast({ title: "Signup failed", description: e.message, variant: "destructive" }); }
    setBusy(false);
  };

  return (
    <div className="space-y-4 bg-events-cream/5 border border-events-cream/10 rounded-2xl p-5">
      <div className="flex gap-1">
        {[0,1,2,3,4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-events-coral" : "bg-events-cream/15"}`} />
        ))}
      </div>

      {step === 0 && (
        <>
          <Field label="First name"><Input value={d.first_name} onChange={(e) => set("first_name", e.target.value)} /></Field>
          <Field label="Last name"><Input value={d.last_name} onChange={(e) => set("last_name", e.target.value)} /></Field>
          <Field label="Email"><Input type="email" value={d.email} onChange={(e) => set("email", e.target.value)} /></Field>
        </>
      )}
      {step === 1 && (
        <>
          <Field label="Phone (full number)" hint="Hidden from everyone except admin. Used to verify it's you when you log in.">
            <Input inputMode="tel" value={d.phone} onChange={(e) => set("phone", e.target.value)} placeholder="555 123 4567" />
          </Field>
        </>
      )}
      {step === 2 && (
        <>
          <Field label="Poachable status">
            <SelectBox value={d.poachable_status} onChange={(v) => set("poachable_status", v)} options={POACHABLE_STATUS as any} />
          </Field>
          <Field label="Career stage">
            <SelectBox value={d.career_stage} onChange={(v) => set("career_stage", v)} options={CAREER_STAGE as any} />
          </Field>
        </>
      )}
      {step === 3 && (
        <>
          <Field label="Field">
            <SelectBox value={d.field} onChange={(v) => { set("field", v); set("focus", ""); }} options={FIELDS} />
          </Field>
          {d.field && (
            <Field label="Focus">
              <SelectBox value={d.focus} onChange={(v) => set("focus", v)} options={FOCUSES_BY_FIELD[d.field] || []} />
            </Field>
          )}
          <Field label="Years in your current field">
            <Input type="number" min={0} value={d.years_in_current_field} onChange={(e) => set("years_in_current_field", Number(e.target.value || 0))} />
          </Field>
        </>
      )}
      {step === 4 && (
        <Field label="The Hook" hint={`One sentence that makes recruiters remember you. ${100 - (d.the_hook?.length || 0)} chars left.`}>
          <Textarea value={d.the_hook} onChange={(e) => set("the_hook", e.target.value.slice(0, 100))} maxLength={100} rows={3} />
        </Field>
      )}

      <div className="flex gap-2 pt-2">
        <Button variant="ghost" onClick={() => (step === 0 ? onBack() : setStep(step - 1))} className="flex-1 text-events-cream/70">Back</Button>
        <Button onClick={next} disabled={busy || !stepValid()} className="flex-1 bg-events-coral hover:bg-events-coral/90 text-events-cream">
          {step < 4 ? "Continue" : "Create account"}
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
