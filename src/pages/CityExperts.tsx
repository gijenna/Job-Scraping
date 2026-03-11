import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Expert, ExpertCity, ExpertCityAssignment, getCompanyLogoUrl } from "@/lib/expert-types";
import { Badge } from "@/components/ui/badge";
import { Linkedin, ArrowLeft } from "lucide-react";
import basecampLogo from "@/assets/basecamp-outdoor-logo.png";

const CityExperts = ({ citySlug }: { citySlug: string }) => {
  const [city, setCity] = useState<ExpertCity | null>(null);
  const [experts, setExperts] = useState<(Expert & { assignment: ExpertCityAssignment })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperts();
  }, [citySlug]);

  const loadExperts = async () => {
    setLoading(true);

    const { data: cityData } = await supabase
      .from('expert_cities')
      .select('*')
      .eq('slug', citySlug)
      .single();

    if (cityData) setCity(cityData as unknown as ExpertCity);

    // Get published assignments for this city
    const { data: assignmentData } = await supabase
      .from('expert_city_assignments')
      .select('*')
      .eq('city_slug', citySlug)
      .eq('published', true);

    if (assignmentData && assignmentData.length > 0) {
      const expertIds = assignmentData.map(a => a.expert_id);
      const { data: expertData } = await supabase
        .from('industry_experts')
        .select('*')
        .in('id', expertIds);

      if (expertData) {
        const merged = expertData.map(e => ({
          ...(e as unknown as Expert),
          assignment: assignmentData.find(a => a.expert_id === e.id) as unknown as ExpertCityAssignment,
        }));
        setExperts(merged);
      }
    }

    setLoading(false);
  };

  const cityName = city?.name || 'City';
  const eventTitle = city?.event_title || 'GATHER';

  if (loading) {
    return (
      <div className="min-h-screen bg-events-teal flex items-center justify-center">
        <p className="text-events-cream/40">Loading experts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-events-teal">
      {/* Header */}
      <div className="border-b border-events-cream/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="https://www.wearetheoutdoorindustry.com" target="_blank" rel="noopener noreferrer">
            <img src={basecampLogo} alt="Basecamp Outdoor" className="h-10" />
          </a>
          <span className="text-events-cream/40 text-xs font-display uppercase tracking-widest">{eventTitle}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-events-cream leading-tight">
          Meet the <span className="text-events-coral">Industry Experts</span>
        </h1>
        <p className="text-events-cream/60 text-lg mt-4 max-w-2xl mx-auto">
          These seasoned leaders are here to share their career wisdom. Browse their cards, 
          prepare your questions, and seek them out at <span className="text-events-yellow font-semibold">{eventTitle}</span>.
        </p>
        {city?.event_location && (
          <p className="text-events-cream/40 text-sm mt-2">{city.event_location} {city.event_time_details ? `· ${city.event_time_details}` : ''}</p>
        )}
      </div>

      {/* Expert Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {experts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-events-cream/40 text-lg">Expert cards coming soon!</p>
            <p className="text-events-cream/30 text-sm mt-2">Check back as we finalize our lineup.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <ExpertPublicCard key={expert.id} expert={expert} citySlug={citySlug} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ExpertPublicCard = ({ expert, citySlug }: { expert: Expert; citySlug: string }) => {
  const cityPrefix = citySlug === 'denver' ? 'Denver' : citySlug === 'portland' ? 'Portland' : 'MN';
  const previousCompanies = expert.previous_companies
    ? expert.previous_companies.split(',').map(c => c.trim()).filter(Boolean)
    : [];

  return (
    <Link
      to={`/${cityPrefix}experts/view/${expert.slug}`}
      className="block bg-events-card rounded-xl border border-events-cream/10 overflow-hidden hover:border-events-coral/30 transition-all hover:shadow-lg hover:shadow-events-coral/5 group"
    >
      {/* Polaroid photo */}
      <div className="relative bg-events-cream p-2.5 pb-3 m-3 rounded-sm shadow-md" style={{ transform: 'rotate(-0.5deg)' }}>
        <div className="aspect-[3/4] bg-gray-300 overflow-hidden relative">
          {expert.photo_url ? (
            <img src={expert.photo_url} alt={expert.full_name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-events-teal/10 text-events-teal/40">
              <span className="text-4xl font-display font-bold">
                {expert.full_name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          {expert.linkedin_url && (
            <div className="absolute bottom-2 right-2 bg-white/90 rounded-full p-1.5">
              <Linkedin className="w-4 h-4 text-[#0077B5]" />
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-4">
        <h3 className="font-display text-xl font-bold text-events-coral leading-tight">
          {expert.full_name}
        </h3>

        {(expert.job_title || expert.current_company) && (
          <div className="flex items-center gap-2 mt-1">
            <p className="text-events-yellow text-sm font-medium truncate">
              {expert.job_title}{expert.job_title && expert.current_company ? ' · ' : ''}{expert.current_company}
            </p>
            {expert.current_company && (
              <img
                src={getCompanyLogoUrl(expert.current_company)}
                alt=""
                className="w-5 h-5 rounded-sm bg-white object-contain shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>
        )}

        {expert.field_of_work && (
          <Badge className="mt-2 bg-events-coral/20 text-events-coral border-events-coral/30 text-xs">
            {expert.field_of_work}
          </Badge>
        )}

        {expert.ask_me_about && (
          <div className="mt-2">
            <span className="text-events-yellow text-xs font-semibold uppercase tracking-wider">Ask me about</span>
            <p className="text-events-cream/70 text-sm mt-0.5 line-clamp-2">{expert.ask_me_about}</p>
          </div>
        )}

        {expert.niche_interests && expert.niche_interests.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {expert.niche_interests.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-events-cream/60 border-events-cream/20 text-xs">
                {tag}
              </Badge>
            ))}
            {expert.niche_interests.length > 4 && (
              <Badge variant="outline" className="text-events-cream/40 border-events-cream/15 text-xs">
                +{expert.niche_interests.length - 4}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default CityExperts;
