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
  candidateMe, candidateLogout, candidateUpdateProfile,
  candidateUploadSignedUrl, candidateAttachUpload,
} from "@/lib/connect-session";
import {
  POACHABLE_STATUS, CAREER_STAGE, FIELDS, FOCUSES_BY_FIELD,
  JOB_TYPES, REMOTE_PREFERENCES, WORKPLACE_TYPES,
  SKILL_CATEGORIES, SKILL_CATEGORY_KEYS, NICHES, US_STATES,
} from "@/lib/taxonomies";
import ImpersonationGate from "@/components/connect/ImpersonationGate";
import BubbleLogoPicker from "@/components/connect/BubbleLogoPicker";
import ConnectBottomNav, { ConnectTopNav } from "@/components/connect/ConnectBottomNav";
import BrandContactConsentCheckbox from "@/components/connect/BrandContactConsentCheckbox";

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
      // Only merge the file URL the server just stored. Replacing the whole
      // local state with the server row would wipe any unsaved edits the user
      // is currently typing (hook, pitch, etc).
      const urlField = kind === "photo" ? "photo_url" : "resume_url";
      setC((prev: any) => ({ ...(prev || candidate), [urlField]: candidate?.[urlField] ?? prev?.[urlField] }));
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
      <div className="min-h-screen bg-events-teal text-events-cream pb-24 sm:pb-0">
        <header className="hidden sm:flex px-4 py-3 border-b border-events-cream/10 items-center justify-between sticky top-0 bg-events-teal/95 backdrop-blur z-30">
          <h1 className="font-afterparty text-2xl">Your profile</h1>
          <ConnectTopNav />
        </header>
        <div className="px-4 py-8 md:py-12">
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

          <Section title="Skills & niches">
            <SkillsPicker
              value={Array.isArray(c.areas_of_expertise) ? c.areas_of_expertise : []}
              onChange={(v) => set("areas_of_expertise", v)}
            />
            <NichePicker
              value={Array.isArray(c.niche_experience) ? c.niche_experience : []}
              onChange={(v) => set("niche_experience", v)}
            />
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
            <Row>
              <Field label="Current state">
                <Select value={c.current_state || ""} onChange={(v) => set("current_state", v)} options={US_STATES as any} />
              </Field>
              <Field label="Current city"><Input value={c.current_city || ""} onChange={(e) => set("current_city", e.target.value)} placeholder="e.g. Phoenix" /></Field>
            </Row>
            {c.current_location && !c.current_state && (
              <p className="text-[11px] text-events-cream/50 font-body">Previously: {c.current_location}</p>
            )}
            <Row>
              <Field label="Open to relocation?">
                <Select value={c.open_to_relocation === true ? "Yes" : c.open_to_relocation === false ? "No" : ""} onChange={(v) => set("open_to_relocation", v === "Yes")} options={["Yes", "No"]} />
              </Field>
              <Field label="Open to anywhere">
                <label className="flex items-center gap-2 h-10 text-sm font-body text-events-cream/80">
                  <Checkbox checked={!!c.open_to_anywhere} onCheckedChange={(v) => set("open_to_anywhere", !!v)} />
                  Yes, open to anywhere
                </label>
              </Field>
            </Row>
            {c.open_to_relocation === true && (
              <>
                <Field label="States open to relocating to">
                  <MultiPills value={c.relocation_states || []} options={US_STATES as any} onChange={(v) => set("relocation_states", v)} />
                </Field>
                <Field label="Specific cities or regions" hint="Separate with commas (e.g. 'Boulder, PNW, anywhere in the mountain west')">
                  <Input value={c.relocation_cities || ""} onChange={(e) => set("relocation_cities", e.target.value)} placeholder="e.g. Boulder, PNW" />
                </Field>
              </>
            )}
            <Field label="Min pay rate (optional)"><Input value={c.min_pay_rate || ""} onChange={(e) => set("min_pay_rate", e.target.value)} placeholder="e.g. 85k or 45/hr" /></Field>
          </Section>

          <Section title="Background">
            <Field label="Total years of professional experience" hint="Across your whole career, all fields combined.">
              <Input type="number" min={0} value={c.total_years_professional ?? ""} onChange={(e) => set("total_years_professional", e.target.value === "" ? null : Number(e.target.value))} />
            </Field>
            <PriorCareersPicker
              value={Array.isArray(c.prior_careers) ? c.prior_careers : []}
              onChange={(v) => set("prior_careers", v)}
            />
            <div className="pt-2 border-t border-events-cream/10 space-y-3">
              <Field label="Outdoor industry experience">
                <Select
                  value={c.outdoor_industry_experience === true ? "Yes" : c.outdoor_industry_experience === false ? "No" : ""}
                  onChange={(v) => {
                    const yes = v === "Yes";
                    set("outdoor_industry_experience", yes);
                    if (!yes) set("outdoor_industry_years", null);
                  }}
                  options={["Yes", "No"]}
                />
              </Field>
              {c.outdoor_industry_experience === true && (
                <Field label="Years in outdoor industry">
                  <Input type="number" min={0} value={c.outdoor_industry_years ?? ""} onChange={(e) => set("outdoor_industry_years", e.target.value === "" ? null : Number(e.target.value))} />
                </Field>
              )}
              <p className="text-[11px] text-events-cream/50 font-body">Outdoor brands care if you've worked in the industry before.</p>
            </div>
            <div className="pt-2 border-t border-events-cream/10 space-y-3">
              <Field label="Management experience">
                <Select
                  value={c.management_experience === true ? "Yes" : c.management_experience === false ? "No" : ""}
                  onChange={(v) => {
                    const yes = v === "Yes";
                    set("management_experience", yes);
                    if (!yes) set("management_years", null);
                  }}
                  options={["Yes", "No"]}
                />
              </Field>
              {c.management_experience === true && (
                <Field label="Years managing people">
                  <Input type="number" min={0} value={c.management_years ?? ""} onChange={(e) => set("management_years", e.target.value === "" ? null : Number(e.target.value))} />
                </Field>
              )}
            </div>
          </Section>

          <Section title="Dream companies">
            <p className="text-xs font-body text-events-cream/60 -mt-1">Type a company name. Brands at this event show first.</p>
            {(() => {
              const dc = c.dream_companies;
              const names: string[] = Array.isArray(dc)
                ? dc.map((x: any) => (typeof x === "string" ? x : x?.name)).filter(Boolean)
                : (dc?.names || []);
              const domains: Record<string, string> = Array.isArray(dc)
                ? Object.fromEntries(dc.filter((x: any) => x?.name && x?.domain).map((x: any) => [x.name, x.domain]))
                : (dc?.domains || {});
              return (
                <BubbleLogoPicker
                  value={names}
                  domains={domains}
                  suggestionEventSlug="denver26"
                  onChange={(n, d) => set("dream_companies", n.map((name) => ({ name, domain: d[name] || null })))}
                  placeholder="Patagonia, Yeti, REI..."
                />
              );
            })()}
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

          <Section title="Contact preferences">
            <BrandContactConsentCheckbox
              checked={!!c.brand_contact_consent}
              onChange={(v) => set("brand_contact_consent", v)}
            />
          </Section>

          <div className="sticky bottom-0 -mx-4 px-4 py-3 bg-events-teal/95 border-t border-events-cream/10 backdrop-blur">
            <Button onClick={save} disabled={saving} className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream h-12">
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
        </div>
        <ConnectBottomNav />
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

