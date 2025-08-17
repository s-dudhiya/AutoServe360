import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import JobsPage from "./pages/admin/JobsPage";
import InventoryPage from "./pages/admin/InventoryPage";
import ReportsPage from "./pages/admin/ReportsPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import MechanicDashboard from "./pages/mechanic/MechanicDashboard";
import MechanicNotificationsPage from "./pages/mechanic/NotificationsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/jobs" element={<JobsPage />} />
          <Route path="/admin/inventory" element={<InventoryPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/notifications" element={<NotificationsPage />} />
          <Route path="/mechanic" element={<MechanicDashboard />} />
          <Route path="/mechanic/notifications" element={<MechanicNotificationsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
