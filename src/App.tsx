import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Events from "./pages/Events";
import Index from "./pages/Index";
import GatherDenver from "./pages/GatherDenver";
import GatherPNW from "./pages/GatherPNW";
import AdminLogin from "./pages/AdminLogin";
import ResetPassword from "./pages/ResetPassword";
import AdminExperts from "./pages/AdminExperts";
import AdminPageMeta from "./pages/AdminPageMeta";
import AdminAfterParty from "./pages/AdminAfterParty";
import AdminConnect from "./pages/AdminConnect";
import AdminEmailTemplates from "./pages/AdminEmailTemplates";
import AdminLeads from "./pages/AdminLeads";
import EventPNW26 from "./pages/EventPNW26";
import EventOutsideDays26 from "./pages/EventOutsideDays26";
import EventOutsideDaysCOS from "./pages/EventOutsideDaysCOS";
import Connect from "./pages/outsidedays/Connect";
import ConnectFull from "./pages/outsidedays/ConnectFull";
import ConnectProfile from "./pages/outsidedays/ConnectProfile";
import ConnectHome from "./pages/outsidedays/ConnectHome";
import ConnectConnections from "./pages/outsidedays/ConnectConnections";
import ConnectHowItWorks from "./pages/outsidedays/ConnectHowItWorks";
import BrandDashboard from "./pages/outsidedays/BrandDashboard";
import GatherPNWExport from "./pages/GatherPNWExport";
import GatherDenverExport from "./pages/GatherDenverExport";
import OldStuffByJenna from "./pages/OldStuffByJenna";
import EventCalendar from "./pages/EventCalendar";
import ExpertInvite from "./pages/ExpertInvite";
import BrandRepInvite from "./pages/BrandRepInvite";
import CityExperts from "./pages/CityExperts";
import ExpertDetail from "./pages/ExpertDetail";
import EventOR26 from "./pages/EventOR26";
import BestDayPitch from "./pages/BestDayPitch";
import BestDayExample from "./pages/BestDayExample";
import OakleyPitch from "./pages/OakleyPitch";
import CardStylePreview from "./pages/CardStylePreview";
import GenerateCards from "./pages/GenerateCards";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import EventMapAdmin from "./pages/EventMapAdmin";
import PrintExpertCard from "./pages/PrintExpertCard";
import AfterPartyInvite from "./pages/AfterPartyInvite";
import AfterPartyInterest from "./pages/AfterPartyInterest";
import AfterPartySplashClip from "./pages/AfterPartySplashClip";
import GuestList from "./pages/GuestList";
import Unsubscribe from "./pages/Unsubscribe";
import NotFound from "./pages/NotFound";
import LinkTracker from "./components/LinkTracker";
// (oakleyWhiteLogo no longer used — replaced by oakleyCreamLogo below.)
import oakleyCreamLogo from "./assets/oakley-logo-cream.png";

