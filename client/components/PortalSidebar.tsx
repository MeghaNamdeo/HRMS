import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import {
  Users,
  Briefcase,
  DollarSign,
  BarChart3,
  Lock,
  Home,
  FileText,
  Clock,
  Calendar,
  Award,
  LogOut,
  Menu,
  X,
  Settings,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const getRoleConfig = (role: UserRole | null) => {
  const configs = {
    employee: {
      name: "Employee Portal",
      icon: Users,
      color: "from-blue-600 to-blue-700",
      items: [
        { icon: Home, label: "Dashboard", href: "/portal/employee" },
        { icon: Users, label: "My Profile", href: "/portal/employee/profile" },
        { icon: Clock, label: "Attendance", href: "/portal/employee/attendance" },
        { icon: Calendar, label: "Leave Management", href: "/portal/employee/leaves" },
        { icon: FileText, label: "Payslip & Salary", href: "/portal/employee/payslip" },
        { icon: Briefcase, label: "Documents", href: "/portal/employee/documents" },
        { icon: Award, label: "Performance", href: "/portal/employee/performance" },
      ],
    },
    hr_admin: {
      name: "HR Admin Portal",
      icon: Briefcase,
      color: "from-emerald-600 to-emerald-700",
      items: [
        { icon: Home, label: "Dashboard", href: "/portal/hr_admin" },
        { icon: Users, label: "Employee Master", href: "/portal/hr_admin/employees" },
        { icon: Clock, label: "Attendance", href: "/portal/hr_admin/attendance" },
        { icon: Calendar, label: "Leave Management", href: "/portal/hr_admin/leaves" },
        { icon: Briefcase, label: "Recruitment", href: "/portal/hr_admin/recruitment" },
        { icon: FileText, label: "Documents", href: "/portal/hr_admin/documents" },
        { icon: Award, label: "Performance", href: "/portal/hr_admin/performance" },
      ],
    },
    finance_admin: {
      name: "Finance Portal",
      icon: DollarSign,
      color: "from-amber-600 to-amber-700",
      items: [
        { icon: Home, label: "Dashboard", href: "/portal/finance_admin" },
        { icon: DollarSign, label: "Salary Structure", href: "/portal/finance_admin/salary" },
        { icon: FileText, label: "Payroll Run", href: "/portal/finance_admin/payroll" },
        { icon: Award, label: "Payslips", href: "/portal/finance_admin/payslips" },
        { icon: Clock, label: "Tax Management", href: "/portal/finance_admin/tax" },
        { icon: BarChart3, label: "Reports", href: "/portal/finance_admin/reports" },
      ],
    },
    manager: {
      name: "Manager Portal",
      icon: BarChart3,
      color: "from-purple-600 to-purple-700",
      items: [
        { icon: Home, label: "Dashboard", href: "/portal/manager" },
        { icon: Users, label: "Team", href: "/portal/manager/team" },
        { icon: Calendar, label: "Approvals", href: "/portal/manager/approvals" },
        { icon: Award, label: "Reviews", href: "/portal/manager/reviews" },
        { icon: BarChart3, label: "Reports", href: "/portal/manager/reports" },
      ],
    },
    super_admin: {
      name: "Super Admin Portal",
      icon: Lock,
      color: "from-red-600 to-red-700",
      items: [
        { icon: Home, label: "Dashboard", href: "/portal/super_admin" },
        { icon: Lock, label: "Role Management", href: "/portal/super_admin/roles" },
        { icon: Users, label: "Users", href: "/portal/super_admin/users" },
        { icon: Briefcase, label: "Organization", href: "/portal/super_admin/org" },
        { icon: Settings, label: "Settings", href: "/portal/super_admin/settings" },
        { icon: FileText, label: "Audit Logs", href: "/portal/super_admin/audit" },
      ],
    },
  };

  return configs[role || "employee"];
};

export function PortalSidebar() {
  const { user, currentRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const roleConfig = getRoleConfig(currentRole);
  const RoleIcon = roleConfig.icon;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-0 left-0 right-0 z-40 lg:hidden bg-white border-b border-slate-200 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${roleConfig.color} flex items-center justify-center`}>
            <RoleIcon className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-slate-900">HRMSuite</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-600 hover:text-slate-900"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 lg:relative lg:translate-x-0 lg:h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col`}
        style={{ height: "100vh" }}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-200 mt-16 lg:mt-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${roleConfig.color} flex items-center justify-center`}>
              <RoleIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                {currentRole?.replace("_", " ")}
              </p>
              <p className="text-sm font-bold text-slate-900">
                {roleConfig.name}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
          {roleConfig.items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-200 p-3 space-y-2">
          <div className="px-4 py-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
              Account
            </p>
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>

          {user && user.roles.length > 1 && (
            <DropdownMenu open={showRoleSwitcher} onOpenChange={setShowRoleSwitcher}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-slate-600 hover:bg-slate-100"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Switch Role
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user.roles.map((role) => {
                  const config = getRoleConfig(role);
                  const Icon = config.icon;
                  return (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => {
                        navigate(`/portal/${role}`);
                        setShowRoleSwitcher(false);
                        setIsOpen(false);
                      }}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {config.name}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
