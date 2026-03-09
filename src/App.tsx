import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GatherPNW from "./pages/GatherPNW";
import GatherDenver from "./pages/GatherDenver";
import GatherPNWExport from "./pages/GatherPNWExport";
import GatherDenverExport from "./pages/GatherDenverExport";
import OldStuffByJenna from "./pages/OldStuffByJenna";
import Events from "./pages/Events";
import EventCalendar from "./pages/EventCalendar";
import AdminLogin from "./pages/AdminLogin";
import AdminExperts from "./pages/AdminExperts";
import ExpertInvite from "./pages/ExpertInvite";
import BrandRepInvite from "./pages/BrandRepInvite";
import CityExperts from "./pages/CityExperts";
import ExpertDetail from "./pages/ExpertDetail";
import EventPNW26 from "./pages/EventPNW26";
import EventOutsideDays26 from "./pages/EventOutsideDays26";
import EventOR26 from "./pages/EventOR26";
import CardStylePreview from "./pages/CardStylePreview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gather-pnw" element={<GatherPNW />} />
          <Route path="/gather-denver" element={<GatherDenver />} />
          <Route path="/gather-pnw-export" element={<GatherPNWExport />} />
          <Route path="/gather-denver-export" element={<GatherDenverExport />} />
          <Route path="/oldstuffbyjenna" element={<OldStuffByJenna />} />
          <Route path="/events" element={<Events />} />
          <Route path="/calendar" element={<EventCalendar />} />
          <Route path="/PNW26" element={<EventPNW26 />} />
          <Route path="/OutsideDays26" element={<EventOutsideDays26 />} />
          <Route path="/OR26" element={<EventOR26 />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/experts" element={<AdminExperts />} />
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
          {/* Expert invite pages - personalized and generic */}
          <Route path="/Denverexperts" element={<ExpertInvite citySlug="denver" />} />
          <Route path="/Denverexperts/:name" element={<ExpertInvite citySlug="denver" />} />
          <Route path="/Portlandexperts" element={<ExpertInvite citySlug="portland" />} />
          <Route path="/Portlandexperts/:name" element={<ExpertInvite citySlug="portland" />} />
          <Route path="/MNexperts" element={<ExpertInvite citySlug="minneapolis" />} />
          <Route path="/MNexperts/:name" element={<ExpertInvite citySlug="minneapolis" />} />
          <Route path="/card-preview" element={<CardStylePreview />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
