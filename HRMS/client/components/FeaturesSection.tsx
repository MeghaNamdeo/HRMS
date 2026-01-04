import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { APP_MODULES, ModuleConfig } from "@/config/modules";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

// --- Components ---

const FeatureCard = ({ feature }: { feature: ModuleConfig }) => {
    const Icon = feature.icon;
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();

    // Logic for RBAC & Interaction
    const handleCardClick = () => {
        // 1. If coming soon, block interaction
        if (feature.comingSoon) return;

        // 2. If not authenticated, redirect to login
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        // 3. Check RBAC
        const userRoles = user?.roles || [];
        const hasAccess = feature.allowedRoles.includes("all") ||
            feature.allowedRoles.some(r => userRoles.includes(r));

        if (!hasAccess) {
            toast({
                title: "Access Denied",
                description: "You do not have permission to access this module.",
                variant: "destructive",
            });
            return;
        }

        // 4. Navigate
        navigate(feature.route);
    };

    return (
        <Card
            onClick={handleCardClick}
            className={cn(
                "group h-full transition-all duration-300 ease-in-out relative overflow-hidden",
                "border border-border", // Light: gray-200, Dark: slate-800
                "bg-background dark:bg-[#020617]", // Strict requirement: #020617
                feature.comingSoon ? "opacity-70 cursor-not-allowed" : "cursor-pointer hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
            )}
        >
            {feature.comingSoon && (
                <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="text-xs bg-muted/50">Coming Soon</Badge>
                </div>
            )}
            <CardHeader className="relative z-10">
                <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors",
                    "bg-primary/10 text-primary",
                    !feature.comingSoon && "group-hover:bg-primary group-hover:text-primary-foreground"
                )}>
                    <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    {feature.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                </p>
            </CardContent>
        </Card>
    );
};

export const FeaturesSection = () => {
    return (
        <section className="py-16 lg:py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                        14+ Power-Packed Modules
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Everything you need under one roof. Integrated, modular, and built for the modern enterprise.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {APP_MODULES.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} />
                    ))}
                </div>
            </div>
        </section>
    );
};
