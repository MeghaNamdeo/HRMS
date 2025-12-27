import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Briefcase,
  DollarSign,
  BarChart3,
  Lock,
  CheckCircle,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  Layers,
  Database,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Users,
      title: "Employee Portal",
      description:
        "Self-service platform for attendance, leave, payslip, and personal data management",
      role: "Employee",
    },
    {
      icon: Briefcase,
      title: "HR Administration",
      description:
        "Complete employee lifecycle management, recruitment, onboarding, and compliance",
      role: "HR Admin",
    },
    {
      icon: DollarSign,
      title: "Finance & Payroll",
      description:
        "Salary structure, payroll processing, tax calculation, and financial reports",
      role: "Finance Admin",
    },
    {
      icon: BarChart3,
      title: "Manager Dashboard",
      description:
        "Team management, leave approvals, performance reviews, and goal tracking",
      role: "Manager",
    },
    {
      icon: Lock,
      title: "Super Admin",
      description:
        "System configuration, role management, audit logs, and integration settings",
      role: "Super Admin",
    },
  ];

  const capabilities = [
    {
      icon: Shield,
      title: "Zero Data Leakage",
      description: "Role-based access control with complete data isolation",
    },
    {
      icon: Zap,
      title: "Enterprise Grade",
      description: "Scalable from 10 to 100,000+ employees",
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "India + Global compliance ready (GDPR, PF, ESIC, Tax)",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Real-time dashboards and comprehensive reporting",
    },
    {
      icon: Layers,
      title: "Workflow Automation",
      description: "Approval workflows, escalations, and automated processes",
    },
    {
      icon: Database,
      title: "Data Integrity",
      description: "Audit trails, data validation, and regulatory compliance",
    },
  ];

  const workflow = [
    {
      step: "1",
      title: "Login & Role Detection",
      description:
        "Secure authentication with automatic role detection and portal routing",
    },
    {
      step: "2",
      title: "Role-Based Access",
      description:
        "Each role sees only authorized data and functions for their scope",
    },
    {
      step: "3",
      title: "Seamless Workflows",
      description:
        "Automated approval chains, leave requests, and payroll processing",
    },
    {
      step: "4",
      title: "Compliance & Audit",
      description:
        "Complete audit trails and compliance reporting for regulatory requirements",
    },
  ];

  return (
    <div className="w-full">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">HRMSuite</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">Compliance</Button>
              <Link to="/login">
                <Button className="bg-primary hover:bg-primary/90">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Enterprise HRMS for the
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Modern Workplace
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              A world-class Human Resource Management System with enterprise-grade
              security, compliance, and scalability. From 10 to 100,000+ employees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Explore the System
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Portals Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Complete Role-Based Portals
            </h2>
            <p className="text-lg text-slate-600">
              Tailored interfaces for every stakeholder in your organization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-slate-200 hover:border-primary hover:shadow-lg transition-all"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-slate-900">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-primary font-semibold text-xs">
                      {feature.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Intelligent Workflow
            </h2>
            <p className="text-lg text-slate-600">
              From login to daily operations, every step is optimized for
              efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflow.map((item, index) => (
              <div key={index} className="relative">
                <div className="absolute w-12 h-12 -left-6 top-0 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <Card className="border-slate-200 pt-8 h-full">
                  <CardHeader>
                    <CardTitle className="text-slate-900">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Capabilities */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Enterprise Capabilities
            </h2>
            <p className="text-lg text-slate-600">
              Built for security, compliance, and scalability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 p-6 rounded-lg border border-slate-200 hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {capability.title}
                    </h3>
                    <p className="mt-2 text-slate-600">
                      {capability.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Key Features
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Everything you need to manage your workforce effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Complete Employee Lifecycle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-600">
                <div>• Recruitment and hiring</div>
                <div>• Onboarding and document collection</div>
                <div>• Active employment management</div>
                <div>• Performance appraisals</div>
                <div>• Resignation and exit management</div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Attendance & Leave Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-600">
                <div>• Real-time attendance tracking</div>
                <div>• Leave policy configuration</div>
                <div>• Approval workflows</div>
                <div>• Attendance corrections</div>
                <div>• Leave balance analytics</div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Payroll & Finance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-600">
                <div>• Salary structure management</div>
                <div>• Monthly payroll processing</div>
                <div>• Tax calculations (India + Global)</div>
                <div>• PF, ESIC, and Form-16 management</div>
                <div>• Financial reporting and analytics</div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Compliance & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-600">
                <div>• Role-based access control</div>
                <div>• Comprehensive audit logs</div>
                <div>• Data encryption and isolation</div>
                <div>• GDPR compliance</div>
                <div>• Regulatory compliance ready</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your HR?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Explore HRMSuite and see how it can streamline your HR operations
          </p>
          <Link to="/login">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-slate-100"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-semibold">HRMSuite</span>
              </div>
              <p className="text-sm">
                Enterprise HRMS for modern organizations
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-sm">
              © 2024 HRMSuite. All rights reserved. Built for enterprise.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
