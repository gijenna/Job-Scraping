import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import EditableText from "@/components/EditableText";

import eventReiConvo from "@/assets/event-rei-convo.jpg";
import eventCrowdConvo from "@/assets/event-crowd-convo.png";
import eventCareerCoaching from "@/assets/event-career-coaching.jpg";
import eventPnwNetworking from "@/assets/event-pnw-networking.jpg";
import eventPnwPanel from "@/assets/event-pnw-panel.jpg";

interface TierAccordion {
  id: string;
  title: string;
  subtitle: string;
  spots: string;
  backgroundImage: string;
  perks: string[];
}

const tiers: TierAccordion[] = [
  {
    id: "hiring",
    title: "Hiring Table",
    subtitle: "Your brand, your team, your conversations — 5–10 min quality chats",
    spots: "7 available",
    backgroundImage: eventReiConvo,
    perks: [
      "Hiring table inside event",
      "Up to 5 brand representatives",
      "Logo & careers page link on event website & registration",
      "Exposure to our 300K+ community",
    ],
  },
  {
    id: "deluxe",
    title: "Deluxe Branding Space",
    subtitle: "Larger space, product demos, stage spotlight — combine HR & marketing budgets",
    spots: "4 available",
    backgroundImage: eventCrowdConvo,
    perks: [
      "Everything in Hiring Table, plus:",
      "Much larger activation space",
      "Up to 20 brand representatives",
      "Room for product display or activation",
      "2-minute stage spotlight during main program",
      "Dedicated social post to 50K LinkedIn / 80K Facebook / 40K IG",
      "Free Candidate Match boost ($400) from Basecamp Match",
    ],
  },
  {
    id: "title",
    title: "Title Sponsorship",
    subtitle: "Top billing. Full integration. The event is yours.",
    spots: "1–2 available",
    backgroundImage: eventCareerCoaching,
    perks: [
      '"Gather PNW 2026, Presented by [You]"',
      "Keynote introduction opportunity",
      "Prime branding at entrance, bar & stage",
      "Post-event engagement & lead report",
      "Custom in-person and/or digital activation built with your creative team",
    ],
  },
];

const PnwHowItWorks = () => {
  const [openTier, setOpenTier] = useState<string | null>(null);

  const toggleTier = (id: string) => {
    setOpenTier(openTier === id ? null : id);
  };

  return (
    <section className="py-20 md:py-28 px-6" style={{ backgroundColor: "#0d1f22" }}>
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-4 font-body"
            style={{ color: "#ED7660" }}
          >
            How Does It Work
          </p>
          <h2
            className="font-display font-extrabold text-4xl md:text-5xl mb-6"
            style={{ color: "#F5E6D3" }}
          >
            Your people talk to our people.
          </h2>
          <p
            className="font-body text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: "#F5E6D3", opacity: 0.8 }}
          >
            We invite 300+ people who work in the outdoor industry — or want to. They visit your brand discovery zone to learn your story through the people that make your company unique.
          </p>
        </motion.div>

        {/* Step 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <span
              className="w-10 h-10 min-w-[2.5rem] min-h-[2.5rem] rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0"
              style={{ backgroundColor: "#FEE123", color: "#154733" }}
            >
              1
            </span>
            <h3
              className="font-display font-bold text-2xl md:text-3xl"
              style={{ color: "#F5E6D3" }}
            >
              Choose your discovery zone
            </h3>
          </div>

          {/* Accordion Tiers */}
          <div className="space-y-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="rounded-xl overflow-hidden border transition-all"
                style={{ borderColor: openTier === tier.id ? "#FEE123" : "rgba(245, 230, 211, 0.2)" }}
              >
                <button
                  onClick={() => toggleTier(tier.id)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-colors hover:bg-white/5"
                  style={{ backgroundColor: "rgba(21, 71, 51, 0.8)" }}
                >
                  <div>
                    <span
                      className="font-display font-bold text-xl md:text-2xl block"
                      style={{ color: "#FEE123" }}
                    >
                      {tier.title}
                    </span>
                    <span
                      className="font-body text-sm md:text-base mt-1 block"
                      style={{ color: "#F5E6D3", opacity: 0.8 }}
                    >
                      {tier.subtitle}
                    </span>
                  </div>
                  <ChevronDown
                    className="w-6 h-6 transition-transform duration-300 shrink-0 ml-4"
                    style={{
                      color: "#F5E6D3",
                      transform: openTier === tier.id ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                <AnimatePresence>
                  {openTier === tier.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="relative p-6 md:p-10 min-h-[320px] md:min-h-[400px] flex flex-col justify-end"
                        style={{
                          backgroundImage: `linear-gradient(to top, rgba(13, 31, 34, 0.97) 15%, rgba(13, 31, 34, 0.75) 55%, rgba(13, 31, 34, 0.4) 100%), url(${tier.backgroundImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <div className="mb-6">
                          <p className="font-body text-sm" style={{ color: "#ED7660" }}>
                            {tier.spots}
                          </p>
                        </div>
                        <ul className="space-y-3">
                          {tier.perks.map((perk, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 font-body text-sm md:text-base"
                              style={{ color: "#F5E6D3" }}
                            >
                              <Check
                                className="w-5 h-5 shrink-0 mt-0.5"
                                style={{ color: "#FEE123" }}
                              />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 mb-12"
        >
          <div className="flex items-start gap-4">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0"
              style={{ backgroundColor: "#FEE123", color: "#154733" }}
            >
              2
            </span>
            <div className="flex-1">
              <h3
                className="font-display font-bold text-2xl md:text-3xl mb-3"
                style={{ color: "#F5E6D3" }}
              >
                Select your storytelling team
              </h3>
              <p
                className="font-body text-base md:text-lg leading-relaxed max-w-lg mb-6"
                style={{ color: "#F5E6D3", opacity: 0.8 }}
              >
                A mix of HR, <strong style={{ color: "#ED7660" }}>Marketing</strong>, and Department leads ready to share what you build, how you build it, and what type of people would fit into or enrich your culture.
              </p>
              <div className="rounded-xl overflow-hidden shadow-xl max-w-md">
                <img
                  src={eventPnwNetworking}
                  alt="Networking at Gather PNW"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-start gap-4">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0"
              style={{ backgroundColor: "#FEE123", color: "#154733" }}
            >
              3
            </span>
            <div className="flex-1">
              <h3
                className="font-display font-bold text-2xl md:text-3xl mb-3"
                style={{ color: "#F5E6D3" }}
              >
                Show up <span style={{ color: "#ED7660" }}>authentically</span>
              </h3>
              <p
                className="font-body text-base md:text-lg leading-relaxed mb-6"
                style={{ color: "#F5E6D3", opacity: 0.8 }}
              >
                Product demos? Swag bags? A panel speaker? Portland's most engaged outdoor professionals 
                are coming to discover brands — make sure yours is one they can't forget. 
                Go beyond your careers page to show top talent they don't just want to{" "}
                <strong style={{ color: "#FEE123" }}>BUY</strong> from you… they want to{" "}
                <strong style={{ color: "#FEE123" }}>WORK</strong> for you.
              </p>
              <div className="rounded-xl overflow-hidden shadow-xl max-w-md">
                <img
                  src={eventPnwPanel}
                  alt="Panel at Gather PNW"
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PnwHowItWorks;
