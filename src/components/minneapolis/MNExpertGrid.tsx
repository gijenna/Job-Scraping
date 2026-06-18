import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Expert } from "@/lib/expert-types";
import ExpertCard from "@/components/experts/ExpertCard";
import ExpertCardCompact from "@/components/experts/ExpertCardCompact";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import EditableText from "@/components/EditableText";
import CardStylePicker from "@/components/event/CardStylePicker";
import { useEventSettings } from "@/hooks/useEventSettings";
import { useEditableTextContext } from "@/components/EditableTextProvider";

const FOREST = "#1A2520";
const CREAM = "#F2E7D5";
const SAGE = "#A8B5A0";
const CORAL = "#E8836B";
const APPLY = "https://basecampoutdoor.typeform.com/MNExperts";

type SessionFilter = "all" | "aug20" | "aug21";

type Row = { expert: Expert; aug20: boolean; aug21: boolean };

const MNExpertGrid = () => {
  const { isAdmin } = useEditableTextContext();
  const { settings } = useEventSettings("minneapolis26");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SessionFilter>("all");
  const [cardStyle, setCardStyle] = useState("polaroid");

  useEffect(() => {
    const v = settings["card_style_mn_experts"];
    if (v) setCardStyle(v);
  }, [settings]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select(
          "expert_id, expert_type, attend_aug20_happyhour, attend_aug21_brunch, industry_experts(id, full_name, photo_url, current_company, job_title, linkedin_url, slug, field_of_work, ask_me_about, years_in_industry, years_in_city, niche_interests, previous_companies, favorite_media, email, company_domains, status, created_by, created_at, updated_at)"
        )
        .eq("city_slug", "minneapolis")
        .eq("published", true);
      const mapped: Row[] = ((data as any[]) || [])
        .filter((d) => d.expert_type !== "brand_rep" && d.industry_experts)
        .map((d) => ({
          expert: d.industry_experts as Expert,
          aug20: !!d.attend_aug20_happyhour,
          aug21: !!d.attend_aug21_brunch,
        }));
      setRows(mapped);
      setLoading(false);
    })();
  }, []);

  const filtered = rows.filter((r) =>
    filter === "all" ? true : filter === "aug20" ? r.aug20 : r.aug21
  );

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

  const tabs: { key: SessionFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "aug20", label: "Aug 20 · Happy Hour" },
    { key: "aug21", label: "Aug 21 · Women's Brunch" },
  ];

  return (
    <section id="experts" className="px-6 py-20 md:py-28" style={{ backgroundColor: FOREST, color: CREAM }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <h2 className="font-normal" style={{ fontSize: 36, color: CREAM }}>
            <EditableText
              settingKey="experts_headline"
              defaultText="The people who got the job, holding the door open."
              as="span"
            />
          </h2>
          <p className="italic" style={{ fontSize: 16, color: SAGE }}>
            <EditableText
              settingKey="experts_sub"
              defaultText="Industry experts you can meet at the Gatherings. Send a note ahead, or just walk up."
              as="span"
            />
          </p>
        </div>

        {isAdmin && (
          <div className="flex justify-center mb-6">
            <CardStylePicker
              eventSlug="minneapolis26"
              settingKey="card_style_mn_experts"
              label="MN experts"
              onStyleChange={setCardStyle}
            />
          </div>
        )}

        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
              style={{
                backgroundColor: filter === t.key ? CORAL : "transparent",
                color: filter === t.key ? CREAM : CREAM,
                border: `1px solid ${filter === t.key ? CORAL : "rgba(242,231,213,0.25)"}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center opacity-60">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ fontSize: 18 }}>
              {rows.length === 0 ? (
                <>
                  Expert lineup announced soon.{" "}
                  <a href={APPLY} target="_blank" rel="noopener noreferrer" className="underline italic">
                    Want to be one of them? Apply here →
                  </a>
                </>
              ) : (
                <>No experts confirmed for this session yet.</>
              )}
            </p>
          </div>
        ) : (
          <div className={gridClass}>
            {filtered.map(({ expert, aug20, aug21 }) => (
              <div key={expert.id} className="relative">
                {renderCard(expert)}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 pointer-events-none">
                  {aug20 && (
                    <span
                      className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: CORAL, color: CREAM }}
                    >
                      Aug 20
                    </span>
                  )}
                  {aug21 && (
                    <span
                      className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: CREAM, color: FOREST }}
                    >
                      Aug 21
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href={APPLY}
            target="_blank"
            rel="noopener noreferrer"
            className="italic underline-offset-4 hover:underline"
            style={{ color: CREAM, fontSize: 14 }}
          >
            Want to be an industry expert at this event? Apply here →
          </a>
        </div>
      </div>
    </section>
  );
};

export default MNExpertGrid;
