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
import EventPNW26 from "./pages/EventPNW26";
import EventOutsideDays26 from "./pages/EventOutsideDays26";
import EventOutsideDaysCOS from "./pages/EventOutsideDaysCOS";
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
import CardStylePreview from "./pages/CardStylePreview";
import GenerateCards from "./pages/GenerateCards";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import EventMapAdmin from "./pages/EventMapAdmin";
import NotFound from "./pages/NotFound";
import LinkTracker from "./components/LinkTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LinkTracker>
        <Routes>
          {/* Primary routes */}
          <Route path="/" element={<Events />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gather-denver" element={<GatherDenver />} />
          <Route path="/gather-pnw" element={<GatherPNW />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/experts" element={<AdminExperts />} />
          <Route path="/admin/event-map" element={<EventMapAdmin />} />
          <Route path="/PNW26" element={<EventPNW26 />} />
          <Route path="/OutsideDays26" element={<EventOutsideDays26 />} />
          <Route path="/outsidedays26-cos" element={<EventOutsideDaysCOS />} />
          {/* Secondary routes */}
          <Route path="/Gatheroverview" element={<Index />} />
          <Route path="/gather-pnw-export" element={<GatherPNWExport />} />
          <Route path="/gather-denver-export" element={<GatherDenverExport />} />
          <Route path="/oldstuffbyjenna" element={<OldStuffByJenna />} />
          <Route path="/calendar" element={<EventCalendar />} />
          <Route path="/OR26" element={<EventOR26 />} />
          <Route path="/bestday" element={<BestDayPitch />} />
          <Route path="/bestdayexample" element={<BestDayExample />} />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </LinkTracker>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
