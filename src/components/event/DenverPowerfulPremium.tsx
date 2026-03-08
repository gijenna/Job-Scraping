import { motion } from "framer-motion";

const DenverPowerfulPremium = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Top cloud transition: from teal into cream */}
      <div
        className="relative py-32 md:py-40 flex items-center justify-center"
        style={{
          background: `
            linear-gradient(180deg, 
              #19363B 0%, 
              #19363B 5%,
              #d4c4a8 20%, 
              #F5E6D3 35%,
              #F5E6D3 65%,
              #d4c4a8 80%,
              #122a2e 95%,
              #0d1f22 100%
            )
          `,
        }}
      >
        {/* Cloud shapes using CSS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top clouds */}
          <div
            className="absolute -top-20 left-1/4 w-[600px] h-[300px] rounded-full opacity-40"
            style={{ background: "radial-gradient(ellipse, white 0%, transparent 70%)" }}
          />
          <div
            className="absolute -top-10 right-1/4 w-[500px] h-[250px] rounded-full opacity-30"
            style={{ background: "radial-gradient(ellipse, white 0%, transparent 70%)" }}
          />
          <div
            className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full opacity-25"
            style={{ background: "radial-gradient(ellipse, white 0%, transparent 65%)" }}
          />
          {/* Mid clouds */}
          <div
            className="absolute top-1/3 left-[10%] w-[400px] h-[200px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, white 0%, transparent 70%)" }}
          />
          <div
            className="absolute top-1/3 right-[15%] w-[350px] h-[180px] rounded-full opacity-25"
            style={{ background: "radial-gradient(ellipse, white 0%, transparent 70%)" }}
          />
          {/* Bottom clouds */}
          <div
            className="absolute -bottom-20 left-1/3 w-[600px] h-[300px] rounded-full opacity-35"
            style={{ background: "radial-gradient(ellipse, white 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-10 right-1/4 w-[500px] h-[250px] rounded-full opacity-30"
            style={{ background: "radial-gradient(ellipse, white 0%, transparent 70%)" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display font-extrabold text-5xl md:text-7xl mb-6"
            style={{ color: "#19363B" }}
          >
            Powerful &amp; Premium
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl font-body leading-relaxed"
            style={{ color: "#3a5a5e" }}
          >
            Our annual gathering features the biggest outdoor brands in the world,
            consistently attracting the industry's top talent, influencers, and athletes.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default DenverPowerfulPremium;
