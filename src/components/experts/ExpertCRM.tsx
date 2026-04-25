import { useState } from "react";
import { Expert, ExpertCityAssignment, ExpertCity } from "@/lib/expert-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Trash2, ExternalLink, Copy, Share2, Pencil, Bookmark, BookmarkCheck, Download } from "lucide-react";
import { PUBLISHED_BASE_URL } from "@/lib/utils";
import { supabase as supabaseClient } from "@/integrations/supabase/client";
import ExpertCard from "./ExpertCard";
import ExpertIntakeForm from "./ExpertIntakeForm";

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
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSaved, setFilterSaved] = useState<string>("active");
  const [previewExpert, setPreviewExpert] = useState<Expert | null>(null);
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);
  const [editCitySlug, setEditCitySlug] = useState<string>("");
  const { toast } = useToast();

  const getExpertAssignments = (expertId: string) =>
    assignments.filter(a => a.expert_id === expertId);

  const toggleSaveForLater = async (expert: Expert) => {
    const newVal = !expert.saved_for_later;
    const { error } = await supabase.from('industry_experts').update({ saved_for_later: newVal } as any).eq('id', expert.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: newVal ? "Saved for later" : "Moved to active" });
      onRefresh();
    }
  };

  const filteredExperts = experts.filter(e => {
    const expertAssigns = getExpertAssignments(e.id);
    const cityMatch = filterCity === "all" || expertAssigns.some(a => a.city_slug === filterCity);
    const typeMatch = filterType === "all" || expertAssigns.some(a => (a.expert_type || 'industry_expert') === filterType);
    const savedMatch = filterSaved === "all" || (filterSaved === "saved" ? e.saved_for_later : !e.saved_for_later);
    return cityMatch && typeMatch && savedMatch;
  });

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

  const exportCsv = () => {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const headers = ['Name', 'Email', 'Job Title', 'Company', 'Field', 'Status', 'LinkedIn', 'Cities', 'Type', 'Years in Industry', 'Years in City', 'Ask Me About', 'Niche Interests', 'Share Links'];
    const rows = filteredExperts.map(e => {
      const expertAssigns = assignments.filter(a => a.expert_id === e.id);
      const cityNames = expertAssigns.map(a => a.city_slug).join('; ');
      const types = [...new Set(expertAssigns.map(a => a.expert_type))].join('; ');
      const shareLinks = e.status === 'confirmed'
        ? expertAssigns.map(a => `https://${projectId}.supabase.co/functions/v1/expert-og/${encodeURIComponent(e.slug)}/${encodeURIComponent(a.city_slug)}`).join('; ')
        : '';
      return [
        e.full_name, e.email || '', e.job_title || '', e.current_company || '',
        e.field_of_work || '', e.status || '', e.linkedin_url || '',
        cityNames, types, e.years_in_industry ?? '', e.years_in_city ?? '',
        e.ask_me_about || '', (e.niche_interests || []).join('; '), shareLinks
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const parts = ['basecamp-experts'];
    if (filterCity !== 'all') parts.push(filterCity);
    if (filterType !== 'all') parts.push(filterType);
    if (filterSaved !== 'all') parts.push(filterSaved);
    parts.push(new Date().toISOString().slice(0, 10));
    a.download = `${parts.join('-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyLink = (expert: Expert, assignment: ExpertCityAssignment) => {
    const isBrandRep = (assignment.expert_type || 'industry_expert') === 'brand_rep';
    let url: string;
    if (isBrandRep) {
      const repPrefix = assignment.city_slug === 'portland' ? 'pnw' : assignment.city_slug;
      url = `${PUBLISHED_BASE_URL}/${repPrefix}reps/${expert.slug}`;
    } else {
      const cityPrefix = assignment.city_slug === 'denver' ? 'Denver' : assignment.city_slug === 'portland' ? 'Portland' : 'MN';
      url = `${PUBLISHED_BASE_URL}/${cityPrefix}experts/${expert.slug}`;
    }
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied!", description: url });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
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
        <span className="text-events-cream/60 text-sm">Type:</span>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48 bg-events-card border-events-cream/20 text-events-cream">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-events-card border-events-cream/20">
            <SelectItem value="all" className="text-events-cream">All Types</SelectItem>
            <SelectItem value="industry_expert" className="text-events-cream">Industry Experts</SelectItem>
            <SelectItem value="brand_rep" className="text-events-cream">Brand Reps</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-events-cream/60 text-sm">Status:</span>
        <Select value={filterSaved} onValueChange={setFilterSaved}>
          <SelectTrigger className="w-48 bg-events-card border-events-cream/20 text-events-cream">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-events-card border-events-cream/20">
            <SelectItem value="active" className="text-events-cream">Active</SelectItem>
            <SelectItem value="saved" className="text-events-cream">Saved for Later</SelectItem>
            <SelectItem value="all" className="text-events-cream">All</SelectItem>
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
                <th className="text-left p-3 text-events-cream/60 font-medium">Type</th>
                <th className="text-left p-3 text-events-cream/60 font-medium">Invite Link</th>
                <th className="text-left p-3 text-events-cream/60 font-medium">City/Event</th>
                <th className="text-left p-3 text-events-cream/60 font-medium">Status</th>
                <th className="text-left p-3 text-events-cream/60 font-medium">Company</th>
                <th className="text-left p-3 text-events-cream/60 font-medium">Share Link</th>
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
                        <div className="flex flex-wrap gap-1">
                          {expertAssigns.map((a) => {
                            const aType = (a.expert_type || 'industry_expert');
                            return (
                              <Badge key={a.id} variant="outline" className={`text-xs ${aType === 'brand_rep' ? 'text-events-yellow border-events-yellow/30' : 'text-events-coral border-events-coral/30'}`}>
                                {aType === 'brand_rep' ? 'Brand Rep' : 'Expert'}
                                <span className="ml-1 text-events-cream/40">({cities.find(c => c.slug === a.city_slug)?.name || a.city_slug})</span>
                              </Badge>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-events-cream/30 text-xs">, </span>
                      )}
                    </td>
                    <td className="p-3">
                      {expertAssigns.length > 0 ? (
                        <div className="space-y-1">
                          {expertAssigns.map((a) => {
                            const isBrandRep = (a.expert_type || 'industry_expert') === 'brand_rep';
                            let linkPath: string;
                            if (isBrandRep) {
                              const repPrefix = a.city_slug === 'portland' ? 'pnw' : a.city_slug;
                              linkPath = `/${repPrefix}reps/${expert.slug}`;
                            } else {
                              const cityPrefix = a.city_slug === 'denver' ? 'Denver' : a.city_slug === 'portland' ? 'Portland' : 'MN';
                              linkPath = `/${cityPrefix}experts/${expert.slug}`;
                            }
                            const url = `${PUBLISHED_BASE_URL}${linkPath}`;
                            return (
                              <div key={a.id} className="flex items-center gap-1.5">
                                <code className="text-[11px] text-events-coral bg-events-coral/10 px-1.5 py-0.5 rounded truncate max-w-[200px]" title={url}>
                                  {linkPath}
                                </code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyLink(expert, a)}
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
                      <div className="flex flex-wrap gap-1.5">
                        {expertAssigns.map((a) => {
                          const cityName = cities.find(c => c.slug === a.city_slug)?.name || a.city_slug;
                          const eventPageMap: Record<string, string> = {
                            portland: '/PNW26',
                            denver: '/OutsideDays26',
                            minneapolis: '/OR26',
                          };
                          const eventPage = eventPageMap[a.city_slug];
                          return (
                            <div key={a.id} className="flex items-center gap-1">
                              <Badge variant="outline" className="text-events-cream/70 border-events-cream/20 text-xs">
                                {cityName}
                                {a.published && <span className="ml-1 text-green-400">●</span>}
                              </Badge>
                              {eventPage && (
                                <a
                                  href={eventPage}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-events-cream/40 hover:text-events-coral transition-colors"
                                  title={`View ${cityName} event page`}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          );
                        })}
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
                    <td className="p-3 text-events-cream/60">{expert.current_company || ', '}</td>
                    <td className="p-3">
                      {expert.status === 'confirmed' && expertAssigns.length > 0 ? (
                        <div className="space-y-1">
                          {expertAssigns.map((a) => {
                            const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
                            const shareUrl = `https://${projectId}.supabase.co/functions/v1/expert-og/${encodeURIComponent(expert.slug)}/${encodeURIComponent(a.city_slug)}`;
                            const downloadOgCard = async () => {
                              try {
                                const pid = import.meta.env.VITE_SUPABASE_PROJECT_ID;
                                const genUrl = `https://${pid}.supabase.co/functions/v1/expert-og/${encodeURIComponent(expert.slug)}/${encodeURIComponent(a.city_slug)}?generate=1`;
                                toast({ title: "Generating card…", description: "This may take a few seconds" });
                                const resp = await fetch(genUrl);
                                if (!resp.ok) throw new Error("Generation failed");
                                const data = await resp.json();
                                const imageUrl = data.image_url;
                                if (!imageUrl) throw new Error("No image URL returned");
                                // Open in new tab, user can right-click save; avoids CORS issues
                                window.open(imageUrl, "_blank");
                                toast({ title: "Card opened, right-click to save!" });
                              } catch (err) {
                                console.error("Download error:", err);
                                toast({ title: "Download failed", description: String(err), variant: "destructive" });
                              }
                            };
                            return (
                              <div key={a.id} className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    navigator.clipboard.writeText(shareUrl);
                                    toast({ title: "Share link copied!", description: `${expert.full_name}, ${cities.find(c => c.slug === a.city_slug)?.name || a.city_slug}` });
                                  }}
                                  className="text-events-cream/60 hover:text-events-cream h-6 px-2 gap-1 text-xs"
                                  title={shareUrl}
                                >
                                  <Share2 className="w-3 h-3" />
                                  {cities.find(c => c.slug === a.city_slug)?.name || a.city_slug}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={downloadOgCard}
                                  className="text-events-cream/60 hover:text-events-yellow h-6 w-6 p-0"
                                  title="Download card image"
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-events-cream/30 text-xs">, </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleSaveForLater(expert)}
                          className={`h-7 px-2 ${expert.saved_for_later ? 'text-events-yellow' : 'text-events-cream/60 hover:text-events-cream'}`}
                          title={expert.saved_for_later ? 'Move to active' : 'Save for later'}
                        >
                          {expert.saved_for_later ? <BookmarkCheck className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const firstAssign = expertAssigns[0];
                            setEditCitySlug(firstAssign?.city_slug || "");
                            setEditingExpert(expert);
                          }}
                          className="text-events-cream/60 hover:text-events-cream h-7 px-2"
                          title="Edit"
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
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
                  <td colSpan={7} className="p-8 text-center text-events-cream/40">
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

      {/* Edit Expert Dialog */}
      <Dialog open={!!editingExpert} onOpenChange={(open) => !open && setEditingExpert(null)}>
        <DialogContent className="bg-events-bg border-events-cream/20 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-events-cream font-display">Edit: {editingExpert?.full_name}</DialogTitle>
          </DialogHeader>
          {editingExpert && (
            <ExpertIntakeForm
              expertId={editingExpert.id}
              existingData={editingExpert}
              citySlug={editCitySlug}
              cityName={cities.find(c => c.slug === editCitySlug)?.name || editCitySlug}
              expertType={assignments.find(a => a.expert_id === editingExpert.id)?.expert_type || 'industry_expert'}
              onComplete={() => {
                setEditingExpert(null);
                onRefresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
      </div>
    </div>
  );
};

export default ExpertCRM;
