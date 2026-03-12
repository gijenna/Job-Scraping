import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import heroPnw from "@/assets/hero-pnw.mp4";
import gatherPnwLogo from "@/assets/gather-pnw-logo-white-uo.png";
import uoDuckLogo from "@/assets/uo-duck-logo.svg";
import basecampMatchLogo from "@/assets/basecamp-match-logo-dark.png";
import RegistrantHero from "@/components/event/RegistrantHero";
import RegistrantHowToTapIn from "@/components/event/RegistrantHowToTapIn";
import RegistrantVenue from "@/components/event/RegistrantVenue";
import EventLogoTicker from "@/components/event/EventLogoTicker";
import PnwWhosComing from "@/components/event/PnwWhosComing";
import JobSeekerTestimonials from "@/components/event/JobSeekerTestimonials";
import BasecampEventsGallery from "@/components/event/BasecampEventsGallery";

const pnwBrands = [
  { name: "Rumpl", domain: "rumpl.com", url: undefined as string | undefined },
  { name: "On Running", domain: "on-running.com", url: undefined as string | undefined },
  { name: "Arc'teryx", domain: "arcteryx.com", url: undefined as string | undefined },
  { name: "Cotopaxi", domain: "cotopaxi.com", url: undefined as string | undefined },
  { name: "Oregon Outdoor Alliance", domain: "oregonoutdooralliance.org", url: "https://www.oregonoutdooralliance.org" },
  { name: "Superfeet", domain: "superfeet.com", url: "https://www.superfeet.com" },
  { name: "Popfly", domain: "popfly.com", url: undefined as string | undefined },
  { name: "Brooks", domain: "brooksrunning.com", url: undefined as string | undefined },
  { name: "Specialized", domain: "specialized.com", url: undefined as string | undefined },
  { name: "Nike", domain: "nike.com", url: undefined as string | undefined },
  { name: "Columbia", domain: "columbia.com", url: undefined as string | undefined },
  { name: "Patagonia", domain: "patagonia.com", url: undefined as string | undefined },
  { name: "KEEN", domain: "keenfootwear.com", url: undefined as string | undefined },
  { name: "Lululemon", domain: "lululemon.com", url: undefined as string | undefined },
  { name: "Dovetail Workwear", domain: "dovetailworkwear.com", url: undefined as string | undefined },
  { name: "Peak Design", domain: "peakdesign.com", url: undefined as string | undefined },
];

const TYPEFORM_PNW = "https://basecampoutdoor.typeform.com/pnw2026";

