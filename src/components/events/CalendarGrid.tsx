import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface CalendarGridProps {
  events: Tables<"events">[];
}

const CalendarGrid = ({ events }: CalendarGridProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredEvent, setHoveredEvent] = useState<Tables<"events"> | null>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

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

  const dotColors = ["bg-events-coral", "bg-events-yellow", "bg-green-400"];

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

              {/* Event dots */}
              {dayEvents.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {dayEvents.map((ev, j) => (
                    <div
                      key={ev.id}
                      className="relative"
                      onMouseEnter={(e) => {
                        setHoveredEvent(ev);
                        setHoverPos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => setHoveredEvent(null)}
                    >
                      <a
                        href={ev.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block w-3 h-3 rounded-full ${dotColors[j % dotColors.length]} hover:scale-125 transition-transform cursor-pointer`}
                        title={ev.title}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hover card */}
      {hoveredEvent && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: hoverPos.x + 12, top: hoverPos.y - 60 }}
        >
          <div className="bg-events-card border border-events-cream/20 rounded-xl p-4 shadow-xl min-w-[240px]">
            {hoveredEvent.photo_url && (
              <img
                src={hoveredEvent.photo_url}
                alt={hoveredEvent.title}
                className="w-full h-28 object-cover rounded-lg mb-3"
              />
            )}
            <h4 className="font-display text-events-cream font-semibold text-sm">
              {hoveredEvent.title}
            </h4>
            <p className="text-events-cream/50 text-xs mt-1">
              {format(new Date(hoveredEvent.date), "MMM d, yyyy · h:mm a")}
            </p>
            <p className="text-events-cream/50 text-xs">
              {hoveredEvent.location || "Digital"}
            </p>
            <span className="inline-block mt-2 bg-events-coral text-events-teal text-xs font-semibold px-3 py-1 rounded-full">
              {!hoveredEvent.cost || hoveredEvent.cost === 0 ? "Free" : `$${hoveredEvent.cost}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;
