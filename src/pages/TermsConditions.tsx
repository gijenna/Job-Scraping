import { Link } from "react-router-dom";
import SiteFooter from "@/components/SiteFooter";

const TermsConditions = () => (
  <div className="min-h-screen bg-events-teal flex flex-col">
    <div className="border-b border-events-cream/10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-events-cream font-display font-bold text-lg hover:text-events-cream/80 transition-colors">Basecamp Outdoor</Link>
      </div>
    </div>

    <main className="flex-1 max-w-3xl mx-auto px-4 py-12 text-events-cream/80 font-body space-y-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-events-cream">Terms & Conditions</h1>
      <p className="text-events-cream/50 text-sm">Last updated: March 16, 2026</p>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">1. Introduction</h2>
        <p>These Terms and Conditions ("Terms") govern your use of the Basecamp Outdoor website and event services operated by Basecamp Outdoor ("we," "us," or "our"). By accessing or using our website and services, you agree to be bound by these Terms.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">2. Service Description</h2>
        <p>Basecamp Outdoor provides an event discovery and registration platform connecting outdoor industry professionals, job seekers, brands, and organizations through in-person career events, networking gatherings, and related programming. Our services include:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Event registration and information</li>
          <li>Industry Expert and Brand Representative profile pages</li>
          <li>Event-related communications</li>
          <li>Career discovery and networking opportunities</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">3. User Responsibilities</h2>
        <p>By using our services, you agree to:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Provide accurate and truthful information in all forms and registrations</li>
          <li>Not misrepresent your identity, professional credentials, or affiliations</li>
          <li>Conduct yourself professionally at all events</li>
          <li>Not use the platform for any unlawful purpose</li>
          <li>Not scrape, harvest, or collect personal data of other users</li>
          <li>Respect the intellectual property rights of Basecamp Outdoor and other users</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">4. Event Registration & Attendance</h2>
        <p>Registration for our events is free unless otherwise stated. We reserve the right to:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Limit event capacity and close registration at any time</li>
          <li>Cancel, postpone, or modify events due to circumstances beyond our control</li>
          <li>Refuse entry or remove attendees who violate these Terms or event codes of conduct</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">5. Industry Expert & Brand Representative Profiles</h2>
        <p>If you submit an Industry Expert or Brand Representative profile:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>You grant us permission to display your submitted information and photo on our website for event promotion purposes</li>
          <li>You confirm that you have the right to share the information and image(s) you submit</li>
          <li>You may request removal of your profile at any time by contacting us</li>
          <li>We may generate promotional card images using your submitted photo and information for social media sharing</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">6. Intellectual Property</h2>
        <p>All content on this website — including text, graphics, logos, images, and software — is the property of Basecamp Outdoor or its content suppliers and is protected by United States and international copyright laws. You may not reproduce, distribute, or create derivative works from our content without express written permission.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">7. Privacy</h2>
        <p>Your use of our services is also governed by our <Link to="/privacy" className="text-events-coral hover:underline">Privacy Policy</Link>, which describes how we collect, use, and protect your personal data. By using our services, you consent to the practices described in our Privacy Policy.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">8. Disclaimer of Warranties</h2>
        <p>Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>That our website will be uninterrupted, error-free, or secure</li>
          <li>The accuracy or completeness of information provided by other users or event participants</li>
          <li>Any specific outcomes from event attendance, including employment opportunities</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">9. Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, Basecamp Outdoor and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or attendance at our events, including but not limited to loss of profits, data, or other intangible losses.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">10. Indemnification</h2>
        <p>You agree to indemnify and hold harmless Basecamp Outdoor from any claims, damages, losses, or expenses arising from your use of our services, your violation of these Terms, or your violation of any rights of a third party.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">11. Governing Law</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of the State of Colorado, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of the State of Colorado.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">12. Changes to These Terms</h2>
        <p>We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Continued use of our services after changes are posted constitutes acceptance of the revised Terms.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">13. Contact Us</h2>
        <p>For questions about these Terms, please contact:</p>
        <p>Basecamp Outdoor<br />Email: <a href="mailto:jenna@wearetheoutdoorindustry.com" className="text-events-coral hover:underline">jenna@wearetheoutdoorindustry.com</a></p>
      </section>
    </main>

    <SiteFooter />
  </div>
);

export default TermsConditions;
