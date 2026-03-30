import { motion } from "framer-motion";
import { ArrowRight, Sun } from "lucide-react";
import EditableText from "@/components/EditableText";

const BEST_DAY_LOGO = "https://logo.clearbit.com/bestdaybrewing.com";
const VARIETY_PACK_IMAGE = "https://bestdaybrewing.com/cdn/shop/files/Variety_Pack_Press_2.png?v=1774462461&width=1445";
const RECRUITER_PHOTO = "https://media.licdn.com/dms/image/v2/C4E03AQEO2snBn5gdhg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1568924201436?e=2147483647&v=beta&t=aBM335GS2SxOlbM9sN9jHytzYy30EPsD8xVlvndQTLk";

const BestDayRegistrantSpotlight = () => {
  return (
    <section className="py-12 md:py-16 px-6" style={{ backgroundColor: "#f6efe7" }}>
      <div className="container mx-auto max-w-6xl">
        {/* Two-column: Text left, Product image right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left column — Text content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <img
                src={BEST_DAY_LOGO}
                alt="Best Day Brewing"
                className="h-8 w-8 rounded-full"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span
                className="text-xs font-display font-bold tracking-[0.2em] uppercase"
                style={{ color: "#f1bd26" }}
              >
                <EditableText settingKey="bd_spot_eyebrow" defaultText="Title Sponsor" as="span" />
              </span>
            </div>

            {/* Title */}
            <h2
              className="font-headline font-bold text-3xl md:text-4xl mb-5"
              style={{ color: "#4d6d7e" }}
            >
              <EditableText settingKey="bd_spot_title" defaultText="A Proudly Sober Event" as="span" />
            </h2>

            {/* Vibe line */}
            <p
              className="font-body text-base md:text-lg leading-relaxed mb-8"
              style={{ color: "#4d6d7e", opacity: 0.8 }}
            >
              <EditableText
                settingKey="bd_spot_vibe"
                defaultText="Last year we shifted to fully sober events — and the response from both job seekers and brands was incredible. Clear eyes, real connections, and a professional atmosphere that lets the outdoor industry's best talent shine."
                as="span"
                multiline
              />
            </p>

            {/* Testimonial bubble */}
            <div
              className="rounded-2xl p-5 mb-8"
              style={{ backgroundColor: "rgba(77, 109, 126, 0.08)", borderLeft: "3px solid #f1bd26" }}
            >
              <div className="flex gap-4">
                <img
                  src={RECRUITER_PHOTO}
                  alt="Recruiter"
                  className="w-12 h-12 rounded-full object-cover shrink-0 mt-1"
                />
                <div>
                  <p
                    className="font-body text-sm md:text-base italic leading-relaxed mb-2"
                    style={{ color: "#4d6d7e" }}
                  >
                    <EditableText
                      settingKey="bd_spot_quote"
                      defaultText="&ldquo;Last year, we made the decision to remove alcohol from our events. We weren't sure how it'd go, but the feedback was overwhelmingly positive. Conversations were more genuine, people stayed longer, and both recruiters and candidates told us it felt more professional and welcoming.&rdquo;"
                      as="span"
                      multiline
                    />
                  </p>
                  <p
                    className="font-display text-xs tracking-wide uppercase font-bold"
                    style={{ color: "#4d6d7e", opacity: 0.5 }}
                  >
                    <EditableText settingKey="bd_spot_attribution" defaultText="— Recruiter, The North Face" as="span" />
                  </p>
                </div>
              </div>
            </div>

            {/* Brand description */}
            <p
              className="font-body text-sm leading-relaxed mb-6"
              style={{ color: "#4d6d7e", opacity: 0.6 }}
            >
              <EditableText
                settingKey="bd_spot_brand_desc"
                defaultText="Born in Northern California, Best Day Brewing crafts the world's best-tasting non-alcoholic beer for the adventure-seeking, fun-loving outdoor community."
                as="span"
              />
            </p>

            {/* Tagline */}
            <p
              className="font-headline text-xl md:text-2xl italic mb-6"
              style={{ color: "#f1bd26" }}
            >
              <EditableText settingKey="bd_spot_tagline" defaultText="Let's have the best day yet." as="span" />
            </p>

            {/* CTA */}
            <a
              href="https://bestdaybrewing.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-display font-bold transition-colors hover:opacity-70"
              style={{ color: "#4d6d7e" }}
            >
              Explore Best Day Brewing <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Right column — Product image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 md:order-2 flex justify-center"
          >
            <img
              src={VARIETY_PACK_IMAGE}
              alt="Best Day Brewing Variety Packs"
              className="w-full max-w-md md:max-w-lg object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BestDayRegistrantSpotlight;
