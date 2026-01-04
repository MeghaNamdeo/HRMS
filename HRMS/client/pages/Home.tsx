import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { FeaturesSection } from "@/components/FeaturesSection";
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
  Calendar,
  FileText,
  GraduationCap,
  Receipt,
  HardDrive,
  Bell,
  Bot,
  Server,
  Code,
  Smartphone,
} from "lucide-react";

export default function Home() {


  const architecture = [
    {
      icon: Code,
      title: "Frontend",
      details: ["React.js / Next.js", "Tailwind CSS / MUI", "Role-based UI"],
    },
    {
      icon: Server,
      title: "Backend",
      details: ["Node.js + Express/NestJS", "REST / GraphQL", "Microservices"],
    },
    {
      icon: Database,
      title: "Database",
      details: ["PostgreSQL / MySQL", "MongoDB (Logs)", "Redis (Caching)"],
    },
    {
      icon: Lock,
      title: "Security",
      details: ["JWT + OAuth 2.0", "RBAC", "Audit Logs & Encryption"],
    },
  ];

  return (
    <div className="w-full">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">HRMSuite</span>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Button variant="ghost">Modules</Button>
              <Button variant="ghost">Pricing</Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              The World's Best
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                HRMS Platform
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              A full-featured, enterprise-grade HR software designed to manage
              the complete employee lifecycle. Matching premium tools used by
              top MNCs with modularity, customization, and AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/login">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                View Architecture
              </Button>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              Suitable for Startups, SMEs, and Large Enterprises
            </p>
          </div>
        </div>
      </section>

      {/* Core Modules Grid */}
      <FeaturesSection />

      {/* Architecture Section */}
      <section className="py-16 lg:py-24 bg-foreground text-background dark:bg-muted/20 dark:text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Modern Technical Architecture
            </h2>
            <p className="text-lg opacity-80">
              Built for performance, security, and scalability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {architecture.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-background/10 border border-white/10 dark:bg-card dark:border-border"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm opacity-80">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enterprise Capabilities */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Enterprise Security
              </h3>
              <p className="text-muted-foreground">
                Data encryption, Role-based masking, GDPR-ready architecture,
                and complete audit logs.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Layers className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Scalable Infrastructure
              </h3>
              <p className="text-muted-foreground">
                Docker & Kubernetes ready with CI/CD pipelines. Scales from 10
                to 100,000+ employees.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Smartphone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Mobile & Global
              </h3>
              <p className="text-muted-foreground">
                Voice-based attendance, mobile app support, and global payroll
                configuration.
              </p>
            </div>
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
            Join the future of work with HRMSuite.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-accent hover:text-accent-foreground"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className="bg-muted/50 dark:bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Briefcase className="w-6 h-6 text-primary" />
            <span className="text-foreground text-xl font-bold">HRMSuite</span>
          </div>
          <p className="mb-8 text-muted-foreground">
            Built with ❤️ by Megha Namdeo | Vision: To build the world's best
            HRMS.
          </p>
          <div className="text-sm text-muted-foreground">
            © 2024 HRMSuite. MIT License.
          </div>
        </div>
      </footer>
    </div>
  );
}
