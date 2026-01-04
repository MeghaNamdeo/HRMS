import { PortalSidebar } from "@/components/PortalSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

const PORTAL_INFO = {
  finance_admin: {
    name: "Finance & Payroll Portal",
    description: "Comprehensive payroll processing, salary management, and financial reporting",
    features: [
      "Salary structure management",
      "Monthly payroll processing",
      "Tax calculation (PF, ESIC, Form-16)",
      "Financial reports and analytics",
      "Reimbursement management",
    ],
  },
  manager: {
    name: "Manager Portal",
    description: "Team management, approvals, performance reviews, and goal tracking",
    features: [
      "Team dashboard and directory",
      "Leave and attendance approvals",
      "Performance reviews",
      "Goal tracking",
      "Team analytics and reports",
    ],
  },
  super_admin: {
    name: "Super Admin Portal",
    description: "System configuration, role management, and audit logging",
    features: [
      "Role-based access control",
      "User and organization management",
      "Policy configuration",
      "Feature flags and integrations",
      "Comprehensive audit logs",
    ],
  },
};

export default function PlaceholderPortal() {
  const { role } = useParams<{ role: string }>();
  const info = PORTAL_INFO[role as keyof typeof PORTAL_INFO];

  if (!info) {
    return (
      <div className="flex bg-background min-h-screen">
        <PortalSidebar />
        <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0 flex items-center justify-center">
          <Card className="border-border max-w-md">
            <CardHeader>
              <CardTitle>Portal Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The requested portal does not exist. Please select a valid role from the sidebar.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-screen">
      <PortalSidebar />

      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        <div className="max-w-4xl">
          {/* Empty State */}
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">
              {info.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {info.description}
            </p>

            {/* Key Features Preview */}
            <Card className="border-border max-w-2xl mx-auto mb-8">
              <CardHeader>
                <CardTitle className="text-left">Planned Features</CardTitle>
              </CardHeader>
              <CardContent className="text-left">
                <ul className="space-y-3">
                  {info.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <span className="text-foreground font-medium">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-8 max-w-2xl mx-auto">
              <p className="text-foreground mb-4">
                This portal is ready to be customized and built out. Continue prompting to design and implement:
              </p>
              <ul className="text-left space-y-2 mb-6 text-muted-foreground">
                <li>• Detailed dashboard layouts and analytics</li>
                <li>• Data tables and management interfaces</li>
                <li>• Forms and workflow automation</li>
                <li>• Reports and export functionality</li>
                <li>• Role-specific features and integrations</li>
              </ul>
              <p className="text-sm text-muted-foreground italic">
                Ask the assistant to "Build out the {info.name.split(" ")[0]} Portal with [specific features]"
              </p>
            </div>

            {/* Navigation */}
            <div className="mt-12">
              <p className="text-muted-foreground mb-4">
                You can navigate between portals using the sidebar menu
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline">
                  View Documentation
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  Continue Building
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
