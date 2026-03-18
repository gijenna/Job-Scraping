import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useEventLogos, EventLogo } from "@/hooks/useEventLogos";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Settings, GripVertical, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface AdminLogoManagerProps {
  eventSlug: string;
  label?: string;
  onLogosChange?: (logos: EventLogo[]) => void;
}

const SortableLogoItem = ({
  logo,
  onDelete,
  onEditUrl,
}: {
  logo: EventLogo;
  onDelete: () => void;
  onEditUrl: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: logo.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 bg-events-card/50 rounded-lg px-2 py-1.5">
      <button {...attributes} {...listeners} className="cursor-grab text-events-cream/40 hover:text-events-cream">
        <GripVertical className="w-3.5 h-3.5" />
      </button>
      {logo.logo_url ? (
        <img src={logo.logo_url} alt={logo.name} className="w-6 h-6 object-contain rounded" />
      ) : logo.domain ? (
        <img src={`https://www.google.com/s2/favicons?domain=${logo.domain}&sz=64`} alt={logo.name} className="w-6 h-6 object-contain" />
      ) : (
        <div className="w-6 h-6 bg-events-cream/10 rounded flex items-center justify-center text-[8px] text-events-cream/40">?</div>
      )}
      <span className="text-events-cream text-xs flex-1 truncate">{logo.name}</span>
      <button onClick={onEditUrl} className="text-events-cream/40 hover:text-events-cream" title="Edit URL">
        <LinkIcon className="w-3.5 h-3.5" />
      </button>
      <button onClick={onDelete} className="text-red-400 hover:text-red-300">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

const AdminLogoManager = ({ eventSlug, label, onLogosChange }: AdminLogoManagerProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [urlEditOpen, setUrlEditOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<EventLogo | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [url, setUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const { logos, addLogo, deleteLogo, updateLogo, reorderLogos } = useEventLogos(eventSlug);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsAdmin(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setIsAdmin(!!session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    onLogosChange?.(logos);
  }, [logos, onLogosChange]);

  if (!isAdmin) return null;

  const handleAdd = async () => {
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);
    let uploadedUrl: string | undefined;
    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const path = `logos/${eventSlug}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("event-photos").upload(path, logoFile);
      if (uploadErr) { toast({ title: "Upload failed", description: uploadErr.message, variant: "destructive" }); setSaving(false); return; }
      const { data: urlData } = supabase.storage.from("event-photos").getPublicUrl(path);
      uploadedUrl = urlData.publicUrl;
    }
    const err = await addLogo({ name: name.trim(), domain: domain.trim() || undefined, logo_url: uploadedUrl, url: url.trim() || undefined });
    if (err) toast({ title: "Error adding logo", description: err.message, variant: "destructive" });
    else { toast({ title: "Logo added!" }); setName(""); setDomain(""); setUrl(""); setLogoFile(null); setAddOpen(false); }
    setSaving(false);
  };

  const handleDelete = async (id: string, logoName: string) => {
    if (!confirm(`Delete "${logoName}"?`)) return;
    const err = await deleteLogo(id);
    if (err) toast({ title: "Error", description: err.message, variant: "destructive" });
    else toast({ title: "Deleted" });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = logos.findIndex((l) => l.id === active.id);
    const newIdx = logos.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(logos, oldIdx, newIdx);
    await reorderLogos(reordered.map((l) => l.id));
  };

  const openUrlEdit = (logo: EventLogo) => {
    setEditingLogo(logo);
    setEditUrl(logo.url || "");
    setUrlEditOpen(true);
  };

  const handleUrlSave = async () => {
    if (!editingLogo) return;
    const err = await updateLogo(editingLogo.id, { url: editUrl.trim() || null });
    if (err) toast({ title: "Error", description: err.message, variant: "destructive" });
    else { toast({ title: "URL updated!" }); setUrlEditOpen(false); }
  };

  return (
    <>
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-4 right-4 z-50 bg-events-coral text-events-teal p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
        title="Manage Logos"
      >
        <Settings className="w-5 h-5" />
      </button>

      {showPanel && (
        <div className="fixed bottom-16 right-4 z-50 w-80 max-h-[70vh] overflow-y-auto bg-events-teal border border-events-cream/20 rounded-xl shadow-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-events-cream text-sm">Logos — {eventSlug}</h3>
            <Button size="sm" onClick={() => setAddOpen(true)} className="bg-events-coral text-events-teal h-7 text-xs">
              <Plus className="w-3 h-3 mr-1" /> Add
            </Button>
          </div>

          {logos.length === 0 && <p className="text-events-cream/40 text-xs">No logos yet.</p>}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={logos.map((l) => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1.5">
                {logos.map((logo) => (
                  <SortableLogoItem
                    key={logo.id}
                    logo={logo}
                    onDelete={() => handleDelete(logo.id, logo.name)}
                    onEditUrl={() => openUrlEdit(logo)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Add Logo Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-events-teal border-events-cream/20 text-events-cream max-w-sm">
          <DialogHeader><DialogTitle className="font-display text-events-cream">Add Logo</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div><Label className="text-events-cream/80 text-xs">Brand Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="bg-events-card border-events-cream/20 text-events-cream h-8 text-sm" /></div>
            <div><Label className="text-events-cream/80 text-xs">Domain (for auto-logo)</Label><Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g. rei.com" className="bg-events-card border-events-cream/20 text-events-cream h-8 text-sm" /></div>
            <div><Label className="text-events-cream/80 text-xs">Upload Logo (optional)</Label><Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="bg-events-card border-events-cream/20 text-events-cream h-8 text-sm" /></div>
            <div><Label className="text-events-cream/80 text-xs">Link URL (optional)</Label><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="bg-events-card border-events-cream/20 text-events-cream h-8 text-sm" /></div>
            <Button onClick={handleAdd} disabled={saving} className="w-full bg-events-coral text-events-teal font-bold text-sm">{saving ? "Saving..." : "Add Logo"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit URL Dialog */}
      <Dialog open={urlEditOpen} onOpenChange={setUrlEditOpen}>
        <DialogContent className="bg-events-teal border-events-cream/20 text-events-cream max-w-sm">
          <DialogHeader><DialogTitle className="font-display text-events-cream">Edit URL — {editingLogo?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <div><Label className="text-events-cream/80 text-xs">Link URL</Label><Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="https://..." className="bg-events-card border-events-cream/20 text-events-cream h-8 text-sm" /></div>
            <Button onClick={handleUrlSave} className="w-full bg-events-coral text-events-teal font-bold text-sm">Save URL</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminLogoManager;
