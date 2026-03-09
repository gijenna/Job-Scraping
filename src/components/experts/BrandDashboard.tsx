import { useState } from "react";
import { Expert, ExpertCityAssignment, ExpertCity, nameToSlug } from "@/lib/expert-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, ExternalLink, Trash2, Building2, Users } from "lucide-react";
import { PUBLISHED_BASE_URL } from "@/lib/utils";

interface BrandDashboardProps {
  experts: Expert[];
  assignments: ExpertCityAssignment[];
  cities: ExpertCity[];
  onRefresh: () => void;
}

interface BrandEntry {
  brandName: string;
  companyRep: string | null;
  expert: Expert;
  assignments: ExpertCityAssignment[];
}

const BrandDashboard = ({ experts, assignments, cities, onRefresh }: BrandDashboardProps) => {
  const { toast } = useToast();

  // Find brand entries: only brand SHELL records (admin-created), not individual people
  // Brand shells have a slug derived from the company/brand name
  const brandEntries: BrandEntry[] = experts
    .map((expert) => {
      const brandAssigns = assignments.filter(
        (a) => a.expert_id === expert.id && (a.expert_type || 'industry_expert') === 'brand_rep'
      );
      if (brandAssigns.length === 0) return null;

      const brandName = expert.current_company || expert.full_name;
      // Only treat as a brand card if the slug matches the company name (brand shell)
      // Individual people have slugs based on their personal name
      const companySlug = nameToSlug(brandName);
      if (expert.slug !== companySlug) return null;

      const hasKnownRep = expert.full_name && expert.current_company && expert.full_name !== expert.current_company;
      const companyRep = hasKnownRep ? expert.full_name : null;

      return {
        brandName,
        companyRep,
        expert,
        assignments: brandAssigns,
      };
    })
    .filter(Boolean) as BrandEntry[];

  const copyLink = (expert: Expert, assignment: ExpertCityAssignment) => {
    const repPrefix = assignment.city_slug === 'portland' ? 'pnw' : assignment.city_slug;
    const url = `${PUBLISHED_BASE_URL}/${repPrefix}reps/${expert.slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied!", description: url });
  };

  const deleteBrand = async (expertId: string) => {
    if (!confirm("Delete this brand and all its assignments?")) return;
    // Delete assignments first, then expert
    await supabase.from('expert_city_assignments').delete().eq('expert_id', expertId).eq('expert_type', 'brand_rep');
    // Check if expert has any remaining assignments
    const { data: remaining } = await supabase
      .from('expert_city_assignments')
      .select('id')
      .eq('expert_id', expertId);
    if (!remaining || remaining.length === 0) {
      await supabase.from('industry_experts').delete().eq('id', expertId);
    }
    toast({ title: "Brand removed" });
    onRefresh();
  };

  // Find people who filled out forms as brand reps for each brand
  const getBrandPeople = (brandName: string, brandExpertId: string) => {
    return experts.filter(
      (e) =>
        e.current_company === brandName &&
        e.id !== brandExpertId // exclude the brand shell itself
    );
  };

  const statusColors: Record<string, string> = {
    invited: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    viewed: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    started: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    confirmed: 'bg-green-500/20 text-green-300 border-green-500/30',
  };

  if (brandEntries.length === 0) {
    return (
      <div className="bg-events-card rounded-lg border border-events-cream/10 p-8 text-center">
        <Building2 className="w-8 h-8 text-events-cream/20 mx-auto mb-3" />
        <p className="text-events-cream/40">No brands added yet. Click "Add Brand" to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-events-yellow" />
          <h3 className="font-display text-lg font-bold text-events-cream">
            Brand Partners
          </h3>
          <span className="text-events-cream/40 text-sm">({brandEntries.length})</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {brandEntries.map((brand) => {
          const brandPeople = getBrandPeople(brand.brandName, brand.expert.id);
          return (
            <div
              key={brand.expert.id}
              className="bg-events-card rounded-xl border border-events-cream/10 p-5 hover:border-events-yellow/20 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-events-yellow/15 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-events-yellow" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-events-cream text-base leading-tight">
                      {brand.brandName}
                    </h4>
                    {brand.companyRep && (
                      <p className="text-events-cream/40 text-xs mt-0.5">
                        Contact: {brand.companyRep}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteBrand(brand.expert.id)}
                  className="text-red-400/40 hover:text-red-400 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete brand"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* City assignments with copy links */}
              <div className="mt-4 space-y-2">
                {brand.assignments.map((a) => {
                  const cityName = cities.find((c) => c.slug === a.city_slug)?.name || a.city_slug;
                  const repPrefix = a.city_slug === 'portland' ? 'pnw' : a.city_slug;
                  const linkPath = `/${repPrefix}reps/${brand.expert.slug}`;

                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-2 bg-events-teal/50 rounded-lg px-3 py-2"
                    >
                      <Badge variant="outline" className="text-events-cream/70 border-events-cream/15 text-xs shrink-0">
                        {cityName}
                      </Badge>
                      <code className="text-[10px] text-events-yellow/70 truncate flex-1" title={`${PUBLISHED_BASE_URL}${linkPath}`}>
                        {linkPath}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyLink(brand.expert, a)}
                        className="text-events-cream/50 hover:text-events-cream h-6 w-6 p-0 shrink-0"
                        title="Copy link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <a
                        href={`${window.location.origin}${linkPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-events-cream/50 hover:text-events-cream h-6 w-6 p-0 shrink-0 inline-flex items-center justify-center"
                        title="Preview"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>

              {/* People who signed up for this brand */}
              {brandPeople.length > 0 && (
                <div className="mt-3 pt-3 border-t border-events-cream/5">
                  <p className="text-events-cream/40 text-xs flex items-center gap-1 mb-2">
                    <Users className="w-3 h-3" /> {brandPeople.length} signed up
                  </p>
                  <div className="space-y-1.5">
                    {brandPeople.map((person) => (
                      <div key={person.id} className="flex items-center justify-between bg-events-teal/30 rounded-md px-3 py-1.5">
                        <span className="text-events-cream text-sm font-medium truncate">
                          {person.full_name}
                        </span>
                        <Badge className={`${statusColors[person.status]} text-[10px] px-1.5 py-0`}>
                          {person.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-events-cream/5">
                <Badge className={`${statusColors[brand.expert.status]} text-xs`}>
                  {brand.expert.status}
                </Badge>
                {brandPeople.length === 0 && (
                  <span className="text-events-cream/30 text-xs">No signups yet</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BrandDashboard;
