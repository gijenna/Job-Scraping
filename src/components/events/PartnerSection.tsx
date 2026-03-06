const PartnerSection = () => {
  return (
    <section className="bg-events-card py-20 px-6" id="partner-section">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-events-cream text-3xl md:text-4xl font-bold mb-6">
          Partner With Us
        </h2>
        <p className="text-events-cream/80 text-lg leading-relaxed mb-4">
          We work with brands like{" "}
          <span className="text-events-coral font-semibold">The North Face</span>,{" "}
          <span className="text-events-coral font-semibold">Patagonia</span>,{" "}
          <span className="text-events-coral font-semibold">Brooks</span>,{" "}
          <span className="text-events-coral font-semibold">REI</span>, and{" "}
          <span className="text-events-coral font-semibold">Cotopaxi</span>{" "}
          for Recruitment Marketing and would love to work with you too.
        </p>
        <p className="text-events-cream/60 text-base mb-8">
          Reach the outdoor industry's top talent, decision-makers, and influencers through our events and community.
        </p>
        <a
          href="mailto:Jenna@wearetheoutdoorindustry.com"
          className="inline-block bg-events-coral text-events-teal font-bold text-base px-8 py-4 rounded-full hover:brightness-110 transition-all shadow-lg"
        >
          Email Jenna to Tap In →
        </a>
      </div>
    </section>
  );
};

export default PartnerSection;
