import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield } from "lucide-react";

interface Permission {
    module: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
}

const MODULES = ["Users", "Employees", "Payroll", "Leave", "Attendance", "ATS"];

const MOCK_ROLES: Role[] = [
    {
        id: "super_admin",
        name: "Super Admin",
        description: "Full access to all modules and settings.",
        permissions: MODULES.map(m => ({ module: m, view: true, create: true, edit: true, delete: true }))
    },
    {
        id: "hr_admin",
        name: "HR Admin",
        description: "Manage employees, recruitment, and leaves.",
        permissions: MODULES.map(m => ({ module: m, view: true, create: m !== "Payroll", edit: true, delete: m !== "Payroll" }))
    },
    {
        id: "manager",
        name: "Manager",
        description: "Team management and approvals.",
        permissions: MODULES.map(m => ({ module: m, view: true, create: false, edit: false, delete: false }))
    },
    {
        id: "employee",
        name: "Employee",
        description: "Self-service portal access only.",
        permissions: MODULES.map(m => ({ module: m, view: m === "Leave" || m === "Attendance", create: false, edit: false, delete: false }))
    }
];

export default function RolesTab() {
    const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
    const [selectedRole, setSelectedRole] = useState<Role | null>(MOCK_ROLES[0]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Roles List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Roles</h3>
                    <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" /> New
                    </Button>
                </div>
                <div className="space-y-2">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            onClick={() => setSelectedRole(role)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedRole?.id === role.id
                                    ? "bg-primary/5 border-primary shadow-sm"
                                    : "bg-card border-border hover:border-primary/50"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{role.name}</span>
                                {role.id === "super_admin" && <Shield className="h-3 w-3 text-primary" />}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {role.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Permission Matrix */}
            <div className="lg:col-span-3 space-y-4">
                <div className="bg-card rounded-lg border border-border">
                    <div className="p-4 border-b border-border flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">{selectedRole?.name} Permissions</h3>
                            <p className="text-sm text-muted-foreground">{selectedRole?.description}</p>
                        </div>
                        <Button>Save Changes</Button>
                    </div>
                    <div className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Module</TableHead>
                                    <TableHead className="text-center">View</TableHead>
                                    <TableHead className="text-center">Create</TableHead>
                                    <TableHead className="text-center">Edit</TableHead>
                                    <TableHead className="text-center">Delete</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedRole?.permissions.map((perm, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{perm.module}</TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox checked={perm.view} disabled={selectedRole.id === "super_admin"} />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox checked={perm.create} disabled={selectedRole.id === "super_admin"} />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox checked={perm.edit} disabled={selectedRole.id === "super_admin"} />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox checked={perm.delete} disabled={selectedRole.id === "super_admin"} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
