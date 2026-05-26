import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";
import { clearbitFromUrl, faviconFromUrl } from "@/lib/url-logo";

interface Props {
  kellySlug?: string | null;
  accentColor?: string;
}

const EDGES_URL = "https://edgesfirst.co/";
const NEMO_URL = "https://www.nemoequipment.com/";

const ExpertSponsorCallout = ({ kellySlug, accentColor = "#ED7660" }: Props) => {
  const edgesLogo = clearbitFromUrl(EDGES_URL) || faviconFromUrl(EDGES_URL, 256);
  const nemoLogo = clearbitFromUrl(NEMO_URL) || faviconFromUrl(NEMO_URL, 128);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative mb-10 rounded-3xl overflow-hidden border border-events-coral/40 bg-gradient-to-br from-events-coral/15 via-events-cream/5 to-transparent p-6 md:p-8 shadow-[0_0_60px_-15px_rgba(237,118,96,0.35)]"
    >
      {/* Glow accent */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30"
        style={{ background: accentColor }}
      />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Logo */}
        <a
          href={EDGES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-events-cream flex items-center justify-center border-4 border-events-coral shadow-xl hover:scale-105 transition-transform"
        >
          {edgesLogo ? (
            <img
              src={edgesLogo}
              alt="Edges First"
              className="w-20 h-20 md:w-24 md:h-24 object-contain"
              onError={(e) => {
                const fb = faviconFromUrl(EDGES_URL, 256);
                if (fb && (e.currentTarget as HTMLImageElement).src !== fb) {
                  (e.currentTarget as HTMLImageElement).src = fb;
                }
              }}
            />
          ) : (
            <span className="font-display font-bold text-events-teal text-xl">EF</span>
          )}
        </a>

        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-events-coral/20 border border-events-coral/40 mb-3">
            <Sparkles className="w-3 h-3 text-events-coral" />
            <EditableText
              settingKey="denver_expert_sponsor_eyebrow"
              defaultText="Industry Expert Program Sponsor"
              as="span"
              className="text-[10px] md:text-xs font-display font-bold uppercase tracking-[0.2em] text-events-coral"
            />
          </div>

          <h3 className="font-headline font-bold text-xl md:text-2xl text-events-cream leading-tight mb-2">
            <EditableText
              settingKey="denver_expert_sponsor_headline"
              defaultText="The Industry Expert program is made possible by Edges First"
              as="span"
            />
          </h3>

          <EditableText
            settingKey="denver_expert_sponsor_blurb"
            defaultText="Edges First is a digital experience and web development shop founded by Kelly Bleck, rooted in outdoor recreation and community-impact work. Kelly built this entire Industry Expert program for us. Go say thanks, check out her work, and send her some real visits."
            as="p"
            className="font-body text-events-cream/85 text-sm md:text-base leading-relaxed mb-4"
            multiline
          />

          <div className="flex flex-wrap gap-3">
            <EditableLink
              textKey="denver_expert_sponsor_cta_text"
              urlKey="denver_expert_sponsor_cta_url"
              defaultText="Visit edgesfirst.co"
              defaultUrl={EDGES_URL}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-events-coral text-events-cream font-display font-bold text-sm uppercase tracking-wider hover:bg-events-coral/90 transition-colors shadow-lg"
            />
            {kellySlug && (
              <a
                href={`#expert-${kellySlug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-events-cream/40 text-events-cream font-display font-bold text-sm uppercase tracking-wider hover:border-events-cream hover:bg-events-cream/5 transition-colors"
              >
                <Heart className="w-4 h-4 fill-events-coral text-events-coral" />
                Meet Kelly Below
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Nemo seats credit */}
      <div className="relative mt-6 pt-5 border-t border-events-cream/15 flex items-center gap-3">
        <a
          href={NEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 w-12 h-12 rounded-xl bg-events-cream flex items-center justify-center border border-events-cream/30 hover:scale-105 transition-transform"
        >
          {nemoLogo ? (
            <img src={nemoLogo} alt="Nemo Equipment" className="w-9 h-9 object-contain" />
          ) : (
            <span className="font-display font-bold text-events-teal text-xs">NEMO</span>
          )}
        </a>
        <EditableText
          settingKey="denver_nemo_seats_text"
          defaultText="Seats provided by Nemo. Chat with experts in comfy Stargaze chairs."
          as="p"
          className="font-body text-events-cream/80 text-sm md:text-base"
        />
      </div>
    </motion.div>
  );
};

export default ExpertSponsorCallout;
