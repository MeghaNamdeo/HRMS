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
  Clock,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Download,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function EmployeeDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      label: "Leave Balance",
      value: "12 Days",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Attendance",
      value: "96%",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Pending Approvals",
      value: "1",
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Performance Score",
      value: "4.2/5",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const recentActivities = [
    {
      type: "leave_approved",
      title: "Leave Request Approved",
      description: "Your leave for Dec 25-27 has been approved",
      date: "2 days ago",
      icon: CheckCircle,
    },
    {
      type: "attendance_pending",
      title: "Attendance Correction Pending",
      description: "Correction request for Dec 20 under review",
      date: "5 days ago",
      icon: AlertCircle,
    },
    {
      type: "payslip_ready",
      title: "November Payslip Ready",
      description: "Your payslip for November is now available",
      date: "1 week ago",
      icon: FileText,
    },
  ];

  return (
    <div className="flex bg-muted/50 min-h-screen">
      <PortalSidebar />

      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        <div className="max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Employee ID: {(user as any)?.employeeId || "EMP-001"} • Department: {(user as any)?.department || "Engineering"}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`${stat.bgColor} p-3 rounded-lg`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="border-slate-200 lg:col-span-1">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Request Leave
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Mark Attendance
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Payslip
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Correct Attendance
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-slate-200 lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your recent actions and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex gap-4 pb-4 border-b border-slate-200 last:border-b-0 last:pb-0">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-slate-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">
                            {activity.title}
                          </p>
                          <p className="text-sm text-slate-600">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leave Policy Summary */}
          <Card className="border-slate-200 mt-6">
            <CardHeader>
              <CardTitle>Leave Policy Summary</CardTitle>
              <CardDescription>
                Your annual leave entitlement and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Casual Leave</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-foreground">8</p>
                    <p className="text-sm text-muted-foreground">/ 12 days</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "67%" }}></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Sick Leave</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-foreground">6</p>
                    <p className="text-sm text-muted-foreground">/ 8 days</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">PTO (Paid Time Off)</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-foreground">4</p>
                    <p className="text-sm text-muted-foreground">/ 5 days</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Unpaid Leave</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-foreground">2</p>
                    <p className="text-sm text-muted-foreground">/ Unlimited</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-slate-200 mt-6">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Important dates and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg hover:border-primary hover:bg-muted/50 transition-colors">
                  <div className="text-2xl font-bold text-primary">25</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Year-End Review</p>
                    <p className="text-sm text-slate-600">December 25, 2024</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </div>

                <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg hover:border-primary hover:bg-muted/50 transition-colors">
                  <div className="text-2xl font-bold text-primary">31</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Salary Review Cycle</p>
                    <p className="text-sm text-slate-600">December 31, 2024</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </div>

                <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg hover:border-primary hover:bg-muted/50 transition-colors">
                  <div className="text-2xl font-bold text-primary">15</div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Form-16 Available</p>
                    <p className="text-sm text-slate-600">January 15, 2025</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
