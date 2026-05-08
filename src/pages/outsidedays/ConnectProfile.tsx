import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  candidateMe, candidateLogout, candidateUpdateProfile,
  candidateUploadSignedUrl, candidateAttachUpload,
} from "@/lib/connect-session";
import {
  POACHABLE_STATUS, CAREER_STAGE, FIELDS, FOCUSES_BY_FIELD,
  JOB_TYPES, REMOTE_PREFERENCES, WORKPLACE_TYPES,
} from "@/lib/taxonomies";
import ImpersonationGate from "@/components/connect/ImpersonationGate";

const ConnectProfile = () => {
  const nav = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [c, setC] = useState<any>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const resumeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const { session } = await candidateMe();
        if (!session) { nav("/outsidedays26/connect"); return; }
        setC(session.subject);
      } catch { nav("/outsidedays26/connect"); }
      setLoading(false);
    })();
  }, [nav]);

  const set = (k: string, v: any) => setC((p: any) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const { candidate } = await candidateUpdateProfile(c);
      setC(candidate);
      toast({ title: "Saved" });
    } catch (e: any) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const upload = async (kind: "photo" | "resume", file: File) => {
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
      setC(candidate);
      toast({ title: kind === "photo" ? "Photo uploaded" : "Resume uploaded" });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    }
  };

  if (loading || !c) {
    return <div className="min-h-screen bg-events-teal text-events-cream flex items-center justify-center font-body">Loading...</div>;
  }

  return (
    <ImpersonationGate>
      <div className="min-h-screen bg-events-teal text-events-cream px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="font-afterparty text-3xl md:text-4xl">Your profile</h1>
              <p className="text-sm font-body text-events-cream/60">Outside Days, Denver 26</p>
            </div>
            <Button variant="ghost" onClick={async () => { await candidateLogout(); nav("/outsidedays26/connect"); }} className="text-events-cream/70">Sign out</Button>
          </header>

          <Section title="Photo">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-events-cream/10 overflow-hidden flex items-center justify-center text-events-cream/40 font-body text-xs">
                {c.photo_url ? <img src={c.photo_url} alt="You" className="w-full h-full object-cover" /> : "No photo"}
              </div>
              <div className="space-y-2">
                <input ref={photoInput} type="file" accept="image/*" capture="user" hidden onChange={(e) => e.target.files?.[0] && upload("photo", e.target.files[0])} />
                <Button onClick={() => photoInput.current?.click()} className="bg-events-coral hover:bg-events-coral/90 text-events-cream">Upload photo</Button>
                <p className="text-[11px] font-body text-events-cream/50">JPG or PNG, under 5MB.</p>
              </div>
            </div>
          </Section>

          <Section title="Identity">
            <Row><Field label="First name"><Input value={c.first_name || ""} onChange={(e) => set("first_name", e.target.value)} /></Field>
                 <Field label="Last name"><Input value={c.last_name || ""} onChange={(e) => set("last_name", e.target.value)} /></Field></Row>
            <Field label="Email"><Input type="email" value={c.email || ""} onChange={(e) => set("email", e.target.value)} /></Field>
          </Section>

          <Section title="The basics">
            <Field label="Poachable status">
              <Select value={c.poachable_status || ""} onChange={(v) => set("poachable_status", v)} options={POACHABLE_STATUS as any} />
            </Field>
            <Field label="Career stage">
              <Select value={c.career_stage || ""} onChange={(v) => set("career_stage", v)} options={CAREER_STAGE as any} />
            </Field>
            <Row>
              <Field label="Field">
                <Select value={c.field || ""} onChange={(v) => { set("field", v); set("focus", ""); }} options={FIELDS} />
              </Field>
              <Field label="Focus">
                <Select value={c.focus || ""} onChange={(v) => set("focus", v)} options={(FOCUSES_BY_FIELD[c.field] || [])} />
              </Field>
            </Row>
            <Field label="Years in current field">
              <Input type="number" min={0} value={c.years_in_current_field ?? 0} onChange={(e) => set("years_in_current_field", Number(e.target.value || 0))} />
            </Field>
            <Field label="The Hook" hint={`${100 - (c.the_hook?.length || 0)} chars left`}>
              <Textarea value={c.the_hook || ""} onChange={(e) => set("the_hook", e.target.value.slice(0, 100))} maxLength={100} rows={2} />
            </Field>
            <Field label="The Pitch" hint={`Optional. ${500 - (c.the_pitch?.length || 0)} chars left`}>
              <Textarea value={c.the_pitch || ""} onChange={(e) => set("the_pitch", e.target.value.slice(0, 500))} maxLength={500} rows={4} />
            </Field>
          </Section>

          <Section title="Current role">
            <Row>
              <Field label="Current title"><Input value={c.current_title || ""} onChange={(e) => set("current_title", e.target.value)} /></Field>
              <Field label="Current company"><Input value={c.current_company || ""} onChange={(e) => set("current_company", e.target.value)} /></Field>
            </Row>
            <Field label="LinkedIn URL"><Input value={c.linkedin_url || ""} onChange={(e) => set("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." /></Field>
            <Field label="Portfolio URL"><Input value={c.portfolio_url || ""} onChange={(e) => set("portfolio_url", e.target.value)} placeholder="https://..." /></Field>
          </Section>

          <Section title="Looking for">
            <Field label="Dream role title"><Input value={c.dream_role_title || ""} onChange={(e) => set("dream_role_title", e.target.value)} /></Field>
            <Field label="Job types open to">
              <MultiPills value={c.job_types_seeking || []} options={JOB_TYPES as any} onChange={(v) => set("job_types_seeking", v)} />
            </Field>
            <Field label="Workplace types open to">
              <MultiPills value={c.workplace_type_preference || []} options={WORKPLACE_TYPES as any} onChange={(v) => set("workplace_type_preference", v)} />
            </Field>
            <Field label="Remote preference">
              <Select value={c.remote_preference || ""} onChange={(v) => set("remote_preference", v)} options={REMOTE_PREFERENCES as any} />
            </Field>
            <Field label="Current location"><Input value={c.current_location || ""} onChange={(e) => set("current_location", e.target.value)} /></Field>
            <Row>
              <Field label="Open to relocation?">
                <Select value={c.open_to_relocation === true ? "Yes" : c.open_to_relocation === false ? "No" : ""} onChange={(v) => set("open_to_relocation", v === "Yes")} options={["Yes", "No"]} />
              </Field>
              <Field label="Where to?"><Input value={c.relocation_locations || ""} onChange={(e) => set("relocation_locations", e.target.value)} placeholder="e.g. PNW, CO, anywhere" /></Field>
            </Row>
            <Field label="Min pay rate (optional)"><Input value={c.min_pay_rate || ""} onChange={(e) => set("min_pay_rate", e.target.value)} placeholder="e.g. 85k or 45/hr" /></Field>
          </Section>

          <Section title="Resume">
            <div className="flex items-center gap-3 flex-wrap">
              {c.resume_url ? (
                <a href={c.resume_url} target="_blank" rel="noreferrer" className="text-events-coral underline font-body text-sm">View current resume</a>
              ) : <span className="text-events-cream/50 font-body text-sm">No resume uploaded.</span>}
              <input ref={resumeInput} type="file" accept="application/pdf" hidden onChange={(e) => e.target.files?.[0] && upload("resume", e.target.files[0])} />
              <Button variant="secondary" onClick={() => resumeInput.current?.click()}>Upload PDF</Button>
            </div>
          </Section>

          <div className="sticky bottom-0 -mx-4 px-4 py-3 bg-events-teal/95 border-t border-events-cream/10 backdrop-blur">
            <Button onClick={save} disabled={saving} className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream h-12">
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </ImpersonationGate>
  );
};

const Section = ({ title, children }: any) => (
  <section className="bg-events-cream/5 border border-events-cream/10 rounded-2xl p-5 space-y-3">
    <h2 className="font-display text-lg text-events-cream">{title}</h2>
    {children}
  </section>
);
const Row = ({ children }: any) => <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>;
const Field = ({ label, hint, children }: any) => (
  <div>
    <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1.5 block">{label}</Label>
    {children}
    {hint && <p className="text-[11px] text-events-cream/50 mt-1 font-body">{hint}</p>}
  </div>
);
const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)}
    className="w-full bg-events-cream/5 border border-events-cream/15 text-events-cream rounded-md h-10 px-3 text-sm font-body">
    <option value="">Select...</option>
    {options.map((o) => (<option key={o} value={o}>{o}</option>))}
  </select>
);
const MultiPills = ({ value, options, onChange }: { value: string[]; options: string[]; onChange: (v: string[]) => void }) => {
  const toggle = (o: string) => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button type="button" key={o} onClick={() => toggle(o)}
            className={`px-3 py-1.5 rounded-full text-xs font-body border transition ${on ? "bg-events-coral text-events-cream border-events-coral" : "bg-transparent text-events-cream/70 border-events-cream/20 hover:border-events-cream/40"}`}>
            {o}
          </button>
        );
      })}
    </div>
  );
};

export default ConnectProfile;
