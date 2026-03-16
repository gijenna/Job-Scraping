import { Link } from "react-router-dom";

const SiteFooter = () => (
  <footer className="bg-events-teal border-t border-events-cream/10 py-6 px-4">
    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-events-cream/40 text-xs font-body">
      <p>© {new Date().getFullYear()} Basecamp Outdoor. All rights reserved.</p>
      <div className="flex items-center gap-4">
        <Link to="/privacy" className="hover:text-events-cream/70 transition-colors">Privacy Policy</Link>
        <span>|</span>
        <Link to="/T&C" className="hover:text-events-cream/70 transition-colors">Terms & Conditions</Link>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
