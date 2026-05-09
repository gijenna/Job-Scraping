import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Expert, ExpertCity, ExpertCityAssignment } from "@/lib/expert-types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertTriangle, Check, RefreshCw } from "lucide-react";

type MapBrand = {
  id: string;
  name: string;
  aliases: string[];
  event_slug: string;
};

interface Props {
  experts: Expert[];
  assignments: ExpertCityAssignment[];
  cities: ExpertCity[];
}

const norm = (s: string | null | undefined) =>
  (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export default function BrandAliasMatcher({ experts, assignments, cities }: Props) {
  const [brands, setBrands] = useState<MapBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [pickers, setPickers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("event_map_brands")
      .select("id,name,aliases,event_slug");
    setBrands((data as MapBrand[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // Map city slug -> event slug. Cities and event_map_brands both use slug strings.
  // We treat any brand whose event_slug matches the expert's city assignment as a candidate.
  const mismatches = useMemo(() => {
    const out: Array<{
      key: string;
      expert: Expert;
      company: string;
      citySlug: string;
      cityName: string;
      candidateBrands: MapBrand[];
    }> = [];

    for (const expert of experts) {
      const company = expert.current_company?.trim();
      if (!company) continue;
      const cKey = norm(company);
      if (!cKey) continue;

      const expertAssigns = assignments.filter((a) => a.expert_id === expert.id);
      if (!expertAssigns.length) continue;

      for (const a of expertAssigns) {
        const cityBrands = brands.filter((b) => b.event_slug === a.city_slug);
        if (!cityBrands.length) continue;

        const matched = cityBrands.find((b) => {
          if (norm(b.name) === cKey) return true;
          return (b.aliases || []).some((alias) => norm(alias) === cKey);
        });
        if (matched) continue;

        const key = `${expert.id}:${a.city_slug}`;
        if (dismissed.has(key)) continue;
        const cityName = cities.find((c) => c.slug === a.city_slug)?.name || a.city_slug;
        out.push({
          key,
          expert,
          company,
          citySlug: a.city_slug,
          cityName,
          candidateBrands: cityBrands.sort((a, b) => a.name.localeCompare(b.name)),
        });
      }
    }
    return out;
  }, [experts, assignments, brands, cities, dismissed]);

  const linkAsAlias = async (key: string, brandId: string, alias: string) => {
    setBusy(key);
    const brand = brands.find((b) => b.id === brandId);
    if (!brand) {
      setBusy(null);
      return;
    }
    const next = Array.from(new Set([...(brand.aliases || []), alias.trim()]));
    const { error } = await supabase
      .from("event_map_brands")
      .update({ aliases: next })
      .eq("id", brandId);
    setBusy(null);
    if (error) {
      toast.error("Could not save alias");
      return;
    }
    toast.success(`Linked "${alias}" to ${brand.name}`);
    setBrands((prev) =>
      prev.map((b) => (b.id === brandId ? { ...b, aliases: next } : b))
    );
  };

  if (loading) {
    return <p className="text-events-cream/40 text-sm">Loading brand matches...</p>;
  }

  return (
    <div className="rounded-lg border border-events-cream/10 bg-events-card p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-events-yellow" />
          <h3 className="font-display text-base font-bold text-events-cream">
            Unmatched expert companies
          </h3>
          <span className="text-events-cream/40 text-xs">
            ({mismatches.length})
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={load}
          className="text-events-cream/60 hover:text-events-cream h-7"
        >
          <RefreshCw className="w-3 h-3 mr-1" /> Refresh
        </Button>
      </div>
      <p className="text-events-cream/50 text-xs">
        Experts whose current company does not match a brand name or alias on
        their event map. Pick the right brand to add the company as an alias,
        keeping the map tile unchanged.
      </p>

      {mismatches.length === 0 ? (
        <div className="text-events-cream/40 text-sm flex items-center gap-2 py-2">
          <Check className="w-4 h-4 text-events-coral" /> All expert companies
          match a brand.
        </div>
      ) : (
        <div className="space-y-2">
          {mismatches.map(({ key, expert, company, cityName, candidateBrands }) => (
            <div
              key={key}
              className="flex flex-wrap items-center gap-2 rounded-md bg-events-teal/40 border border-events-cream/10 px-3 py-2"
            >
              <div className="text-sm text-events-cream min-w-0 flex-1">
                <span className="font-semibold">
                  {expert.full_name || expert.email}
                </span>{" "}
                <span className="text-events-cream/50">at</span>{" "}
                <span className="text-events-yellow">{company}</span>{" "}
                <span className="text-events-cream/40 text-xs">
                  ({cityName})
                </span>
              </div>
              <Select
                value={pickers[key] || ""}
                onValueChange={(v) => setPickers((p) => ({ ...p, [key]: v }))}
              >
                <SelectTrigger className="h-8 w-56 bg-events-teal text-events-cream border-events-cream/20 text-xs">
                  <SelectValue placeholder="Link to brand..." />
                </SelectTrigger>
                <SelectContent>
                  {candidateBrands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                disabled={!pickers[key] || busy === key}
                onClick={() => linkAsAlias(key, pickers[key], company)}
                className="h-8 bg-events-coral text-events-cream hover:bg-events-coral/90"
              >
                {busy === key ? "Saving..." : "Add as alias"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  setDismissed((d) => {
                    const n = new Set(d);
                    n.add(key);
                    return n;
                  })
                }
                className="h-8 text-events-cream/50 hover:text-events-cream"
              >
                Dismiss
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
