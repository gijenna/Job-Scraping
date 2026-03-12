import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Expert, ExpertCity } from "@/lib/expert-types";
import ExpertIntakeForm from "@/components/experts/ExpertIntakeForm";
import { ExpertQuestion } from "@/lib/expert-types";
import LeafConfetti from "@/components/experts/LeafConfetti";
import QuestionDialog from "@/components/experts/QuestionDialog";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, CalendarDays, ArrowRight, HelpCircle, Sparkles, Users, MessageSquare, Star, ChevronDown } from "lucide-react";
import basecampLogo from "@/assets/basecamp-outdoor-logo.png";
import heroDenver from "@/assets/hero-denver.mp4";
import heroPortland from "@/assets/hero-portland.jpg";
import heroMinneapolis from "@/assets/hero-minneapolis.jpg";

interface ExpertInviteProps {
  citySlug: string;
}

const CITY_HEROES: Record<string, { image?: string; video?: string }> = {
  denver: { video: heroDenver },
  portland: { image: heroPortland },
  minneapolis: { image: heroMinneapolis },
};

const CITY_EVENT_DATA: Record<string, {
  tagline: string;
  yearNote: string;
  attendance: string;
  attendanceNote: string;
  venue: string;
  venueMapUrl: string;
  time: string;
  whoAttends: string[];
  format: string[];
  companies: string[];
}> = {
  denver: {
    tagline: 'Basecamp × Outside Days Festival',
    yearNote: '3rd year with Outside Inc — named top activation 2024 & 2025',
    attendance: '500–800',
    attendanceNote: 'career event · 40,000+ at full festival',
    venue: 'Auraria Campus Wellness Center, Denver, CO',
    venueMapUrl: 'https://www.google.com/maps/search/?api=1&query=Auraria+Campus+Wellness+Center+Denver+CO',
    time: '1–4 PM MT',
    whoAttends: [
      'Strong presence of passive experts — not actively searching but networking',
      'Outdoor-oriented talent applying skills at mission-aligned companies',
      'Heavily product, design, creative, and corporate roles',
      'Professionals from VF brands, Yeti, REI, and more',
    ],
    format: [
      'Employer tables with 5–10 min recruiter conversations',
      'Industry Expert / Mentor Zone (that\'s you!)',
      'VIP hour for underrepresented communities (200 candidates)',
      'Full festival access — Death Cab headlining Friday night',
    ],
    companies: [
      'REI', 'Patagonia', 'The North Face', 'Cotopaxi', 'Black Diamond',
      'Vail Resorts', 'Smartwool', 'Nike', 'Google', 'Apple', 'KPMG',
      'Amazon', 'Backbone Media', 'Outside Inc', 'Yeti',
    ],
  },
  portland: {
    tagline: 'Basecamp × University of Oregon Portland',
    yearNote: '5th annual — proven format, growing every year',
    attendance: '300+',
    attendanceNote: 'fresh grads, tenured leaders & industry-curious',
    venue: 'UO Portland Campus — 2800 NE Liberty St, Portland',
    venueMapUrl: 'https://www.google.com/maps/search/?api=1&query=2800+NE+Liberty+St+Portland+OR',
    time: '5:30–8:30 PM PT',
    whoAttends: [
      'UO Sports Product Management grads — elite & diverse cohort',
      'Tenured outdoor industry leaders open to new possibilities',
      'Mid-career experts from tech, healthcare & sport pivoting into outdoor',
      'Active job seekers in the current market',
    ],
    format: [
      'Employer tables with 5–10 min recruiter conversations',
      'Industry Expert / Mentor Zone (that\'s you!)',
      '"How I Broke In" panel — tactical career tips from real leaders',
      'Free food & drinks for all attendees',
    ],
    companies: [
      'Rumpl', 'On Running', 'Arc\'teryx', 'Cotopaxi', 'Brooks',
      'Specialized', 'Superfeet', 'Rivian', 'Columbia', 'Nike',
      'Adidas', 'REI', 'KEEN', 'Popfly', 'Oregon Outdoor Alliance',
    ],
  },
  minneapolis: {
    tagline: 'Basecamp Outdoor — Minneapolis',
    yearNote: 'New market launch — expanding the Gather community',
    attendance: '200+',
    attendanceNote: 'intimate, curated audience',
    venue: 'Minneapolis, MN',
    venueMapUrl: 'https://www.google.com/maps/search/?api=1&query=Minneapolis+MN',
    time: 'TBD',
    whoAttends: [
      'Active job seekers in the outdoor & active lifestyle space',
      'Mid-career professionals from Midwest outdoor brands',
      'Students from regional outdoor programs',
      'Career transitioners with transferable skills',
    ],
    format: [
      'Employer tables with 5–10 min recruiter conversations',
      'Industry Expert / Mentor Zone (that\'s you!)',
      '"How I Broke In" panel — career tactics from real leaders',
      'Networking reception with light snacks & drinks',
    ],
    companies: [
      'REI', 'Patagonia', 'The North Face', 'Columbia', 'Nike',
      'Adidas', 'On Running', 'Lululemon', 'Cotopaxi', 'Garmin',
      'VF Corporation', 'KEEN',
    ],
  },
};

