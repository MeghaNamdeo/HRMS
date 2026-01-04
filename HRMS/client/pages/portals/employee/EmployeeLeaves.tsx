
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { leaveService, Leave } from "@/services/db/leaveService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function EmployeeLeaves() {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        type: "Casual Leave",
        startDate: "",
        endDate: "",
        reason: ""
    });

    useEffect(() => {
        if (user) loadLeaves();
    }, [user]);

    const loadLeaves = async () => {
        if (!user) return;
        try {
            const data = await leaveService.getMyLeaves(user.id);
            setLeaves(data);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        try {
            await leaveService.apply({
                employeeId: user.id,
                type: formData.type as any,
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason
            });
            toast.success("Leave application submitted");
            setOpen(false);
            loadLeaves();
        } catch (err) {
            toast.error("Failed to apply");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">My Leaves</h2>
                    <p className="text-muted-foreground">Detailed view of your leave history and balance.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"><Plus className="mr-2 h-4 w-4" /> Apply Leave</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Apply for Leave</DialogTitle></DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>Leave Type</Label>
                                <Select onValueChange={(v) => setFormData({ ...formData, type: v })} defaultValue={formData.type}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                                        <SelectItem value="Earned Leave">Earned Leave</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input type="date" required onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input type="date" required onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Reason</Label>
                                <Input required onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
                            </div>
                            <Button type="submit" className="w-full">Submit Application</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-none shadow-sm bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50/80 transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Leave Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">12 Days</div>
                        <p className="text-xs text-blue-600/80 mt-1">Available for this year</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-orange-50/50 dark:bg-orange-900/10 hover:bg-orange-50/80 transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">4 Days</div>
                        <p className="text-xs text-orange-600/80 mt-1">Consumed this year</p>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-purple-50/50 dark:bg-purple-900/10 hover:bg-purple-50/80 transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Pending Approval</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{leaves.filter(l => l.status === 'pending').length} Requests</div>
                        <p className="text-xs text-purple-600/80 mt-1">Awaiting manager action</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Leave History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {leaves.map((leave) => (
                            <div key={leave.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0 hover:bg-muted/30 p-2 rounded-lg transition-colors">
                                <div className="space-y-1">
                                    <p className="font-semibold text-foreground">{leave.type}</p>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                        {leave.startDate} — {leave.endDate}
                                    </div>
                                    <p className="text-xs text-muted-foreground italic">"{leave.reason}"</p>
                                </div>
                                <Badge variant="outline" className={`
                                    ${leave.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                        leave.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                            'bg-red-50 text-red-700 border-red-200'}
                                    uppercase tracking-wider text-xs font-semibold px-2.5 py-0.5
                                `}>
                                    {leave.status}
                                </Badge>
                            </div>
                        ))}
                        {leaves.length === 0 && (
                            <div className="text-center py-12">
                                <div className="bg-muted/50 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                                    <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground font-medium">No leave history found</p>
                                <p className="text-xs text-muted-foreground mt-1">Apply for leave to get started</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
