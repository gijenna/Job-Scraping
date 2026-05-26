import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import EditableText from "@/components/EditableText";
import EditableLink from "@/components/EditableLink";
import ExpertCardMinimal from "@/components/experts/ExpertCardMinimal";
import { Expert } from "@/lib/expert-types";
import edgesLogo from "@/assets/edges-first-logo.png";
import nemoLogo from "@/assets/nemo-logo.webp";

interface Props {
  kellyExpert?: Expert | null;
  accentColor?: string;
}

const EDGES_URL = "https://edgesfirst.co/";
const NEMO_URL = "https://www.nemoequipment.com/";
const STARGAZE_URL =
  "https://www.nemoequipment.com/products/stargaze-reclining-camp-chair?srsltid=AfmBOooCxukfQY4K6rdxrMAaOlplT0WGO3zluKCeakLezu11lq-eGcl3";

// Filter to recolor the dark-blue Edges logo PNG to cream (#F5E6D3-ish)
const creamFilter: React.CSSProperties = {
  filter:
    "brightness(0) saturate(100%) invert(94%) sepia(13%) saturate(556%) hue-rotate(335deg) brightness(99%) contrast(94%)",
};

const ExpertSponsorCallout = ({ kellyExpert, accentColor = "#ED7660" }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative mb-8 rounded-2xl overflow-hidden border border-events-coral/40 bg-gradient-to-br from-events-coral/15 via-events-cream/5 to-transparent px-5 py-4 md:px-6 md:py-5 shadow-[0_0_60px_-15px_rgba(237,118,96,0.35)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-30"
        style={{ background: accentColor }}
      />

      <div className="relative flex flex-col gap-3">
        {/* Header row: logo + eyebrow */}
        <div className="flex items-center gap-3">
          <a
            href={EDGES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 hover:scale-105 transition-transform"
          >
            <img
              src={edgesLogo}
              alt="Edges First"
              style={creamFilter}
              className="h-10 md:h-12 w-auto object-contain"
            />
          </a>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-events-coral/20 border border-events-coral/40">
            <Sparkles className="w-3 h-3 text-events-coral" />
            <EditableText
              settingKey="denver_expert_sponsor_eyebrow"
              defaultText="Industry Expert Program Sponsor"
              as="span"
              className="text-[10px] md:text-xs font-display font-bold uppercase tracking-[0.2em] text-events-coral"
            />
          </div>
        </div>

        {/* Headline */}
        <h3 className="font-headline font-bold text-lg md:text-xl text-events-cream leading-tight">
          <EditableText
            settingKey="denver_expert_sponsor_headline"
            defaultText="The Industry Expert program is made possible by Edges First"
            as="span"
          />
        </h3>

        {/* Blurb */}
        <EditableText
          settingKey="denver_expert_sponsor_blurb"
          defaultText="Edges First is a digital experience and web development shop founded by Kelly Bleck, rooted in outdoor recreation. Kelly built this entire Industry Expert program for us. Go say thanks and send her some real visits."
          as="p"
          className="font-body text-events-cream/85 text-sm leading-relaxed"
          multiline
        />

        {/* Action row: CTA + Meet Kelly text + Kelly minimal card */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <EditableLink
            textKey="denver_expert_sponsor_cta_text"
            urlKey="denver_expert_sponsor_cta_url"
            defaultText="Visit edgesfirst.co"
            defaultUrl={EDGES_URL}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-events-coral text-events-cream font-display font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-events-coral/90 transition-colors shadow-lg"
          />

          {kellyExpert && (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-body italic text-events-cream/90 text-sm md:text-base">
                <Heart className="w-4 h-4 fill-events-coral text-events-coral" />
                <EditableText
                  settingKey="denver_expert_sponsor_meet_kelly_text"
                  defaultText="Meet Kelly"
                  as="span"
                />
              </span>

              <div className="relative">
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-[-4px] left-1/2 -translate-x-1/2 w-[88px] h-[88px] rounded-full ring-2 ring-events-coral/70 animate-pulse shadow-[0_0_25px_rgba(237,118,96,0.55)] z-0"
                />
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-1.5 py-0.5 rounded-full bg-events-coral text-events-cream text-[8px] font-display font-bold uppercase tracking-wider shadow-lg whitespace-nowrap">
                  Made this possible
                </span>
                <div className="relative z-10">
                  <ExpertCardMinimal expert={kellyExpert} className="!gap-1" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nemo seats credit */}
        <div className="mt-1 pt-3 border-t border-events-cream/15 flex items-center gap-3">
          <a
            href={NEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 hover:scale-105 transition-transform"
          >
            <img src={nemoLogo} alt="Nemo Equipment" className="h-9 w-auto object-contain" />
          </a>
          <p className="font-body text-events-cream/80 text-xs md:text-sm">
            <EditableText
              settingKey="denver_nemo_seats_lead"
              defaultText="Seats provided by Nemo. Chat with experts in comfy "
              as="span"
            />
            <EditableLink
              textKey="denver_nemo_chair_text"
              urlKey="denver_nemo_chair_url"
              defaultText="Stargaze chairs"
              defaultUrl={STARGAZE_URL}
              className="font-semibold text-events-coral underline-offset-4 hover:underline"
            />
            <span>.</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpertSponsorCallout;
