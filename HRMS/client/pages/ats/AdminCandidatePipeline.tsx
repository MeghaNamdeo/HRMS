import { useState, useEffect } from "react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // Unused in MVP

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { User, Phone, Mail, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { atsService, Application } from "@/services/db/atsService";

const COLUMN_STATUSES = ["applied", "screening", "interview", "offer", "hired", "rejected"];

export default function AdminCandidatePipeline() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const data = await atsService.getAllApplications();
            setApplications(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusChange = async (appId: string, newStatus: string) => {
        const success = await atsService.updateStatus(appId, newStatus);

        if (success) {
            setApplications(apps => apps.map(app =>
                app.id === appId ? { ...app, status: newStatus } : app
            ));
            toast({
                title: "Status Updated",
                description: `Candidate moved to ${newStatus}.`,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update status.",
            });
        }
    };

    const getMatchScoreColor = (score: number) => {
        if (score >= 80) return "bg-green-100 text-green-800";
        if (score >= 50) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    if (loading) return <div className="p-8 text-center">Loading pipeline...</div>;

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Candidate Pipeline</h2>
                <p className="text-muted-foreground">Track and manage candidate applications.</p>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-[1200px]">
                    {COLUMN_STATUSES.map((status) => (
                        <div key={status} className="flex-1 min-w-[280px] bg-muted/40 rounded-lg border border-border p-3 flex flex-col">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="font-semibold capitalize text-sm text-foreground">{status}</h3>
                                <Badge variant="secondary" className="text-xs">
                                    {applications.filter(a => a.status === status).length}
                                </Badge>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] px-1 custom-scrollbar">
                                {applications.filter(a => a.status === status).map(app => (
                                    <Card key={app.id} className="cursor-pointer hover:shadow-md transition-shadow border-border bg-card">
                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-sm font-medium leading-tight text-foreground">
                                                    {app.candidate_name}
                                                </CardTitle>
                                                <Badge variant="outline" className={`ml-2 text-[10px] ${getMatchScoreColor(app.match_score)}`}>
                                                    {app.match_score}% Match
                                                </Badge>
                                            </div>
                                            <CardDescription className="text-xs mt-1 text-muted-foreground">
                                                {app.job?.title || "Unknown Job"}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-2 space-y-3">
                                            <div className="text-xs text-muted-foreground space-y-1">
                                                <div className="flex items-center">
                                                    <Mail className="h-3 w-3 mr-1" /> {app.email}
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="h-3 w-3 mr-1" /> {app.phone}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-6 text-xs px-2 hover:bg-muted">
                                                            <FileText className="h-3 w-3 mr-1" /> Resume
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>{app.candidate_name}'s Resume</DialogTitle>
                                                            <DialogDescription>Applied for {app.job?.title}</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="mt-4 p-4 bg-muted/20 border border-border rounded text-sm text-foreground whitespace-pre-wrap max-h-[60vh] overflow-y-auto font-mono">
                                                            {app.resume_text || "No resume text provided."}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                <Select
                                                    defaultValue={app.status}
                                                    onValueChange={(val) => handleStatusChange(app.id, val)}
                                                >
                                                    <SelectTrigger className="h-6 w-[100px] text-xs">
                                                        <SelectValue placeholder="Move" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {COLUMN_STATUSES.map(s => (
                                                            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
