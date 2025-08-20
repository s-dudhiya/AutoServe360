import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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
import ProtectedRoute from "./components/layout/ProtectedRoute";
import CreateJobCardPage from "./pages/admin/CreateJobCardPage";
import { MainLayout } from "./components/layout/MainLayout";
import ProfilePage from "./pages/ProfilePage"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes - All wrapped inside MainLayout */}
            <Route 
              element={
                <ProtectedRoute role="admin">
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/jobs" element={<JobsPage />} />
              <Route path="/admin/jobs/create" element={<CreateJobCardPage />} /> 
              <Route path="/admin/inventory" element={<InventoryPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/notifications" element={<NotificationsPage />} />
               <Route path="/admin/profile" element={<ProfilePage />} /> 
            </Route>

            {/* Mechanic Routes - All wrapped inside MainLayout */}
            <Route 
              element={
                <ProtectedRoute role="mechanic">
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/mechanic" element={<MechanicDashboard />} />
              <Route path="/mechanic/notifications" element={<MechanicNotificationsPage />} />
              <Route path="/mechanic/profile" element={<ProfilePage />} />
            </Route>
              
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;