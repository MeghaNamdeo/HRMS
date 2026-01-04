
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserCheck, Clock, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const data = [
    { name: 'Jan', employees: 110, active: 100 },
    { name: 'Feb', employees: 115, active: 108 },
    { name: 'Mar', employees: 120, active: 112 },
    { name: 'Apr', employees: 124, active: 118 },
    { name: 'May', employees: 128, active: 122 },
    { name: 'Jun', employees: 132, active: 128 },
];

const attendanceData = [
    { name: 'Mon', present: 95 },
    { name: 'Tue', present: 92 },
    { name: 'Wed', present: 96 },
    { name: 'Thu', present: 94 },
    { name: 'Fri', present: 88 },
];

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) return null;
    const isHR = user.roles.includes("ROLE_HR_ADMIN");
    const isFinance = user.roles.includes("ROLE_FINANCE_ADMIN");
    const isSuper = user.roles.includes("ROLE_SUPER_ADMIN");

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-none shadow-sm bg-white/50 dark:bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">128</div>
                        <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
                            <ArrowUpRight className="h-3 w-3 mr-1" /> +4% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 dark:bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Now</CardTitle>
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">112</div>
                        <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
                            <Activity className="h-3 w-3 mr-1" /> 88% online
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 dark:bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                            <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">12</div>
                        <p className="text-xs text-orange-600 flex items-center mt-1 font-medium">
                            Requires attention
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white/50 dark:bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Payroll Status</CardTitle>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                            <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pending</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            For March 2024
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Employee Growth</CardTitle>
                        <CardDescription>Employee headcount over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        labelStyle={{ color: 'var(--foreground)' }}
                                    />
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                                    <Area type="monotone" dataKey="employees" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorEmployees)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Weekly Attendance</CardTitle>
                        <CardDescription>Present employees this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attendanceData}>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    />
                                    <Bar dataKey="present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Section */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates from across the organization</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {[
                            { title: "New application received", desc: "Frontend Developer role • Mark Wilson", time: "2m ago", icon: UserCheck, color: "text-blue-500 bg-blue-100" },
                            { title: "Payroll generated", desc: "February 2024 payroll processed successfully", time: "1h ago", icon: DollarSign, color: "text-green-500 bg-green-100" },
                            { title: "Leave request approved", desc: "Sarah Smith • Sick Leave • 2 days", time: "3h ago", icon: Clock, color: "text-orange-500 bg-orange-100" },
                            { title: "New policy document", desc: "Updated Remote Work Policy v2.0", time: "5h ago", icon: TrendingUp, color: "text-purple-500 bg-purple-100" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start">
                                <div className={`h-9 w-9 rounded-full flex items-center justify-center mr-4 ${item.color.split(" ")[1]} dark:bg-opacity-20`}>
                                    <item.icon className={`h-5 w-5 ${item.color.split(" ")[0]}`} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none text-foreground">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </div>
                                <div className="ml-auto font-medium text-xs text-muted-foreground">{item.time}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
