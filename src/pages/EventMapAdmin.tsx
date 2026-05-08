import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useEventMapBrands, MapBrand } from "@/hooks/useEventMapBrands";
import { useEventMapLayouts } from "@/hooks/useEventMapLayouts";
import { useEventLogos } from "@/hooks/useEventLogos";
import EventMapCanvas from "@/components/event/EventMapCanvas";
import MapSidebar from "@/components/event/MapSidebar";
import MapBrandPanel from "@/components/event/MapBrandPanel";
import MapExpertZone, { MapExpert } from "@/components/event/MapExpertZone";
import MapSponsorAssigner from "@/components/event/MapSponsorAssigner";
import { Trash2, Printer, Upload, Plus, Pencil, Check, X, RefreshCw } from "lucide-react";

const EVENT_SLUG = "denver26";
const EXPERT_ZONE_NAME = "Industry Expert Zone";

const EventMapAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [printMode, setPrintMode] = useState(false);

  // Quick-add state
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newTableCount, setNewTableCount] = useState(1);
  const [newIsActivation, setNewIsActivation] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Partial<MapBrand>>({});

  // Panel
  const [selectedBrand, setSelectedBrand] = useState<MapBrand | null>(null);

  // Expert zone state
  const [selectedExpertIds, setSelectedExpertIds] = useState<string[]>([]);
  const [allExperts, setAllExperts] = useState<MapExpert[]>([]);

  const { brands, addBrand, updateBrand, deleteBrand, refetch: refetchBrands } = useEventMapBrands(EVENT_SLUG);
  const { layouts, upsertLayout, removeLayout, publish } = useEventMapLayouts(EVENT_SLUG, "draft");
  const { logos: bubbleLogos } = useEventLogos("denver26-bubbles");
  const { logos: partnerLogos } = useEventLogos("denver26-partners");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin");
      else setAuthed(true);
      setLoading(false);
    });
  }, [navigate]);

  // Fetch all Denver experts for the zone
  useEffect(() => {
    const fetchExperts = async () => {
      const { data } = await supabase
        .from("expert_city_assignments")
        .select("expert_id, expert_type, industry_experts(id, full_name, photo_url, current_company, job_title)")
        .eq("city_slug", "denver")
        .eq("published", true);
      if (data) {
        const mapped = data
          .filter((d: any) => d.industry_experts)
          .map((d: any) => ({
            id: d.industry_experts.id,
            full_name: d.industry_experts.full_name,
            photo_url: d.industry_experts.photo_url,
            current_company: d.industry_experts.current_company,
            job_title: d.industry_experts.job_title,
          }));
        setAllExperts(mapped);
        // Default: all selected
        setSelectedExpertIds(mapped.map((e: MapExpert) => e.id));
      }
    };
    fetchExperts();
  }, []);

  // Auto-create expert zone brand if it doesn't exist
  useEffect(() => {
    if (!authed || brands.length === 0) return;
    const exists = brands.find((b) => b.name === EXPERT_ZONE_NAME);
    if (!exists) {
      addBrand({
        name: EXPERT_ZONE_NAME,
        is_activation: true,
        table_count: 4,
        description: "Basecamp Match Industry Expert Zone",
      });
    }
  }, [authed, brands.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleExpert = (expertId: string) => {
    setSelectedExpertIds((prev) =>
      prev.includes(expertId) ? prev.filter((id) => id !== expertId) : [...prev, expertId]
    );
  };

  const handleSyncFromBubbles = async () => {
    // Combine both sources, deduplicate by name
    const allLogos = [...bubbleLogos, ...partnerLogos];
    const seen = new Set<string>();
    const uniqueLogos = allLogos.filter((l) => {
      const key = l.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (uniqueLogos.length === 0) {
      toast({ title: "No logos found", description: "No logos in bubble or partner lists to sync." });
      return;
    }
    let added = 0;
    for (const logo of uniqueLogos) {
      const exists = brands.find((b) => b.name.toLowerCase() === logo.name.toLowerCase());
      if (exists) continue;
      let logoUrl = logo.logo_url || null;
      const websiteUrl = logo.url || null;
      if (!logoUrl && (logo.domain || websiteUrl)) {
        try {
          const domain = logo.domain || new URL(websiteUrl!.startsWith("http") ? websiteUrl! : `https://${websiteUrl}`).hostname;
          logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch { /* ignore */ }
      }
      await addBrand({
        name: logo.name,
        website_url: websiteUrl,
        logo_url: logoUrl,
        table_count: 1,
        is_activation: false,
      });
      added++;
    }
    toast({ title: `Synced ${added} brands`, description: added === 0 ? "All brands already exist." : `${added} new brands imported.` });
    if (added > 0) refetchBrands();
  };

  const selectedExperts = allExperts.filter((e) => selectedExpertIds.includes(e.id));

  if (loading) return <div className="min-h-screen bg-events-teal flex items-center justify-center text-white">Loading...</div>;
  if (!authed) return null;

  const handleQuickAdd = async () => {
    if (!newName.trim()) return;
    let logoUrl: string | null = null;

    if (newUrl.trim()) {
      try {
        const domain = new URL(newUrl.trim().startsWith("http") ? newUrl.trim() : `https://${newUrl.trim()}`).hostname;
        logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      } catch { /* ignore bad url */ }
    }

    await addBrand({
      name: newName.trim(),
      website_url: newUrl.trim() || null,
      logo_url: logoUrl,
      table_count: newTableCount,
      is_activation: newIsActivation,
    });

    setNewName("");
    setNewUrl("");
    setNewTableCount(1);
    setNewIsActivation(false);
    toast({ title: "Brand added" });
  };

  const handleDropFromSidebar = (brandId: string, x: number, y: number) => {
    upsertLayout(brandId, { x, y });
  };

  const handleMove = (brandId: string, x: number, y: number) => {
    upsertLayout(brandId, { x, y });
  };

  const handleShapeChange = (brandId: string, shape: string) => {
    upsertLayout(brandId, { shape: shape as any });
  };

  const handleRotate = (brandId: string, rotation: number) => {
    upsertLayout(brandId, { rotation });
  };

  const handleRemoveFromCanvas = (brandId: string) => {
    removeLayout(brandId);
  };

  const handleDeleteBrand = async (brandId: string) => {
    // Remove layout first, then delete the brand
    await removeLayout(brandId);
    await deleteBrand(brandId);
  };

  const startEdit = (brand: MapBrand) => {
    setEditingId(brand.id);
    setEditFields({ name: brand.name, description: brand.description, table_count: brand.table_count, logo_url: brand.logo_url, is_activation: brand.is_activation, sponsor_brand_id: brand.sponsor_brand_id, website_url: brand.website_url, offers_remote: brand.offers_remote ?? null, currently_hiring: brand.currently_hiring ?? null, culture_blurb: brand.culture_blurb ?? null });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updateBrand(editingId, editFields);
    setEditingId(null);
    setEditFields({});
  };

  const handlePublish = async () => {
    await publish();
  };

  const handleAssignSponsor = async (activationId: string, sponsorId: string | null) => {
    await updateBrand(activationId, { sponsor_brand_id: sponsorId });
  };

  if (printMode) {
    return (
      <div className="bg-white min-h-screen p-4">
        <button onClick={() => setPrintMode(false)} className="print:hidden mb-4 px-4 py-2 bg-events-teal text-white rounded font-display text-sm">
          Exit Print Mode
        </button>
        <EventMapCanvas brands={brands} layouts={layouts} printMode expertZoneExperts={selectedExperts} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-events-teal">
      {/* Header */}
      <div className="bg-events-teal border-b border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div>
          <h1 className="font-headline font-bold text-xl text-events-cream">Event Map Manager</h1>
          <p className="text-xs text-white/50 font-body">Denver Outside Days · Auraria Wellness Center</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSyncFromBubbles} className="gap-1 text-events-teal">
            <RefreshCw className="w-3.5 h-3.5" /> Sync Bubble Logos
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPrintMode(true)} className="gap-1 text-events-teal">
            <Printer className="w-3.5 h-3.5" /> Print
          </Button>
          <Button size="sm" onClick={handlePublish} className="gap-1 bg-events-coral hover:bg-events-coral/90 text-white">
            <Upload className="w-3.5 h-3.5" /> Publish Live
          </Button>
        </div>
      </div>

      <div className="flex print:hidden">
        {/* Sidebar */}
        <div className="w-64 shrink-0 bg-events-teal border-r border-white/10 p-4 h-[calc(100vh-65px)] overflow-y-auto">
          <MapSidebar brands={brands} layouts={layouts} />
        </div>

        {/* Main area */}
        <div className="flex-1 p-4 overflow-auto h-[calc(100vh-65px)]">
          {/* Quick Add */}
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/50 font-body uppercase tracking-wider mb-3">Quick Add Brand</p>
            <div className="flex gap-2 flex-wrap items-end">
              <div className="flex-1 min-w-[140px]">
                <label className="text-[10px] text-white/40 font-body">Company Name</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Brand name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 h-8 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="text-[10px] text-white/40 font-body">Website URL</label>
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 h-8 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
                />
              </div>
              <div className="w-20">
                <label className="text-[10px] text-white/40 font-body">Tables</label>
                <Input
                  type="number"
                  min={1}
                  value={newTableCount}
                  onChange={(e) => setNewTableCount(Number(e.target.value))}
                  className="bg-white/10 border-white/20 text-white h-8 text-sm"
                />
              </div>
              <label className="flex items-center gap-1.5 text-xs text-white/60 font-body cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsActivation}
                  onChange={(e) => setNewIsActivation(e.target.checked)}
                  className="rounded"
                />
                Activation
              </label>
              <Button size="sm" onClick={handleQuickAdd} className="gap-1 bg-events-coral hover:bg-events-coral/90 text-white h-8">
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="mb-6">
            <EventMapCanvas
              brands={brands}
              layouts={layouts}
              interactive
              onMove={handleMove}
              onShapeChange={handleShapeChange}
              onRotate={handleRotate}
              onDropFromSidebar={handleDropFromSidebar}
              onRemoveFromCanvas={handleRemoveFromCanvas}
              onClick={(b) => setSelectedBrand(b)}
              expertZoneExperts={selectedExperts}
            />
            <p className="text-[10px] text-white/30 font-body mt-1">
              Drag brands from sidebar. Double-click placed brand to remove. Click shape toggle (⟳) for multi-table layouts.
            </p>
          </div>

          {/* Admin Table */}
          <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-white/60 font-body text-xs">Logo</TableHead>
                  <TableHead className="text-white/60 font-body text-xs">Name</TableHead>
                  <TableHead className="text-white/60 font-body text-xs">URL</TableHead>
                  <TableHead className="text-white/60 font-body text-xs">Description</TableHead>
                  <TableHead className="text-white/60 font-body text-xs">Tables</TableHead>
                  <TableHead className="text-white/60 font-body text-xs">Type</TableHead>
                  <TableHead className="text-white/60 font-body text-xs">Sponsor</TableHead>
                  <TableHead className="text-white/60 font-body text-xs w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((brand) => {
                  const isEditing = editingId === brand.id;
                  const logoSrc = (isEditing ? editFields.logo_url : brand.logo_url) || (brand.website_url ? (() => { try { return `https://www.google.com/s2/favicons?domain=${new URL(brand.website_url.startsWith("http") ? brand.website_url : `https://${brand.website_url}`).hostname}&sz=128`; } catch { return null; } })() : null);

                  return (
                    <FragmentWithKey key={brand.id}>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                          {logoSrc ? (
                            <img src={logoSrc} alt="" className="w-6 h-6 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          ) : (
                            <span className="text-[9px] font-bold text-events-teal">{brand.name[0]}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input value={editFields.name || ""} onChange={(e) => setEditFields((p) => ({ ...p, name: e.target.value }))} className="bg-white/10 border-white/20 text-white h-7 text-xs" />
                        ) : (
                          <span className="text-sm text-white font-display">{brand.name}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input value={editFields.website_url || ""} onChange={(e) => setEditFields((p) => ({ ...p, website_url: e.target.value }))} placeholder="https://..." className="bg-white/10 border-white/20 text-white h-7 text-xs" />
                        ) : (
                          <span className="text-xs text-white/60 font-body truncate max-w-[120px] block">{brand.website_url || ", "}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input value={editFields.description || ""} onChange={(e) => setEditFields((p) => ({ ...p, description: e.target.value }))} className="bg-white/10 border-white/20 text-white h-7 text-xs" />
                        ) : (
                          <span className="text-xs text-white/60 font-body">{brand.description || ", "}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input type="number" min={1} value={editFields.table_count || 1} onChange={(e) => setEditFields((p) => ({ ...p, table_count: Number(e.target.value) }))} className="bg-white/10 border-white/20 text-white h-7 text-xs w-16" />
                        ) : (
                          <span className="text-sm text-white font-body">{brand.table_count}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <label className="flex items-center gap-1 text-xs text-white/60">
                            <input type="checkbox" checked={editFields.is_activation || false} onChange={(e) => setEditFields((p) => ({ ...p, is_activation: e.target.checked }))} />
                            Activation
                          </label>
                        ) : (
                          <span className="text-xs text-white/60 font-body">{brand.is_activation ? "Activation" : "Brand"}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <select
                            value={editFields.sponsor_brand_id || ""}
                            onChange={(e) => setEditFields((p) => ({ ...p, sponsor_brand_id: e.target.value || null }))}
                            className="bg-white/10 border border-white/20 text-white text-xs rounded h-7 px-1"
                          >
                            <option value="">None</option>
                            {brands.filter((b) => b.id !== brand.id).map((b) => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs text-white/60 font-body">
                            {brand.sponsor_brand_id ? brands.find((b) => b.id === brand.sponsor_brand_id)?.name || ", " : ", "}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {isEditing ? (
                            <>
                              <button onClick={saveEdit} className="w-6 h-6 rounded bg-green-600 text-white flex items-center justify-center hover:bg-green-700">
                                <Check className="w-3 h-3" />
                              </button>
                              <button onClick={() => setEditingId(null)} className="w-6 h-6 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(brand)} className="w-6 h-6 rounded bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button onClick={() => handleDeleteBrand(brand.id)} className="w-6 h-6 rounded bg-red-600/20 text-red-400 flex items-center justify-center hover:bg-red-600/40">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {isEditing && (
                      <TableRow key={`${brand.id}-hiring`} className="border-white/10 bg-white/[0.02]">
                        <TableCell colSpan={8} className="py-3">
                          <div className="space-y-3">
                            <p className="text-xs uppercase tracking-wider text-events-coral font-body font-semibold">Hiring info</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-white/80 font-body block mb-1">Remote work policy</label>
                                <select
                                  value={editFields.offers_remote || ""}
                                  onChange={(e) => setEditFields((p) => ({ ...p, offers_remote: e.target.value || null }))}
                                  className="bg-white/10 border border-white/20 text-white text-xs rounded h-8 px-2 w-full"
                                >
                                  <option value="">(no selection)</option>
                                  <option value="Fully remote">Fully remote</option>
                                  <option value="Hybrid">Hybrid</option>
                                  <option value="In-office only">In-office only</option>
                                  <option value="Varies by role">Varies by role</option>
                                </select>
                                <p className="text-[10px] text-white/40 mt-1 font-body">What is your remote work policy?</p>
                              </div>
                              <div>
                                <label className="text-xs text-white/80 font-body block mb-1">Currently hiring</label>
                                <select
                                  value={editFields.currently_hiring || ""}
                                  onChange={(e) => setEditFields((p) => ({ ...p, currently_hiring: e.target.value || null }))}
                                  className="bg-white/10 border border-white/20 text-white text-xs rounded h-8 px-2 w-full"
                                >
                                  <option value="">(no selection)</option>
                                  <option value="Yes, actively hiring">Yes, actively hiring</option>
                                  <option value="Not actively hiring">Not actively hiring</option>
                                  <option value="Always open to great people">Always open to great people</option>
                                </select>
                                <p className="text-[10px] text-white/40 mt-1 font-body">What's your current hiring status?</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-white/80 font-body block mb-1">Culture blurb</label>
                              <textarea
                                value={editFields.culture_blurb || ""}
                                onChange={(e) => setEditFields((p) => ({ ...p, culture_blurb: e.target.value.slice(0, 280) || null }))}
                                maxLength={280}
                                rows={3}
                                className="bg-white/10 border border-white/20 text-white text-xs rounded px-2 py-1.5 w-full resize-y"
                              />
                              <div className="flex justify-between mt-1">
                                <p className="text-[10px] text-white/40 font-body">One or two sentences about your culture or what you offer. Candidates will see this on your brand card.</p>
                                <p className="text-[10px] text-white/40 font-body">{(editFields.culture_blurb || "").length}/280</p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                    </FragmentWithKey>
                  );
                })}
                {brands.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-white/30 text-sm py-8 font-body">
                      No brands yet. Use Quick Add above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Sponsor Assignment */}
          <div className="mt-6">
            <MapSponsorAssigner
              brands={brands}
              onAssignSponsor={handleAssignSponsor}
              onAddSponsorBrand={async (name) => {
                return await addBrand({ name, table_count: 0, is_activation: false });
              }}
            />
          </div>

          {/* Industry Expert Zone */}
          <div className="mt-6">
            <MapExpertZone
              citySlug="denver"
              selectedExpertIds={selectedExpertIds}
              onToggleExpert={handleToggleExpert}
            />
          </div>
        </div>
      </div>

      {/* Brand detail panel */}
      <MapBrandPanel brand={selectedBrand} onClose={() => setSelectedBrand(null)} />
    </div>
  );
};

export default EventMapAdmin;
