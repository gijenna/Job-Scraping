import { useState } from "react";
import { Expert, ExpertCityAssignment, ExpertCity } from "@/lib/expert-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Trash2, ExternalLink, Copy } from "lucide-react";
import ExpertCard from "./ExpertCard";

interface ExpertCRMProps {
  experts: Expert[];
  assignments: ExpertCityAssignment[];
  cities: ExpertCity[];
  onRefresh: () => void;
}

const statusColors: Record<string, string> = {
  invited: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  viewed: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  started: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  confirmed: 'bg-green-500/20 text-green-300 border-green-500/30',
};

const ExpertCRM = ({ experts, assignments, cities, onRefresh }: ExpertCRMProps) => {
  const [filterCity, setFilterCity] = useState<string>("all");
  const [previewExpert, setPreviewExpert] = useState<Expert | null>(null);
  const { toast } = useToast();

  const getExpertAssignments = (expertId: string) =>
    assignments.filter(a => a.expert_id === expertId);

  const filteredExperts = filterCity === "all"
    ? experts
    : experts.filter(e => getExpertAssignments(e.id).some(a => a.city_slug === filterCity));

  const togglePublish = async (assignmentId: string, currentlyPublished: boolean) => {
    const { error } = await supabase
      .from('expert_city_assignments')
      .update({ published: !currentlyPublished })
      .eq('id', assignmentId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: currentlyPublished ? "Unpublished" : "Published!" });
      onRefresh();
    }
  };

  const deleteExpert = async (expertId: string) => {
    if (!confirm("Delete this expert and all their assignments?")) return;
    const { error } = await supabase.from('industry_experts').delete().eq('id', expertId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Expert deleted" });
      onRefresh();
    }
  };

  const copyLink = (expert: Expert, citySlug: string) => {
    const cityPrefix = citySlug === 'denver' ? 'Denver' : citySlug === 'portland' ? 'Portland' : 'MN';
    const url = `${window.location.origin}/${cityPrefix}experts/${expert.slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied!", description: url });
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="text-events-cream/60 text-sm">Filter by city:</span>
        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="w-48 bg-events-card border-events-cream/20 text-events-cream">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-events-card border-events-cream/20">
            <SelectItem value="all" className="text-events-cream">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.slug} value={city.slug} className="text-events-cream">
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-events-cream/40 text-sm ml-auto">{filteredExperts.length} experts</span>
      </div>

      {/* Table */}
      <div className="bg-events-card rounded-lg border border-events-cream/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-events-cream/10">
                <th className="text-left p-3 text-events-cream/60 font-medium">Name</th>
                <th className="text-left p-3 text-events-cream/60 font-medium">Invite Link</th>
                <th className="text-left p-3 text-events-cream/60 font-medium">City/Event</th>
                <th className="text-left p-3 text-events-cream/60 font-medium">Status</th>
                <th className="text-left p-3 text-events-cream/60 font-medium">Company</th>
                <th className="text-right p-3 text-events-cream/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExperts.map((expert) => {
                const expertAssigns = getExpertAssignments(expert.id);
                return (
                  <tr key={expert.id} className="border-b border-events-cream/5 hover:bg-events-cream/5 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {expert.photo_url ? (
                          <img src={expert.photo_url} className="w-8 h-8 rounded-full object-cover grayscale" alt="" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-events-coral/20 flex items-center justify-center text-events-coral text-xs font-bold">
                            {expert.full_name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        <div>
                          <span className="text-events-cream font-medium">{expert.full_name}</span>
                          {expert.linkedin_url && (
                            <a href={expert.linkedin_url} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-400 hover:text-blue-300">
                              <ExternalLink className="w-3 h-3 inline" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      {expertAssigns.length > 0 ? (
                        <div className="space-y-1">
                          {expertAssigns.map((a) => {
                            const cityPrefix = a.city_slug === 'denver' ? 'Denver' : a.city_slug === 'portland' ? 'Portland' : 'MN';
                            const url = `${window.location.origin}/${cityPrefix}experts/${expert.slug}`;
                            return (
                              <div key={a.id} className="flex items-center gap-1.5">
                                <code className="text-[11px] text-events-coral bg-events-coral/10 px-1.5 py-0.5 rounded truncate max-w-[200px]" title={url}>
                                  /{cityPrefix}experts/{expert.slug}
                                </code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyLink(expert, a.city_slug)}
                                  className="text-events-cream/60 hover:text-events-cream h-6 w-6 p-0 shrink-0"
                                  title="Copy full URL"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </Button>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-events-cream/60 hover:text-events-cream h-6 w-6 p-0 shrink-0 inline-flex items-center justify-center"
                                  title="Open invite page"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-events-cream/30 text-xs">No assignment</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {expertAssigns.map((a) => (
                          <Badge key={a.id} variant="outline" className="text-events-cream/70 border-events-cream/20 text-xs">
                            {cities.find(c => c.slug === a.city_slug)?.name || a.city_slug}
                            {a.published && <span className="ml-1 text-green-400">●</span>}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge
                        className={`${statusColors[expert.status]} text-xs ${expert.status === 'confirmed' ? 'cursor-pointer hover:ring-2 hover:ring-green-400/40 transition-all' : ''}`}
                        onClick={() => expert.status === 'confirmed' && setPreviewExpert(expert)}
                        title={expert.status === 'confirmed' ? 'Click to preview card' : undefined}
                      >
                        {expert.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-events-cream/60">{expert.current_company || '—'}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        {expertAssigns.map((a) => (
                          <Button
                            key={a.id}
                            size="sm"
                            variant="ghost"
                            onClick={() => togglePublish(a.id, a.published)}
                            className="text-events-cream/60 hover:text-events-cream h-7 px-2"
                            title={a.published ? 'Unpublish' : 'Publish'}
                          >
                            {a.published ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </Button>
                        ))}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteExpert(expert.id)}
                          className="text-red-400/60 hover:text-red-400 h-7 px-2"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredExperts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-events-cream/40">
                    No experts found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      {/* Card Preview Dialog */}
      <Dialog open={!!previewExpert} onOpenChange={(open) => !open && setPreviewExpert(null)}>
        <DialogContent className="bg-events-teal border-events-cream/20 max-w-sm p-0 overflow-hidden">
          {previewExpert && (
            <div className="p-4">
              <p className="text-events-cream/40 text-xs uppercase tracking-wider mb-3 text-center">Card Preview</p>
              <ExpertCard expert={previewExpert} expanded />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
      </div>
    </div>
  );
};

export default ExpertCRM;
