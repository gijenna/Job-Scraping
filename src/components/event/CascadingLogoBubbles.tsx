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

  // On mobile, wrap into rows so every logo is visible. On desktop, keep cascading line.
  const perRow = isMobile ? 6 : logos.length;
  const rows: typeof logos[] = [];
  for (let i = 0; i < logos.length; i += perRow) {
    rows.push(logos.slice(i, i + perRow));
  }

  const rotateAt = (i: number) =>
    ['-5deg', '7deg', '-8deg', '6deg', '-4deg', '9deg', '-7deg', '5deg', '-3deg', '11deg', '-6deg', '4deg', '-8deg'][i % 13];

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

      {isMobile ? (
        <div className="flex flex-col gap-2 items-center">
          {rows.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-6 gap-2 justify-items-center w-full max-w-[320px]">
              {row.map((logo, i) => {
                const globalIdx = rIdx * perRow + i;
                const imgSrc = logo.logo_url || `https://www.google.com/s2/favicons?domain=${logo.domain}&sz=128`;
                const normalizedUrl = logo.url?.trim()
                  ? (logo.url.trim().startsWith("http") ? logo.url.trim() : `https://${logo.url.trim()}`)
                  : null;
                const bubble = (
                  <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "100px" }}
                    transition={{ duration: 0.5, delay: 0.05 * globalIdx, ease: [0.22, 1, 0.36, 1] }}
                    className="w-11 h-11 rounded-full flex items-center justify-center shadow-md"
                    style={{ transform: `rotate(${rotateAt(globalIdx)})`, backgroundColor: bubbleColor }}
                  >
                    <img src={imgSrc} alt={logo.name} className="w-6 h-6 object-contain" style={{ mixBlendMode: 'multiply' }} />
                  </motion.div>
                );
                return normalizedUrl ? (
                  <a key={globalIdx} href={normalizedUrl} target="_blank" rel="noopener noreferrer">{bubble}</a>
                ) : (
                  <React.Fragment key={globalIdx}>{bubble}</React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
      <div className="relative h-24 md:h-32 overflow-hidden">
        {(() => {
          const spreadPercent = Math.min(85, logos.length * 15);
          const centerOffset = (100 - spreadPercent) / 2;
          const rainLogos = logos.map((logo, i) => ({
            logo,
            leftPercent: logos.length === 1 ? 50 : centerOffset + (i / (logos.length - 1)) * spreadPercent,
            delay: 0.3 + i * 0.18,
            rotate: rotateAt(i),
          }));
          return rainLogos.map((item, i) => {
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
            const normalizedUrl = item.logo.url?.trim()
              ? (item.logo.url.trim().startsWith("http") ? item.logo.url.trim() : `https://${item.logo.url.trim()}`)
              : null;
            return normalizedUrl ? (
              <a key={i} href={normalizedUrl} target="_blank" rel="noopener noreferrer" className="cursor-pointer">{bubble}</a>
            ) : (
              <React.Fragment key={i}>{bubble}</React.Fragment>
            );
          });
        })()}
      </div>
      )}
    </div>
  );
};

export default CascadingLogoBubbles;
