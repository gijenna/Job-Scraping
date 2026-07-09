import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Expert } from "@/lib/expert-types";
import ExpertCard from "@/components/experts/ExpertCard";
import ExpertCardCompact from "@/components/experts/ExpertCardCompact";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import EditableText from "@/components/EditableText";
import CardStylePicker from "@/components/event/CardStylePicker";
import { useEventSettings } from "@/hooks/useEventSettings";
import { useEditableTextContext } from "@/components/EditableTextProvider";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const SAGE = "#A8B5A0";
const CORAL = "#E8836B";

interface MNPastExpertsProps {
  /** "minneapolis26" or "mnexperts" — drives the card style picker setting & EditableText scope. */
  eventSlug?: string;
  showLinkToEvent?: boolean;
}

type PastRow = { expert: Expert; cities: string[] };

const CITY_LABEL: Record<string, string> = {
  denver: "Denver",
  portland: "Portland",
};

const MNPastExperts = ({ eventSlug = "minneapolis26", showLinkToEvent = false }: MNPastExpertsProps) => {
  const { isAdmin } = useEditableTextContext();
  const { settings, setSetting } = useEventSettings(eventSlug);
  const [rows, setRows] = useState<PastRow[]>([]);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [cardStyle, setCardStyle] = useState("polaroid");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<string[]>([]);

  useEffect(() => {
    const v = settings["card_style_mn_past_experts"];
    if (v) setCardStyle(v);
    const o = settings["past_experts_order"];
    if (o) {
      try { setOrder(JSON.parse(o)); } catch { /* noop */ }
    }
  }, [settings]);

  useEffect(() => {
    (async () => {
      const [{ data: assigns }, { data: hidden }] = await Promise.all([
        supabase
          .from("expert_city_assignments")
          .select(
            "city_slug, expert_id, expert_type, industry_experts(id, full_name, photo_url, current_company, job_title, linkedin_url, slug, field_of_work, ask_me_about, years_in_industry, years_in_city, niche_interests, previous_companies, favorite_media, email, company_domains, status, created_by, created_at, updated_at)"
          )
          .in("city_slug", ["denver", "portland"])
          .eq("published", true),
        supabase.from("mn_past_expert_hidden" as any).select("expert_id"),
      ]);

      const hiddenSet = new Set<string>(((hidden as any[]) || []).map((r: any) => r.expert_id));
      setHiddenIds(hiddenSet);

      const map = new Map<string, PastRow>();
      ((assigns as any[]) || []).forEach((a: any) => {
        if (a.expert_type === "brand_rep") return;
        const ex = a.industry_experts as Expert | null;
        if (!ex) return;
        const existing = map.get(ex.id);
        if (existing) {
          if (!existing.cities.includes(a.city_slug)) existing.cities.push(a.city_slug);
        } else {
          map.set(ex.id, { expert: ex, cities: [a.city_slug] });
        }
      });
      setRows(Array.from(map.values()));
      setLoading(false);
    })();
  }, []);

  const toggleHidden = async (expertId: string) => {
    const isHidden = hiddenIds.has(expertId);
    if (isHidden) {
      await (supabase as any).from("mn_past_expert_hidden").delete().eq("expert_id", expertId);
      setHiddenIds((s) => {
        const n = new Set(s);
        n.delete(expertId);
        return n;
      });
    } else {
      await (supabase as any).from("mn_past_expert_hidden").insert({ expert_id: expertId });
      setHiddenIds((s) => new Set(s).add(expertId));
    }
  };

  // Apply saved order, then append any not yet ordered
  const orderedRows = (() => {
    const byId = new Map(rows.map((r) => [r.expert.id, r]));
    const used = new Set<string>();
    const result: PastRow[] = [];
    order.forEach((id) => {
      const r = byId.get(id);
      if (r) { result.push(r); used.add(id); }
    });
    rows.forEach((r) => { if (!used.has(r.expert.id)) result.push(r); });
    return result;
  })();

  const moveExpert = async (expertId: string, dir: -1 | 1) => {
    const ids = orderedRows.map((r) => r.expert.id);
    const idx = ids.indexOf(expertId);
    const newIdx = idx + dir;
    if (idx < 0 || newIdx < 0 || newIdx >= ids.length) return;
    [ids[idx], ids[newIdx]] = [ids[newIdx], ids[idx]];
    setOrder(ids);
    await setSetting("past_experts_order", JSON.stringify(ids));
  };

  const visibleRows = orderedRows.filter((r) => isAdmin || !hiddenIds.has(r.expert.id));


  const renderCard = (e: Expert) => {
    switch (cardStyle) {
      case "compact":
        return <ExpertCardCompact expert={e} />;
      case "minimal":
        return <ExpertCardMinimal expert={e} />;
      default:
        return <ExpertCard expert={e} />;
    }
  };

  const gridClass =
    cardStyle === "minimal"
      ? "grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6"
      : cardStyle === "compact"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";

  return (
    <section className="px-6 py-20 md:py-24" style={{ backgroundColor: FOREST, color: CREAM }}>
      <div className="w-full mx-auto px-8 lg:px-16">
        <div className="text-center space-y-3 mb-8">
          <p
            className="uppercase font-semibold"
            style={{ fontSize: 12, letterSpacing: "1.6px", color: CORAL }}
          >
            <EditableText
              settingKey="past_experts_eyebrow"
              defaultText="WHO'S SHOWN UP BEFORE"
              as="span"
            />
          </p>
          <h2 className="font-normal" style={{ fontSize: 36, color: CREAM }}>
            <EditableText
              settingKey="past_experts_headline"
              defaultText="The room you'll be joining."
              as="span"
            />
          </h2>
          <p className="italic max-w-2xl mx-auto" style={{ fontSize: 16, color: SAGE }}>
            <EditableText
              settingKey="past_experts_sub"
              defaultText="Industry experts who've shown up for past Basecamp Outdoor activations in Denver and Portland."
              as="span"
              multiline
            />
          </p>
        </div>

        {isAdmin && (
          <div className="flex justify-center mb-8">
            <CardStylePicker
              eventSlug={eventSlug}
              settingKey="card_style_mn_past_experts"
              label="Past experts"
              onStyleChange={setCardStyle}
            />
          </div>
        )}

        {loading ? (
          <p className="text-center opacity-60"><EditableText settingKey="past_experts_loading" defaultText="Loading..." as="span" /></p>
        ) : visibleRows.length === 0 ? (
          <p className="text-center opacity-60"><EditableText settingKey="past_experts_empty" defaultText="No past experts to display yet." as="span" /></p>
        ) : (
          <div className={gridClass}>
            {visibleRows.map(({ expert, cities }) => {
              const isHidden = hiddenIds.has(expert.id);
              return (
                <div key={expert.id} className={`relative ${isHidden ? "opacity-40" : ""}`}>
                  {isAdmin && (
                    <button
                      onClick={() => toggleHidden(expert.id)}
                      className="absolute -top-2 -right-2 z-20 w-7 h-7 rounded-full bg-events-coral text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      title={isHidden ? "Show on Minneapolis page" : "Hide from Minneapolis page"}
                    >
                      {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  )}
                  {isAdmin && (
                    <div className="absolute -top-2 -left-2 z-20 flex gap-1">
                      <button
                        onClick={() => moveExpert(expert.id, -1)}
                        className="w-7 h-7 rounded-full bg-events-teal text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        title="Move left"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveExpert(expert.id, 1)}
                        className="w-7 h-7 rounded-full bg-events-teal text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                        title="Move right"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {renderCard(expert)}
                  <div className="absolute top-2 left-2 z-10 flex gap-1 flex-wrap pointer-events-none">
                    {cities.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: CREAM, color: FOREST }}
                      >
                        {CITY_LABEL[c] || c}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showLinkToEvent && (
          <div className="text-center mt-12">
            <Link
              to="/minneapolis26"
              className="inline-block italic underline underline-offset-4"
              style={{ color: CREAM, fontSize: 14 }}
            >
              <EditableText settingKey="past_experts_event_link" defaultText="See who's confirmed for Minneapolis →" as="span" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default MNPastExperts;
