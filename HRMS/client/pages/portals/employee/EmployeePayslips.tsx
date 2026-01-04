
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { payrollService, Payslip } from "@/services/db/payrollService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";

export default function EmployeePayslips() {
    const { user } = useAuth();
    const [payslips, setPayslips] = useState<Payslip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) loadData();
    }, [user]);

    const loadData = async () => {
        // In a real app, we'd have a specific getMyPayslips(uid), but for now we filter the mock history
        const all = await payrollService.getHistory();
        // Filter for current user (or match name for mock)
        const mySlips = all.filter(p => p.employeeId === user?.id || p.employeeName.includes(user?.name.split(" ")[0] || ""));
        setPayslips(mySlips);
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">My Payslips</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {payslips.map(slip => (
                    <Card key={slip.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{slip.month}</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${slip.netSalary}</div>
                            <p className="text-xs text-muted-foreground">Net Pay</p>
                            <div className="mt-4 flex items-center justify-between">
                                <Badge variant="outline">{slip.status}</Badge>
                                <Button size="sm" variant="ghost">
                                    <Download className="mr-2 h-4 w-4" /> Download
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {payslips.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No payslips available yet.
                    </div>
                )}
            </div>
        </div>
    );
}
