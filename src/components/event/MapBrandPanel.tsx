import { useState, useEffect } from "react";
import { X, ExternalLink, ChevronDown, ChevronUp, Wifi, Sparkles, Briefcase, Star } from "lucide-react";
import { MapBrand } from "@/hooks/useEventMapBrands";
import { supabase } from "@/integrations/supabase/client";
import { Expert } from "@/lib/expert-types";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import ConnectionForm from "@/components/connect/ConnectionForm";
import ConnectPersonSheet from "@/components/connect/ConnectPersonSheet";
import BrandLeadCapture from "@/components/connect/BrandLeadCapture";
import BrandVisitToggle from "@/components/connect/BrandVisitToggle";
import { motion, AnimatePresence } from "framer-motion";
import { candidateToggleStar } from "@/lib/connect-session";
import { useEventMode } from "@/lib/connect-event-mode";
import { useToast } from "@/hooks/use-toast";
import type { NoteRecipient } from "@/components/connect/NoteComposer";

interface MapBrandPanelProps {
  brand: MapBrand | null;
  onClose: () => void;
  candidateMode?: boolean;
  starredBrandIds?: Set<string>;
  onStarChanged?: (brandId: string, isStarred: boolean) => void;
  noteRecipientIds?: Set<string>;
  onSendNote?: (recipient: NoteRecipient) => void;
  /** When set, auto-open the matching rep's person sheet on top of the modal. */
  autoOpenRepSlug?: string | null;
  /** Optional CTA links rendered at the bottom of the modal body. */
  registerUrl?: string;
  connectUrl?: string;
}

