import React from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import EditableText from "@/components/EditableText";
import { useEditableTextContext } from "@/components/EditableTextProvider";

interface LogoItem {
  name: string;
  domain: string;
  logo_url?: string | null;
  url?: string | null;
}

interface CascadingLogoBubblesProps {
  logos: LogoItem[];
  bubbleColor?: string;
  editKeyPrefix?: string;
}

const CascadingLogoBubbles = ({
  logos,
  bubbleColor = "#F5E6D3",
  editKeyPrefix = "bubbles",
}: CascadingLogoBubblesProps) => {
  const isMobile = useIsMobile();
  const { isAdmin } = useEditableTextContext();

  if (logos.length === 0) return null;

  const spreadPercent = Math.min(85, logos.length * 15);
  const centerOffset = (100 - spreadPercent) / 2;

  const rainLogos = logos.map((logo, i) => ({
    logo,
    leftPercent: logos.length === 1
      ? 50
      : centerOffset + (i / (logos.length - 1)) * spreadPercent,
    delay: 0.3 + i * 0.18,
    rotate: ['-5deg', '7deg', '-8deg', '6deg', '-4deg', '9deg', '-7deg', '5deg', '-3deg', '11deg', '-6deg', '4deg', '-8deg'][i % 13],
  }));

  return (
    <div className="relative overflow-hidden py-4 md:py-6">
      {/* Admin editable subtitle area */}
      {isAdmin && (
        <div className="text-center mb-4 relative z-10">
          <p className="text-events-cream/40 text-xs">
            <EditableText settingKey={`${editKeyPrefix}_subtitle`} defaultText="" as="span" />
          </p>
        </div>
      )}
      <div className="relative h-24 md:h-32 overflow-hidden">
        {rainLogos.map((item, i) => {
          const imgSrc = item.logo.logo_url || `https://www.google.com/s2/favicons?domain=${item.logo.domain}&sz=128`;
          const bubble = (
            <motion.div
              initial={{ y: "-100%", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "200px" }}
              transition={{
                y: { duration: 2.5, delay: item.delay, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.5, delay: item.delay },
              }}
              className="absolute bottom-3 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg"
              style={{ left: `${item.leftPercent}%`, transform: `rotate(${item.rotate})`, backgroundColor: bubbleColor }}
            >
              <motion.div
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.2, 0.9, 1.05, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item.delay + 2.4, ease: "easeOut" }}
              >
                <img src={imgSrc} alt={item.logo.name} className="w-5 h-5 md:w-8 md:h-8 object-contain" style={{ mixBlendMode: 'multiply' }} />
              </motion.div>
            </motion.div>
          );

          return item.logo.url ? (
            <a key={i} href={item.logo.url} target="_blank" rel="noopener noreferrer">
              {bubble}
            </a>
          ) : (
            <React.Fragment key={i}>{bubble}</React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CascadingLogoBubbles;
