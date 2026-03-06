import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

interface EventCardProps {
  event: Tables<"events">;
}

const EventCard = ({ event }: EventCardProps) => {
  const eventDate = new Date(event.date);
  const day = format(eventDate, "dd");
  const month = format(eventDate, "MMM").toUpperCase();
  const year = format(eventDate, "yyyy");
  const isFree = !event.cost || event.cost === 0;

  return (
    <a
      href={event.registration_link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-events-card"
    >
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
        <p className="text-events-cream/50 text-sm mb-4">
          {event.location || "Digital"}
        </p>
        <div className="inline-block bg-events-coral text-events-teal font-semibold text-sm px-5 py-2.5 rounded-full hover:brightness-110 transition-all">
          {isFree ? "Register Free" : `Register $${event.cost}`}
        </div>
      </div>
    </a>
  );
};

export default EventCard;
