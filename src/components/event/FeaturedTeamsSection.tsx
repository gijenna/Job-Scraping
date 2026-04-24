import { motion } from "framer-motion";
import EditableText from "@/components/EditableText";
import CascadingLogoBubbles from "@/components/event/CascadingLogoBubbles";
import BrandUmbrellaSection from "@/components/event/BrandUmbrellaSection";
import { Expert } from "@/lib/expert-types";

interface FeaturedTeamsSectionProps {
  brandReps: Expert[];
  bubbleLogos: { name: string; domain: string; logo_url: string | null }[];
  accentColor?: string;
  bgColor?: string;
  bubbleColor?: string;
  editKeyPrefix?: string;
  eyebrowKey?: string;
  headlineKey?: string;
  eventSlug?: string;
  highlightBrandRep?: string;
}

const FeaturedTeamsSection = ({
  brandReps,
  bubbleLogos,
  accentColor = "#FEE123",
  bgColor = "#154733",
  bubbleColor = "#e8f0d8",
  editKeyPrefix = "pnw_bubbles",
  eyebrowKey = "pnw_brand_reps_eyebrow",
  headlineKey = "pnw_brand_reps_headline",
  eventSlug = "pnw26",
  highlightBrandRep,
}: FeaturedTeamsSectionProps) => {
  if (brandReps.length === 0 && bubbleLogos.length === 0) return null;

  return (
    <section className="py-10 md:py-14 px-6" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-2">
          <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body" style={{ color: accentColor }}>
            <EditableText settingKey={eyebrowKey} defaultText="Featured Brands" as="span" />
          </p>
          <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-cream">
            <EditableText settingKey={headlineKey} defaultText="Meet the Teams" as="span" />
          </h2>
          <p className="font-body text-events-cream/70 text-sm md:text-base max-w-2xl mx-auto mt-4">
            <EditableText
              settingKey={`${headlineKey}_subtitle`}
              defaultText="If you see a logo below, that brand will be exhibiting on-site. Brands decide which team members to send based on registrant lists, so check back to see which departments will be represented."
              as="span"
            />
          </p>
        </motion.div>

        <CascadingLogoBubbles logos={bubbleLogos} bubbleColor={bubbleColor} editKeyPrefix={editKeyPrefix} />

        {brandReps.length > 0 && (
          <BrandUmbrellaSection experts={brandReps} accentColor={accentColor} eventSlug={eventSlug} highlightBrandRep={highlightBrandRep} />
        )}
      </div>
    </section>
  );
};

export default FeaturedTeamsSection;
