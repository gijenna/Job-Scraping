import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import headlinersImg from "@/assets/outside-days-headliners.png";
import EditableText from "@/components/EditableText";

const DenverFestivalPartner = () => {
  return (
    <section className="relative py-20 md:py-28 bg-[#19363B] overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <h2
              className="font-headline font-bold text-events-cream leading-[1.1]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              <EditableText settingKey="festival_headline" defaultText="Gather is an outdoor industry discovery zone merging a career fair & field marketing." as="span" multiline />
            </h2>

            <p className="text-events-cream/70 font-body text-lg md:text-xl leading-relaxed">
              <EditableText settingKey="festival_body" defaultText="We're the only FREE activation at Outside Days' 40,000-person festival - and we've been a partner since day one." as="span" multiline />
            </p>

            <p className="text-events-yellow/80 font-body text-sm italic">
              <EditableText settingKey="festival_note" defaultText="Psst - Basecamp partners get free 3-day tix 🎟️" as="span" />
            </p>

            <a
              href="mailto:jenna@wearetheoutdoorindustry.com?subject=I want to get in on Gather Denver"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-display font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: "#E1B624", color: "#19363B" }}
            >
              Involve your brand
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <a href="https://bit.ly/outside-days" target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow">
              <img src={headlinersImg} alt="Outside Days 2026 headliners - Death Cab for Cutie, My Morning Jacket, Cage the Elephant" className="w-full h-auto object-cover" />
            </a>
            <p className="mt-3 text-events-cream/40 text-xs font-body text-center italic">
              2026 Outside Days headliners - 2026 Outside Days headliners - May 28–31, Denver CO, Denver CO
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DenverFestivalPartner;
