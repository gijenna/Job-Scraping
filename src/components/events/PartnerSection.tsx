import EditableText from "@/components/EditableText";

const PartnerSection = () => {
  return (
    <section className="bg-events-card py-20 px-6" id="partner-section">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-display text-events-cream text-3xl md:text-4xl font-bold mb-6">
          <EditableText settingKey="partner_headline" defaultText="Partner With Us" as="span" />
        </h2>
        <p className="text-events-cream/80 text-lg leading-relaxed mb-4">
          <EditableText
            settingKey="partner_body"
            defaultText="We work with brands like The North Face, Patagonia, Brooks, REI, and Cotopaxi for Recruitment Marketing and would love to work with you too."
            as="span"
            multiline
          />
        </p>
        <p className="text-events-cream/60 text-base mb-8">
          <EditableText settingKey="partner_subtitle" defaultText="Reach the outdoor industry's top talent, decision-makers, and influencers through our events and community." as="span" multiline />
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
