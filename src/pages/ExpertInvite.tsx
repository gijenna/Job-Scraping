import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Expert, ExpertCity, ExpertQuestion } from "@/lib/expert-types";
import ExpertIntakeForm from "@/components/experts/ExpertIntakeForm";
import LeafConfetti from "@/components/experts/LeafConfetti";
import QuestionDialog from "@/components/experts/QuestionDialog";
import ExpertCard from "@/components/experts/ExpertCard";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, CalendarDays, ArrowRight, HelpCircle, Sparkles, Users, MessageSquare, BookOpen, Coffee } from "lucide-react";
import basecampLogo from "@/assets/basecamp-outdoor-logo.png";
import SiteFooter from "@/components/SiteFooter";
import { EditableTextProvider } from "@/components/EditableTextProvider";
import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";
import OrderedSections from "@/components/event/OrderedSections";
import MNORGatherings from "@/components/minneapolis/MNORGatherings";
import MNPastExperts from "@/components/minneapolis/MNPastExperts";
import MNEventDetails from "@/components/minneapolis/MNEventDetails";
const heroDenver = "/hero-denver.mp4";
import heroPortland from "@/assets/hero-portland.jpg";
import heroMN from "@/assets/mn26/AnthonyMarz_Basecamp-024.jpg.asset.json";
import mnCtaBg from "@/assets/mn26/AnthonyMarz_Basecamp-211.jpg.asset.json";
import orGatheringsHorizontal from "@/assets/mn26/or-gatherings-horizontal.png.asset.json";

const MN_FOREST = "#1A2520";
const isMN = (slug: string) => slug === "minneapolis";
const EXPERT_PHOTOS = [
  "https://basecampoutdoorevents.com/__l5e/assets-v1/9dbf7783-4552-4a9b-bf39-9029c76e3acb/AnthonyMarz_Basecamp-083-2.jpg",
  "https://basecampoutdoorevents.com/__l5e/assets-v1/54a59ae4-e76d-401e-9ea4-dd70f7cbd927/AnthonyMarz_Basecamp-094-2.jpg",
  "https://basecampoutdoorevents.com/__l5e/assets-v1/b8a8a961-1567-4b57-9e36-aabb1f692ca4/AnthonyMarz_Basecamp-138.jpg",
];
interface ExpertInviteProps {
  citySlug?: string;
}

const CITY_HEROES: Record<string, { image?: string; video?: string }> = {
  denver: { video: heroDenver },
  portland: { image: heroPortland },
  minneapolis: { image: heroMN.url },
};

