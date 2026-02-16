import { motion } from "framer-motion";

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
    quote: "The job seekers were super motivated and highly aligned. I will definitely seek out this event in the future!",
    name: "Crystal Weaver",
    title: "Recruiting Manager, Eleven Experience",
    domain: "elevenexperience.com",
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
    quote: "We had a GREAT time at Gather! I thought it was a very successful event - the volunteers you had helping were very much appreciated!",
    name: "Jessica Martin",
    title: "Talent Acquisition, YETI",
    domain: "yeti.com",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-6 border-y border-border">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">Social Proof</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground">
            Recruiters Love Gather
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-8 shadow-card"
              style={{ backgroundColor: 'white' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={`https://logo.clearbit.com/${t.domain}`}
                  alt=""
                  className="w-10 h-10 rounded-full object-contain p-1"
                  style={{ backgroundColor: '#f9fafb' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div>
                  <p className="font-display font-semibold text-secondary-foreground">{t.name}</p>
                  <p className="text-muted-foreground text-sm">{t.title}</p>
                </div>
              </div>
              <p className="text-secondary-foreground font-body text-sm leading-relaxed italic">
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