const MapBrandPanel = ({
  brand, onClose, candidateMode = false,
  starredBrandIds, onStarChanged, noteRecipientIds, onSendNote,
  autoOpenRepSlug, registerUrl, connectUrl,
}: MapBrandPanelProps) => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [expanded, setExpanded] = useState(true);
  const [logging, setLogging] = useState<{ brand: true } | null>(null);
  const [personSheet, setPersonSheet] = useState<Expert | null>(null);
  const [starBusy, setStarBusy] = useState(false);
  const mode = useEventMode();
  const { toast } = useToast();
  const isStarred = !!(brand && starredBrandIds?.has(brand.id));

  const toggleStar = async () => {
    if (!brand || starBusy) return;
    setStarBusy(true);
    const optimistic = !isStarred;
    onStarChanged?.(brand.id, optimistic);
    try {
      const r = await candidateToggleStar(brand.id);
      if (r.starred !== optimistic) onStarChanged?.(brand.id, r.starred);
    } catch (e: any) {
      onStarChanged?.(brand.id, !optimistic);
      toast({ title: "Could not save", description: e.message, variant: "destructive" });
    } finally {
      setStarBusy(false);
    }
  };

  useEffect(() => {
    if (!brand) { setExperts([]); return; }
    const fetchReps = async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select("expert_id, expert_type, industry_experts(id, full_name, photo_url, current_company, job_title, linkedin_url, slug, field_of_work, ask_me_about, years_in_industry, years_in_city, niche_interests, previous_companies, favorite_media, email, company_domains, status)")
        .eq("city_slug", "denver")
        .eq("published", true);

      if (!data) return;
      const brandNames = [brand.name, ...((brand as any).aliases || [])]
        .map((n: string) => n?.toLowerCase().trim())
        .filter(Boolean);
      const matched = data
        .filter((d: any) => {
          const exp = d.industry_experts;
          const co = exp?.current_company?.toLowerCase().trim();
          return co && brandNames.includes(co);
        })
        .map((d: any) => d.industry_experts as Expert);
      setExperts(matched);
    };
    fetchReps();
  }, [brand]);

  // Auto-open the matching rep's person sheet when arriving via share link.
  useEffect(() => {
    if (!autoOpenRepSlug || experts.length === 0) return;
    const match = experts.find((e: any) => e?.slug === autoOpenRepSlug);
    if (match) setPersonSheet(match);
  }, [autoOpenRepSlug, experts]);

  if (!brand) return null;

  const logoSrc = brand.logo_url || (brand.website_url ? `https://logo.clearbit.com/${new URL(brand.website_url).hostname}` : null);
  const hiringActive =
    brand.currently_hiring === "Yes, actively hiring" ||
    brand.currently_hiring === "Always open to great people";

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="relative w-full max-w-lg max-h-[85vh] bg-events-teal rounded-xl shadow-2xl overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            {candidateMode && (
              <button
                onClick={toggleStar}
                disabled={starBusy}
                aria-label={isStarred ? "Remove from shortlist" : "Add to shortlist"}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isStarred ? "bg-events-coral text-events-cream" : "bg-black/20 text-events-cream hover:bg-black/40"
                }`}
              >
                <Star className={`w-4 h-4 ${isStarred ? "fill-current" : ""}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/20 text-events-cream flex items-center justify-center hover:bg-black/40 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sponsor callout (per-brand text, decoupled from is_featured) */}
          {(brand as any).sponsor_callout_text && (
            <div className="mx-6 mt-4 mr-24 rounded-xl border-l-4 border-events-coral bg-events-coral/15 px-4 py-3">
              <p className="font-body text-events-cream text-[13px] leading-snug">
                {(brand as any).sponsor_callout_text}
              </p>
            </div>
          )}

          {/* Brand header */}
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-events-cream flex items-center justify-center overflow-hidden shadow-md border-2 border-white shrink-0">
                {logoSrc ? (
                  <img src={logoSrc} alt={brand.name} className="w-12 h-12 object-contain" />
                ) : (
                  <span className="font-display font-bold text-xl text-events-teal">
                    {brand.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-headline font-bold text-xl text-events-cream">{brand.name}</h3>
                {brand.is_activation && (
                  <span className="text-[10px] uppercase tracking-wider text-events-yellow font-body">Activation</span>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-events-cream/40 text-xs font-body">
                    {brand.table_count} table{brand.table_count > 1 ? "s" : ""}
                  </span>
                  {brand.website_url && (
                    <a
                      href={/^https?:\/\//i.test(brand.website_url) ? brand.website_url : `https://${brand.website_url.replace(/^\/+/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-events-coral font-display font-bold hover:underline"
                    >
                      Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Visited toggle (during/post event only) */}
            {candidateMode && mode !== "pre_event" && (
              <div className="mt-4">
                <BrandVisitToggle
                  brand={{ id: brand.id, name: brand.name }}
                  reps={experts}
                />
              </div>
            )}

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {hiringActive && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-display bg-events-coral text-events-cream px-2.5 py-1 rounded-full">
                  <Briefcase className="w-3 h-3" /> Currently hiring
                </span>
              )}
              {brand.is_featured && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-display border border-events-yellow text-events-yellow px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              )}
              {brand.offers_remote && brand.offers_remote.toLowerCase() !== "no" && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-display bg-events-cream/10 text-events-cream/80 px-2.5 py-1 rounded-full">
                  <Wifi className="w-3 h-3" /> {brand.offers_remote}
                </span>
              )}
            </div>

            {(brand as any).why_visit_text && (
              <div className="mt-4">
                <h4 className="text-[10px] uppercase tracking-[0.18em] font-display text-events-coral/80 mb-1.5">
                  Why visit our table
                </h4>
                <blockquote className="border-l-2 border-events-coral/60 pl-3 text-sm text-events-cream/80 font-body">
                  {(brand as any).why_visit_text}
                </blockquote>
              </div>
            )}

            {brand.description && (
              <p className="text-sm text-events-cream/70 font-body mt-4">{brand.description}</p>
            )}

            {candidateMode && ((brand as any).lead_question_active || brand.is_featured) && (
              <BrandLeadCapture brandId={brand.id} />
            )}
          </div>

          {/* Brand Reps section */}
          {experts.length > 0 && (
            <div className="border-t border-white/10">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="w-full flex items-center justify-between px-6 py-3 hover:bg-white/5 transition-colors"
              >
                <span className="font-display font-bold text-sm text-events-cream">
                  Brand Reps ({experts.length})
                </span>
                {expanded ? <ChevronUp className="w-4 h-4 text-events-cream/40" /> : <ChevronDown className="w-4 h-4 text-events-cream/40" />}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {experts.map((expert) => (
                        candidateMode ? (
                          <button
                            key={expert.id}
                            onClick={() => setPersonSheet(expert)}
                            className="block w-full text-left active:scale-95 transition-transform relative"
                          >
                            <ExpertCardMinimal expert={expert} disableExpand />
                          </button>
                        ) : (
                          <ExpertCardMinimal key={expert.id} expert={expert} />
                        )
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Bottom CTAs: register or jump to Connect */}
          {(registerUrl || connectUrl) && (
            <div className="border-t border-white/10 px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {registerUrl && (
                  <a
                    href={registerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-events-coral hover:bg-events-coral/90 text-events-cream font-display font-bold text-sm uppercase tracking-wider px-5 py-3 rounded-full transition-colors"
                  >
                    Register for the event
                  </a>
                )}
                {connectUrl && (
                  <div className="flex flex-col sm:items-end items-start gap-1">
                    <span className="text-[11px] text-events-cream/55 font-body">Already registered?</span>
                    <a
                      href={connectUrl}
                      className="inline-flex items-center justify-center gap-2 border border-events-cream/40 text-events-cream/90 hover:border-events-cream hover:text-events-cream font-display font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-colors"
                    >
                      Send notes to company reps
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {personSheet && (
        <ConnectPersonSheet
          open
          expert={personSheet}
          subjectType="brand_rep"
          brand={{ id: brand.id, name: brand.name, logo_url: brand.logo_url, website_url: brand.website_url }}
          onClose={() => setPersonSheet(null)}
          onNoteChanged={(rid, has) => {
            if (onSendNote) {
              // parent tracks note recipients via its own list refresh
            }
          }}
        />
      )}
    </>
  );
};

export default MapBrandPanel;
