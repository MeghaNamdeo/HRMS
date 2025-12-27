import { PortalSidebar } from "@/components/PortalSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  UserPlus,
  Activity,
  Calendar,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";

export default function HRAdminDashboard() {
  const { user } = useAuth();

  const kpis = [
    {
      label: "Total Employees",
      value: "5,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Active Recruitments",
      value: "18",
      change: "+3 this month",
      icon: UserPlus,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Pending Approvals",
      value: "24",
      change: "5 urgent",
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Onboarding in Progress",
      value: "12",
      change: "Due this week: 3",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const attendanceData = [
    { date: "Mon", present: 5000, absent: 150, leave: 84 },
    { date: "Tue", present: 5020, absent: 140, leave: 74 },
    { date: "Wed", present: 5050, absent: 130, leave: 54 },
    { date: "Thu", present: 5015, absent: 160, leave: 59 },
    { date: "Fri", present: 4980, absent: 180, leave: 74 },
  ];

  const departmentData = [
    { name: "Engineering", employees: 1200, vacancies: 8 },
    { name: "Sales", employees: 800, vacancies: 5 },
    { name: "Marketing", employees: 350, vacancies: 2 },
    { name: "HR", employees: 120, vacancies: 1 },
    { name: "Finance", employees: 180, vacancies: 2 },
  ];

  const recentEmployees = [
    {
      id: 1,
      name: "Alice Johnson",
      role: "Senior Engineer",
      joinDate: "Jan 10, 2024",
      status: "Active",
    },
    {
      id: 2,
      name: "Bob Smith",
      role: "Product Manager",
      joinDate: "Jan 8, 2024",
      status: "Active",
    },
    {
      id: 3,
      name: "Carol White",
      role: "Design Lead",
      joinDate: "Jan 5, 2024",
      status: "Onboarding",
    },
    {
      id: 4,
      name: "David Brown",
      role: "Sales Executive",
      joinDate: "Jan 3, 2024",
      status: "Active",
    },
    {
      id: 5,
      name: "Emma Davis",
      role: "Data Analyst",
      joinDate: "Jan 1, 2024",
      status: "Active",
    },
  ];

  const pendingActions = [
    {
      type: "leave_approval",
      title: "Leave Approval",
      count: 5,
      icon: Calendar,
      color: "text-blue-600",
      action: "Review",
    },
    {
      type: "attendance_correction",
      title: "Attendance Corrections",
      count: 8,
      icon: Clock,
      color: "text-amber-600",
      action: "Verify",
    },
    {
      type: "documents",
      title: "Document Submissions",
      count: 12,
      icon: AlertCircle,
      color: "text-red-600",
      action: "Review",
    },
    {
      type: "resignations",
      title: "Resignation Notices",
      count: 2,
      icon: Users,
      color: "text-purple-600",
      action: "Process",
    },
  ];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <PortalSidebar />

      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        <div className="max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              HR Administration Dashboard
            </h1>
            <p className="text-slate-600 mt-2">
              Manage your workforce efficiently • {user?.name}
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <Card key={index} className="border-slate-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          {kpi.label}
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {kpi.value}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {kpi.change}
                        </p>
                      </div>
                      <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                        <Icon className={`w-6 h-6 ${kpi.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Attendance Chart */}
            <Card className="border-slate-200 lg:col-span-2">
              <CardHeader>
                <CardTitle>Weekly Attendance Trend</CardTitle>
                <CardDescription>
                  Attendance, absence, and leave patterns this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="present" fill="#3b82f6" name="Present" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                    <Bar dataKey="leave" fill="#f59e0b" name="Leave" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pending Actions */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Pending Actions</CardTitle>
                <CardDescription>
                  Require your attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-primary hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <Icon className={`w-5 h-5 ${action.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {action.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {action.count} pending
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:bg-primary/10"
                      >
                        {action.action}
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Department Overview and Recent Employees */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Breakdown */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>
                  Employee distribution across departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.map((dept, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-slate-900">
                          {dept.name}
                        </p>
                        <span className="text-sm text-slate-500">
                          {dept.employees} employees
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${(dept.employees / 1200) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs text-amber-600 font-semibold">
                          {dept.vacancies} vacant
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Onboardings */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle>Recent Employees</CardTitle>
                <CardDescription>
                  Recently joined employees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-start justify-between p-3 border border-slate-200 rounded-lg hover:border-primary hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">
                          {emp.name}
                        </p>
                        <p className="text-sm text-slate-600">{emp.role}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Joined: {emp.joinDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            emp.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employee Lifecycle Status */}
          <Card className="border-slate-200 mt-6">
            <CardHeader>
              <CardTitle>Employee Lifecycle Status</CardTitle>
              <CardDescription>
                Employees in each stage of their lifecycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="text-center p-4 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Recruitment</p>
                  <p className="text-3xl font-bold text-slate-900">48</p>
                  <p className="text-xs text-slate-500 mt-2">candidates in pipeline</p>
                </div>

                <div className="text-center p-4 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Onboarding</p>
                  <p className="text-3xl font-bold text-amber-600">12</p>
                  <p className="text-xs text-slate-500 mt-2">in progress</p>
                </div>

                <div className="text-center p-4 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Active</p>
                  <p className="text-3xl font-bold text-green-600">5,234</p>
                  <p className="text-xs text-slate-500 mt-2">employees</p>
                </div>

                <div className="text-center p-4 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">On Leave</p>
                  <p className="text-3xl font-bold text-blue-600">156</p>
                  <p className="text-xs text-slate-500 mt-2">currently</p>
                </div>

                <div className="text-center p-4 border border-slate-200 rounded-lg">
                  <p className="text-sm text-slate-600 mb-2">Exit</p>
                  <p className="text-3xl font-bold text-red-600">8</p>
                  <p className="text-xs text-slate-500 mt-2">resignations pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
