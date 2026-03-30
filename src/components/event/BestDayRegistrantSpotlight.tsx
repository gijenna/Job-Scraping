import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import EditableText from "@/components/EditableText";

import bestDayPitchImage from "@/assets/best-day-pitch.png";

const RECRUITER_PHOTO = "https://media.licdn.com/dms/image/v2/C4E03AQEO2snBn5gdhg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1568924201436?e=2147483647&v=beta&t=aBM335GS2SxOlbM9sN9jHytzYy30EPsD8xVlvndQTLk";

const BestDayRegistrantSpotlight = () => {
  return (
    <section className="bg-bestday-cream py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Title centered above */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="mb-3 font-headline text-3xl font-bold text-bestday-blue md:text-4xl">
            <EditableText settingKey="bd_spot_title" defaultText="A Proudly Sober Event" as="span" />
          </h2>
          <p className="mx-auto max-w-3xl font-body text-base leading-relaxed text-bestday-blue/70 md:text-lg">
            <EditableText
              settingKey="bd_spot_vibe"
              defaultText="Last year we shifted to fully sober events — and the response from both job seekers and brands was incredible. Clear eyes, real connections, and a professional atmosphere that lets the outdoor industry's best talent shine."
              as="span"
              multiline
            />
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative z-10 flex max-w-xl flex-col gap-6"
          >
            <div className="rounded-2xl border-l-4 border-bestday-yellow bg-bestday-blue/10 p-5 md:p-6">
              <div className="flex gap-4">
                <img
                  src={RECRUITER_PHOTO}
                  alt="Recruiter"
                  className="mt-1 h-12 w-12 shrink-0 rounded-full object-cover"
                />
                <div>
                  <p className="mb-2 font-body text-sm italic leading-relaxed text-bestday-blue md:text-base">
                    <EditableText
                      settingKey="bd_spot_quote"
                      defaultText="&ldquo;Last year, we made the decision to remove alcohol from our events. We weren't sure how it'd go, but the feedback was overwhelmingly positive. Conversations were more genuine, people stayed longer, and both recruiters and candidates told us it felt more professional and welcoming.&rdquo;"
                      as="span"
                      multiline
                    />
                  </p>
                  <p className="font-display text-xs font-bold uppercase tracking-wide text-bestday-blue/55">
                    <EditableText
                      settingKey="bd_spot_attribution"
                      defaultText="— Recruiter, The North Face"
                      as="span"
                    />
                  </p>
                </div>
              </div>
            </div>

            {/* Brand description */}
            <p className="font-body text-sm leading-relaxed text-bestday-blue/65">
              <EditableText
                settingKey="bd_spot_brand_desc"
                defaultText="Born in Northern California, Best Day Brewing crafts the world's best-tasting non-alcoholic beer for the adventure-seeking, fun-loving outdoor community."
                as="span"
              />
            </p>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 md:flex-nowrap md:gap-4">
              <p className="shrink-0 font-headline text-xl italic text-bestday-yellow md:text-2xl">
                <EditableText
                  settingKey="bd_spot_tagline"
                  defaultText="Let's have the best day yet."
                  as="span"
                />
              </p>
              <a
                href="https://bestdaybrewing.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 whitespace-nowrap font-display text-sm font-bold text-bestday-blue transition-opacity hover:opacity-70"
              >
                Explore Best Day Brewing <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="pointer-events-none absolute bottom-0 right-0 top-0 z-0 hidden items-end md:flex md:-right-24"
          >
            <img
              src={bestDayPitchImage}
              alt="Best Day Brewing Variety Packs"
              className="block h-full w-auto max-w-[840px] object-contain object-bottom"
            />
          </motion.div>

          {/* Mobile: show image below text */}
          <div className="mt-8 flex justify-center md:hidden">
            <img
              src={bestDayPitchImage}
              alt="Best Day Brewing Variety Packs"
              className="block h-auto w-full max-w-[400px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestDayRegistrantSpotlight;
