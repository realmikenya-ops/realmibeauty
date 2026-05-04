import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Explore from "./pages/Explore.tsx";
import VendorDetail from "./pages/VendorDetail.tsx";
import Login from "./pages/Login.tsx";
import VendorSignup from "./pages/VendorSignup.tsx";
import About from "./pages/About.tsx";
import VendorDashboard from "./pages/VendorDashboard.tsx";
import CyberHome from "./pages/CyberHome.tsx";
import CyberAuth from "./pages/CyberAuth.tsx";
import CyberDashboard from "./pages/CyberDashboard.tsx";
import CyberAdmin from "./pages/CyberAdmin.tsx";
import { WhatsAppButton } from "./components/WhatsAppButton.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/vendor/:id" element={<VendorDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/vendor-signup" element={<VendorSignup />} />
          <Route path="/about" element={<About />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/cyber" element={<CyberHome />} />
          <Route path="/cyber/auth" element={<CyberAuth />} />
          <Route path="/cyber/dashboard" element={<CyberDashboard />} />
          <Route path="/cyber/admin" element={<CyberAdmin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