const CITY_EVENT_LINK: Record<string, { path: string; label: string; shortLabel: string }> = {
  denver: { path: '/OutsideDays26', label: 'Outside Days Career Fair', shortLabel: 'Outside Days Career Fair' },
  portland: { path: '/PNW26', label: 'Gather PNW', shortLabel: 'Gather: PNW' },
  minneapolis: { path: '/minneapolis26', label: 'Basecamp Outdoor Lounge Minneapolis', shortLabel: 'Basecamp Lounge: MN' },
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
    yearNote: '3rd year with Outside Inc, named top activation 2024 & 2025',
    attendance: '500–800',
    attendanceNote: 'career event · 40,000+ at full festival',
    venue: 'Auraria Campus Wellness Center, Denver, CO',
    venueMapUrl: 'https://www.google.com/maps/search/?api=1&query=Auraria+Campus+Wellness+Center+Denver+CO',
    time: '3–6 PM MT',
    whoAttends: [
      'Strong presence of passive candidates, not actively searching but networking',
      'Outdoor-oriented talent applying skills at mission-aligned companies',
      'Heavily product, design, creative, and corporate roles',
      'Professionals from VF brands, Yeti, REI, and more',
    ],
    format: [
      'Discovery Zone, your branded space to tell your story',
      'Employer tables with 5–10 min recruiter conversations',
    ],
    companies: [
      'REI', 'Patagonia', 'The North Face', 'Cotopaxi', 'Black Diamond',
      'Vail Resorts', 'Smartwool', 'Nike', 'Google', 'Apple', 'KPMG',
      'Amazon', 'Backbone Media', 'Outside Inc', 'Yeti', 'Peak Design',
    ],
  },
  portland: {
    tagline: 'Basecamp × University of Oregon Portland',
    yearNote: '5th annual, proven format, growing every year',
    attendance: '300+',
    attendanceNote: 'fresh grads, tenured leaders & industry-curious',
    venue: 'UO Portland Campus, 2800 NE Liberty St, Portland',
    venueMapUrl: 'https://www.google.com/maps/search/?api=1&query=2800+NE+Liberty+St+Portland+OR',
    time: '5:30–8:30 PM PT',
    whoAttends: [
      'UO Sports Product Management grads, elite & diverse cohort',
      'Tenured outdoor industry leaders open to new possibilities',
      'Mid-career professionals from tech, healthcare & sport pivoting into outdoor',
      'Active job seekers in the current market',
    ],
    format: [
      'Discovery Zone, your branded space to tell your story',
      'Employer tables with 5–10 min recruiter conversations',
      '"How I Broke In" panel, tactical career tips from real leaders',
      'Free food & drinks for all attendees',
    ],
    companies: [
      'Rumpl', 'On Running', 'Arc\'teryx', 'Cotopaxi', 'Brooks',
      'Specialized', 'Superfeet', 'Rivian', 'Columbia', 'Nike',
      'Adidas', 'REI', 'KEEN', 'Popfly', 'Oregon Outdoor Alliance', 'Peak Design',
    ],
  },
  minneapolis: {
    tagline: 'Basecamp Outdoor Lounge × Minneapolis',
    yearNote: 'New market, first Basecamp Outdoor Lounge in the Twin Cities',
    attendance: '150–250',
    attendanceNote: 'outdoor professionals & passive talent · intentionally intimate',
    venue: 'Minneapolis Convention Center',
    venueMapUrl: 'https://www.google.com/maps/search/?api=1&query=Minneapolis+Convention+Center',
    time: 'Thursday · Aug 20, 2026 · 10:30 AM to 12:30 PM CT',
    whoAttends: [
      'Outdoor industry professionals across the Midwest',
      'Active & passive talent open to mission-aligned opportunities',
      'Mid-career professionals from tech, retail & sport pivoting into outdoor',
      'Recent grads and early-career candidates from MN, WI, IA & beyond',
    ],
    format: [
      'One intimate session on Thursday morning inside Outdoor Retailer',
      'Proudly Sober lounge with focused conversations and no bar noise',
      'Industry expert office hours for walk-up or pre-arranged chats',
      'Free OR badge + access to the Popfly × Basecamp After Party Thursday night',
    ],
    companies: [],
  },
};

const ExpertExample = ({ src, alt }: { src: string; alt: string }) => (
  <div className="overflow-hidden rounded-lg border border-events-cream/10 bg-events-cream/5">
    <img src={src} alt={alt} className="aspect-[4/3] w-full object-cover" />
  </div>
);

