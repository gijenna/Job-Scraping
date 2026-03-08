import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Expert, FIELD_OPTIONS, NICHE_OPTIONS, getCompanyLogoUrl } from "@/lib/expert-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import ExpertLivePreview from "./ExpertLivePreview";

interface ExpertIntakeFormProps {
  expertId?: string;
  existingData?: Partial<Expert>;
  citySlug: string;
  cityName: string;
  onComplete: () => void;
}

interface CityAssignment {
  city_slug: string;
  city_name: string;
}

const ExpertIntakeForm = ({ expertId, existingData, citySlug, cityName, onComplete }: ExpertIntakeFormProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [customNiche, setCustomNiche] = useState("");
  const [myAssignments, setMyAssignments] = useState<CityAssignment[]>([]);
  const [allCities, setAllCities] = useState<{ slug: string; name: string }[]>([]);
  const assignmentsLoadedRef = useRef(false);

  // Load existing city assignments for this expert
  useEffect(() => {
    const loadAssignments = async () => {
      // Load all cities
      const { data: citiesData } = await supabase.from('expert_cities').select('slug, name').eq('active', true);
      if (citiesData) setAllCities(citiesData);

      // Only load from DB on first mount or when expertId first becomes available
      if (assignmentsLoadedRef.current) return;

      if (!expertId) {
        setMyAssignments([{ city_slug: citySlug, city_name: cityName }]);
        return;
      }

      assignmentsLoadedRef.current = true;
      const { data: assigns } = await supabase
        .from('expert_city_assignments').select('city_slug').eq('expert_id', expertId);
      if (assigns && assigns.length > 0 && citiesData) {
        const mapped = assigns.map(a => ({
          city_slug: a.city_slug,
          city_name: citiesData.find(c => c.slug === a.city_slug)?.name || a.city_slug,
        }));
        setMyAssignments(mapped);
      } else if (citiesData) {
        // Expert exists but no assignments found — default to current city
        setMyAssignments([{ city_slug: citySlug, city_name: cityName }]);
      }
    };
    loadAssignments();
  }, [expertId, citySlug, cityName]);

  const [form, setForm] = useState({
    full_name: existingData?.full_name || '',
    email: existingData?.email || '',
    job_title: existingData?.job_title || '',
    current_company: existingData?.current_company || '',
    photo_url: existingData?.photo_url || '',
    linkedin_url: existingData?.linkedin_url || '',
    field_of_work: existingData?.field_of_work || '',
    years_in_industry: existingData?.years_in_industry?.toString() || '',
    years_in_city: existingData?.years_in_city?.toString() || '',
    ask_me_about: existingData?.ask_me_about || '',
    favorite_media: existingData?.favorite_media || '',
    previous_companies: existingData?.previous_companies || '',
    niche_interests: existingData?.niche_interests || [] as string[],
  });

  useEffect(() => {
    if (existingData) {
      setForm(prev => ({
        ...prev,
        full_name: existingData.full_name || prev.full_name,
        email: existingData.email || prev.email,
        job_title: existingData.job_title || prev.job_title,
        current_company: existingData.current_company || prev.current_company,
        photo_url: existingData.photo_url || prev.photo_url,
        linkedin_url: existingData.linkedin_url || prev.linkedin_url,
        field_of_work: existingData.field_of_work || prev.field_of_work,
        years_in_industry: existingData.years_in_industry?.toString() || prev.years_in_industry,
        years_in_city: existingData.years_in_city?.toString() || prev.years_in_city,
        ask_me_about: existingData.ask_me_about || prev.ask_me_about,
        favorite_media: existingData.favorite_media || prev.favorite_media,
        previous_companies: existingData.previous_companies || prev.previous_companies,
        niche_interests: existingData.niche_interests || prev.niche_interests,
      }));
    }
  }, [existingData]);

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleNiche = (niche: string) => {
    setForm(prev => ({
      ...prev,
      niche_interests: prev.niche_interests.includes(niche)
        ? prev.niche_interests.filter(n => n !== niche)
        : [...prev.niche_interests, niche],
    }));
  };

  const addCustomNiche = () => {
    if (customNiche.trim() && !form.niche_interests.includes(customNiche.trim())) {
      setForm(prev => ({ ...prev, niche_interests: [...prev.niche_interests, customNiche.trim()] }));
      setCustomNiche("");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `expert-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('email-assets')
      .upload(`expert-photos/${fileName}`, file, { upsert: false });

    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return;
    }

    const { data: publicUrl } = supabase.storage
      .from('email-assets')
      .getPublicUrl(`expert-photos/${fileName}`);

    update('photo_url', publicUrl.publicUrl);
    toast({ title: "Photo uploaded!" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.full_name.trim() || !form.email.trim() || !form.current_company.trim()) {
      toast({ title: "Missing required fields", description: "Please fill in your name, email, and current company.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        job_title: form.job_title.trim() || null,
        current_company: form.current_company.trim(),
        photo_url: form.photo_url || null,
        linkedin_url: form.linkedin_url.trim() || null,
        field_of_work: form.field_of_work || null,
        years_in_industry: form.years_in_industry ? parseInt(form.years_in_industry) : null,
        years_in_city: form.years_in_city ? parseInt(form.years_in_city) : null,
        ask_me_about: form.ask_me_about.trim() || null,
        favorite_media: form.favorite_media.trim() || null,
        previous_companies: form.previous_companies.trim() || null,
        niche_interests: form.niche_interests,
        status: 'confirmed' as const,
        updated_at: new Date().toISOString(),
      };

      let finalExpertId = expertId;

      if (expertId) {
        const { error } = await supabase
          .from('industry_experts')
          .update(payload)
          .eq('id', expertId);
        if (error) throw error;
      } else {
        const baseSlug = form.full_name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const { data: existing } = await supabase
          .from('industry_experts')
          .select('id')
          .eq('slug', baseSlug)
          .maybeSingle();

        if (existing) {
          finalExpertId = existing.id;
          const { error } = await supabase
            .from('industry_experts')
            .update(payload)
            .eq('id', existing.id);
          if (error) throw error;
        } else {
          const { data: newExpert, error } = await supabase
            .from('industry_experts')
            .insert({ ...payload, slug: baseSlug })
            .select()
            .single();
          if (error) throw error;
          finalExpertId = newExpert?.id;
        }
      }

      // Sync city assignments — add any new ones from the form
      if (finalExpertId) {
        const { data: existingAssignments, error: existingAssignmentsError } = await supabase
          .from('expert_city_assignments')
          .select('city_slug')
          .eq('expert_id', finalExpertId);

        if (existingAssignmentsError) throw existingAssignmentsError;

        const existingCitySlugs = new Set((existingAssignments || []).map(a => a.city_slug));
        for (const assignment of myAssignments) {
          if (existingCitySlugs.has(assignment.city_slug)) continue;

          const { error: insertAssignmentError } = await supabase
            .from('expert_city_assignments')
            .insert({
              expert_id: finalExpertId,
              city_slug: assignment.city_slug,
              published: false,
            });

          if (insertAssignmentError) throw insertAssignmentError;
        }
      }

      toast({ title: "Profile saved!", description: "Your industry expert card is ready." });
      onComplete();
    } catch (err: any) {
      toast({ title: "Error saving", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const previewData: Partial<Expert> = {
    ...form,
    years_in_industry: form.years_in_industry ? parseInt(form.years_in_industry) : undefined,
    years_in_city: form.years_in_city ? parseInt(form.years_in_city) : undefined,
  } as Partial<Expert>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-events-cream/50 text-sm">
          Return anytime to edit your card. Fields marked * are required — everything else makes your card shine.
        </p>

        {/* Required Fields */}
        <div className="space-y-4 p-4 rounded-lg bg-events-card/50 border border-events-cream/10">
          <h4 className="text-events-coral font-display font-semibold text-sm uppercase tracking-wider">Required</h4>

          <div className="space-y-2">
            <Label className="text-events-cream">Full Name *</Label>
            <Input value={form.full_name} onChange={e => update('full_name', e.target.value)} required
              className="bg-events-card border-events-cream/20 text-events-cream" />
          </div>

          <div className="space-y-2">
            <Label className="text-events-cream">Email * <span className="text-events-cream/40 text-xs">(not shown publicly — admin only)</span></Label>
            <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} required
              className="bg-events-card border-events-cream/20 text-events-cream" />
          </div>

          <div className="space-y-2">
            <Label className="text-events-cream">Current Company *</Label>
            <Input value={form.current_company} onChange={e => update('current_company', e.target.value)} required
              className="bg-events-card border-events-cream/20 text-events-cream" />
          </div>

          <div className="space-y-2">
            <Label className="text-events-cream">Event Location(s)</Label>
            <div className="flex flex-wrap gap-2">
              {myAssignments.map(a => (
                <Badge key={a.city_slug} className="bg-events-coral/20 text-events-coral border-events-coral/30 text-xs flex items-center gap-1">
                  {a.city_name}
                  {myAssignments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setMyAssignments(prev => prev.filter(p => p.city_slug !== a.city_slug))}
                      className="hover:text-white transition-colors ml-0.5"
                      title={`Remove ${a.city_name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {/* Show cities not yet assigned */}
            {allCities.filter(c => !myAssignments.some(a => a.city_slug === c.slug)).length > 0 && (
              <div className="mt-2">
                <p className="text-events-cream/40 text-xs mb-1.5">Add another event location:</p>
                <div className="flex flex-wrap gap-1.5">
                  {allCities
                    .filter(c => !myAssignments.some(a => a.city_slug === c.slug))
                    .map(c => (
                      <Badge
                        key={c.slug}
                        className="cursor-pointer bg-transparent text-events-cream/50 border-events-cream/20 hover:border-events-coral hover:text-events-coral text-xs transition-colors"
                        onClick={() => setMyAssignments(prev => [...prev, { city_slug: c.slug, city_name: c.name }])}
                      >
                        + {c.name}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <h4 className="text-events-yellow font-display font-semibold text-sm uppercase tracking-wider">Profile Details</h4>

          <div className="space-y-2">
            <Label className="text-events-cream">Job Title</Label>
            <Input value={form.job_title} onChange={e => update('job_title', e.target.value)}
              className="bg-events-card border-events-cream/20 text-events-cream" placeholder="VP of Marketing" />
          </div>

          <div className="space-y-2">
            <Label className="text-events-cream">Photo</Label>
            <div className="flex gap-2">
              <label className="flex-1">
                <div className="flex items-center gap-2 px-3 py-2 bg-events-card border border-events-cream/20 rounded-md cursor-pointer hover:bg-events-card/80 transition-colors text-events-cream/60 text-sm">
                  <Upload className="w-4 h-4" /> Upload photo
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              <Input
                value={form.photo_url}
                onChange={e => update('photo_url', e.target.value)}
                className="flex-1 bg-events-card border-events-cream/20 text-events-cream text-sm"
                placeholder="or paste image URL"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-events-cream">LinkedIn URL</Label>
            <Input value={form.linkedin_url} onChange={e => update('linkedin_url', e.target.value)}
              className="bg-events-card border-events-cream/20 text-events-cream" placeholder="https://linkedin.com/in/you" />
          </div>

          <div className="space-y-2">
            <Label className="text-events-cream">Ask Me About</Label>
            <p className="text-events-cream/40 text-xs">The main thing you can give advice about. e.g. "Contracting at Nike" or "Inclusive Design"</p>
            <Input value={form.ask_me_about} onChange={e => update('ask_me_about', e.target.value)}
              className="bg-events-card border-events-cream/20 text-events-cream" />
          </div>

          <div className="space-y-2">
            <Label className="text-events-cream">Field of Work</Label>
            <Select value={form.field_of_work} onValueChange={v => update('field_of_work', v)}>
              <SelectTrigger className="bg-events-card border-events-cream/20 text-events-cream">
                <SelectValue placeholder="Select your field" />
              </SelectTrigger>
              <SelectContent className="bg-events-card border-events-cream/20 max-h-60">
                {FIELD_OPTIONS.map(f => (
                  <SelectItem key={f} value={f} className="text-events-cream">{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-events-cream">Years in Industry</Label>
              <Input inputMode="numeric" pattern="[0-9]*" value={form.years_in_industry} onChange={e => update('years_in_industry', e.target.value.replace(/[^0-9]/g, ''))}
                className="bg-events-card border-events-cream/20 text-events-cream [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
            <div className="space-y-2">
              <Label className="text-events-cream">Years in {cityName}</Label>
              <Input inputMode="numeric" pattern="[0-9]*" value={form.years_in_city} onChange={e => update('years_in_city', e.target.value.replace(/[^0-9]/g, ''))}
                className="bg-events-card border-events-cream/20 text-events-cream [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-events-cream">Previous Companies</Label>
            <p className="text-events-cream/40 text-xs">Comma separated — we'll show their logos</p>
            <Input value={form.previous_companies} onChange={e => update('previous_companies', e.target.value)}
              className="bg-events-card border-events-cream/20 text-events-cream" placeholder="Nike, REI, Patagonia" />
          </div>

          <div className="space-y-2">
            <Label className="text-events-cream">Favorite Media / Conversation Starter</Label>
            <p className="text-events-cream/40 text-xs">An article or podcast you've been in that represents you well</p>
            <Textarea value={form.favorite_media} onChange={e => update('favorite_media', e.target.value)}
              className="bg-events-card border-events-cream/20 text-events-cream min-h-[60px]" />
          </div>

          <div className="space-y-2">
            <Label className="text-events-cream">Niche Interests</Label>
            <p className="text-events-cream/40 text-xs">Click to toggle, or type a custom one below</p>
            <div className="flex flex-wrap gap-1.5">
              {NICHE_OPTIONS.map(niche => (
                <Badge
                  key={niche}
                  className={`cursor-pointer text-xs transition-colors ${
                    form.niche_interests.includes(niche)
                      ? 'bg-events-coral text-events-cream border-events-coral'
                      : 'bg-transparent text-events-cream/50 border-events-cream/20 hover:border-events-cream/40'
                  }`}
                  onClick={() => toggleNiche(niche)}
                >
                  {niche}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={customNiche}
                onChange={e => setCustomNiche(e.target.value)}
                placeholder="Custom interest..."
                className="bg-events-card border-events-cream/20 text-events-cream text-sm"
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomNiche())}
              />
              <Button type="button" size="sm" onClick={addCustomNiche} variant="outline"
                className="border-events-cream/20 text-events-cream hover:bg-events-coral/20">Add</Button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream font-semibold text-lg py-6"
        >
          {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save My Card'}
        </Button>
      </form>

      {/* Live Preview */}
      <div className="hidden lg:block">
        <ExpertLivePreview data={previewData} />
      </div>
    </div>
  );
};

export default ExpertIntakeForm;
