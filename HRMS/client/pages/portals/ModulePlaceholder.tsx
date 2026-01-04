import { LucideIcon, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ModulePlaceholderProps {
    title: string;
    description: string;
    icon: LucideIcon;
    features: string[];
    status?: "active" | "development" | "planned";
}

export default function ModulePlaceholder({
    title,
    description,
    icon: Icon,
    features,
    status = "development",
}: ModulePlaceholderProps) {
    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <div className="mb-8 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                    <Icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                    <p className="text-muted-foreground mt-1">{description}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Status Card */}
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle>Module Status</CardTitle>
                            <CardDescription>Current implementation status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 p-4 bg-yellow-50/50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50 text-yellow-700 dark:text-yellow-400 mb-6">
                                <AlertCircle className="w-5 h-5" />
                                <p className="font-medium">
                                    This module is currently under active development.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-foreground">Planned Features</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-sm text-foreground/80">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* KPI Placeholders */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-32 bg-muted/20 rounded-xl animate-pulse"
                            />
                        ))}
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full justify-start" disabled>
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Configure Settings
                            </Button>
                            <Button variant="outline" className="w-full justify-start" disabled>
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Generate Reports
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
