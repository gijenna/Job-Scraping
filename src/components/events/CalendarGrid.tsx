import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface CalendarGridProps {
  events: Tables<"events">[];
}

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

const CalendarGrid = ({ events }: CalendarGridProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Tables<"events"> | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days = useMemo(() => {
    const result: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      result.push(day);
      day = addDays(day, 1);
    }
    return result;
  }, [currentMonth]);

  const eventsOnDay = (day: Date) =>
    events.filter((e) => isSameDay(new Date(e.date), day));

  const pillColors = ["bg-events-coral", "bg-events-yellow", "bg-green-400"];

  const handleEventClick = useCallback((ev: Tables<"events">, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedEvent?.id === ev.id) {
      setSelectedEvent(null);
      setPopupPos(null);
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // On mobile, show centered at bottom
    if (vw < 768) {
      setPopupPos(null); // Will use fixed bottom sheet style
    } else {
      let left = rect.left + rect.width / 2;
      let top = rect.bottom + 8;
      // Clamp to viewport
      if (left + 140 > vw) left = vw - 160;
      if (left - 140 < 0) left = 160;
      if (top + 250 > vh) top = rect.top - 260;
      setPopupPos({ top, left });
    }

    setSelectedEvent(ev);
  }, [selectedEvent]);

  // Close popup on outside click
  useEffect(() => {
    if (!selectedEvent) return;
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setSelectedEvent(null);
        setPopupPos(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedEvent]);

  const renderPopup = () => {
    if (!selectedEvent) return null;

    const ptOff = getPTOffset(selectedEvent.date);
    const endDate = (selectedEvent as any).end_date;
    let timeStr: string;
    if (endDate) {
      timeStr = `${formatTimeInZone(selectedEvent.date, ptOff)}–${formatTimeInZone(endDate, ptOff)} PT`;
    } else {
      timeStr = `${formatTimeInZone(selectedEvent.date, ptOff)} PT`;
    }

    const content = (
      <div ref={popupRef} className="bg-events-card border border-events-cream/20 rounded-xl p-4 shadow-xl w-[280px]">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-display text-events-cream font-semibold text-sm flex-1 pr-2">
            {selectedEvent.title}
          </h4>
          <button onClick={() => { setSelectedEvent(null); setPopupPos(null); }} className="text-events-cream/50 hover:text-events-cream">
            <X size={16} />
          </button>
        </div>
        {selectedEvent.photo_url && (
          <img
            src={selectedEvent.photo_url}
            alt={selectedEvent.title}
            className="w-full h-28 object-cover rounded-lg mb-3"
          />
        )}
        <p className="text-events-cream/50 text-xs mt-1">
          {format(new Date(selectedEvent.date), "MMM d, yyyy")} · {timeStr}
        </p>
        <p className="text-events-cream/50 text-xs">
          {selectedEvent.location || "Digital"}
        </p>
        <a
          href={selectedEvent.registration_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 bg-events-coral text-events-teal text-xs font-semibold px-4 py-2 rounded-full hover:brightness-110 transition-all"
        >
          {!selectedEvent.cost || selectedEvent.cost === 0 ? "Register Free" : `Register $${selectedEvent.cost}`}
        </a>
      </div>
    );

    // Mobile: bottom sheet
    if (!popupPos) {
      return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 md:hidden">
          {content}
        </div>
      );
    }

    // Desktop: positioned popup
    return (
      <div
        className="fixed z-50 hidden md:block"
        style={{ left: popupPos.left, top: popupPos.top, transform: "translateX(-50%)" }}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Month header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-events-cream/70 hover:text-events-coral transition-colors p-2"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-display text-events-cream text-2xl md:text-3xl font-bold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-events-cream/70 hover:text-events-coral transition-colors p-2"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-events-cream/50 text-sm font-medium py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-events-cream/5 rounded-xl overflow-hidden">
        {days.map((day, i) => {
          const dayEvents = eventsOnDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={i}
              className={`relative min-h-[80px] md:min-h-[100px] p-2 transition-colors ${
                isCurrentMonth ? "bg-events-teal" : "bg-events-teal/50"
              } ${isToday ? "ring-1 ring-events-coral" : ""}`}
            >
              <span
                className={`text-sm ${
                  isCurrentMonth ? "text-events-cream" : "text-events-cream/30"
                } ${isToday ? "text-events-coral font-bold" : ""}`}
              >
                {format(day, "d")}
              </span>

              {/* Event pills */}
              {dayEvents.length > 0 && (
                <div className="flex flex-col gap-1 mt-1">
                  {dayEvents.map((ev, j) => (
                    <button
                      key={ev.id}
                      onClick={(e) => handleEventClick(ev, e)}
                      className={`${pillColors[j % pillColors.length]} text-events-teal text-[10px] md:text-xs font-semibold rounded-full px-1.5 py-0.5 truncate text-left hover:brightness-110 transition-all cursor-pointer max-w-full`}
                      title={ev.title}
                    >
                      <span className="hidden md:inline">{ev.title.length > 12 ? ev.title.slice(0, 12) + "…" : ev.title}</span>
                      <span className="md:hidden">•</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {renderPopup()}
    </div>
  );
};

export default CalendarGrid;
