
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { employeeService, Employee } from "@/services/db/employeeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Plus, Search, MoreVertical, LayoutGrid, List } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddEmployeeDialog from "./AddEmployeeDialog";

export default function EmployeeList() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const data = await employeeService.getAll();
            setEmployees(data);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Employees</h2>
                    <p className="text-muted-foreground">Manage your team members and their access.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-muted p-1 rounded-lg border border-border">
                        <Button
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Employee
                    </Button>
                </div>
            </div>

            <AddEmployeeDialog open={isAddOpen} onOpenChange={setIsAddOpen} onSuccess={loadEmployees} />

            <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, or role..."
                        className="pl-9 bg-background border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {/* Filter Placeholder - Could be a dropdown here */}
            </div>

            {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="animate-pulse h-64 bg-muted/20 border-border" />
                    ))}
                </div>
            ) : filteredEmployees.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border">
                    No employees found matching your search.
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredEmployees.map((emp) => (
                        <Card key={emp.id} className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20 border-border bg-card">
                            <div className="h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors" />
                            <CardContent className="pt-0 -mt-12 text-center pb-6">
                                <div className="mx-auto h-24 w-24 rounded-full border-4 border-background bg-card flex items-center justify-center text-3xl font-bold text-primary shadow-sm mb-3">
                                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                                </div>
                                <h3 className="font-semibold text-lg text-foreground">{emp.firstName} {emp.lastName}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{emp.designation}</p>

                                <div className="space-y-2 mb-6">
                                    <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted/80">
                                        {emp.department}
                                    </Badge>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <span className={`h-2 h-2 w-2 rounded-full ${emp.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`} />
                                        <span className="text-xs uppercase tracking-wider font-medium text-muted-foreground">{emp.status}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2">
                                    <Button variant="outline" size="sm" className="w-full">
                                        View Profile
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Terminate</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-border shadow-sm">
                    <CardHeader className="p-0" />
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="font-semibold">Name</TableHead>
                                    <TableHead className="font-semibold">Role</TableHead>
                                    <TableHead className="font-semibold">Department</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Joined</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmployees.map((emp) => (
                                    <TableRow key={emp.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                                    {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-foreground">{emp.firstName} {emp.lastName}</div>
                                                    <div className="text-xs text-muted-foreground">{emp.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{emp.role}</TableCell>
                                        <TableCell>
                                            <span className="text-sm">{emp.department}</span>
                                            <span className="text-xs text-muted-foreground ml-2">• {emp.designation}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={emp.status === 'active' ? 'default' : 'secondary'} className={emp.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none' : ''}>
                                                {emp.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{emp.doj}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Terminate</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
