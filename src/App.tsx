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
import Events from "./pages/Events";
import EventCalendar from "./pages/EventCalendar";
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
          <Route path="/events" element={<Events />} />
          <Route path="/calendar" element={<EventCalendar />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
