import { motion } from "framer-motion";

const DenverPowerfulPremium = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        className="relative flex flex-col items-center justify-start"
        style={{
          background: `
            linear-gradient(180deg, 
              #19363B 0%, 
              #19363B 3%,
              #c4b49a 12%, 
              #F5E6D3 22%,
              #F5E6D3 40%,
              #e8d5bf 55%,
              #b8a888 65%,
              #4a6a6e 78%,
              #1a3a3f 88%,
              #0d1f22 100%
            )
          `,
        }}
      >
        {/* ── Text area ── */}
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl pt-32 md:pt-40 pb-12">
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

        {/* ── Cloud field below text ── */}
        <div className="relative w-full h-[300px] md:h-[420px] pointer-events-none">
          {/* Layer 1 — large billowy shapes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[200px] md:h-[280px]"
            style={{ background: "radial-gradient(ellipse 70% 100% at 50% 0%, #F5E6D3 0%, transparent 100%)" }} />

          {/* Individual cloud puffs */}
          <div className="absolute top-4 left-[5%] w-[350px] h-[160px] rounded-full opacity-70"
            style={{ background: "radial-gradient(ellipse, #F5E6D3 0%, transparent 70%)" }} />
          <div className="absolute top-0 left-[25%] w-[500px] h-[220px] rounded-full opacity-80"
            style={{ background: "radial-gradient(ellipse, #efe0cc 0%, transparent 65%)" }} />
          <div className="absolute top-8 right-[10%] w-[400px] h-[180px] rounded-full opacity-65"
            style={{ background: "radial-gradient(ellipse, #F5E6D3 0%, transparent 70%)" }} />
          <div className="absolute top-2 right-[30%] w-[450px] h-[200px] rounded-full opacity-75"
            style={{ background: "radial-gradient(ellipse, #e8d5bf 0%, transparent 68%)" }} />

          {/* Layer 2 — mid wispy clouds */}
          <div className="absolute top-[30%] left-[15%] w-[300px] h-[140px] rounded-full opacity-50"
            style={{ background: "radial-gradient(ellipse, #d4c4a8 0%, transparent 70%)" }} />
          <div className="absolute top-[35%] right-[20%] w-[350px] h-[150px] rounded-full opacity-45"
            style={{ background: "radial-gradient(ellipse, #d4c4a8 0%, transparent 70%)" }} />
          <div className="absolute top-[25%] left-[45%] w-[400px] h-[160px] rounded-full opacity-55"
            style={{ background: "radial-gradient(ellipse, #cdb99a 0%, transparent 65%)" }} />

          {/* Layer 3 — fading wisps */}
          <div className="absolute top-[55%] left-[10%] w-[250px] h-[100px] rounded-full opacity-30"
            style={{ background: "radial-gradient(ellipse, #b8a888 0%, transparent 70%)" }} />
          <div className="absolute top-[50%] right-[15%] w-[280px] h-[110px] rounded-full opacity-25"
            style={{ background: "radial-gradient(ellipse, #b8a888 0%, transparent 70%)" }} />
          <div className="absolute top-[60%] left-[40%] w-[320px] h-[120px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, #a09070 0%, transparent 70%)" }} />
        </div>
      </div>
    </section>
  );
};

export default DenverPowerfulPremium;
