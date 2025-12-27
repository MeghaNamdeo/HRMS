import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/portals/EmployeeDashboard";
import HRAdminDashboard from "./pages/portals/HRAdminDashboard";
import PlaceholderPortal from "./pages/portals/PlaceholderPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />

    {/* Portal Routes - Protected */}
    <Route
      path="/portal/employee"
      element={
        <ProtectedRoute>
          <EmployeeDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/portal/hr_admin"
      element={
        <ProtectedRoute>
          <HRAdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/portal/finance_admin"
      element={
        <ProtectedRoute>
          <PlaceholderPortal />
        </ProtectedRoute>
      }
    />
    <Route
      path="/portal/manager"
      element={
        <ProtectedRoute>
          <PlaceholderPortal />
        </ProtectedRoute>
      }
    />
    <Route
      path="/portal/super_admin"
      element={
        <ProtectedRoute>
          <PlaceholderPortal />
        </ProtectedRoute>
      }
    />

    {/* Catch-all placeholder routes for portal sub-pages */}
    <Route
      path="/portal/:role/:page"
      element={
        <ProtectedRoute>
          <PlaceholderPortal />
        </ProtectedRoute>
      }
    />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
