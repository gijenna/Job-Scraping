import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Expert, ExpertCity, getCompanyLogoUrl } from "@/lib/expert-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, ArrowLeft, MapPin, Briefcase, Clock, BookOpen, Sparkles } from "lucide-react";
import basecampLogo from "@/assets/basecamp-outdoor-logo.png";
import ShareCardButtons from "@/components/experts/ShareCardButtons";

const ExpertDetail = ({ citySlug }: { citySlug: string }) => {
  const { name } = useParams();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [city, setCity] = useState<ExpertCity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExpert();
  }, [citySlug, name]);

  const loadExpert = async () => {
    setLoading(true);

    const [{ data: cityData }, { data: expertData }] = await Promise.all([
      supabase.from('expert_cities').select('*').eq('slug', citySlug).single(),
      supabase.from('industry_experts').select('*').eq('slug', name).single(),
    ]);

    if (cityData) setCity(cityData as unknown as ExpertCity);
    if (expertData) setExpert(expertData as unknown as Expert);
    setLoading(false);
  };

  const cityPrefix = citySlug === 'denver' ? 'Denver' : citySlug === 'portland' ? 'Portland' : 'MN';
  const previousCompanies = expert?.previous_companies
    ? expert.previous_companies.split(',').map(c => c.trim()).filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-events-teal flex items-center justify-center">
        <p className="text-events-cream/40">Loading...</p>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-events-teal flex items-center justify-center">
        <div className="text-center">
          <p className="text-events-cream/60 text-lg">Expert not found</p>
          <Link to={`/${cityPrefix}experts/browse`} className="text-events-coral hover:underline mt-2 inline-block">
            ← Back to all experts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-events-teal">
      {/* Header */}
      <div className="border-b border-events-cream/10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="https://www.wearetheoutdoorindustry.com" target="_blank" rel="noopener noreferrer">
            <img src={basecampLogo} alt="Basecamp Outdoor" className="h-10" />
          </a>
          <Link
            to={`/${cityPrefix}experts/browse`}
            className="text-events-cream/50 hover:text-events-cream text-sm flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Experts
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-[320px_1fr] gap-8">
          {/* Polaroid Card */}
          <div>
            <div className="bg-events-cream p-3 pb-4 rounded-sm shadow-lg max-w-xs mx-auto" style={{ transform: 'rotate(-1.5deg)' }}>
              <div className="aspect-[3/4] bg-gray-300 overflow-hidden relative">
                {expert.photo_url ? (
                  <img src={expert.photo_url} alt={expert.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-events-teal/10 text-events-teal/30">
                    <span className="text-5xl font-display font-bold">
                      {expert.full_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                {expert.linkedin_url && (
                  <a
                    href={expert.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 bg-white/90 rounded-full p-2 hover:bg-white transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-[#0077B5]" />
                  </a>
                )}
              </div>
            </div>

            {expert.linkedin_url && (
              <div className="text-center mt-4">
                <a
                  href={expert.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-events-cream/50 hover:text-events-cream text-sm transition-colors"
                >
                  <Linkedin className="w-4 h-4" /> View LinkedIn Profile
                </a>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-events-coral">
                {expert.full_name}
              </h1>

              {(expert.job_title || expert.current_company) && (
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-events-yellow text-lg font-medium">
                    {expert.job_title}{expert.job_title && expert.current_company ? ' · ' : ''}{expert.current_company}
                  </p>
                  {expert.current_company && (
                    <img
                      src={getCompanyLogoUrl(expert.current_company)}
                      alt=""
                      className="w-6 h-6 rounded-sm bg-white object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>
              )}

              {expert.field_of_work && (
                <Badge className="mt-3 bg-events-coral/20 text-events-coral border-events-coral/30">
                  {expert.field_of_work}
                </Badge>
              )}
            </div>

            {/* Stats */}
            {(expert.years_in_industry || expert.years_in_city) && (
              <div className="flex gap-6">
                {expert.years_in_industry && (
                  <div className="flex items-center gap-2 text-events-cream/70">
                    <Briefcase className="w-4 h-4 text-events-coral" />
                    <span>{expert.years_in_industry} years in industry</span>
                  </div>
                )}
                {expert.years_in_city && (
                  <div className="flex items-center gap-2 text-events-cream/70">
                    <MapPin className="w-4 h-4 text-events-coral" />
                    <span>{expert.years_in_city} years in the area</span>
                  </div>
                )}
              </div>
            )}

            {/* Ask me about */}
            {expert.ask_me_about && (
              <div className="bg-events-card/50 rounded-xl border border-events-cream/10 p-5">
                <h3 className="text-events-yellow font-display font-semibold flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" /> Ask me about
                </h3>
                <p className="text-events-cream/80 leading-relaxed">{expert.ask_me_about}</p>
              </div>
            )}

            {/* Previous companies */}
            {previousCompanies.length > 0 && (
              <div>
                <h3 className="text-events-cream/50 text-sm font-semibold uppercase tracking-wider mb-2">Previously at</h3>
                <div className="flex flex-wrap gap-3">
                  {previousCompanies.map((company) => (
                    <div key={company} className="flex items-center gap-2 bg-events-card/50 rounded-lg px-3 py-2 border border-events-cream/10">
                      <img
                        src={getCompanyLogoUrl(company)}
                        alt={company}
                        className="w-5 h-5 rounded-sm bg-white object-contain p-0.5"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span className="text-events-cream/70 text-sm">{company}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Niche interests */}
            {expert.niche_interests && expert.niche_interests.length > 0 && (
              <div>
                <h3 className="text-events-cream/50 text-sm font-semibold uppercase tracking-wider mb-2">Outdoor Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {expert.niche_interests.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-events-cream/70 border-events-cream/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Favorite media */}
            {expert.favorite_media && (
              <div>
                <h3 className="text-events-cream/50 text-sm font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-4 h-4" /> Currently reading / listening
                </h3>
                <p className="text-events-cream/70">{expert.favorite_media}</p>
              </div>
            )}

            {/* Event CTA */}
            {city && (
              <div className="bg-events-coral/10 border border-events-coral/20 rounded-xl p-5 mt-4">
                <p className="text-events-cream/80 text-sm">
                  Meet <span className="text-events-coral font-semibold">{expert.full_name.split(' ')[0]}</span> at{' '}
                  <span className="text-events-yellow font-semibold">{city.event_title}</span>
                  {city.event_location ? ` in ${city.event_location}` : ''}
                  {city.event_time_details ? ` · ${city.event_time_details}` : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertDetail;
