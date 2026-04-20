import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";
import { Trash2, Pencil, Link2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Convert a UTC date to a specific US timezone offset and format time
const formatTimeInZone = (dateStr: string, offsetHours: number) => {
  const d = new Date(dateStr);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const zoned = new Date(utc + offsetHours * 3600000);
  return format(zoned, "h:mm a");
};

const getPTOffset = (dateStr: string) => {
  const d = new Date(dateStr);
  const year = d.getUTCFullYear();
  const marchSecondSun = new Date(Date.UTC(year, 2, 8));
  marchSecondSun.setUTCDate(8 + (7 - marchSecondSun.getUTCDay()) % 7);
  const novFirstSun = new Date(Date.UTC(year, 10, 1));
  novFirstSun.setUTCDate(1 + (7 - novFirstSun.getUTCDay()) % 7);
  return d >= marchSecondSun && d < novFirstSun ? -7 : -8;
};

const formatMultiZone = (startDate: string, endDate?: string | null) => {
  const ptOff = getPTOffset(startDate);
  const mtOff = ptOff + 1;
  const etOff = ptOff + 3;

  if (endDate) {
    const startPT = formatTimeInZone(startDate, ptOff);
    const endPT = formatTimeInZone(endDate, ptOff);
    const startMT = formatTimeInZone(startDate, mtOff);
    const endMT = formatTimeInZone(endDate, mtOff);
    const startET = formatTimeInZone(startDate, etOff);
    const endET = formatTimeInZone(endDate, etOff);
    return `${startPT}–${endPT} PT · ${startMT}–${endMT} MT · ${startET}–${endET} ET`;
  }

  const pt = formatTimeInZone(startDate, ptOff);
  const mt = formatTimeInZone(startDate, mtOff);
  const et = formatTimeInZone(startDate, etOff);
  return `${pt} PT · ${mt} MT · ${et} ET`;
};

// Convert UTC ISO to a Pacific Time datetime-local string for the form
const utcToPacificLocal = (isoStr: string) => {
  const d = new Date(isoStr);
  const ptOff = getPTOffset(isoStr);
  const utc = d.getTime();
  const pacific = new Date(utc + ptOff * 3600000);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pacific.getUTCFullYear()}-${pad(pacific.getUTCMonth() + 1)}-${pad(pacific.getUTCDate())}T${pad(pacific.getUTCHours())}:${pad(pacific.getUTCMinutes())}`;
};

const pacificToUTC = (localStr: string): string => {
  const d = new Date(localStr);
  const year = d.getFullYear();
  const marchSecondSun = new Date(year, 2, 8);
  marchSecondSun.setDate(8 + (7 - marchSecondSun.getDay()) % 7);
  const novFirstSun = new Date(year, 10, 1);
  novFirstSun.setDate(1 + (7 - novFirstSun.getDay()) % 7);
  const isPDT = d >= marchSecondSun && d < novFirstSun;
  const offsetHours = isPDT ? 7 : 8;
  const parts = localStr.split(/[-T:]/);
  const utc = new Date(Date.UTC(
    parseInt(parts[0]),
    parseInt(parts[1]) - 1,
    parseInt(parts[2]),
    parseInt(parts[3]) + offsetHours,
    parseInt(parts[4])
  ));
  return utc.toISOString();
};

interface EventCardProps {
  event: Tables<"events"> & { end_date?: string | null };
  isAdmin?: boolean;
  onDelete?: () => void;
}

const EventCard = ({ event, isAdmin, onDelete }: EventCardProps) => {
  const eventDate = new Date(event.date);
  const day = format(eventDate, "dd");
  const month = format(eventDate, "MMM").toUpperCase();
  const year = format(eventDate, "yyyy");
  const isFree = !event.cost || event.cost === 0;
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editTitle, setEditTitle] = useState(event.title);
  const [editDate, setEditDate] = useState(utcToPacificLocal(event.date));
  const [editEndDate, setEditEndDate] = useState(event.end_date ? utcToPacificLocal(event.end_date) : "");
  const [editCost, setEditCost] = useState(String(event.cost ?? 0));
  const [editLink, setEditLink] = useState(event.registration_link);
  const [editType, setEditType] = useState<"in-person" | "digital" | "workshop">(event.type as any);
  const [editLocation, setEditLocation] = useState(event.location ?? "");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${event.title}"?`)) return;
    setDeleting(true);
    const { error } = await supabase.from("events").delete().eq("id", event.id);
    if (error) {
      toast({ title: "Error deleting event", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Event deleted" });
      onDelete?.();
    }
    setDeleting(false);
  };

  const handleEditOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDate || !editLink.trim()) {
      toast({ title: "Missing fields", description: "Fill in title, date, and registration link.", variant: "destructive" });
      return;
    }
    setEditLoading(true);
    try {
      let photoUrl = event.photo_url;

      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const path = `events/${event.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("event-photos")
          .upload(path, photoFile);
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from("event-photos").getPublicUrl(path);
        photoUrl = urlData.publicUrl;
      }

      const startUTC = pacificToUTC(editDate);
      const endUTC = editEndDate ? pacificToUTC(editEndDate) : null;
      const { error } = await supabase.from("events").update({
        title: editTitle.trim(),
        date: startUTC,
        end_date: endUTC,
        cost: parseFloat(editCost) || 0,
        registration_link: editLink.trim(),
        type: editType,
        location: editType === "digital" ? "Digital" : editLocation.trim() || null,
        photo_url: photoUrl,
      }).eq("id", event.id);
      if (error) throw error;
      toast({ title: "Event updated!" });
      setEditOpen(false);
      setPhotoFile(null);
      onDelete?.(); // reuse callback to refetch
    } catch (err: any) {
      toast({ title: "Error updating event", description: err.message, variant: "destructive" });
    } finally {
      setEditLoading(false);
    }
  };

  const timeDisplay = formatMultiZone(event.date, (event as any).end_date);

  return (
    <>
      <a
        href={event.registration_link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-events-card relative"
      >
        {/* Admin buttons */}
        {isAdmin && (
          <div className="absolute top-3 right-3 z-10 flex gap-1.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const shareUrl = `https://qpnzjcbdtybwazceggmv.supabase.co/functions/v1/og-meta?path=/e/${event.id}`;
                navigator.clipboard.writeText(shareUrl);
                toast({ title: "Share link copied!", description: "Use this link on social media for the event preview image." });
              }}
              className="bg-black/60 hover:bg-events-coral text-events-cream p-2 rounded-full transition-colors"
              title="Copy social share link"
            >
              <Link2 size={16} />
            </button>
            <button
              onClick={handleEditOpen}
              className="bg-black/60 hover:bg-events-coral text-events-cream p-2 rounded-full transition-colors"
              title="Edit event"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-black/60 hover:bg-red-600 text-events-cream p-2 rounded-full transition-colors"
              title="Delete event"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        {/* Image area */}
        <div className="relative h-52 overflow-hidden">
          {event.photo_url ? (
            <img
              src={event.photo_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-events-teal to-events-card flex items-center justify-center">
              <span className="text-events-cream/30 font-display text-2xl">Basecamp</span>
            </div>
          )}

          {/* Date badge */}
          <div className="absolute top-3 left-3 bg-events-yellow text-events-teal rounded-lg px-3 py-2 text-center leading-none shadow-lg">
            <span className="block text-2xl font-bold font-display">{day}</span>
            <span className="block text-xs font-semibold tracking-wider">{month}</span>
            <span className="block text-[10px] opacity-80">{year}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display text-events-cream text-lg font-semibold mb-1 group-hover:text-events-coral transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="text-events-cream/50 text-sm mb-1">
            {event.location || "Digital"}
          </p>
          <p className="text-events-cream/40 text-xs mb-4 leading-relaxed">
            {timeDisplay}
          </p>
          <div className="inline-block bg-events-coral text-events-teal font-semibold text-sm px-5 py-2.5 rounded-full hover:brightness-110 transition-all">
            {isFree ? "Register Free" : `Register $${event.cost}`}
          </div>
        </div>
      </a>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-events-teal border-events-cream/20 text-events-cream max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-events-cream text-xl">Edit Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
            <div>
              <Label className="text-events-cream/80">Event Title *</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="bg-events-card border-events-cream/20 text-events-cream" required />
            </div>
            <div>
              <Label className="text-events-cream/80">Start Time (Pacific) *</Label>
              <Input type="datetime-local" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="bg-events-card border-events-cream/20 text-events-cream" required />
            </div>
            <div>
              <Label className="text-events-cream/80">End Time (Pacific)</Label>
              <Input type="datetime-local" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} className="bg-events-card border-events-cream/20 text-events-cream" />
            </div>
            <div>
              <Label className="text-events-cream/80">Cost (0 for free)</Label>
              <Input type="number" min="0" step="0.01" value={editCost} onChange={(e) => setEditCost(e.target.value)} className="bg-events-card border-events-cream/20 text-events-cream" />
            </div>
            <div>
              <Label className="text-events-cream/80">Registration Link *</Label>
              <Input type="url" value={editLink} onChange={(e) => setEditLink(e.target.value)} className="bg-events-card border-events-cream/20 text-events-cream" required />
            </div>
            <div>
              <Label className="text-events-cream/80">Type *</Label>
              <div className="flex gap-2 mt-1">
                {(["in-person", "digital", "workshop"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setEditType(t)} className={`px-3 py-1.5 rounded-full text-sm transition-all ${editType === t ? "bg-events-coral text-events-teal" : "bg-events-card text-events-cream/70 border border-events-cream/10"}`}>
                    {t === "in-person" ? "In-Person" : t === "digital" ? "Digital" : "Workshop"}
                  </button>
                ))}
              </div>
            </div>
            {editType !== "digital" && (
              <div>
                <Label className="text-events-cream/80">Location</Label>
                <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="bg-events-card border-events-cream/20 text-events-cream" />
              </div>
            )}
            <div>
              <Label className="text-events-cream/80">Event Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                className="bg-events-card border-events-cream/20 text-events-cream"
              />
              {event.photo_url && !photoFile && (
                <img src={event.photo_url} alt="Current" className="mt-2 h-20 rounded-lg object-cover" />
              )}
            </div>
            <Button type="submit" disabled={editLoading} className="w-full bg-events-coral text-events-teal font-bold hover:brightness-110 rounded-full">
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;
