// "Your team at this event" expandable banner shown immediately below the
// brand card preview on the brand dashboard. Reuses the same name+aliases
// matching logic that powers the candidate-facing brand modal reps grid.
import { useEffect, useState } from "react";
import { ChevronDown, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Rep {
  id: string;
  full_name: string;
  photo_url: string | null;
}

const slugify = (s: string) =>
  (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function CopyInviteLinkPill({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex items-center gap-1.5 text-[11px] font-display uppercase tracking-wider bg-events-cream/10 hover:bg-events-cream/20 text-events-cream/85 border border-events-cream/20 px-3 py-1.5 rounded-full transition-colors"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Link copied" : "Copy invite link"}
    </button>
  );
}

export function InviteLinkPill({ brand }: { brand: any }) {
  const url = `https://sponsor-attract-hub.lovable.app/denverreps/${slugify(brand?.name || "")}`;
  return <CopyInviteLinkPill url={url} />;
}

export default function BrandTeamSection({ brand }: { brand: any }) {
  const [reps, setReps] = useState<Rep[]>([]);
  const [expanded, setExpanded] = useState(false);
  const inviteUrl = `https://sponsor-attract-hub.lovable.app/denverreps/${slugify(brand?.name || "")}`;

  useEffect(() => {
    if (!brand) return;
    (async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select("expert_type, industry_experts(id, full_name, photo_url, current_company)")
        .eq("city_slug", "denver")
        .eq("expert_type", "brand_rep");
      if (!data) return;
      const brandNames = [brand.name, ...((brand as any).aliases || [])]
        .map((n: string) => n?.toLowerCase().trim())
        .filter(Boolean);
      const matched = (data as any[])
        .filter((d) => {
          const co = d.industry_experts?.current_company?.toLowerCase().trim();
          return co && brandNames.includes(co);
        })
        .map((d) => d.industry_experts as Rep);
      // Dedup by id
      const seen = new Set<string>();
      setReps(matched.filter((r) => r && !seen.has(r.id) && (seen.add(r.id) || true)));
    })();
  }, [brand]);

  if (!brand) return null;
  const count = reps.length;

  return (
    <div className="bg-events-coral text-events-cream rounded-b-2xl rounded-t-none overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-events-coral/90 transition-colors"
      >
        <span className="font-display text-sm uppercase tracking-wider">
          Your team at this event ({count})
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="px-5 pb-4 pt-1">
          {count === 0 ? (
            <p className="text-events-cream/90 text-xs font-body mb-3">
              No team members have signed up yet. Share the link below to invite them.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-3">
              {reps.map((r) => {
                const initials = (r.full_name || "")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <div key={r.id} className="flex flex-col items-center text-center gap-1.5">
                    <div className="w-12 h-12 rounded-full bg-events-cream/20 overflow-hidden flex items-center justify-center border-2 border-events-cream/40">
                      {r.photo_url ? (
                        <img src={r.photo_url} alt={r.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display text-xs text-events-cream">{initials}</span>
                      )}
                    </div>
                    <span className="text-[11px] font-body text-events-cream leading-tight line-clamp-2">
                      {r.full_name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <CopyInviteLinkPill url={inviteUrl} />
        </div>
      )}
    </div>
  );
}
