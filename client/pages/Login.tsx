import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Briefcase,
  DollarSign,
  BarChart3,
  Lock,
  LogIn,
  AlertCircle,
  Loader,
} from "lucide-react";

const DEMO_ACCOUNTS = [
  {
    email: "john.doe@company.com",
    name: "John Doe",
    icon: Users,
    description: "View profile, leave, attendance, payslip",
    role: "Employee",
  },
  {
    email: "hr.admin@company.com",
    name: "HR Admin",
    icon: Briefcase,
    description: "Employee lifecycle, recruitment, policies",
    role: "HR Admin",
  },
  {
    email: "finance.admin@company.com",
    name: "Finance Admin",
    icon: DollarSign,
    description: "Payroll, salary, tax, financial reports",
    role: "Finance Admin",
  },
  {
    email: "manager@company.com",
    name: "Manager",
    icon: BarChart3,
    description: "Team management, approvals, reviews",
    role: "Manager",
  },
  {
    email: "super.admin@company.com",
    name: "Super Admin",
    icon: Lock,
    description: "System configuration, audit logs, integrations",
    role: "Super Admin",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("demo");
  const [isCustomLogin, setIsCustomLogin] = useState(false);

  // Redirect if already logged in
  if (user && !isLoading) {
    const roleMap: Record<string, string> = {
      "ROLE_EMPLOYEE": "employee",
      "ROLE_HR_ADMIN": "hr_admin",
      "ROLE_FINANCE_ADMIN": "finance_admin",
      "ROLE_MANAGER": "manager",
      "ROLE_SUPER_ADMIN": "super_admin",
    };
    const firstRole = user.roles[0];
    const mappedRole = roleMap[firstRole] || "employee";
    navigate(`/portal/${mappedRole}`, { replace: true });
    return null;
  }

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }
    try {
      await login(email, password);
      const roleMap: Record<string, string> = {
        "ROLE_EMPLOYEE": "employee",
        "ROLE_HR_ADMIN": "hr_admin",
        "ROLE_FINANCE_ADMIN": "finance_admin",
        "ROLE_MANAGER": "manager",
        "ROLE_SUPER_ADMIN": "super_admin",
      };
      // Get the first role from the logged-in user
      if (user) {
        const mappedRole = roleMap[user.roles[0]] || "employee";
        navigate(`/portal/${mappedRole}`);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const quickLogin = async (account: (typeof DEMO_ACCOUNTS)[0]) => {
    try {
      await login(account.email, "demo");
      const roleMap: Record<string, string> = {
        "ROLE_EMPLOYEE": "employee",
        "ROLE_HR_ADMIN": "hr_admin",
        "ROLE_FINANCE_ADMIN": "finance_admin",
        "ROLE_MANAGER": "manager",
        "ROLE_SUPER_ADMIN": "super_admin",
      };
      if (user) {
        const mappedRole = roleMap[user.roles[0]] || "employee";
        navigate(`/portal/${mappedRole}`);
      }
    } catch (err) {
      console.error("Quick login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-center min-h-screen px-4 py-12">
          <div className="w-full max-w-6xl">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">HRMSuite</h1>
              </div>
              <p className="text-xl text-slate-400">
                Enterprise HRMS Platform
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="max-w-2xl mx-auto mb-6 p-4 border border-red-500 bg-red-500/10 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-200">{error}</p>
                  <p className="text-sm text-red-300 mt-1">
                    Please check your credentials and try again
                  </p>
                </div>
              </div>
            )}

            <Tabs defaultValue="quick" className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="quick">Quick Login</TabsTrigger>
                <TabsTrigger value="custom">Custom Login</TabsTrigger>
              </TabsList>

              {/* Quick Login Tab */}
              <TabsContent value="quick" className="space-y-6">
                <p className="text-center text-slate-400 mb-6">
                  Select a demo account to explore the system
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {DEMO_ACCOUNTS.map((account) => {
                    const Icon = account.icon;
                    return (
                      <button
                        key={account.email}
                        onClick={() => quickLogin(account)}
                        disabled={isLoading}
                        className="group relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50 p-6 transition-all hover:border-primary hover:bg-slate-800/80 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="rounded-lg bg-primary/20 p-3 group-hover:bg-primary/30 transition-colors">
                            {isLoading ? (
                              <Loader className="w-6 h-6 text-primary animate-spin" />
                            ) : (
                              <Icon className="w-6 h-6 text-primary" />
                            )}
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold text-white">
                              {account.name}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                              {account.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Custom Login Tab */}
              <TabsContent value="custom">
                <Card className="max-w-md mx-auto border-slate-700 bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Sign In</CardTitle>
                    <CardDescription>
                      Enter your email and password to sign in
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleLogin();
                        }}
                        disabled={isLoading}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-300">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleLogin();
                        }}
                        disabled={isLoading}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 disabled:opacity-50"
                      />
                    </div>

                    <Button
                      onClick={handleLogin}
                      disabled={!email || !password || isLoading}
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-slate-400 text-center">
                      Use any demo email • Password: demo
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
