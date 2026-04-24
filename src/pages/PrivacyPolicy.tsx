import { Link } from "react-router-dom";
import SiteFooter from "@/components/SiteFooter";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-events-teal flex flex-col">
    <div className="border-b border-events-cream/10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-events-cream font-display font-bold text-lg hover:text-events-cream/80 transition-colors">Basecamp Outdoor</Link>
      </div>
    </div>

    <main className="flex-1 max-w-3xl mx-auto px-4 py-12 text-events-cream/80 font-body space-y-8">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-events-cream">Privacy Policy</h1>
      <p className="text-events-cream/50 text-sm">Last updated: March 16, 2026</p>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">1. Data Controller</h2>
        <p>Basecamp Outdoor ("we," "us," or "our") operates the website basecampjobs.com and related event pages. We are the data controller responsible for your personal data.</p>
        <p>Contact: <a href="mailto:jenna@wearetheoutdoorindustry.com" className="text-events-coral hover:underline">jenna@wearetheoutdoorindustry.com</a></p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">2. Data We Collect</h2>
        <p>We collect the following personal data when you voluntarily submit it through our event registration forms, expert intake forms, or brand representative forms:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Full name</li>
          <li>Email address</li>
          <li>Professional information (job title, company, field of work, years of experience)</li>
          <li>LinkedIn profile URL (if provided)</li>
          <li>Profile photo (if uploaded)</li>
          <li>Professional interests and career-related information</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">3. Lawful Basis for Processing (GDPR)</h2>
        <p>We process your personal data under the following lawful bases as defined by the General Data Protection Regulation (GDPR):</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><strong className="text-events-cream">Consent</strong>, By voluntarily submitting your information through our forms, you consent to its processing for the stated purposes.</li>
          <li><strong className="text-events-cream">Legitimate Interest</strong>, We have a legitimate interest in communicating with you about the events you have registered for or inquired about.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">4. How We Use Your Data</h2>
        <p>We use your personal data exclusively to:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Communicate with you about the specific event you registered for or inquired about</li>
          <li>Send event logistics, updates, and follow-up information</li>
          <li>Display your expert or brand representative profile on our event pages (if you opted in as an industry expert or brand rep)</li>
          <li>Improve our event programming and attendee experience</li>
        </ul>
        <div className="bg-events-card/50 border border-events-cream/10 rounded-lg p-4 mt-2">
          <p className="text-events-yellow font-semibold text-sm">🔒 We do NOT sell, rent, trade, or share your personal data with any third parties for marketing purposes. Your data is used solely for event-related communications.</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">5. Data Retention</h2>
        <p>We retain your personal data for the duration necessary to fulfill the purposes described above, typically through the conclusion of the event and any post-event follow-up (generally no more than 12 months after the event). You may request deletion of your data at any time.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">6. Your Rights Under GDPR</h2>
        <p>If you are located in the European Economic Area (EEA) or United Kingdom, you have the following rights under GDPR Articles 15–21:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><strong className="text-events-cream">Right of Access</strong>, Request a copy of the personal data we hold about you.</li>
          <li><strong className="text-events-cream">Right to Rectification</strong>, Request correction of inaccurate or incomplete data.</li>
          <li><strong className="text-events-cream">Right to Erasure</strong>, Request deletion of your personal data ("right to be forgotten").</li>
          <li><strong className="text-events-cream">Right to Restrict Processing</strong>, Request that we limit how we use your data.</li>
          <li><strong className="text-events-cream">Right to Data Portability</strong>, Request your data in a structured, machine-readable format.</li>
          <li><strong className="text-events-cream">Right to Object</strong>, Object to processing of your data based on legitimate interest.</li>
        </ul>
        <p>To exercise any of these rights, contact us at <a href="mailto:jenna@wearetheoutdoorindustry.com" className="text-events-coral hover:underline">jenna@wearetheoutdoorindustry.com</a>. We will respond within 30 days.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">7. Cookies & Tracking</h2>
        <p>Our website uses only essential cookies required for site functionality. We do not use third-party advertising cookies or tracking pixels. We do not engage in behavioral tracking or profiling.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">8. Third-Party Services</h2>
        <p>We use the following third-party services to operate our platform:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><strong className="text-events-cream">Typeform</strong>, For event registration form submissions</li>
          <li><strong className="text-events-cream">Cloud hosting</strong>, For secure data storage and website hosting</li>
        </ul>
        <p>These service providers process data on our behalf under appropriate data processing agreements and do not use your data for their own purposes.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">9. Data Security</h2>
        <p>We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All data is transmitted over encrypted connections (HTTPS/TLS).</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">10. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.</p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold text-events-cream">11. Contact Us</h2>
        <p>For any questions about this Privacy Policy or to exercise your data rights, please contact:</p>
        <p>Basecamp Outdoor<br />Email: <a href="mailto:jenna@wearetheoutdoorindustry.com" className="text-events-coral hover:underline">jenna@wearetheoutdoorindustry.com</a></p>
      </section>
    </main>

    <SiteFooter />
  </div>
);

export default PrivacyPolicy;
