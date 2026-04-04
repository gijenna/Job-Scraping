import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useEventMapBrands, MapBrand } from "@/hooks/useEventMapBrands";
import { useEventMapLayouts } from "@/hooks/useEventMapLayouts";
import EventMapCanvas from "@/components/event/EventMapCanvas";
import MapSidebar from "@/components/event/MapSidebar";
import MapBrandPanel from "@/components/event/MapBrandPanel";
import MapExpertZone from "@/components/event/MapExpertZone";
import MapSponsorAssigner from "@/components/event/MapSponsorAssigner";
import { Trash2, Printer, Upload, Plus, Pencil, Check, X } from "lucide-react";

const EVENT_SLUG = "denver26";

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

  const { brands, addBrand, updateBrand, deleteBrand } = useEventMapBrands(EVENT_SLUG);
  const { layouts, upsertLayout, removeLayout, publish } = useEventMapLayouts(EVENT_SLUG, "draft");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin");
      else setAuthed(true);
      setLoading(false);
    });
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-events-teal flex items-center justify-center text-white">Loading...</div>;
  if (!authed) return null;

  const handleQuickAdd = async () => {
    if (!newName.trim()) return;
    let logoUrl: string | null = null;
    let domain: string | null = null;

    if (newUrl.trim()) {
      try {
        domain = new URL(newUrl.trim().startsWith("http") ? newUrl.trim() : `https://${newUrl.trim()}`).hostname;
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

  const startEdit = (brand: MapBrand) => {
    setEditingId(brand.id);
    setEditFields({ name: brand.name, description: brand.description, table_count: brand.table_count, logo_url: brand.logo_url, is_activation: brand.is_activation, sponsor_brand_id: brand.sponsor_brand_id });
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
        <EventMapCanvas brands={brands} layouts={layouts} printMode />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-events-teal">
      {/* Header */}
      <div className="bg-events-teal border-b border-white/10 px-6 py-4 flex items-center justify-between print:hidden">
        <div>
          <h1 className="font-headline font-bold text-xl text-events-cream">Event Map Manager</h1>
          <p className="text-xs text-white/50 font-body">Denver Outside Days · Auraria Wellness Center</p>
        </div>
        <div className="flex gap-2">
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
              onDropFromSidebar={handleDropFromSidebar}
              onRemoveFromCanvas={handleRemoveFromCanvas}
              onClick={(b) => setSelectedBrand(b)}
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
                    <TableRow key={brand.id} className="border-white/10 hover:bg-white/5">
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
                          <Input value={editFields.description || ""} onChange={(e) => setEditFields((p) => ({ ...p, description: e.target.value }))} className="bg-white/10 border-white/20 text-white h-7 text-xs" />
                        ) : (
                          <span className="text-xs text-white/60 font-body">{brand.description || "—"}</span>
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
                            {brand.sponsor_brand_id ? brands.find((b) => b.id === brand.sponsor_brand_id)?.name || "—" : "—"}
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
                              <button onClick={() => deleteBrand(brand.id)} className="w-6 h-6 rounded bg-red-600/20 text-red-400 flex items-center justify-center hover:bg-red-600/40">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {brands.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-white/30 text-sm py-8 font-body">
                      No brands yet. Use Quick Add above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          {/* Sponsor Assignment */}
          <div className="mt-6">
            <MapSponsorAssigner brands={brands} onAssignSponsor={handleAssignSponsor} />
          </div>

          {/* Industry Expert Zone */}
          <div className="mt-6">
            <MapExpertZone citySlug="denver" />
          </div>
        </div>
      </div>
      </div>

      {/* Brand detail panel */}
      <MapBrandPanel brand={selectedBrand} onClose={() => setSelectedBrand(null)} />
    </div>
  );
};

export default EventMapAdmin;
