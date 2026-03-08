import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { supabase } from "@/integrations/supabase/client";
import { nameToSlug, ExpertCity } from "@/lib/expert-types";
import { Plus, Loader2 } from "lucide-react";

interface AddExpertDialogProps {
  cities: ExpertCity[];
  onAdded: () => void;
}

const AddExpertDialog = ({ cities, onAdded }: AddExpertDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [citySlug, setCitySlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !citySlug) return;

    setLoading(true);
    try {
      const slug = nameToSlug(name);

      // Attempt LinkedIn scrape if URL provided
      let scrapedData: Record<string, any> = {};
      if (linkedinUrl.trim()) {
        setScraping(true);
        try {
          const { data, error } = await supabase.functions.invoke('scrape-linkedin', {
            body: { url: linkedinUrl.trim() },
          });
          if (!error && data?.success && data?.data) {
            scrapedData = data.data;
            toast({ title: "LinkedIn data extracted!", description: `Found: ${scrapedData.headline || scrapedData.name || 'basic info'}` });
          } else {
            toast({ title: "LinkedIn scrape limited", description: "Could not extract full profile. You can fill in details manually.", variant: "destructive" });
          }
        } catch {
          toast({ title: "LinkedIn scrape failed", description: "Proceeding with manual entry.", variant: "destructive" });
        }
        setScraping(false);
      }

      const { data: user } = await supabase.auth.getUser();

      const { error } = await supabase.from('industry_experts').insert({
        full_name: name.trim(),
        slug,
        email: null,
        linkedin_url: linkedinUrl.trim() || null,
        job_title: scrapedData.headline || null,
        current_company: scrapedData.company || null,
        photo_url: scrapedData.photoUrl || null,
        status: 'invited' as const,
        created_by: user.user?.id || null,
      });

      if (error) throw error;

      // Create city assignment
      const { data: expert } = await supabase
        .from('industry_experts')
        .select('id')
        .eq('slug', slug)
        .single();

      if (expert) {
        await supabase.from('expert_city_assignments').insert({
          expert_id: expert.id,
          city_slug: citySlug,
          published: false,
        });
      }

      toast({ title: "Expert added!", description: `Personalized URL: /${citySlug === 'denver' ? 'Denver' : citySlug === 'portland' ? 'Portland' : 'MN'}experts/${slug}` });
      setName("");
      setLinkedinUrl("");
      setCitySlug("");
      setOpen(false);
      onAdded();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-events-coral hover:bg-events-coral/90 text-events-cream">
          <Plus className="w-4 h-4 mr-1" /> Add Expert
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-events-teal border-events-cream/20 text-events-cream">
        <DialogHeader>
          <DialogTitle className="font-display text-events-coral">Add Industry Expert</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-events-cream">Full Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-events-card border-events-cream/20 text-events-cream"
              placeholder="Jane Smith"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-events-cream">City / Event *</Label>
            <Select value={citySlug} onValueChange={setCitySlug} required>
              <SelectTrigger className="bg-events-card border-events-cream/20 text-events-cream">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent className="bg-events-card border-events-cream/20">
                {cities.map((city) => (
                  <SelectItem key={city.slug} value={city.slug} className="text-events-cream">
                    {city.name} — {city.event_title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-events-cream">LinkedIn URL (optional)</Label>
            <Input
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="bg-events-card border-events-cream/20 text-events-cream"
              placeholder="https://linkedin.com/in/janesmith"
            />
            <p className="text-events-cream/40 text-xs">We'll try to auto-populate their card from LinkedIn</p>
          </div>
          <Button
            type="submit"
            disabled={loading || !name.trim() || !citySlug}
            className="w-full bg-events-coral hover:bg-events-coral/90 text-events-cream"
          >
            {scraping ? (
              <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Scraping LinkedIn...</>
            ) : loading ? (
              <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Adding...</>
            ) : (
              'Add & Generate Link'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpertDialog;