const EventPNW26 = () => {
  return (
    <main className="bg-events-teal min-h-screen relative">
      {/* Basecamp Match logo top-left */}
      <a
        href="https://www.basecampjobs.com"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 left-4 z-50"
      >
        <img
          src={basecampMatchLogo}
          alt="Basecamp Match"
          className="h-8 md:h-10 w-auto drop-shadow-lg"
        />
      </a>

      <RegistrantHero
        backgroundSrc={heroPnw}
        backgroundType="video"
        logoSrc={gatherPnwLogo}
        logoAlt="Gather PNW logo"
        date="April 16, 2026"
        location="UO Portland Campus · Portland, OR"
        time="5:30 – 8:30 PM PT"
        tagline="The Pacific Northwest's premier outdoor industry networking event. Free for all."
        registrationUrl={TYPEFORM_PNW}
        overlayColor="rgba(21, 71, 51, 0.65)"
        accentColor="#FEE123"
        sponsorPageUrl="/gather-pnw"
      />

      <EventLogoTicker
        brands={pnwBrands}
        headline="Brands & professionals in the room"
      />

      {/* Industry Experts — moved below ticker */}
      <PnwWhosComing accentColor="#FEE123" bgColor="#154733" />

      <RegistrantHowToTapIn
        registrationUrl={TYPEFORM_PNW}
        sponsorPageUrl="/gather-pnw"
        expertsPageUrl="/Portlandexperts"
        accentColor="#FEE123"
        bgColor="#0d2b1f"
        attendeeCount="300+"
      />

      {/* Brand Showcase — Who's in the room */}
      <section className="py-16 md:py-24 px-6 bg-events-cream">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body text-events-coral">
              Who's in the room
            </p>
            <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-teal leading-tight">
              Chat with hiring managers & industry leaders from brands like:
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8 md:gap-12 items-center justify-items-center"
          >
            {pnwBrands.map((brand) => {
              const inner = (
                <div className="flex flex-col items-center gap-2 group">
                  <img
                    src={`https://logo.clearbit.com/${brand.domain}`}
                    alt={brand.name}
                    className="h-10 md:h-14 w-auto object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.src = `https://www.google.com/s2/favicons?domain=${brand.domain}&sz=128`;
                      target.className = "h-8 md:h-10 w-auto object-contain opacity-70 group-hover:opacity-100 transition-all duration-300";
                    }}
                  />
                  <span className="font-body text-xs text-events-teal/50 group-hover:text-events-teal/80 transition-colors">
                    {brand.name}
                  </span>
                </div>
              );

              return brand.url ? (
                <a key={brand.name} href={brand.url} target="_blank" rel="noopener noreferrer">
                  {inner}
                </a>
              ) : (
                <div key={brand.name}>{inner}</div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Job Seeker Testimonials */}
      <JobSeekerTestimonials accentColor="#FEE123" bgColor="#154733" />

      {/* Gallery — Check out other Basecamp Events */}
      <BasecampEventsGallery />

      {/* What to Expect */}
      <section className="py-16 md:py-24 px-6 bg-events-teal">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-body" style={{ color: "#FEE123" }}>
              What to Expect
            </p>
            <h2 className="font-headline font-bold text-3xl md:text-5xl text-events-cream leading-tight">
              This isn't a job fair. It's a{" "}
              <span style={{ color: "#FEE123" }}>career accelerator.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { num: "300+", label: "Professionals & Students", desc: "Marketing, product, design, ops, and career changers — all in one room." },
              { num: "15+", label: "Brands Represented", desc: "Talk directly with hiring managers and team leads at top outdoor brands." },
              { num: "45min", label: "'How I Broke In' Panel", desc: "Hear real career stories from leaders who built their path in outdoor." },
              { num: "FREE", label: "Always Free to Attend", desc: "We believe access to opportunity shouldn't cost anything." },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl p-6 border border-white/10"
                style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
              >
                <p className="font-headline font-bold text-3xl mb-1" style={{ color: "#FEE123" }}>{stat.num}</p>
                <p className="font-display font-bold text-base text-events-cream mb-2">{stat.label}</p>
                <p className="font-body text-sm text-events-cream/60">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* UO Sports Product Management Section */}
      <section className="py-20 md:py-28 px-6 bg-events-cream">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            {/* Left: Logo + Sco Ducks */}
            <div className="flex flex-col items-center md:items-start gap-6 md:w-1/3 shrink-0">
              <img
                src={uoDuckLogo}
                alt="University of Oregon"
                className="w-40 md:w-52 h-auto"
              />
              <p className="font-headline font-bold text-2xl md:text-3xl" style={{ color: "#154733" }}>
                #ScoDucks 🦆
              </p>
            </div>

            {/* Right: Program Details */}
            <div className="md:w-2/3">
              <p className="text-xs tracking-[0.3em] uppercase mb-3 font-body text-events-coral">
                Our Host Program
              </p>
              <h2 className="font-headline font-bold text-2xl md:text-4xl text-events-teal mb-4 leading-tight">
                MS Sports Product Management
              </h2>
              <p className="font-body text-events-teal/70 leading-relaxed mb-4">
                The University of Oregon partnered with the sports and outdoor product industry's best to create this one-of-a-kind master's program. Experience the entire product creation lifecycle through the lenses of innovation, sustainability, diversity and inclusion, and global business.
              </p>
              <p className="font-body text-events-teal/70 leading-relaxed mb-6">
                <strong className="text-events-teal">90% of alumni</strong> work at leading brands including Nike, adidas, Under Armour, New Balance, On Running, Hoka, Specialized, and more. Located at UO's Portland campus — the heart of the PNW outdoor industry.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "rgba(21, 71, 51, 0.08)" }}>
                  <p className="font-headline font-bold text-xl" style={{ color: "#154733" }}>90%</p>
                  <p className="font-body text-xs text-events-teal/60">Alumni placement</p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "rgba(21, 71, 51, 0.08)" }}>
                  <p className="font-headline font-bold text-xl" style={{ color: "#154733" }}>3,000+</p>
                  <p className="font-body text-xs text-events-teal/60">OR outdoor companies</p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: "rgba(21, 71, 51, 0.08)" }}>
                  <p className="font-headline font-bold text-xl" style={{ color: "#154733" }}>$29B</p>
                  <p className="font-body text-xs text-events-teal/60">Industry output</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://bit.ly/47veqAL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold text-sm transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: "#154733", color: "#FEE123" }}
                >
                  Learn More
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://business.uoregon.edu/programs/spm/apply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold text-sm border-2 transition-all duration-300 hover:scale-105"
                  style={{ borderColor: "#154733", color: "#154733" }}
                >
                  Apply Now
                </a>
                <a
                  href="https://www.youtube.com/watch?v=o7HcNEwDW14"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold text-sm border-2 transition-all duration-300 hover:scale-105"
                  style={{ borderColor: "#154733", color: "#154733" }}
                >
                  Watch Video
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <RegistrantVenue
        venueName="UO Portland Campus"
        address="2800 NE Liberty St, Portland, OR 97211"
        googleMapsUrl="https://maps.google.com/?q=2800+NE+Liberty+St+Portland+OR"
        date="April 16, 2026"
        eventTime="5:30 – 8:30 PM PT"
        description="Basecamp Outdoor × University of Oregon's Sports Product Management program. Located at UO's new Portland campus — the heart of the PNW outdoor industry."
        accentColor="#FEE123"
      />

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-events-teal">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-headline font-bold text-3xl md:text-4xl text-events-cream mb-6">
              Ready to Gather?
            </h2>
            <p className="font-body text-events-cream/60 mb-8">
              Free registration. Limited capacity. Don't miss the PNW's best outdoor industry event.
            </p>
            <a
              href={TYPEFORM_PNW}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-display font-bold text-lg shadow-xl transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: "#FEE123", color: "#154733" }}
            >
              Register Free
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default EventPNW26;
