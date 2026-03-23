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
import SiteFooter from "@/components/SiteFooter";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import PageMetaEditor from "@/components/event/PageMetaEditor";
import { usePageMeta } from "@/hooks/usePageMeta";

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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });
    return () => subscription.unsubscribe();
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
    <EditableTextProvider pageSlug="events">
      <PageMetaApplier title="Basecamp Events" />
      <div className="min-h-screen bg-events-cream">
        <PageMetaEditor />
        <EventsNav
          onFilterSelect={handleFilterSelect}
          onScrollToPartner={handleScrollToPartner}
        />

        <EventsHero />

        {/* Newsletter CTA - after hero */}
        <div className="bg-events-coral py-6 px-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-display text-events-teal font-bold text-lg md:text-xl text-center sm:text-left">
              <EditableText settingKey="newsletter_cta_text" defaultText="Stay in the loop — sign up for events & our weekly newsletter" as="span" />
            </p>
            <a
              href="https://basecampoutdoor.typeform.com/Basecamp"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-events-teal text-events-cream font-display font-bold text-sm hover:brightness-110 transition-all shadow-md"
            >
              Sign Up →
            </a>
          </div>
        </div>

        {/* Events section */}
        <div ref={eventsRef} className="bg-events-cream py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <h2 className="font-display text-events-teal text-2xl md:text-3xl font-bold">
                <EditableText settingKey="events_section_title" defaultText="View all upcoming events" as="span" />
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

            <div className="mb-8">
              <EventFilters activeFilter={filter} onFilterChange={setFilter} />
            </div>

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
                  <EventCard key={event.id} event={event} isAdmin={isAdmin} onDelete={fetchEvents} />
                ))}
              </div>
            )}
          </div>
        </div>

        <EventsTicker />

        <div ref={partnerRef}>
          <PartnerSection />
        </div>

        {/* Newsletter CTA - before footer */}
        <div className="bg-events-teal py-12 px-6 border-t border-events-cream/10">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-display text-events-cream text-2xl md:text-3xl font-bold mb-3">
              <EditableText settingKey="footer_cta_headline" defaultText="Don't miss what's next" as="span" />
            </h3>
            <p className="text-events-cream/60 font-body mb-6">
              <EditableText settingKey="footer_cta_subtitle" defaultText="Get event announcements, industry insights, and career tips delivered weekly." as="span" />
            </p>
            <a
              href="https://basecampoutdoor.typeform.com/Basecamp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-events-coral text-events-teal font-display font-bold text-base hover:brightness-110 transition-all shadow-lg"
            >
              Subscribe to the Newsletter →
            </a>
          </div>
        </div>

        <SiteFooter />
      </div>
    </EditableTextProvider>
  );
};

export default Events;
