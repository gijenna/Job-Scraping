import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { dashboardCandidate } from "@/lib/connect-session";

function Section({ title, children }: any) {
  if (!children) return null;
  return (
    <div className="border-t border-events-cream/10 pt-4 mt-4">
      <h3 className="text-events-cream/60 text-[11px] uppercase tracking-wider font-body mb-2">{title}</h3>
      <div className="text-events-cream/90 font-body text-sm space-y-1">{children}</div>
    </div>
  );
}

function Bubbles({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <span key={s} className="px-2.5 py-1 rounded-full bg-events-cream/10 border border-events-cream/15 text-events-cream/80 text-xs">{s}</span>
      ))}
    </div>
  );
}

export default function CandidateProfileDrawer({ id, open, onClose }: { id: string | null; open: boolean; onClose: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !id) return;
    setLoading(true);
    setData(null);
    dashboardCandidate(id).then(setData).finally(() => setLoading(false));
  }, [id, open]);

  const c = data?.candidate;
  const conns = data?.connections || [];

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-events-teal text-events-cream border-events-cream/10 overflow-y-auto">
        {loading && <div className="text-events-cream/60 font-body text-center py-12">Loading...</div>}
        {c && (
          <div className="pt-2">
            <div className="flex gap-4">
              {(data.photo_signed_url || c.photo_url) && (
                <div className="w-28 h-32 bg-events-cream p-1.5 rounded-sm shadow-lg -rotate-3 shrink-0">
                  <img src={data.photo_signed_url || c.photo_url} alt={c.first_name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {c.the_hook && <p className="font-display text-2xl md:text-3xl text-events-cream leading-tight">{c.the_hook}</p>}
                <p className="text-events-cream/80 font-body mt-1">{c.first_name} {c.last_name}</p>
                <p className="text-events-cream/50 text-xs font-body">
                  {[c.current_title, c.current_company].filter(Boolean).join(" at ")}
                </p>
                <p className="text-events-cream/50 text-xs font-body mt-0.5">
                  {[c.career_stage, c.current_location, c.years_in_current_field ? `${c.years_in_current_field}y` : null].filter(Boolean).join(" · ")}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {c.brand_contact_consent && c.linkedin_url && (
                    <a href={c.linkedin_url} target="_blank" rel="noreferrer" className="text-events-coral text-xs font-body inline-flex items-center gap-1">
                      LinkedIn <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {c.brand_contact_consent && c.email && (
                    <a href={`mailto:${c.email}`} className="text-events-coral text-xs font-body inline-flex items-center gap-1">
                      Email <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {(data.resume_signed_url || c.resume_url) && (
                    <a href={data.resume_signed_url || c.resume_url} target="_blank" rel="noreferrer" className="text-events-coral text-xs font-body inline-flex items-center gap-1">
                      Resume <Download className="w-3 h-3" />
                    </a>
                  )}
                  {c.portfolio_url && (
                    <a href={c.portfolio_url} target="_blank" rel="noreferrer" className="text-events-coral text-xs font-body inline-flex items-center gap-1">
                      Portfolio <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {!c.brand_contact_consent && (
                    <span className="text-[11px] font-body text-events-cream/50 italic">
                      Contact info not shared
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Section title="The Pitch">{c.the_pitch || <em className="text-events-cream/40">Not provided</em>}</Section>

            <Section title="Career">
              <p>{[c.field, c.focus].filter(Boolean).join(" / ")}</p>
              <p>Poachable: {c.poachable_status}</p>
              {c.total_years_professional != null && <p>{c.total_years_professional} years professional</p>}
              {Array.isArray(c.prior_careers) && c.prior_careers.length > 0 && (
                <div className="mt-2">
                  <p className="text-events-cream/60 text-xs">Prior careers</p>
                  <ul className="list-disc list-inside text-sm">
                    {c.prior_careers.map((p: any, i: number) => (
                      <li key={i}>{typeof p === "string" ? p : `${p.title || ""} at ${p.company || ""}`}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Section>

            <Section title="Looking for">
              {c.dream_role_title && <p>Dream role: {c.dream_role_title}</p>}
              <Bubbles items={c.job_types_seeking || []} />
              {c.remote_preference && <p>Remote: {c.remote_preference}</p>}
              {c.open_to_relocation && <p>Open to relocation{c.relocation_locations ? `: ${c.relocation_locations}` : ""}</p>}
              {c.min_pay_rate && <p>Min pay: {c.min_pay_rate}</p>}
              <Bubbles items={c.workplace_type_preference || []} />
            </Section>

            <Section title="Expertise">
              <Bubbles items={c.areas_of_expertise || []} />
              {Array.isArray(c.niche_experience) && c.niche_experience.length > 0 && (
                <Bubbles items={c.niche_experience.map((n: any) => (typeof n === "string" ? n : n?.name)).filter(Boolean)} />
              )}
              {Array.isArray(c.dream_companies) && c.dream_companies.length > 0 && (
                <div className="mt-2">
                  <p className="text-events-cream/60 text-xs mb-1">Dream companies</p>
                  <Bubbles items={c.dream_companies.map((d: any) => (typeof d === "string" ? d : d?.name)).filter(Boolean)} />
                </div>
              )}
            </Section>

            <Section title="Outdoor & management">
              {c.outdoor_industry_experience && <p>Outdoor industry: {c.outdoor_industry_years || 0} years</p>}
              {c.management_experience && <p>Management: {c.management_years || 0} years</p>}
            </Section>

            {(c.dei_gender || c.dei_lgbtq || c.dei_disability || c.dei_veteran || c.dei_race_ethnicity) && (
              <Section title="Self-identified">
                {c.dei_gender && <p>Gender: {c.dei_gender}</p>}
                {c.dei_lgbtq && <p>LGBTQ+: {c.dei_lgbtq}</p>}
                {c.dei_disability && <p>Disability: {c.dei_disability}</p>}
                {c.dei_veteran && <p>Veteran: {c.dei_veteran}</p>}
                {c.dei_race_ethnicity?.length > 0 && <Bubbles items={c.dei_race_ethnicity} />}
              </Section>
            )}

            {conns.length > 0 && (
              <Section title="Connections with your brand">
                {conns.map((cn: any) => (
                  <div key={cn.id} className="bg-events-cream/5 rounded-lg p-3 mb-2 border border-events-cream/10">
                    <p className="text-events-cream/50 text-xs">{new Date(cn.created_at).toLocaleString()}</p>
                    {cn.message_to_brand && cn.message_sent_at && (
                      <blockquote className="pl-2 border-l-2 border-events-coral italic text-sm mt-2">"{cn.message_to_brand}"</blockquote>
                    )}
                    {cn.role_flagged && <p className="text-xs mt-1"><span className="text-events-yellow">Flagged role:</span> {cn.role_flagged}</p>}
                    {cn.follow_up_direction && <p className="text-xs mt-1 text-events-cream/70">Follow-up: {cn.follow_up_direction}</p>}
                  </div>
                ))}
              </Section>
            )}

            <div className="mt-6 flex justify-end">
              <Button variant="ghost" onClick={onClose} className="text-events-cream/70">Close</Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
