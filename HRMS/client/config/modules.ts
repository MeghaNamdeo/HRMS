import {
    Users,
    Briefcase,
    Calendar,
    FileText,
    DollarSign,
    TrendingUp,
    GraduationCap,
    Receipt,
    HardDrive,
    Shield,
    Bell,
    BarChart3,
    Bot,
    LucideIcon,
} from "lucide-react";

export interface ModuleConfig {
    title: string;
    description: string;
    icon: LucideIcon;
    route: string;
    allowedRoles: string[]; // "all" or specific roles like "admin", "hr_admin", "employee"
    enabled: boolean;
    comingSoon?: boolean;
    category?: "core" | "admin" | "utility";
}

export const APP_MODULES: ModuleConfig[] = [
    {
        title: "User & Role Management",
        description: "Define granular permissions and custom user roles to ensure secure data access.",
        icon: Users,
        route: "/app/users",
        allowedRoles: ["super_admin", "hr_admin"],
        enabled: true,
        category: "admin",
    },
    {
        title: "Employee Management",
        description: "Unified 360-degree database for personal details, documents, and hierarchy.",
        icon: Briefcase,
        route: "/app/employees",
        allowedRoles: ["all"], // Employees see their own, HR sees all
        enabled: true,
        category: "core",
    },
    {
        title: "Recruitment & ATS",
        description: "Hiring lifecycle from job posting and screening to interview scheduling.",
        icon: Users,
        route: "/app/recruitment",
        allowedRoles: ["hr_admin", "super_admin"],
        enabled: true,
        category: "core",
    },
    {
        title: "Attendance Management",
        description: "Real-time capture via biometric integration or web punch-in.",
        icon: Calendar,
        route: "/app/attendance",
        allowedRoles: ["all"],
        enabled: true,
        category: "core",
    },
    {
        title: "Leave Management",
        description: "Leave rules, approval workflows, and real-time balance tracking.",
        icon: FileText,
        route: "/app/leave",
        allowedRoles: ["all"],
        enabled: true,
        category: "core",
    },
    {
        title: "Payroll Management",
        description: "Salary computation, tax calculations, and payslip generation.",
        icon: DollarSign,
        route: "/app/payroll",
        allowedRoles: ["finance_admin", "super_admin", "employee"], // Employees view payslips
        enabled: true,
        category: "core",
    },
    {
        title: "Performance (PMS)",
        description: "Goal setting, feedback loops, and 360-degree appraisals.",
        icon: TrendingUp,
        route: "/app/performance",
        allowedRoles: ["all"],
        enabled: true,
        comingSoon: true,
        category: "core",
    },
    {
        title: "L&D (LMS)",
        description: "Create, assign, and track training programs and certifications.",
        icon: GraduationCap,
        route: "/app/lms",
        allowedRoles: ["all"],
        enabled: true,
        comingSoon: true,
        category: "core",
    },
    {
        title: "Expense & Reimbursement",
        description: "Claim submissions, approval hierarchies, and digital receipt storage.",
        icon: Receipt,
        route: "/app/expenses",
        allowedRoles: ["all"],
        enabled: true,
        category: "utility",
    },
    {
        title: "Asset Management",
        description: "Lifecycle tracking from procurement to recovery and depreciation.",
        icon: HardDrive,
        route: "/app/assets",
        allowedRoles: ["hr_admin", "finance_admin", "super_admin"],
        enabled: true,
        comingSoon: true,
        category: "admin",
    },
    {
        title: "Compliance & Legal",
        description: "Manage employee contracts, policy documents, and compliance records.",
        icon: Shield,
        route: "/app/compliance",
        allowedRoles: ["hr_admin", "super_admin"],
        enabled: true,
        comingSoon: true,
        category: "admin",
    },
    {
        title: "Notifications",
        description: "Automated alerts for approvals, birthdays, and policy updates.",
        icon: Bell,
        route: "/app/notifications",
        allowedRoles: ["all"],
        enabled: true,
        category: "utility",
    },
    {
        title: "Reports & Analytics",
        description: "Visual dashboards for actionable insights on retention and efficiency.",
        icon: BarChart3,
        route: "/app/reports",
        allowedRoles: ["hr_admin", "super_admin", "finance_admin"],
        enabled: true,
        category: "admin",
    },
    {
        title: "Automation & AI",
        description: "Intelligent chatbot for answering employee queries instantly.",
        icon: Bot,
        route: "/app/automation",
        allowedRoles: ["all"],
        enabled: true,
        comingSoon: true,
        category: "utility",
    },
];
