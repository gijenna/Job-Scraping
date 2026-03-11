import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import EventsNav from "@/components/events/EventsNav";
import CalendarGrid from "@/components/events/CalendarGrid";
import AddEventDialog from "@/components/events/AddEventDialog";
import { ArrowLeft } from "lucide-react";

const EventCalendar = () => {
  const [events, setEvents] = useState<Tables<"events">[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });
    setEvents(data || []);
  };

  useEffect(() => {
    fetchEvents();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-events-teal">
      <EventsNav />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto mb-8">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-events-cream/60 hover:text-events-coral transition-colors text-sm mb-4"
          >
            <ArrowLeft size={16} /> Back to Events
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-events-cream text-3xl md:text-4xl font-bold">
              Event Calendar
            </h1>
            <AddEventDialog onEventAdded={fetchEvents} />
          </div>
        </div>
        <CalendarGrid events={events} />
      </div>
    </div>
  );
};

export default EventCalendar;