const ExpertInvite = ({ citySlug = "denver" }: ExpertInviteProps) => {
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
  const [formExpertId, setFormExpertId] = useState<string | undefined>(undefined);
  const [formExistingData, setFormExistingData] = useState<Partial<Expert> | undefined>(undefined);
  const [sampleExpert, setSampleExpert] = useState<Expert | null>(null);

  useEffect(() => {
    if (citySlug !== 'minneapolis') return;
    (async () => {
      const { data: sample } = await supabase
        .from('industry_experts')
        .select('*')
        .eq('slug', 'mike-chamberlain-torres')
        .maybeSingle();
      if (sample) setSampleExpert(sample as unknown as Expert);
    })();
  }, [citySlug]);

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
    const { data: faqData } = await supabase
      .from('expert_questions').select('*')
      .eq('city_slug', citySlug).eq('show_in_faq', true)
      .order('created_at', { ascending: true });
    if (faqData) setFaqs(faqData as unknown as ExpertQuestion[]);
    setLoading(false);
  };

  const handleImIn = () => {
    setShowConfetti(true);
    if (expert) {
      setFormExpertId(expert.id);
      setFormExistingData(expert as unknown as Partial<Expert>);
    } else {
      setFormExpertId(undefined);
      setFormExistingData(undefined);
    }
    setTimeout(() => setShowForm(true), 800);
    setTimeout(() => setShowConfetti(false), 4500);
  };

  const handleNameLookup = async () => {
    if (!lookupName.trim()) return;
    const { data } = await supabase
      .from('industry_experts').select('*')
      .ilike('full_name', lookupName.trim()).maybeSingle();
    if (data) {
      setFormExpertId(data.id);
      setFormExistingData(data as unknown as Expert);
      setReturning(false);
      setShowForm(true);
    } else {
      const slug = lookupName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const { data: slugMatch } = await supabase
        .from('industry_experts').select('*').eq('slug', slug).maybeSingle();
      if (slugMatch) {
        setFormExpertId(slugMatch.id);
        setFormExistingData(slugMatch as unknown as Expert);
        setReturning(false);
        setShowForm(true);
      } else {
        setFormExpertId(undefined);
        setFormExistingData({ full_name: lookupName.trim() });
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
  const heroMedia = CITY_HEROES[citySlug];
  const firstName = expert?.full_name?.split(' ')[0] || '';
  const content = (
    <div className="min-h-screen" style={isMN(citySlug) ? { backgroundColor: MN_FOREST } : undefined}>
      {!isMN(citySlug) && <div className="absolute inset-0 -z-10 bg-events-teal" />}
      <LeafConfetti active={showConfetti} />

      {!showForm ? (
        <>
          {/* === HERO SECTION === */}
          <section className={`relative flex flex-col overflow-hidden ${isMN(citySlug) ? "min-h-[74vh]" : "min-h-screen"}`} style={isMN(citySlug) ? { backgroundColor: MN_FOREST } : undefined}>
            <div className="absolute inset-0 z-0">
              {heroMedia?.video ? (
                <video
                  autoPlay muted loop playsInline
                  className="w-full h-full object-cover"
                  src={heroMedia.video}
                />
              ) : heroMedia?.image ? (
                <img src={heroMedia.image} alt="" className={`w-full h-full object-cover ${isMN(citySlug) ? "md:object-[65%_center]" : ""}`} />
              ) : null}
              {isMN(citySlug) ? (
                <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${MN_FOREST} 0%, ${MN_FOREST} 44%, ${MN_FOREST}d9 56%, ${MN_FOREST}33 100%)` }} />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-events-teal/80 via-events-teal/60 to-events-teal" />
              )}
            </div>

            <div className="relative z-10 border-b border-white/10">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <a href="https://www.wearetheoutdoorindustry.com" target="_blank" rel="noopener noreferrer">
                    <img src={basecampLogo} alt="Basecamp Outdoor" className="h-10" />
                  </a>
                  {isMN(citySlug) && (
                    <img src={orGatheringsHorizontal.url} alt="OR Gatherings" className="h-8 md:h-10 w-auto" />
                  )}
                </div>
                <Link to={CITY_EVENT_LINK[citySlug]?.path ?? '/PNW26'} className="text-white/40 text-xs font-display uppercase tracking-widest hover:text-white/70 transition-colors">{eventTitle}</Link>
              </div>
            </div>

            <div className="relative z-10 flex-1 flex items-center">
              <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 w-full">
                {isMN(citySlug) ? (
                  <div className="max-w-2xl text-left">
                    <p className="text-events-coral font-display font-semibold text-xs md:text-sm uppercase tracking-[0.25em]">
                      <EditableText settingKey="mn_hero_eyebrow" defaultText="Basecamp Outdoor Lounge · OR Minneapolis" as="span" />
                    </p>
                    <h1 className="font-display text-4xl md:text-6xl font-bold text-events-cream leading-[1.05] mt-6">
                      <EditableText
                        settingKey="mn_hero_headline"
                        defaultText="Mentor the next generation at scale."
                        as="span"
                        multiline
                      />
                    </h1>
                    <p className="text-events-cream/78 text-base md:text-lg mt-6 max-w-lg leading-relaxed">
                      <EditableText
                        settingKey="mn_hero_sub"
                        defaultText="Thursday morning inside Outdoor Retailer. You have been hand selected for your industry wisdom. Our community wants to hear from you."
                        as="span"
                        multiline
                      />
                    </p>
                    <div className="flex flex-col sm:flex-row items-start gap-3 mt-8">
                      <Button
                        onClick={handleImIn}
                        className="bg-events-coral hover:bg-events-coral/90 text-white font-display font-bold text-base px-8 py-6 rounded-xl"
                      >
                        <EditableText settingKey="mn_hero_primary_cta" defaultText="I'm In" as="span" /> <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button
                        onClick={() => document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' })}
                        variant="outline"
                        className="border-white/25 text-white hover:bg-white/10 font-display text-base px-8 py-6 rounded-xl"
                      >
                        <EditableText settingKey="mn_hero_secondary_cta" defaultText="Learn More" as="span" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-[1fr_320px] gap-8 items-center">
                    <div>
                      <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-[1.1]">
                        {expert ? (
                          <>
                            Hey <span className="text-events-yellow">{firstName}</span>,
                            <br />
                            we'd love for you to be an{' '}
                            <span className="text-events-coral">Industry Expert</span>
                            <br />
                            at{' '}
                            {(() => {
                              const ev = CITY_EVENT_LINK[citySlug] ?? CITY_EVENT_LINK.portland;
                              return <Link to={ev.path} className="underline decoration-white/30 underline-offset-4 hover:decoration-white/60 transition-colors">{ev.label}</Link>;
                            })()}.
                          </>
                        ) : (
                          <>
                            Become an{' '}
                            <span className="text-events-coral">Industry Expert</span>
                            <br />
                            at{' '}
                            {(() => {
                              const ev = CITY_EVENT_LINK[citySlug] ?? CITY_EVENT_LINK.portland;
                              return <Link to={ev.path} className="underline decoration-white/30 underline-offset-4 hover:decoration-white/60 transition-colors">{ev.label}</Link>;
                            })()}.
                          </>
                        )}
                      </h1>

                      <p className="text-white/70 text-lg mt-6 max-w-lg leading-relaxed">
                        {expert ? (
                          <>You'll share your story, answer questions from attendees, and help the next generation of outdoor industry professionals find their path. Your profile card will be published on our site before the event.</>
                        ) : (
                          <>Share your career story, mentor attendees, and help the next generation of outdoor professionals find their path. Your profile card will be featured on our website before the event.</>
                        )}
                      </p>

                      <div className="flex items-center gap-4 mt-8">
                        <Button
                          onClick={() => document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' })}
                          className="bg-white text-events-teal hover:bg-white/90 font-display font-bold text-base px-8 py-6 rounded-xl"
                        >
                          Learn More <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <div
                        onClick={handleImIn}
                        className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl cursor-pointer hover:bg-white/15 hover:scale-[1.02] transition-all group"
                      >
                        <div className="w-24 h-24 rounded-full bg-events-teal mx-auto flex items-center justify-center border-2 border-white/20 overflow-hidden">
                          {expert?.photo_url ? (
                            <img src={expert.photo_url} alt={expert.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white/60 font-display text-2xl font-bold">?</span>
                          )}
                        </div>
                        <h3 className="font-display text-lg font-bold text-white text-center mt-4">
                          {expert?.full_name || 'Your Name Here'}
                        </h3>
                        <p className="text-events-coral text-sm text-center font-medium">Industry Expert</p>
                        {expert?.current_company && (
                          <p className="text-white/40 text-xs text-center mt-0.5">{expert.current_company}</p>
                        )}
                        <p className="text-white/30 text-xs text-center mt-2 group-hover:text-events-coral transition-colors">
                          Click to build your card →
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {isMN(citySlug) && (
            <section className="border-y border-events-cream/10 px-4 py-5" style={{ backgroundColor: MN_FOREST }}>
              <div className="mx-auto flex max-w-5xl flex-col gap-2 text-center text-xs font-display font-semibold uppercase tracking-[0.18em] text-events-cream/58 md:flex-row md:items-center md:justify-center md:gap-6">
                <span><EditableText settingKey="mn_event_detail_date" defaultText="Thursday · Aug 20, 2026" as="span" /></span>
                <span className="hidden md:inline text-events-coral">•</span>
                <span><EditableText settingKey="mn_event_detail_time" defaultText="10:30 AM to 12:30 PM CT" as="span" /></span>
                <span className="hidden md:inline text-events-coral">•</span>
                <span><EditableText settingKey="mn_event_detail_location" defaultText="Minneapolis Convention Center · Inside Outdoor Retailer" as="span" /></span>
              </div>
            </section>
          )}

          {/* === WHAT IT MEANS SECTION === */}
          {isMN(citySlug) ? (
            <>
              <section id="learn-more" className="py-12 md:py-16" style={{ backgroundColor: MN_FOREST }}>
                <div className="max-w-7xl mx-auto px-6">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-events-cream text-center">
                    <EditableText settingKey="mn_meaning_headline" defaultText="What It Means To Be An Industry Expert" as="span" />
                  </h2>
                  <p className="text-events-cream/72 text-lg md:text-xl text-center mt-5 max-w-3xl mx-auto leading-relaxed">
                    <EditableText
                      settingKey="mn_meaning_sub"
                      defaultText="Being an Industry Expert means you were hand selected for hard-won industry wisdom and invited to help the next wave make better moves."
                      as="span"
                      multiline
                    />
                  </p>

                  <div className="grid md:grid-cols-3 gap-5 mt-10">
                    <div className="rounded-xl border border-events-cream/10 bg-events-cream/[0.04] p-5">
                      <ExpertExample src={EXPERT_PHOTOS[0]} alt="Industry experts in conversation at a Basecamp Outdoor event" />
                      <h4 className="font-display text-events-cream font-bold mt-5">
                        <EditableText settingKey="mn_feature1_title" defaultText="Share Your Journey" as="span" />
                      </h4>
                      <p className="text-events-cream/62 text-sm mt-2 leading-relaxed">
                        <EditableText
                          settingKey="mn_feature1_body"
                          defaultText="Tell the useful version. Pivots, breaks, lessons, and the moments someone else needs before their next move."
                          as="span"
                          multiline
                        />
                      </p>
                    </div>
                    <div className="rounded-xl border border-events-cream/10 bg-events-cream/[0.04] p-5">
                      <ExpertExample src={EXPERT_PHOTOS[1]} alt="Outdoor industry leaders networking at Basecamp Outdoor" />
                      <h4 className="font-display text-events-cream font-bold mt-5">
                        <EditableText settingKey="mn_feature2_title" defaultText="Get Free Access" as="span" />
                      </h4>
                      <p className="text-events-cream/62 text-sm mt-2 leading-relaxed">
                        <EditableText
                          settingKey="mn_feature2_body"
                          defaultText="Your expert slot includes a free Outdoor Retailer badge and access to the Popfly × Basecamp After Party Thursday night."
                          as="span"
                          multiline
                        />
                      </p>
                    </div>
                    <div className="rounded-xl border border-events-cream/10 bg-events-cream/[0.04] p-5">
                      <ExpertExample src={EXPERT_PHOTOS[2]} alt="Basecamp Outdoor community members sharing industry advice" />
                      <h4 className="font-display text-events-cream font-bold mt-5">
                        <EditableText settingKey="mn_feature3_title" defaultText="Expert Status" as="span" />
                      </h4>
                      <p className="text-events-cream/62 text-sm mt-2 leading-relaxed">
                        <EditableText
                          settingKey="mn_feature3_body"
                          defaultText="You become one of the visible people in the room. Coveted, useful, and easy to point to as you build whatever comes next."
                          as="span"
                          multiline
                        />
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* === HOW YOU'LL SHOW UP === */}
              <section className="py-14 md:py-20" style={{ backgroundColor: MN_FOREST }}>
                <div className="max-w-6xl mx-auto px-4">
                  <div className="text-center mb-12">
                    <p className="text-events-coral font-display font-semibold text-xs uppercase tracking-[0.25em]">
                      <EditableText settingKey="mn_showup_eyebrow" defaultText="How You'll Show Up" as="span" />
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-events-cream mt-3">
                      <EditableText settingKey="mn_showup_headline" defaultText="This is your card. It goes live on the event page." as="span" multiline />
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className="flex justify-center">
                      {sampleExpert ? (
                        <div className="w-full max-w-xs">
                          <ExpertCard expert={sampleExpert} />
                        </div>
                      ) : (
                        <div className="w-full max-w-xs aspect-[3/4] rounded-xl bg-events-card/40 animate-pulse" />
                      )}
                    </div>

                    <div className="space-y-5 text-events-cream">
                      <h3 className="font-display text-2xl font-bold">
                        <EditableText settingKey="mn_showup_title" defaultText="A pre-event spotlight, filled in by you." as="span" />
                      </h3>
                      <p className="text-events-cream/75 leading-relaxed">
                        <EditableText
                          settingKey="mn_showup_body"
                          defaultText="Your card is published on the event page before the Gathering. Attendees use it to see who will be in the room, choose who to meet, and show up with better questions."
                          as="span"
                          multiline
                        />
                      </p>
                      <ul className="space-y-3 text-events-cream/80 text-sm">
                        <li className="flex gap-3"><span className="text-events-coral font-bold">›</span><span><EditableText settingKey="mn_showup_bullet1" defaultText="Your story, your voice, not a bio a recruiter wrote." as="span" /></span></li>
                        <li className="flex gap-3"><span className="text-events-coral font-bold">›</span><span><EditableText settingKey="mn_showup_bullet2" defaultText="Update it whenever the job, the ask, or the mood changes." as="span" /></span></li>
                        <li className="flex gap-3"><span className="text-events-coral font-bold">›</span><span><EditableText settingKey="mn_showup_bullet3" defaultText="Attendees show up prepared. You get better conversations." as="span" /></span></li>
                      </ul>
                      <p className="text-events-cream/60 text-sm italic pt-2">
                        <EditableText settingKey="mn_showup_hint_prefix" defaultText="Hint: this card also becomes your profile if you join our larger" as="span" />{' '}
                        <EditableLink
                          textKey="mn_showup_program_text"
                          urlKey="mn_showup_program_url"
                          defaultText="Industry Expert program"
                          defaultUrl="https://www.wearetheoutdoorindustry.com/career-collective-"
                          className="text-events-yellow underline underline-offset-4 hover:text-events-yellow/80"
                        />
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section id="learn-more" className="bg-events-teal py-16 md:py-24">
              <div className="max-w-4xl mx-auto px-4">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-events-cream text-center">
                  What It Means To Be An Industry Expert
                </h2>
                <p className="text-events-cream/60 text-lg text-center mt-6 max-w-2xl mx-auto leading-relaxed">
                  As an <strong className="text-events-coral">Industry Expert</strong>, you'll be a go-to resource
                  for attendees, answering questions, sharing your career journey, and helping people navigate the outdoor industry.
                </p>
                <p className="text-events-cream/70 text-lg text-center mt-4 max-w-2xl mx-auto leading-relaxed">
                  We want attendees to know <strong className="text-events-cream">who's coming</strong> in advance
                  so they can have questions ready. Your profile card will be published on our website before the event
                  so people can prepare meaningful conversations with you.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mt-12">
                  <div className="bg-events-card/60 rounded-xl border border-events-cream/10 p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-events-coral/20 flex items-center justify-center mx-auto">
                      <BookOpen className="w-6 h-6 text-events-coral" />
                    </div>
                    <h4 className="font-display text-events-cream font-bold mt-4">Share Your Journey</h4>
                    <p className="text-events-cream/50 text-sm mt-2">
                      Tell your story, how you got into the industry, what you've learned, and what excites you most.
                    </p>
                  </div>
                  <div className="bg-events-card/60 rounded-xl border border-events-cream/10 p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-events-yellow/20 flex items-center justify-center mx-auto">
                      <BookOpen className="w-6 h-6 text-events-yellow" />
                    </div>
                    <h4 className="font-display text-events-cream font-bold mt-4">Pre-Event Spotlight</h4>
                    <p className="text-events-cream/50 text-sm mt-2">
                      Your card is published on our site before the event, attendees will come prepared with questions for you.
                    </p>
                  </div>
                  <div className="bg-events-card/60 rounded-xl border border-events-cream/10 p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-events-coral/20 flex items-center justify-center mx-auto">
                      <Coffee className="w-6 h-6 text-events-coral" />
                    </div>
                    <h4 className="font-display text-events-cream font-bold mt-4">Real Conversations</h4>
                    <p className="text-events-cream/50 text-sm mt-2">
                      No resumes, no booth lines. Just authentic one-on-one conversations with passionate industry talent.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {citySlug === 'minneapolis' && (
            <OrderedSections
              sections={[
                { key: 'or_gatherings', content: <MNORGatherings /> },
                { key: 'event_details', content: <MNEventDetails onApply={() => setShowForm(true)} /> },
                { key: 'past_experts', content: <MNPastExperts eventSlug="mnexperts" showLinkToEvent /> },
              ]}
            />
          )}


          {/* === THE EVENT SECTION (non-MN cities) === */}
          {citySlug !== 'minneapolis' && (() => {
            const eventData = CITY_EVENT_DATA[citySlug] || CITY_EVENT_DATA.denver;
            return (
              <section className="relative py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                  {heroMedia?.video ? (
                    <video autoPlay muted loop playsInline className="w-full h-full object-cover" src={heroMedia.video} />
                  ) : heroMedia?.image ? (
                    <img src={heroMedia.image} alt="" className="w-full h-full object-cover" />
                  ) : null}
                  <div className="absolute inset-0 bg-events-cream/90" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                  <div className="text-center mb-12">
                    <p className="text-events-coral font-display font-semibold text-sm uppercase tracking-widest">{eventData.tagline}</p>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-events-teal mt-3">
                      The Event
                    </h2>
                    <p className="text-events-teal/60 text-lg mt-3 max-w-xl mx-auto">Here's what you're signing up for.</p>
                  </div>

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

                  <div className="bg-events-teal rounded-xl px-6 py-4 mb-10 text-center">
                    <p className="text-events-cream font-display font-medium text-sm">
                      <Sparkles className="w-4 h-4 inline mr-2 text-events-yellow" />
                      {eventData.yearNote}
                    </p>
                  </div>

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

                  {eventData.companies.length > 0 && (
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
                  )}
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

          {/* === CTA SECTION === */}
          <section className="relative py-16 md:py-24">
            <div className="absolute inset-0 z-0">
              {citySlug === 'minneapolis' ? (
                <img src={mnCtaBg.url} alt="" className="w-full h-full object-cover" />
              ) : heroMedia?.image ? (
                <img src={heroMedia.image} alt="" className="w-full h-full object-cover" />
              ) : null}
              <div className="absolute inset-0" style={{ backgroundColor: isMN(citySlug) ? `${MN_FOREST}d9` : undefined }}>
                {!isMN(citySlug) && <div className="w-full h-full bg-events-teal/85" />}
              </div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-events-cream leading-tight">
                {isMN(citySlug) ? <EditableText settingKey="mn_cta_headline" defaultText="So, are you in?" as="span" /> : "So... are you in?"}
              </h2>
              <p className="text-events-cream/60 text-lg mt-4 max-w-xl mx-auto">
                {isMN(citySlug) ? (
                  <EditableText settingKey="mn_cta_sub" defaultText="We would love for you to share your expertise with the Basecamp Minneapolis community." as="span" multiline />
                ) : expert ? (
                  <>{firstName}, we'd love for you to share your expertise with the Basecamp {cityName} community.</>
                ) : (
                  <>We'd love for you to share your expertise with the Basecamp {cityName} community.</>
                )}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Button
                  onClick={handleImIn}
                  className="bg-events-coral hover:bg-events-coral/90 text-white font-display font-bold text-xl px-10 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  {isMN(citySlug) ? <EditableText settingKey="mn_cta_primary_button" defaultText="I'm In! Let's Do This" as="span" /> : "I'm In! Let's Do This"} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={() => setShowQuestions(true)}
                  variant="outline"
                  className="border-events-cream/20 text-events-cream hover:bg-events-card font-display px-8 py-6"
                >
                  <HelpCircle className="w-4 h-4 mr-2" /> {isMN(citySlug) ? <EditableText settingKey="mn_cta_question_button" defaultText="I have questions" as="span" /> : "I have questions"}
                </Button>
              </div>
              <Link
                to={CITY_EVENT_LINK[citySlug]?.path ?? '/PNW26'}
                className="text-events-cream/50 hover:text-events-cream/80 text-sm mt-6 inline-block transition-colors underline underline-offset-2"
              >
                {isMN(citySlug) ? <EditableText settingKey="mn_cta_attend_link" defaultText="Just want to register and attend for free? We'd love to see you" as="span" /> : "Just want to register and attend for free? We'd love to see you"}
              </Link>

              {!expert && !returning && (
                <button
                  onClick={() => setReturning(true)}
                  className="text-events-cream/30 hover:text-events-cream/60 text-xs mt-8 block mx-auto transition-colors"
                >
                  {isMN(citySlug) ? <EditableText settingKey="mn_returning_prompt" defaultText="Been here before? Click to look up your card" as="span" /> : "Been here before? Click to look up your card"}
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
                    {isMN(citySlug) ? <EditableText settingKey="mn_returning_go" defaultText="Go" as="span" /> : "Go"}
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
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <img src={basecampLogo} alt="Basecamp Outdoor" className="h-10" />
              <button
                onClick={() => setShowForm(false)}
                className="text-events-cream/50 hover:text-events-cream text-sm font-display flex items-center gap-1 transition-colors"
              >
                {isMN(citySlug) ? <EditableText settingKey="mn_form_back" defaultText="← Back to event info" as="span" /> : "← Back to event info"}
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold text-events-cream">
                {isMN(citySlug) ? <EditableText settingKey="mn_form_headline" defaultText="Build your Industry Expert card" as="span" /> : <>Build your <span className="text-events-coral">Industry Expert</span> card</>}
              </h2>
              <p className="text-events-cream/50 mt-2">
                {isMN(citySlug) ? (
                  <EditableText settingKey="mn_form_sub" defaultText="The more details you add, the better your card looks. Fill out what you can now, then return anytime to edit your card." as="span" multiline />
                ) : (
                  <>The more details you add, the better your card looks. Fill out what you can now , <strong className="text-events-cream/70"> return anytime to edit your card</strong>.</>
                )}
              </p>
            </div>
            <ExpertIntakeForm
              expertId={formExpertId}
              existingData={formExistingData}
              citySlug={citySlug}
              cityName={cityName}
              expertType="industry_expert"
              onComplete={(savedExpert) => {
                if (savedExpert) {
                  setFormExpertId(savedExpert.id);
                  setFormExistingData(prev => ({
                    ...prev,
                    ...savedExpert,
                  }));
                }
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
      <SiteFooter />
    </div>
  );

  if (isMN(citySlug)) {
    return <EditableTextProvider pageSlug="mnexperts">{content}</EditableTextProvider>;
  }

  return content;
};

export default ExpertInvite;