const OAKLEY_PRESENTER = {
  label: "@",
  sublabel: "RiNo",
  logoUrl: oakleyCreamLogo,
  logoAlt: "Oakley",
  href: "https://www.oakley.com",
  creamGlow: true,
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LinkTracker>
        <Routes>
          {/* Pinned to top for quick access — order matches Jenna's preferred menu order */}
          <Route path="/" element={<Events />} />
          <Route path="/OutsideDays26" element={<EventOutsideDays26 />} />
          <Route
            path="/afterparty"
            element={
              <AfterPartyInvite
                presenter={OAKLEY_PRESENTER}
                venueShowcase="oakley-rino"
              />
            }
          />
          <Route path="/guests" element={<GuestList venueShowcase="oakley-rino" />} />
          <Route path="/admin/experts" element={<AdminExperts />} />
          <Route path="/admin/event-map" element={<EventMapAdmin />} />
          <Route path="/experts/afterparty" element={<AdminAfterParty />} />
          <Route path="/outsidedays26/connect" element={<Connect />} />
          <Route path="/outsidedays26/dashboard" element={<BrandDashboard />} />

          {/* Other afterparty variants */}
          <Route path="/afterparty-clip" element={<AfterPartySplashClip />} />
          <Route path="/afterparty-interest" element={<AfterPartyInterest />} />
          <Route
            path="/afterparty"
            element={
              <AfterPartyInvite
                presenter={OAKLEY_PRESENTER}
                venueShowcase="oakley-rino"
              />
            }
          />
          <Route
            path="/afterparty/:name"
            element={
              <AfterPartyInvite
                presenter={OAKLEY_PRESENTER}
                venueShowcase="oakley-rino"
              />
            }
          />
          <Route
            path="/afterpartyoakley"
            element={
              <AfterPartyInvite
                presenter={OAKLEY_PRESENTER}
                venueShowcase="oakley-rino"
              />
            }
          />
          <Route
            path="/afterpartyoakley/:name"
            element={
              <AfterPartyInvite
                presenter={OAKLEY_PRESENTER}
                venueShowcase="oakley-rino"
              />
            }
          />
          {/* Primary routes */}
          <Route path="/" element={<Events />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gather-denver" element={<GatherDenver />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/experts" element={<AdminExperts />} />
          <Route path="/admin/page-meta" element={<AdminPageMeta />} />
          <Route path="/admin/event-map" element={<EventMapAdmin />} />
          <Route path="/admin/connect" element={<AdminConnect />} />
          <Route path="/admin/email-templates" element={<AdminEmailTemplates />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/OutsideDays26" element={<EventOutsideDays26 />} />
          <Route path="/outsidedays26-cos" element={<EventOutsideDaysCOS />} />
          {/* Outside Days connect (career fair) */}
          <Route path="/outsidedays26/connect" element={<Connect />} />
          <Route path="/outsidedays26/connect/how-it-works" element={<ConnectHowItWorks />} />
          <Route path="/outsidedays26/connect/full" element={<ConnectFull />} />
          <Route path="/outsidedays26/connect/home" element={<ConnectHome />} />
          <Route path="/outsidedays26/connect/profile" element={<ConnectProfile />} />
          <Route path="/outsidedays26/connect/connections" element={<ConnectConnections />} />
          <Route path="/outsidedays26/dashboard" element={<BrandDashboard />} />
          {/* Secondary routes */}
          <Route path="/Gatheroverview" element={<Index />} />
          <Route path="/gather-pnw-export" element={<GatherPNWExport />} />
          <Route path="/gather-denver-export" element={<GatherDenverExport />} />
          <Route path="/oldstuffbyjenna" element={<OldStuffByJenna />} />
          <Route path="/calendar" element={<EventCalendar />} />
          <Route path="/OR26" element={<EventOR26 />} />
          <Route path="/bestday" element={<BestDayPitch />} />
          <Route path="/bestdayexample" element={<BestDayExample />} />
          <Route path="/oakley" element={<OakleyPitch />} />
          {/* Brand Rep invite pages */}
          <Route path="/denverreps" element={<BrandRepInvite citySlug="denver" />} />
          <Route path="/denverreps/:name" element={<BrandRepInvite citySlug="denver" />} />
          <Route path="/pnwreps" element={<BrandRepInvite citySlug="portland" />} />
          <Route path="/pnwreps/:name" element={<BrandRepInvite citySlug="portland" />} />
          {/* Public expert browsing pages */}
          <Route path="/Denverexperts/browse" element={<CityExperts citySlug="denver" />} />
          <Route path="/Portlandexperts/browse" element={<CityExperts citySlug="portland" />} />
          <Route path="/MNexperts/browse" element={<CityExperts citySlug="minneapolis" />} />
          {/* Public expert detail pages */}
          <Route path="/Denverexperts/view/:name" element={<ExpertDetail citySlug="denver" />} />
          <Route path="/Portlandexperts/view/:name" element={<ExpertDetail citySlug="portland" />} />
          <Route path="/MNexperts/view/:name" element={<ExpertDetail citySlug="minneapolis" />} />
          {/* Expert invite pages */}
          <Route path="/Denverexperts" element={<ExpertInvite citySlug="denver" />} />
          <Route path="/Denverexperts/:name" element={<ExpertInvite citySlug="denver" />} />
          <Route path="/Portlandexperts" element={<ExpertInvite citySlug="portland" />} />
          <Route path="/Portlandexperts/:name" element={<ExpertInvite citySlug="portland" />} />
          <Route path="/MNexperts" element={<ExpertInvite citySlug="minneapolis" />} />
          <Route path="/MNexperts/:name" element={<ExpertInvite citySlug="minneapolis" />} />
          <Route path="/card-preview" element={<CardStylePreview />} />
          <Route path="/generate" element={<GenerateCards />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/T&C" element={<TermsConditions />} />
          <Route path="/print-card" element={<PrintExpertCard />} />
          <Route path="/guests" element={<GuestList venueShowcase="oakley-rino" />} />
          {/* Hidden Oakley variant — same data as /guests, with the RiNo
              venue showcase replacing the event-info column. Not linked. */}
          <Route path="/guestsoakley" element={<GuestList venueShowcase="oakley-rino" />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          {/* Less-used \u2014 moved down */}
          <Route path="/PNW26" element={<EventPNW26 />} />
          <Route path="/gather-pnw" element={<GatherPNW />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </LinkTracker>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
