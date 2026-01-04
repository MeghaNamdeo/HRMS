
import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
    Users, Briefcase, DollarSign, PieChart, Settings,
    LogOut, Menu, X, Home, User, FileText, Calendar,
    Shield, Bell, Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NavItem {
    title: string;
    href: string;
    icon: any;
    roles: UserRole[];
}

const navItems: NavItem[] = [
    // Common
    { title: "Dashboard", href: "/dashboard", icon: Home, roles: ["ROLE_EMPLOYEE", "ROLE_HR_ADMIN", "ROLE_FINANCE_ADMIN", "ROLE_SUPER_ADMIN"] },

    // Employee
    { title: "My Profile", href: "/portal/employee/profile", icon: User, roles: ["ROLE_EMPLOYEE"] },
    { title: "My Leaves", href: "/portal/employee/leaves", icon: Calendar, roles: ["ROLE_EMPLOYEE"] },
    { title: "My Payslips", href: "/portal/employee/payslips", icon: FileText, roles: ["ROLE_EMPLOYEE"] },

    // HR Admin
    { title: "Employees", href: "/portal/hr_admin/employees", icon: Users, roles: ["ROLE_HR_ADMIN", "ROLE_SUPER_ADMIN"] },
    { title: "Recruitment (ATS)", href: "/portal/hr_admin/recruitment", icon: Briefcase, roles: ["ROLE_HR_ADMIN", "ROLE_SUPER_ADMIN"] },
    { title: "Attendance", href: "/portal/hr_admin/attendance", icon: Calendar, roles: ["ROLE_HR_ADMIN", "ROLE_SUPER_ADMIN"] },

    // Finance
    { title: "Payroll", href: "/portal/finance_admin/payroll", icon: DollarSign, roles: ["ROLE_FINANCE_ADMIN", "ROLE_SUPER_ADMIN"] },
    { title: "Expenses", href: "/portal/finance_admin/expenses", icon: PieChart, roles: ["ROLE_FINANCE_ADMIN", "ROLE_SUPER_ADMIN"] },

    // Super Admin
    { title: "Settings", href: "/portal/super_admin/settings", icon: Settings, roles: ["ROLE_SUPER_ADMIN"] },
];

import { ModeToggle } from "@/components/mode-toggle";

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const filteredNavItems = navItems.filter(item =>
        item.roles.some(role => user.roles.includes(role))
    );

    return (
        <div className="min-h-screen bg-muted/40 flex font-sans antialiased">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar-background border-r border-sidebar-border shadow-sm transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
                    !sidebarOpen && "-translate-x-full md:hidden"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b border-sidebar-border mt-4 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-foreground tracking-tight">HRMSuite</span>
                            <span className="text-xs text-muted-foreground block font-medium">Enterprise Edition</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex flex-col h-[calc(100vh-80px)] justify-between px-4 py-2">
                    <div className="space-y-6">
                        <nav className="space-y-1">
                            {filteredNavItems.map((item) => {
                                const isActive = location.pathname.startsWith(item.href) || (item.href === "/dashboard" && location.pathname === "/dashboard");
                                return (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className={cn("h-5 w-5 mr-3 transition-colors", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                                        {item.title}
                                        {isActive && (
                                            <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/50" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="mt-auto pt-6 border-t border-sidebar-border">
                        <div className="bg-muted/50 p-4 rounded-xl mb-4 border border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-xl h-12 px-4" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-muted/40">
                <header className="h-20 bg-background/80 backdrop-blur-md border-b flex items-center justify-between px-8 sticky top-0 z-40 transition-all duration-200">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                            <Menu className="h-6 w-6" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground capitalize tracking-tight">
                                {location.pathname.split("/").pop()?.replace(/_/g, " ") || "Overview"}
                            </h1>
                            <p className="text-sm text-muted-foreground hidden md:block">
                                Welcome back, here's what's happening today.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="items-center gap-2 hidden md:flex mr-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search..." className="w-64 pl-9 rounded-full bg-muted/50 border-transparent hover:bg-muted transition-colors focus:bg-background focus:border-primary/20" />
                            </div>
                        </div>
                        <ModeToggle />
                        <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 rounded-full h-10 w-10">
                            <Bell className="h-5 w-5 text-muted-foreground" />
                            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-background"></span>
                        </Button>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto space-y-8">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