type NicheEntry = { niche: string; years: number | null };

const SkillsPicker = ({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) => {
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
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((s) => (
            <button type="button" key={s} onClick={() => toggle(s)}
              className="px-3 py-1.5 rounded-full text-xs font-body border bg-events-coral text-events-cream border-events-coral inline-flex items-center gap-1.5">
              {s}<X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search skills..." />
      <div className="space-y-1.5">
        {filteredCats.map(({ cat, skills }) => {
          const count = skills.filter((s) => selected.has(s)).length;
          const isOpen = !!q || open[cat];
          return (
            <Collapsible key={cat} open={isOpen} onOpenChange={(o) => setOpen((p) => ({ ...p, [cat]: o }))}>
              <CollapsibleTrigger className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-events-cream/5 border border-events-cream/10 text-sm font-body text-events-cream hover:bg-events-cream/10">
                <span>{cat} {count > 0 && <span className="text-events-coral">({count})</span>}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 px-3 py-2">
                  {skills.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm font-body text-events-cream/80 cursor-pointer py-1">
                      <Checkbox checked={selected.has(s)} onCheckedChange={() => toggle(s)} />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
      <p className="text-[11px] text-events-cream/50 font-body">Select the skills that describe what you do best. Brands will filter on these.</p>
    </div>
  );
};

const NichePicker = ({ value, onChange }: { value: NicheEntry[]; onChange: (v: NicheEntry[]) => void }) => {
  const map = new Map<string, number | null>();
  for (const e of value) {
    if (e && typeof e === "object" && e.niche) map.set(e.niche, e.years ?? null);
  }
  const setEntries = (m: Map<string, number | null>) => {
    onChange(Array.from(m.entries()).map(([niche, years]) => ({ niche, years })));
  };
  const toggle = (n: string) => {
    const m = new Map(map);
    if (m.has(n)) m.delete(n); else m.set(n, null);
    setEntries(m);
  };
  const setYears = (n: string, raw: string) => {
    const m = new Map(map);
    if (raw === "") m.set(n, null);
    else {
      const y = parseInt(raw, 10);
      m.set(n, Number.isFinite(y) && y >= 0 ? y : null);
    }
    setEntries(m);
  };
  return (
    <div className="space-y-2 pt-2 border-t border-events-cream/10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {NICHES.map((n) => {
          const on = map.has(n);
          return (
            <div key={n} className="flex items-center gap-2 py-1">
              <label className="flex items-center gap-2 text-sm font-body text-events-cream/80 cursor-pointer flex-1">
                <Checkbox checked={on} onCheckedChange={() => toggle(n)} />
                <span>{n}</span>
              </label>
              {on && (
                <Input type="number" min={0} value={map.get(n) ?? ""} onChange={(e) => setYears(n, e.target.value)}
                  placeholder="yrs" className="w-20 h-8 text-sm" />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-events-cream/50 font-body">Tap niches you have actual <strong className="font-semibold text-events-cream/85">paid work experience</strong> in (not just interests). Years are optional but helpful.</p>
    </div>
  );
};

type PriorCareer = { field: string; focus: string; years: number | null };

const PriorCareersPicker = ({ value, onChange }: { value: PriorCareer[]; onChange: (v: PriorCareer[]) => void }) => {
  const entries: PriorCareer[] = value.map((e: any) => ({
    field: e?.field || "",
    focus: e?.focus || "",
    years: e?.years ?? null,
  }));
  const update = (i: number, patch: Partial<PriorCareer>) => {
    const next = entries.map((e, idx) => (idx === i ? { ...e, ...patch } : e));
    onChange(next);
  };
  const remove = (i: number) => onChange(entries.filter((_, idx) => idx !== i));
  const add = () => {
    if (entries.length >= 3) return;
    onChange([...entries, { field: "", focus: "", years: null }]);
  };
  return (
    <div className="space-y-3 pt-2 border-t border-events-cream/10">
      <div>
        <Label className="text-events-cream/80 text-xs font-body uppercase tracking-wider mb-1.5 block">Prior careers</Label>
        <p className="text-[11px] text-events-cream/60 font-body">Worked in multiple fields? Add up to 3 prior careers so brands see your full story. A senior salesperson transitioning to marketing is way more valuable than '1 year of marketing.'</p>
      </div>
      {entries.map((e, i) => (
        <div key={i} className="relative bg-events-cream/5 border border-events-cream/10 rounded-lg p-3 pr-10 space-y-2">
          <button type="button" onClick={() => remove(i)} aria-label="Remove" className="absolute top-2 right-2 text-events-cream/60 hover:text-events-coral">
            <X className="w-4 h-4" />
          </button>
          <Row>
            <Field label="Field">
              <Select value={e.field} onChange={(v) => update(i, { field: v, focus: "" })} options={FIELDS} />
            </Field>
            <Field label="Focus">
              <Select value={e.focus} onChange={(v) => update(i, { focus: v })} options={(FOCUSES_BY_FIELD[e.field] || [])} />
            </Field>
          </Row>
          <Field label="Years">
            <Input type="number" min={0} value={e.years ?? ""} onChange={(ev) => update(i, { years: ev.target.value === "" ? null : Number(ev.target.value) })} />
          </Field>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={add} disabled={entries.length >= 3}>
        Add another prior career
      </Button>
    </div>
  );
};

export default ConnectProfile;
