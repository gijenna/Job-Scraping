import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

import eventReiConvo from "@/assets/event-rei-convo.jpg";
import eventAlterraChat from "@/assets/event-alterra-chat.jpg";
import eventYeti from "@/assets/event-yeti.jpg";
import eventShar from "@/assets/event-shar.jpg";

interface TierAccordion {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  spots: string;
  backgroundImage: string;
  perks: string[];
}

const tiers: TierAccordion[] = [
  {
    id: "starter",
    title: "We're HERE",
    subtitle: "Plenty of space for 5 reps & pizazz",
    price: "$3,000+",
    spots: "10 available",
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
    title: "We're GEAR",
    subtitle: "A deluxe space with room for up to 20 reps, way more room to get creative",
    price: "$6,000–$12,000",
    spots: "4 available",
    backgroundImage: eventAlterraChat,
    perks: [
      "Everything in Starter, plus:",
      "Much larger activation space",
      "Up to 20 brand representatives",
      "Room for product display or activation",
      "Dedicated social post to 50K LinkedIn / 80K Facebook / 40K IG",
      "Free Candidate Match boost ($400) from Basecamp Match",
    ],
  },
  {
    id: "title",
    title: "GET USED TO IT",
    subtitle: "The entire event is your zone & we can get Funky.",
    price: "$15,000–$25,000",
    spots: "1–2 available",
    backgroundImage: eventYeti,
    perks: [
      '"Outside Days Career Fair presented by [You]"',
      "Prime branding at entrance & stage",
      "Post-event engagement & lead report",
      "Custom in-person and/or digital activation built with your creative team",
    ],
  },
];

const DenverHowItWorks = () => {
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
            We invite 500+ people who work in the outdoor industry — or want to. They visit your brand discovery zone to learn your story through the people that make your company unique.
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
              className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg"
              style={{ backgroundColor: "#E1B624", color: "#19363B" }}
            >
              1
            </span>
            <h3
              className="font-display font-bold text-2xl md:text-3xl"
              style={{ color: "#F5E6D3" }}
            >
              Choose your discovery zone size
            </h3>
          </div>

          {/* Accordion Tiers */}
          <div className="space-y-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="rounded-xl overflow-hidden border transition-all"
                style={{ borderColor: openTier === tier.id ? "#E1B624" : "rgba(245, 230, 211, 0.2)" }}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleTier(tier.id)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-colors hover:bg-white/5"
                  style={{ backgroundColor: "rgba(25, 54, 59, 0.8)" }}
                >
                  <div>
                    <span
                      className="font-display font-bold text-xl md:text-2xl block"
                      style={{ color: "#E1B624" }}
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

                {/* Accordion Content */}
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
                          backgroundSize: tier.id === "title" ? "140%" : "cover",
                          backgroundPosition: tier.id === "title" ? "center 58%" : "center",
                        }}
                      >
                        {/* Price */}
                        <div className="mb-6">
                          <p
                            className="font-display font-extrabold text-4xl md:text-5xl"
                            style={{ color: "#E1B624" }}
                          >
                            {tier.price}
                          </p>
                          <p
                            className="font-body text-sm mt-1"
                            style={{ color: "#ED7660" }}
                          >
                            {tier.spots}
                          </p>
                        </div>

                        {/* Perks */}
                        <ul className="space-y-3">
                          {tier.perks.map((perk, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 font-body text-sm md:text-base"
                              style={{ color: "#F5E6D3" }}
                            >
                              <Check
                                className="w-5 h-5 shrink-0 mt-0.5"
                                style={{ color: "#E1B624" }}
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
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
            <div className="flex items-start gap-4 flex-1">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0"
                style={{ backgroundColor: "#E1B624", color: "#19363B" }}
              >
                2
              </span>
              <div>
                <h3
                  className="font-display font-bold text-2xl md:text-3xl mb-3"
                  style={{ color: "#F5E6D3" }}
                >
                  You select your storytelling team
                </h3>
                <p
                  className="font-body text-base md:text-lg leading-relaxed"
                  style={{ color: "#F5E6D3", opacity: 0.8 }}
                >
                  A mix of HR, Marketing, and Department leads ready to share what you build, how you build it, and what type of people would fit into or enrich your culture.
                </p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
              viewport={{ once: true }}
              className="shrink-0 w-48 h-56 md:w-56 md:h-64 rounded-2xl overflow-hidden shadow-xl self-center md:self-start"
              style={{ rotate: "3deg" }}
            >
              <img
                src={eventYetiBestday}
                alt="YETI team at event"
                className="w-full h-full object-cover object-bottom"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
              viewport={{ once: true }}
              className="shrink-0 w-48 h-56 md:w-56 md:h-64 rounded-2xl overflow-hidden shadow-xl self-center md:self-start order-2 md:order-first"
              style={{ rotate: "-3deg" }}
            >
              <img
                src={eventShar}
                alt="Shar Snacks activation"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="flex items-start gap-4 flex-1">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0"
                style={{ backgroundColor: "#E1B624", color: "#19363B" }}
              >
                3
              </span>
              <div>
                <h3
                  className="font-display font-bold text-2xl md:text-3xl mb-3"
                  style={{ color: "#F5E6D3" }}
                >
                  You get creative. Demos? Product displays? Giveaways? Dunk tanks?
                </h3>
                <p
                  className="font-body text-base md:text-lg leading-relaxed"
                  style={{ color: "#F5E6D3", opacity: 0.8 }}
                >
                  How can you put your products and culture on display to go beyond your careers page and retail store to show top talent they don't just want to <strong style={{ color: "#E1B624" }}>BUY</strong> from you… they want to <strong style={{ color: "#E1B624" }}>WORK</strong> for you. And they'll be refreshing your page so they never miss when you post a dream job.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DenverHowItWorks;