const ExpertInvite = ({ citySlug }: ExpertInviteProps) => {
  const { name } = useParams();
  const [city, setCity] = useState<ExpertCity | null>(null);
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [faqs, setFaqs] = useState<ExpertQuestion[]>([]);
  const [returning, setReturning] = useState(false);
  const [lookupName, setLookupName] = useState("");

  useEffect(() => {
    loadData();
  }, [citySlug, name]);

  const loadData = async () => {
    setLoading(true);
    const { data: cityData } = await supabase
      .from('expert_cities').select('*').eq('slug', citySlug).single();
    if (cityData) setCity(cityData as unknown as ExpertCity);

    if (name) {
      const { data: expertData } = await supabase
        .from('industry_experts').select('*').eq('slug', name).single();
      if (expertData) {
        setExpert(expertData as unknown as Expert);
        if (expertData.status === 'invited') {
          await supabase.from('industry_experts')
            .update({ status: 'viewed' }).eq('id', expertData.id);
        }
      }
    }
    // Load published FAQs for this city
    const { data: faqData } = await supabase
      .from('expert_questions').select('*')
      .eq('city_slug', citySlug).eq('show_in_faq', true)
      .order('created_at', { ascending: true });
    if (faqData) setFaqs(faqData as unknown as ExpertQuestion[]);
    setLoading(false);
  };

  const handleImIn = () => {
    setShowConfetti(true);
    setTimeout(() => setShowForm(true), 800);
    setTimeout(() => setShowConfetti(false), 4500);
    if (expert?.id) {
      supabase.from('industry_experts')
        .update({ status: 'started' }).eq('id', expert.id);
    }
  };

  const handleNameLookup = async () => {
    if (!lookupName.trim()) return;
    const { data } = await supabase
      .from('industry_experts').select('*')
      .ilike('full_name', lookupName.trim()).maybeSingle();
    if (data) {
      setExpert(data as unknown as Expert);
      setReturning(false);
      setShowForm(true);
    } else {
      const slug = lookupName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const { data: slugMatch } = await supabase
        .from('industry_experts').select('*').eq('slug', slug).maybeSingle();
      if (slugMatch) {
        setExpert(slugMatch as unknown as Expert);
        setReturning(false);
        setShowForm(true);
      } else {
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
  const firstName = expert?.full_name?.split(' ')[0] || '';
  const heroMedia = CITY_HEROES[citySlug];

  return (
    <div className="min-h-screen bg-events-teal">
      <LeafConfetti active={showConfetti} />

      {!showForm ? (
        <>
          {/* === HERO SECTION === */}
          <section className="relative min-h-screen flex flex-col">
            {/* Background */}
            <div className="absolute inset-0 z-0">
              {heroMedia?.video ? (
                <video
                  autoPlay muted loop playsInline
                  className="w-full h-full object-cover"
                  src={heroMedia.video}
                />
              ) : heroMedia?.image ? (
                <img src={heroMedia.image} alt="" className="w-full h-full object-cover" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-b from-events-teal/80 via-events-teal/60 to-events-teal" />
            </div>

            {/* Header */}
            <div className="relative z-10 border-b border-white/10">
              <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                <a href="https://www.wearetheoutdoorindustry.com" target="_blank" rel="noopener noreferrer">
                  <img src={basecampLogo} alt="Basecamp Outdoor" className="h-10" />
                </a>
                <span className="text-white/40 text-xs font-display uppercase tracking-widest">{eventTitle}</span>
              </div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 flex-1 flex items-center">
              <div className="max-w-5xl mx-auto px-4 py-16 w-full">
                <div className="grid md:grid-cols-[1fr_320px] gap-8 items-center">
                  {/* Left - Headline */}
                  <div>
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-[1.1]">
                      {expert ? (
                        <>
                          Hey <span className="text-events-coral underline decoration-events-coral/40 underline-offset-4">{firstName}</span>,
                          <br />
                          we'd love for you
                          <br />
                          to be an Industry
                          <br />
                          Expert.
                        </>
                      ) : (
                        <>
                          Become an
                          <br />
                          <span className="text-events-coral">Industry Expert</span>
                          <br />
                          at {eventTitle}.
                        </>
                      )}
                    </h1>

                    <p className="text-white/70 text-lg mt-6 max-w-lg leading-relaxed">
                      We're looking for respected voices in the outdoor industry to serve as{' '}
                      <strong className="text-white">Industry Experts</strong> at our upcoming {cityName} event.
                      You're exactly who our community wants to meet.
                    </p>

                    <div className="flex items-center gap-4 mt-8">
                      <Button
                        onClick={() => document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-white text-events-teal hover:bg-white/90 font-display font-bold text-base px-8 py-6 rounded-xl"
                      >
                        See What It Means <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <span className="text-white/40 text-sm">Join 20+ Industry Leaders</span>
                    </div>
                  </div>

                  {/* Right - Mini Card Preview (clickable) */}
                  <div className="hidden md:block">
                    <div
                      onClick={handleImIn}
                      className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl cursor-pointer hover:bg-white/15 hover:scale-[1.02] transition-all group"
                    >
                      <div className="w-24 h-24 rounded-full bg-events-teal mx-auto flex items-center justify-center border-2 border-white/20">
                        {expert?.photo_url ? (
                          <img src={expert.photo_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-white/60 font-display text-2xl font-bold">
                            {expert ? expert.full_name.split(' ').map(n => n[0]).join('') : '?'}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-bold text-white text-center mt-4">
                        {expert?.full_name || 'Your Name'}
                      </h3>
                      <p className="text-events-coral text-sm text-center font-medium">Industry Expert</p>
                      {expert?.job_title && (
                        <p className="text-white/50 text-xs text-center mt-1">{expert.job_title}</p>
                      )}
                      <p className="text-white/30 text-xs text-center mt-2 group-hover:text-events-coral transition-colors">
                        {expert ? 'Click to edit your card →' : 'Click to build your card →'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="relative z-10 text-center pb-8">
              <ChevronDown className="w-6 h-6 text-white/30 mx-auto animate-bounce" />
            </div>
          </section>

          {/* === THE PROBLEM SECTION === */}
          <section id="learn-more" className="bg-events-teal py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-events-cream text-center">
                The Problem with Networking
              </h2>
              <h3 className="text-events-yellow text-xl md:text-2xl font-display text-center mt-3">
                Nametags don't tell the whole story.
              </h3>
              <p className="text-events-cream/60 text-lg text-center mt-6 max-w-2xl mx-auto leading-relaxed">
                Typically, we connect attendees to brand recruiter teams. But this year, we want to elevate the experience
                by bringing in real leaders with cool careers and aspirational trajectories.
              </p>
              <p className="text-events-cream/70 text-lg text-center mt-4 max-w-2xl mx-auto leading-relaxed">
                Instead of expecting attendees to read a nametag and guess who is standing in front of them,
                we are spotlighting <strong className="text-events-coral">Industry Experts</strong>.
                You will be advertised on our website before the event so attendees can plan meaningful conversations with you.
              </p>

              {/* Feature cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="bg-events-card/60 rounded-xl border border-events-cream/10 p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-events-coral/20 flex items-center justify-center mx-auto">
                    <MapPin className="w-6 h-6 text-events-coral" />
                  </div>
                  <h4 className="font-display text-events-cream font-bold mt-4">Dedicated Space</h4>
                  <p className="text-events-cream/50 text-sm mt-2">
                    You'll have a designated "Industry Expert" area making you easily approachable.
                  </p>
                </div>
                <div className="bg-events-card/60 rounded-xl border border-events-cream/10 p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-events-yellow/20 flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-events-yellow" />
                  </div>
                  <h4 className="font-display text-events-cream font-bold mt-4">Guide the Next Gen</h4>
                  <p className="text-events-cream/50 text-sm mt-2">
                    Serve as an on-the-spot mentor for our passionate community of outdoor professionals.
                  </p>
                </div>
                <div className="bg-events-card/60 rounded-xl border border-events-cream/10 p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-events-coral/20 flex items-center justify-center mx-auto">
                    <Star className="w-6 h-6 text-events-coral" />
                  </div>
                  <h4 className="font-display text-events-cream font-bold mt-4">Be Spotlighted</h4>
                  <p className="text-events-cream/50 text-sm mt-2">
                    Your card is published on our site — attendees will prepare conversations in advance.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* === THE EVENT SECTION === */}
          {(() => {
            const eventData = CITY_EVENT_DATA[citySlug] || CITY_EVENT_DATA.denver;
            return (
              <section className="bg-events-cream py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4">
                  {/* Header */}
                  <div className="text-center mb-12">
                    <p className="text-events-coral font-display font-semibold text-sm uppercase tracking-widest">{eventData.tagline}</p>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-events-teal mt-3">
                      The Event
                    </h2>
                    <p className="text-events-teal/60 text-lg mt-3 max-w-xl mx-auto">Here's what you're signing up for.</p>
                  </div>

                  {/* Key Details Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {city?.event_date && (
                      <div className="bg-white rounded-xl p-5 shadow-sm border border-events-teal/10 text-center">
                        <CalendarDays className="w-6 h-6 text-events-coral mx-auto" />
                        <p className="text-events-teal font-display font-bold mt-3 text-lg">
                          {new Date(city.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                        </p>
                        <p className="text-events-teal/50 text-xs mt-1">
                          {new Date(city.event_date).toLocaleDateString('en-US', { year: 'numeric', timeZone: 'UTC' })}
                        </p>
                      </div>
                    )}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-events-teal/10 text-center">
                      <Clock className="w-6 h-6 text-events-coral mx-auto" />
                      <p className="text-events-teal font-display font-bold mt-3 text-lg">{eventData.time}</p>
                      <p className="text-events-teal/50 text-xs mt-1">Event hours</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-events-teal/10 text-center">
                      <Users className="w-6 h-6 text-events-coral mx-auto" />
                      <p className="text-events-teal font-display font-bold mt-3 text-lg">{eventData.attendance}</p>
                      <p className="text-events-teal/50 text-xs mt-1">{eventData.attendanceNote}</p>
                    </div>
                     <a href={eventData.venueMapUrl} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-5 shadow-sm border border-events-teal/10 text-center hover:shadow-md hover:border-events-coral/30 transition-all cursor-pointer group">
                       <MapPin className="w-6 h-6 text-events-coral mx-auto" />
                       <p className="text-events-teal font-display font-bold mt-3 text-sm leading-tight group-hover:text-events-coral transition-colors">{eventData.venue}</p>
                       <p className="text-events-teal/40 text-xs mt-1 group-hover:text-events-coral/60 transition-colors">View on map ↗</p>
                     </a>
                  </div>

                  {/* Year Note Banner */}
                  <div className="bg-events-teal rounded-xl px-6 py-4 mb-10 text-center">
                    <p className="text-events-cream font-display font-medium text-sm">
                      <Sparkles className="w-4 h-4 inline mr-2 text-events-yellow" />
                      {eventData.yearNote}
                    </p>
                  </div>

                  {/* Two Column: Who Attends + Format */}
                  <div className="grid md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-events-teal/10">
                      <h4 className="text-events-coral font-display font-bold text-sm uppercase tracking-wider mb-4">Who Attends</h4>
                      <ul className="space-y-3">
                        {eventData.whoAttends.map((item, i) => (
                          <li key={i} className="flex gap-3 text-events-teal/80 text-sm">
                            <span className="text-events-coral font-bold mt-0.5">›</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-events-teal/10">
                      <h4 className="text-events-coral font-display font-bold text-sm uppercase tracking-wider mb-4">Event Format</h4>
                      <ul className="space-y-3">
                        {eventData.format.map((item, i) => (
                          <li key={i} className="flex gap-3 text-events-teal/80 text-sm">
                            <span className="text-events-coral font-bold mt-0.5">›</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Companies */}
                  <div className="text-center">
                    <p className="text-events-teal/40 text-xs uppercase tracking-widest font-display mb-4">Companies Represented In The Room</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {eventData.companies.map((company) => (
                        <span key={company} className="bg-events-teal/5 text-events-teal/70 text-xs px-4 py-2 rounded-full border border-events-teal/10 font-medium">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* === FAQ SECTION === */}
          {faqs.length > 0 && (
            <section className="bg-events-teal py-16 md:py-20">
              <div className="max-w-3xl mx-auto px-4">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-events-cream text-center">
                  <MessageSquare className="w-6 h-6 inline-block mr-2 text-events-coral" />
                  Frequently Asked Questions
                </h2>
                <p className="text-events-cream/40 text-center mt-2 text-sm">From people just like you</p>
                <div className="mt-8 space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="bg-events-card/60 rounded-xl border border-events-cream/10 p-6">
                      <p className="text-events-cream font-medium">{faq.question_text}</p>
                      {faq.admin_answer && (
                        <p className="text-events-cream/60 text-sm mt-3 pl-4 border-l-2 border-events-coral/40">
                          {faq.admin_answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="relative py-16 md:py-24">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
              {heroMedia?.image && <img src={heroMedia.image} alt="" className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-events-teal/85" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-events-cream leading-tight">
                So, {expert ? <span className="text-events-coral">{expert.full_name}</span> : 'friend'}...
                <br />are you in?
              </h2>
              <p className="text-events-cream/60 text-lg mt-4 max-w-xl mx-auto">
                We'd be honored to feature your career journey and have you mentor
                the Basecamp {cityName} community.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Button
                  onClick={handleImIn}
                  className="bg-events-coral hover:bg-events-coral/90 text-white font-display font-bold text-xl px-10 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  I'm In! Let's Do This <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={() => setShowQuestions(true)}
                  variant="outline"
                  className="border-events-cream/20 text-events-cream hover:bg-events-card font-display px-8 py-6"
                >
                  <HelpCircle className="w-4 h-4 mr-2" /> I have questions
                </Button>
              </div>

              {/* Return visitor */}
              {!expert && !returning && (
                <button
                  onClick={() => setReturning(true)}
                  className="text-events-cream/30 hover:text-events-cream/60 text-xs mt-8 transition-colors"
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
          </section>
        </>
      ) : (
        /* Intake Form */
        <>
          <div className="border-b border-events-cream/10">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
              <img src={basecampLogo} alt="Basecamp Outdoor" className="h-10" />
              <button
                onClick={() => setShowForm(false)}
                className="text-events-cream/50 hover:text-events-cream text-sm font-display flex items-center gap-1 transition-colors"
              >
                ← Back to event info
              </button>
            </div>
          </div>
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
              existingData={expert || (lookupName ? { full_name: lookupName.trim() } : undefined)}
              citySlug={citySlug}
              cityName={cityName}
              onComplete={(savedExpert) => {
                if (savedExpert) setExpert(savedExpert);
                loadData();
              }}
            />
          </div>
        </>
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
