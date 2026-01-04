import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/portals/EmployeeDashboard";
import HRAdminDashboard from "./pages/portals/HRAdminDashboard";
import PlaceholderPortal from "./pages/portals/PlaceholderPortal";
import ModulePlaceholder from "./pages/portals/ModulePlaceholder";
import NotFound from "./pages/NotFound";
import JobsList from "./pages/ats/JobsList";
import JobDetails from "./pages/ats/JobDetails";
import AdminJobDashboard from "./pages/ats/AdminJobDashboard";
import AdminCandidatePipeline from "./pages/ats/AdminCandidatePipeline";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/portals/hr_admin/EmployeeList";
import PayrollDashboard from "./pages/portals/finance_admin/PayrollDashboard";
import UserManagementDashboard from "./pages/portals/hr_admin/UserManagementDashboard";
import EmployeeProfile from "./pages/portals/employee/EmployeeProfile";
import EmployeeLeaves from "./pages/portals/employee/EmployeeLeaves";
import EmployeePayslips from "./pages/portals/employee/EmployeePayslips";
import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  Briefcase,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  BookOpen,
  Receipt,
  HardDrive,
  Shield,
  Bell,
  BarChart3,
  Bot,
  Settings,
  User,
  FileText
} from "lucide-react";

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

    {/* Public ATS Routes */}
    <Route path="/jobs" element={<JobsList />} />
    <Route path="/jobs/:id" element={<JobDetails />} />

    {/* Protected Dashboard Layout */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
    </Route>

    {/* Redirect old portal routes to dashboard for now, or unified them */}
    {/* Main Application Routes (Module Dashboard) */}
    <Route
      path="/app"
      element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />

      {/* Core Modules */}
      <Route path="users" element={<UserManagementDashboard />} />
      {/* We can reuse existing EmployeeList here or keep it separate. Let's redirect for now or reuse? Reuse is better. */}
      {/* Mapped "Employee Management" to existing HR Admin Employee List if admin, but ideally it should be a general portal. Let's use Placeholder for now to be safe, or direct to specific portals. 
      Actually, the user asked for /app/employees. Let's use existing list for admins, or placeholder for general. 
      Let's strictly follow the routes requested. */}
      <Route path="employees" element={<EmployeeList />} /> {/* Reusing existing list */}

      {/* Recruitment */}
      <Route path="recruitment" element={<AdminJobDashboard />} />
      <Route path="recruitment/pipeline" element={<AdminCandidatePipeline />} />
      <Route path="recruitment/jobs/:id" element={<JobDetails />} />

      {/* Attendance */}
      <Route path="attendance" element={<ModulePlaceholder title="Attendance" description="Track daily attendance" icon={Clock} features={["Daily Logs", "Biometric Sync", "Shift Rooster"]} />} />

      {/* Leave - Reuse EmployeeLeaves or a generic manager? Let's use EmployeeLeaves for "Me" view for now. */}
      <Route path="leave" element={<EmployeeLeaves />} />

      {/* Payroll */}
      <Route path="payroll" element={<PayrollDashboard />} />

      {/* Placeholders for new modules */}
      <Route path="performance" element={<ModulePlaceholder title="Performance (PMS)" description="Performance Management System" icon={TrendingUp} features={["OKRs", "Appraisals", "360 Feedback"]} />} />
      <Route path="lms" element={<ModulePlaceholder title="L&D (LMS)" description="Learning Management System" icon={BookOpen} features={["Course Catalog", "My Learning", "Certifications"]} />} />
      <Route path="expenses" element={<ModulePlaceholder title="Expenses" description="Expense & Reimbursement" icon={Receipt} features={["My Claims", "Approvals", "Policies"]} />} />
      <Route path="assets" element={<ModulePlaceholder title="Asset Management" description="Track company assets" icon={HardDrive} features={["My Assets", "Request New", "Return Asset"]} />} />
      <Route path="compliance" element={<ModulePlaceholder title="Compliance & Legal" description="Legal documents & compliance" icon={Shield} features={["Documents", "Policies", "Audits"]} />} />
      <Route path="notifications" element={<ModulePlaceholder title="Notifications" description="System alerts & announcements" icon={Bell} features={["Inbox", "Preferences", "Announcements"]} />} />
      <Route path="reports" element={<ModulePlaceholder title="Reports & Analytics" description="Data insights" icon={BarChart3} features={["Headcount", "Attrition", "Payroll Reports"]} />} />
      <Route path="automation" element={<ModulePlaceholder title="Automation & AI" description="AI Assistant" icon={Bot} features={["Chatbot", "Workflows", "FAQ"]} />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
