import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import EventsNav from "@/components/events/EventsNav";
import EventsHero from "@/components/events/EventsHero";
import EventCard from "@/components/events/EventCard";
import EventFilters from "@/components/events/EventFilters";
import EventsTicker from "@/components/events/EventsTicker";
import PartnerSection from "@/components/events/PartnerSection";
import AddEventDialog from "@/components/events/AddEventDialog";
import { CalendarDays } from "lucide-react";

const Events = () => {
  const [events, setEvents] = useState<Tables<"events">[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const eventsRef = useRef<HTMLDivElement>(null);
  const partnerRef = useRef<HTMLDivElement>(null);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .gte("date", new Date().toISOString())
      .order("date", { ascending: true });
    setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
    // Check if user is authenticated (admin)
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session);
    });
  }, []);

  const handleFilterSelect = (f: string) => {
    setFilter(f);
    eventsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToPartner = () => {
    partnerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredEvents = events.filter((e) => {
    if (filter === "all") return true;
    if (filter === "free") return !e.cost || e.cost === 0;
    return e.type === filter;
  });

  return (
    <div className="min-h-screen bg-events-cream">
      <EventsNav
        onFilterSelect={handleFilterSelect}
        onScrollToPartner={handleScrollToPartner}
      />

      <EventsHero />

      {/* Events section */}
      <div ref={eventsRef} className="bg-events-cream py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h2 className="font-display text-events-teal text-2xl md:text-3xl font-bold">
              View all upcoming events
            </h2>
            <div className="flex items-center gap-4">
              {isAdmin && <AddEventDialog onEventAdded={fetchEvents} />}
              <Link
                to="/calendar"
                className="flex items-center gap-2 text-events-teal hover:text-events-coral transition-colors font-medium"
              >
                <CalendarDays size={20} />
                View Event Calendar
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <EventFilters activeFilter={filter} onFilterChange={setFilter} />
          </div>

          {/* Event cards grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-xl bg-events-teal/10 animate-pulse" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-events-teal/60 text-lg">No upcoming events match this filter.</p>
              <p className="text-events-teal/40 text-sm mt-2">Check back soon or try a different filter!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>

      <EventsTicker />

      <div ref={partnerRef}>
        <PartnerSection />
      </div>
    </div>
  );
};

export default Events;
