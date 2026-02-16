import { motion } from "framer-motion";
import { Check, Star, Zap, Crown } from "lucide-react";

const tiers = [
  {
    name: "Hiring Table",
    price: "$3,000+",
    spots: "7 available",
    icon: Zap,
    popular: true,
    bestFor: "Outdoor/active lifestyle brands hiring anytime in 2026–27",
    perks: [
      "Hiring table inside event",
      "Up to 5 brand representatives",
      "Logo & careers page link across event website & registration",
      "Exposure to our 300K community",
    ],
  },
  {
    name: "Deluxe Hiring + Branding",
    price: "$6,000–12,000",
    spots: "4 available",
    icon: Star,
    popular: false,
    bestFor: "Hiring AND marketing teams looking to split budget, or brands consolidating niche influence",
    perks: [
      "Everything in Hiring Table, plus:",
      "Much larger activation space",
      "Up to 20 brand representatives",
      "Room for product display or activation",
      "Dedicated social post to 50K LinkedIn / 80K Facebook / 40K IG",
      'Free Candidate Match boost ($400) from <a href="https://basecampjobs.com" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:opacity-80">Basecamp Match</a>',
    ],
  },
  {
    name: "Title Sponsorship",
    price: "$15,000–$25,000",
    spots: "1–2 available",
    icon: Crown,
    popular: false,
    bestFor: "Major industry players wanting top billing and full integration",
    perks: [
      '"Gather Denver 2026, Presented by [You]"',
      "Keynote introduction opportunity",
      "Prime branding at entrance, bar & stage",
      "Post-event engagement & lead report",
      "Custom in-person and digital activation built with your creative team",
    ],
  },
];

const PartnershipTiers = () => {
  return (
    <section className="py-24 px-6" id="tiers">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4 font-body">Partnership Options</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-foreground">
            Find Your Fit
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative bg-gradient-card border rounded-xl p-8 shadow-card flex flex-col ${
                tier.popular ? "border-primary/50 shadow-gold" : "border-border"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-gold text-primary-foreground text-xs font-display font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <tier.icon className="w-5 h-5 text-primary" />
              </div>

              <h3 className="font-display font-bold text-xl text-foreground">{tier.name}</h3>
              <p className="font-display font-extrabold text-3xl text-gradient-gold mt-2">{tier.price}</p>
              <p className="text-primary text-sm font-body mt-1">{tier.spots}</p>

              <p className="text-muted-foreground text-sm font-body mt-4 mb-6 leading-relaxed">
                <span className="text-foreground font-semibold">Best for:</span> {tier.bestFor}
              </p>

              <ul className="space-y-3 flex-1">
                {tier.perks.map((perk, j) => (
                  <li key={j} className="flex gap-3 text-sm text-muted-foreground font-body">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span dangerouslySetInnerHTML={{ __html: perk }} />
                  </li>
                ))}
              </ul>

              <a
                href="mailto:Jenna@wearetheoutdoorindustry.com?subject=I'd like to participate in GATHER Denver 2026"
                className={`mt-8 inline-flex items-center justify-center px-6 py-3 rounded-lg font-display font-semibold text-sm transition-all ${
                  tier.popular
                    ? "bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-gold"
                    : "border border-primary/30 text-primary hover:bg-primary/10"
                }`}
              >
                Secure Your Spot
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnershipTiers;
