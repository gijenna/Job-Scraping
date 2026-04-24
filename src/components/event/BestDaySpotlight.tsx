import { motion } from "framer-motion";
import { ArrowRight, Beer, Leaf, Award } from "lucide-react";

const BEST_DAY_LOGO = "https://bestdaybrewing.com/cdn/shop/files/916_IG_Feed_Ads_1200_x_1200_px_3.png?v=1739926696&width=400";

const beers = [
  {
    name: "West Coast IPA",
    img: "https://bestdaybrewing.com/cdn/shop/files/BestDay_Hop-Ingredient_1080x1250_7d215e4b-fdbb-49a3-b78a-a1cde8cbebdb.jpg?v=1732557217&width=600",
  },
  {
    name: "Hazy IPA",
    img: "https://bestdaybrewing.com/cdn/shop/files/BestDay_Hop-Ingredient_1080x1250_0f8031d0-5245-4f3f-8774-2225aa92770d.jpg?v=1732557167&width=600",
  },
  {
    name: "Kölsch & Electro-Lime",
    img: "https://bestdaybrewing.com/cdn/shop/files/BestDay_Lineup_3200x1800_Desktop.jpg?v=1732557169&width=900",
  },
];

const valueProps = [
  {
    icon: Award,
    title: "Award-Winning NA Beer",
    desc: "Craft-brewed to full strength, then gently de-alcoholized to preserve the rich aromas and flavors.",
  },
  {
    icon: Leaf,
    title: "Premium Ingredients",
    desc: "Non-GMO, vegan, made with water, barley, hops, and yeast, packed with antioxidant polyphenols.",
  },
  {
    icon: Beer,
    title: "Full Lineup of Styles",
    desc: "West Coast IPA, Hazy IPA, Kölsch, Electro-Lime, plus rotating limited-edition releases.",
  },
];

const BestDaySpotlight = () => {
  return (
    <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-events-teal via-[#0d1f22] to-events-teal">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-display font-bold tracking-widest uppercase text-events-yellow mb-4">
            Title Sponsor Spotlight
          </span>
          <div className="flex items-center justify-center mb-6">
            <img
              src={BEST_DAY_LOGO}
              alt="Best Day Brewing"
              className="h-20 md:h-28 w-auto"
            />
          </div>
          <p className="font-body text-events-cream/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Best Day Brewing crafts the world's best-tasting non-alcoholic beer, brewed to full strength, then gently de-alcoholized to keep every ounce of flavor. Premium, non-GMO, vegan, and damn near perfect.
          </p>
        </motion.div>

        {/* Value Props */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {valueProps.map((item, i) => (
            <div
              key={i}
              className="bg-events-card/50 border border-events-cream/10 rounded-2xl p-6 text-center"
            >
              <item.icon className="w-8 h-8 text-events-yellow mx-auto mb-3" />
              <h3 className="font-headline font-bold text-events-cream text-lg mb-2">
                {item.title}
              </h3>
              <p className="font-body text-events-cream/60 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {beers.map((beer, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden group">
              <img
                src={beer.img}
                alt={beer.name}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 font-headline font-bold text-events-cream text-lg">
                {beer.name}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <a
            href="https://bestdaybrewing.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-display font-bold text-lg shadow-xl transition-all duration-300 hover:scale-105 bg-events-yellow text-events-teal"
          >
            Explore Best Day Brewing <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BestDaySpotlight;
