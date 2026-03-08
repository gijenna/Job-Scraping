import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Expert, ExpertCity } from "@/lib/expert-types";
import ExpertIntakeForm from "@/components/experts/ExpertIntakeForm";
import LeafConfetti from "@/components/experts/LeafConfetti";
import QuestionDialog from "@/components/experts/QuestionDialog";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, CalendarDays, ArrowRight, HelpCircle, Sparkles } from "lucide-react";
import basecampLogo from "@/assets/basecamp-outdoor-logo.png";

interface ExpertInviteProps {
  citySlug: string;
}

const ExpertInvite = ({ citySlug }: ExpertInviteProps) => {
  const { name } = useParams();
  const [city, setCity] = useState<ExpertCity | null>(null);
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [returning, setReturning] = useState(false);
  const [lookupName, setLookupName] = useState("");

  useEffect(() => {
    loadData();
  }, [citySlug, name]);

  const loadData = async () => {
    setLoading(true);

    // Fetch city
    const { data: cityData } = await supabase
      .from('expert_cities')
      .select('*')
      .eq('slug', citySlug)
      .single();

    if (cityData) setCity(cityData as unknown as ExpertCity);

    // If personalized URL, find expert by slug
    if (name) {
      const { data: expertData } = await supabase
        .from('industry_experts')
        .select('*')
        .eq('slug', name)
        .single();

      if (expertData) {
        setExpert(expertData as unknown as Expert);

        // Update status to viewed if still invited
        if (expertData.status === 'invited') {
          await supabase
            .from('industry_experts')
            .update({ status: 'viewed' })
            .eq('id', expertData.id);
        }
      }
    }

    setLoading(false);
  };

  const handleImIn = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowForm(true);
    }, 800);
    setTimeout(() => setShowConfetti(false), 4500);

    // Update status to started
    if (expert?.id) {
      supabase
        .from('industry_experts')
        .update({ status: 'started' })
        .eq('id', expert.id);
    }
  };

  const handleNameLookup = async () => {
    if (!lookupName.trim()) return;

    // Try case-insensitive name match first
    const { data } = await supabase
      .from('industry_experts')
      .select('*')
      .ilike('full_name', lookupName.trim())
      .maybeSingle();

    if (data) {
      setExpert(data as unknown as Expert);
      setReturning(false);
      setShowForm(true);
    } else {
      // Also try slug match as fallback
      const slug = lookupName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const { data: slugMatch } = await supabase
        .from('industry_experts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (slugMatch) {
        setExpert(slugMatch as unknown as Expert);
        setReturning(false);
        setShowForm(true);
      } else {
        // Not found — just show the form with no existing data (they'll create on save)
        setReturning(false);
        setShowForm(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-events-teal flex items-center justify-center">
        <p className="text-events-cream/40">Loading...</p>
      </div>
    );
  }

  const cityName = city?.name || 'Your City';
  const eventTitle = city?.event_title || 'GATHER';

  return (
    <div className="min-h-screen bg-events-teal">
      <LeafConfetti active={showConfetti} />

      {/* Header */}
      <div className="border-b border-events-cream/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={basecampLogo} alt="Basecamp Outdoor" className="h-10" />
          <span className="text-events-cream/40 text-xs font-display uppercase tracking-widest">{eventTitle}</span>
        </div>
      </div>

      {!showForm ? (
        /* Hero / Pitch Section */
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6">
            {/* Personalized greeting */}
            {expert ? (
              <h1 className="font-display text-4xl md:text-6xl font-bold text-events-cream leading-tight">
                <span className="text-events-coral">{expert.full_name.split(' ')[0]}</span>, we want you at
                <br />
                <span className="text-events-yellow">{eventTitle}</span>
              </h1>
            ) : (
              <h1 className="font-display text-4xl md:text-6xl font-bold text-events-cream leading-tight">
                Become an <span className="text-events-coral">Industry Expert</span> at
                <br />
                <span className="text-events-yellow">{eventTitle}</span>
              </h1>
            )}

            <p className="text-events-cream/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We're inviting tenured leaders with inspiring careers to be <strong className="text-events-cream">on-the-spot mentors</strong> for 
              our community. Instead of a nametag, you'll get a dedicated <strong className="text-events-cream">Industry Expert card</strong> showcasing 
              your career — attendees will seek you out for meaningful conversations.
            </p>

            {/* Event details */}
            {city && (
              <div className="flex flex-wrap justify-center gap-4 py-4">
                {city.event_location && (
                  <div className="flex items-center gap-2 text-events-cream/60">
                    <MapPin className="w-4 h-4 text-events-coral" />
                    <span>{city.event_location}</span>
                  </div>
                )}
                {city.event_time_details && (
                  <div className="flex items-center gap-2 text-events-cream/60">
                    <Clock className="w-4 h-4 text-events-coral" />
                    <span>{city.event_time_details}</span>
                  </div>
                )}
                {city.arrival_time && (
                  <div className="flex items-center gap-2 text-events-cream/60">
                    <CalendarDays className="w-4 h-4 text-events-coral" />
                    <span>Arrive by {city.arrival_time}</span>
                  </div>
                )}
              </div>
            )}

            <p className="text-events-cream/40 text-sm">
              Details like parking and logistics will be emailed to the address you provide.
            </p>

            {/* What you'll do */}
            <div className="bg-events-card/50 rounded-xl border border-events-cream/10 p-6 md:p-8 text-left max-w-xl mx-auto mt-8">
              <h3 className="font-display text-lg text-events-yellow font-semibold mb-4">What does an Industry Expert do?</h3>
              <ul className="space-y-3 text-events-cream/70 text-sm">
                <li className="flex gap-3">
                  <Sparkles className="w-4 h-4 text-events-coral shrink-0 mt-0.5" />
                  Be in a special <strong className="text-events-cream">Industry Expert area</strong> so attendees can find you easily
                </li>
                <li className="flex gap-3">
                  <Sparkles className="w-4 h-4 text-events-coral shrink-0 mt-0.5" />
                  Your card will be <strong className="text-events-cream">advertised on our website</strong> before the event
                </li>
                <li className="flex gap-3">
                  <Sparkles className="w-4 h-4 text-events-coral shrink-0 mt-0.5" />
                  Attendees will <strong className="text-events-cream">prepare conversations</strong> — no awkward cold intros
                </li>
                <li className="flex gap-3">
                  <Sparkles className="w-4 h-4 text-events-coral shrink-0 mt-0.5" />
                  Share your career wisdom and <strong className="text-events-cream">give back to the community</strong>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button
                onClick={handleImIn}
                className="bg-events-coral hover:bg-events-coral/90 text-events-cream font-display font-bold text-xl px-10 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                I'm In <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => setShowQuestions(true)}
                variant="outline"
                className="border-events-cream/20 text-events-cream hover:bg-events-card font-display px-8 py-6"
              >
                <HelpCircle className="w-4 h-4 mr-2" /> I have questions first
              </Button>
            </div>

            {/* Return visitor option (non-personalized) */}
            {!expert && !returning && (
              <button
                onClick={() => setReturning(true)}
                className="text-events-cream/30 hover:text-events-cream/60 text-xs mt-6 transition-colors"
              >
                Been here before? Click to look up your card
              </button>
            )}

            {returning && (
              <div className="flex items-center gap-2 max-w-xs mx-auto mt-4">
                <input
                  value={lookupName}
                  onChange={e => setLookupName(e.target.value)}
                  placeholder="Enter your full name"
                  className="flex-1 px-3 py-2 rounded-md bg-events-card border border-events-cream/20 text-events-cream text-sm placeholder:text-events-cream/30"
                  onKeyDown={e => e.key === 'Enter' && handleNameLookup()}
                />
                <Button size="sm" onClick={handleNameLookup} className="bg-events-coral hover:bg-events-coral/90 text-events-cream">
                  Go
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Intake Form */
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-events-cream">
              Build your <span className="text-events-coral">Industry Expert</span> card
            </h2>
            <p className="text-events-cream/50 mt-2">
              The more details you add, the better your card looks. Fill out what you can now — 
              <strong className="text-events-cream/70"> return anytime to edit your card</strong>.
            </p>
          </div>
          <ExpertIntakeForm
            expertId={expert?.id}
            existingData={expert || undefined}
            citySlug={citySlug}
            cityName={cityName}
            onComplete={() => loadData()}
          />
        </div>
      )}

      <QuestionDialog
        open={showQuestions}
        onOpenChange={setShowQuestions}
        expertName={expert?.full_name || ''}
        citySlug={citySlug}
        expertId={expert?.id}
      />
    </div>
  );
};

export default ExpertInvite;
