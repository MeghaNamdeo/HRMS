
import { useState, useEffect } from "react";
import { payrollService, Payslip } from "@/services/db/payrollService";
import { employeeService, Employee } from "@/services/db/employeeService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function PayrollDashboard() {
    const [history, setHistory] = useState<Payslip[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [payslips, emps] = await Promise.all([
            payrollService.getHistory(),
            employeeService.getAll()
        ]);
        setHistory(payslips);
        setEmployees(emps);
        setLoading(false);
    };

    const handleRunPayroll = async (emp: Employee) => {
        try {
            await payrollService.generate(emp.id, `${emp.firstName} ${emp.lastName}`, 5000); // Mock salary 5k
            toast.success(`Payroll generated for ${emp.firstName}`);
            loadData();
        } catch (e) {
            toast.error("Failed to generate payroll");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Payroll Management</h2>
                    <p className="text-muted-foreground">Analyze and process monthly payrolls.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                <Card className="md:col-span-5 border-none shadow-sm bg-gradient-to-br from-white to-slate-50 dark:from-card dark:to-background">
                    <CardHeader className="border-b border-border/50">
                        <CardTitle className="flex items-center gap-2">
                            <PlayCircle className="h-5 w-5 text-primary" />
                            Process Payroll
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Generate payslips for current month</p>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="pl-6">Employee</TableHead>
                                    <TableHead className="text-right pr-6">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.map(emp => (
                                    <TableRow key={emp.id} className="hover:bg-muted/50 transition-colors">
                                        <TableCell className="pl-6 font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                                                </div>
                                                {emp.firstName} {emp.lastName}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button size="sm" variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => handleRunPayroll(emp)}>
                                                Generate
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {employees.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                                            No employees found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="md:col-span-7 border-border shadow-sm">
                    <CardHeader className="border-b border-border/50 bg-muted/20">
                        <CardTitle>Recent Payslips</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-border/50">
                                    <TableHead className="pl-6">Employee</TableHead>
                                    <TableHead>Month</TableHead>
                                    <TableHead>Net Pay</TableHead>
                                    <TableHead className="text-right pr-6">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map(slip => (
                                    <TableRow key={slip.id} className="hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0">
                                        <TableCell className="pl-6 font-medium">{slip.employeeName}</TableCell>
                                        <TableCell className="text-muted-foreground">{slip.month}</TableCell>
                                        <TableCell className="font-mono text-foreground">${slip.netSalary}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                {slip.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {history.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                                            No payslips generated yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
