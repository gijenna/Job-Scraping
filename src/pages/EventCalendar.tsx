import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import EventsNav from "@/components/events/EventsNav";
import CalendarGrid from "@/components/events/CalendarGrid";
import AddEventDialog from "@/components/events/AddEventDialog";

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
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session);
    });
  }, []);

  return (
    <div className="min-h-screen bg-events-teal">
      <EventsNav />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between">
          <h1 className="font-display text-events-cream text-3xl md:text-4xl font-bold">
            Event Calendar
          </h1>
          {isAdmin && <AddEventDialog onEventAdded={fetchEvents} />}
        </div>
        <CalendarGrid events={events} />
      </div>
    </div>
  );
};

export default EventCalendar;
