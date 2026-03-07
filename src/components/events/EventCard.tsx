import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Convert a UTC date to a specific US timezone offset and format time
const formatTimeInZone = (dateStr: string, offsetHours: number) => {
  const d = new Date(dateStr);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const zoned = new Date(utc + offsetHours * 3600000);
  return format(zoned, "h:mm a");
};

// PT offset: -7 (PDT Mar-Nov), -8 (PST Nov-Mar)
const getPTOffset = (dateStr: string) => {
  const d = new Date(dateStr);
  const year = d.getUTCFullYear();
  // Approximate DST: second Sunday of March to first Sunday of November
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

  const timeDisplay = formatMultiZone(event.date, (event as any).end_date);

  return (
    <a
      href={event.registration_link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-events-card relative"
    >
      {/* Admin delete button */}
      {isAdmin && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-red-600 text-events-cream p-2 rounded-full transition-colors"
          title="Delete event"
        >
          <Trash2 size={16} />
        </button>
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
  );
};

export default EventCard;
