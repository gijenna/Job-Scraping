import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote: "We all met GREAT candidates. Three of us have a candidate in play, and I am hopefully extending an offer to one today. Huge success.",
    name: "Martine Knights",
    title: "Sr Recruiter, VF Corporation",
    domain: "vfc.com",
  },
  {
    quote: "We generated a LOT of excellent candidates & would be very happy to sponsor again! We were so impressed by the depth of talent — AWESOMELY tenured individuals.",
    name: "Hillary St. John",
    title: "Sr. HR, Elevate Outdoor Collective",
    domain: "elevateoc.com",
  },
  {
    quote: "We had a GREAT time at Gather! I thought it was a very successful event - the volunteers you had helping were very much appreciated!",
    name: "Jessica Martin",
    title: "Talent Acquisition, YETI",
    domain: "yeti.com",
  },
  {
    quote: "We use Gather as a branding opportunity for when we're hiring in the future.",
    name: "Liz Berry",
    title: "Sr Manager, Talent Acquisition, Cotopaxi",
    domain: "cotopaxi.com",
  },
  {
    quote: "We are still OVER THE MOON after Gather. Basecamp has been my FAVORITE partner and the one that has generated the most goodwill and visibility for our nascent program.",
    name: "Chris Castilian",
    title: "Sr Executive Director, Outdoor Industry Leadership Program, University of Denver",
    domain: "du.edu",
  },
  {
    quote: "The job seekers were super motivated and highly aligned. I will definitely seek out this event in the future!",
    name: "Crystal Weaver",
    title: "Recruiting Manager, Eleven Experience",
    domain: "elevenexperience.com",
  },
];

const Testimonials = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>(":scope > div")?.offsetWidth ?? 300;
    el.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  return (
    <section className="py-6 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <p className="text-primary text-xs tracking-[0.3em] uppercase mb-3 font-body">Social Proof</p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-foreground">
              Brands Love Gather
            </h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="snap-start shrink-0 w-[280px] md:w-[calc(25%-12px)] rounded-xl p-5 shadow-md border border-neutral-200 flex flex-col"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${t.domain}&sz=64`}
                  alt={`${t.name} company logo`}
                  className="w-9 h-9 rounded-lg object-contain border border-neutral-200 p-1"
                  style={{ backgroundColor: "#ffffff" }}
                />
                <div className="min-w-0">
                  <p className="font-display font-bold text-sm leading-snug" style={{ color: "#19363B" }}>{t.name}</p>
                  <p className="text-xs leading-snug mt-0.5" style={{ color: "#715F61" }}>{t.title}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed font-body italic flex-1" style={{ color: "#19363B" }}>
                "{t.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
