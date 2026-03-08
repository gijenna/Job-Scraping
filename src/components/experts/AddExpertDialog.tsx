import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { nameToSlug, ExpertCity } from "@/lib/expert-types";
import { Plus, Loader2, Copy, ExternalLink, Link2, Check } from "lucide-react";

interface AddExpertDialogProps {
  cities: ExpertCity[];
  onAdded: () => void;
}

const AddExpertDialog = ({ cities, onAdded }: AddExpertDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [citySlug, setCitySlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getCityPrefix = (slug: string) =>
    slug === 'denver' ? 'Denver' : slug === 'portland' ? 'Portland' : 'MN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !citySlug) return;

    setLoading(true);
    try {
      const slug = nameToSlug(name);
      const { data: user } = await supabase.auth.getUser();

      // Check if expert already exists
      const { data: existing } = await supabase
        .from('industry_experts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      let expertId: string;

      if (existing) {
        expertId = existing.id;
      } else {
        const { data: newExpert, error } = await supabase.from('industry_experts').insert({
          full_name: name.trim(),
          slug,
          status: 'invited' as const,
          created_by: user.user?.id || null,
        }).select('id').single();

        if (error) throw error;
        expertId = newExpert.id;
      }

      // Ensure city assignment exists
      const { data: assignmentExists } = await supabase
        .from('expert_city_assignments')
        .select('id')
        .eq('expert_id', expertId)
        .eq('city_slug', citySlug)
        .maybeSingle();

      if (!assignmentExists) {
        await supabase.from('expert_city_assignments').insert({
          expert_id: expertId,
          city_slug: citySlug,
          published: false,
        });
      }

      const prefix = getCityPrefix(citySlug);
      const url = `${window.location.origin}/${prefix}experts/${slug}`;
      setGeneratedUrl(url);
      onAdded();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast({ title: "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setName("");
    setCitySlug("");
    setGeneratedUrl("");
    setCopied(false);
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) handleReset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="bg-events-coral hover:bg-events-coral/90 text-events-cream">
          <Plus className="w-4 h-4 mr-1" /> Add Expert
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-events-cream border-events-cream/20 text-events-teal sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-events-teal/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-events-teal" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl text-events-teal">Generate Pitch Link</DialogTitle>
              <p className="text-events-teal/60 text-sm mt-0.5">
                Create a personalized landing page URL to send to prospective Industry Experts.
              </p>
            </div>
          </div>
        </DialogHeader>

        {!generatedUrl ? (
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-events-teal font-semibold">Expert's Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-events-teal/5 border-events-teal/15 text-events-teal h-12 text-base"
                placeholder="Hannah Harrick"
              />
            </div>

            {/* City Selection - Card Style */}
            <div className="space-y-2">
              <Label className="text-events-teal font-semibold">Event Location</Label>
              <div className="grid grid-cols-2 gap-3">
                {cities.map((city) => (
                  <button
                    key={city.slug}
                    type="button"
                    onClick={() => setCitySlug(city.slug)}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                      citySlug === city.slug
                        ? 'border-events-teal bg-events-teal/5 shadow-md'
                        : 'border-events-teal/15 hover:border-events-teal/30 bg-white'
                    }`}
                  >
                    {citySlug === city.slug && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-events-teal flex items-center justify-center">
                        <Check className="w-3 h-3 text-events-cream" />
                      </div>
                    )}
                    <span className="font-display font-bold text-lg text-events-teal block">{city.name}</span>
                    <span className="text-events-teal/50 text-sm">{city.event_location || city.event_title}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !name.trim() || !citySlug}
              className="w-full bg-events-teal hover:bg-events-teal/90 text-events-cream h-12 text-base font-display"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
              ) : (
                'Generate Link'
              )}
            </Button>
          </form>
        ) : (
          /* Success State - Show URL */
          <div className="space-y-5 mt-2">
            <div className="space-y-2">
              <Label className="text-events-teal font-semibold">Your Personalized Link</Label>
              <div className="bg-white border border-events-teal/15 rounded-xl p-4">
                <p className="text-events-teal/70 text-sm break-all font-mono leading-relaxed">
                  {generatedUrl}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCopy}
                className="flex-1 bg-events-coral hover:bg-events-coral/90 text-events-cream h-12 font-display"
              >
                {copied ? (
                  <><Check className="w-4 h-4 mr-2" /> Copied!</>
                ) : (
                  <><Copy className="w-4 h-4 mr-2" /> Copy Link</>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(generatedUrl, '_blank')}
                className="flex-1 border-events-teal/20 text-events-teal hover:bg-events-teal/5 h-12 font-display"
              >
                Preview <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <button
              onClick={handleReset}
              className="w-full text-events-teal/40 hover:text-events-teal/70 text-sm transition-colors"
            >
              + Add another expert
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddExpertDialog;
