import { Linkedin, Twitter, Copy, Share2, Check, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ShareCardButtonsProps {
  expertSlug: string;
  expertName: string;
  citySlug: string;
  eventTitle?: string;
  compact?: boolean;
}

const CITY_EVENT_PAGE: Record<string, string> = {
  portland: "/PNW26",
  denver: "/OutsideDays26",
  minneapolis: "/events",
};

const ShareCardButtons = ({ expertSlug, expertName, citySlug, eventTitle, compact = false }: ShareCardButtonsProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const shareUrl = `https://${projectId}.supabase.co/functions/v1/expert-og/${encodeURIComponent(expertSlug)}/${encodeURIComponent(citySlug)}`;
  
  const siteBase = "https://sponsor-attract-hub.lovable.app";
  const eventPage = `${siteBase}${CITY_EVENT_PAGE[citySlug] || "/events"}`;
  
  const eventLabel = eventTitle || (citySlug === "portland" ? "Gather PNW" : citySlug === "denver" ? "Outside Days Denver" : "Basecamp Outdoor");
  const firstName = expertName.split(" ")[0];

  const shareText = `I'm an Industry Expert at ${eventLabel} by @BasecampOutdoor! Come meet me and other outdoor industry professionals. Register free → ${eventPage}`;

  const handleLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=500");
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=500");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Link copied!", description: "Share it anywhere you'd like." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Please copy the URL manually.", variant: "destructive" });
    }
  };

  if (compact) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="border-events-cream/20 text-events-cream/60 hover:text-events-cream hover:bg-events-card gap-1.5"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-display font-semibold text-events-cream flex items-center gap-2">
        <Share2 className="w-4 h-4 text-events-coral" />
        Share your card on social media
      </h4>
      <p className="text-events-cream/60 text-sm">
        Help us spread the word, {firstName}! Share your expert card and invite others to the event.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="border-[#0077B5]/40 text-[#0077B5] hover:bg-[#0077B5]/10 gap-2"
          onClick={handleLinkedIn}
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-events-cream/20 text-events-cream hover:bg-events-card gap-2"
          onClick={handleTwitter}
        >
          <Twitter className="w-4 h-4" />
          X / Twitter
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-events-cream/20 text-events-cream hover:bg-events-card gap-2"
          onClick={handleCopy}
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </div>

      {citySlug === "minneapolis" && (
        <div className="pt-3 border-t border-events-cream/10 space-y-2">
          <p className="text-events-cream/60 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            Download images for social
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { fmt: "og", label: "Post (1200×630)" },
              { fmt: "ig_portrait", label: "IG Post (1080×1350)" },
              { fmt: "ig_story", label: "IG Story (1080×1920)" },
            ].map(({ fmt, label }) => {
              const url = `https://${projectId}.supabase.co/functions/v1/expert-card-image/${encodeURIComponent(expertSlug)}/minneapolis?format=${fmt}&download=1`;
              return (
                <Button
                  key={fmt}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-events-cream/20 text-events-cream/80 hover:text-events-cream hover:bg-events-card gap-1.5"
                  onClick={() => window.open(url, "_blank")}
                >
                  <Download className="w-3.5 h-3.5" />
                  {label}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareCardButtons;
