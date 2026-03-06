import heroIllustration from "@/assets/events-hero-illustration.jpg";

const EventsHero = () => {
  return (
    <section className="relative pt-16">
      {/* Hero content */}
      <div className="relative bg-events-teal min-h-[70vh] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-center w-full relative z-10">
          {/* Left: Text */}
          <div>
            <p className="font-glacial text-events-cream/80 text-lg md:text-xl tracking-wide mb-3">
              What's On
            </p>
            <h1 className="font-display text-events-cream text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Happenings<br />at Basecamp
            </h1>
          </div>

          {/* Right: Illustration */}
          <div className="flex justify-center md:justify-end">
            <img
              src={heroIllustration}
              alt="Whimsical outdoor community illustration with bees, honeycomb, and diverse characters in a forest"
              className="w-full max-w-lg rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Ripped paper edge */}
      <div className="relative -mt-1">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L0,20 Q30,45 60,25 Q90,5 120,30 Q150,55 180,35 Q210,15 240,40 Q270,65 300,40 Q330,15 360,35 Q390,55 420,30 Q450,5 480,25 Q510,45 540,20 Q570,0 600,25 Q630,50 660,30 Q690,10 720,35 Q750,60 780,35 Q810,10 840,30 Q870,50 900,25 Q930,0 960,20 Q990,40 1020,25 Q1050,10 1080,35 Q1110,60 1140,40 Q1170,20 1200,35 Q1230,50 1260,30 Q1290,10 1320,25 Q1350,40 1380,20 Q1410,0 1440,15 L1440,0 Z"
            fill="hsl(192 38% 16%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default EventsHero;
