import { Users, Shield, Activity } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersTab from "./UsersTab";
import RolesTab from "./RolesTab";

export default function UserManagementDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">User & Role Management</h1>
                <p className="text-muted-foreground">
                    Manage system access, define roles, and audit security logs.
                </p>
            </div>

            <Tabs defaultValue="users" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="users" className="flex gap-2">
                        <Users className="h-4 w-4" />
                        Users
                    </TabsTrigger>
                    <TabsTrigger value="roles" className="flex gap-2">
                        <Shield className="h-4 w-4" />
                        Roles & Permissions
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex gap-2">
                        <Activity className="h-4 w-4" />
                        Activity Logs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <UsersTab />
                </TabsContent>

                <TabsContent value="roles" className="space-y-4">
                    <RolesTab />
                </TabsContent>

                <TabsContent value="activity">
                    <div className="flex items-center justify-center h-64 border rounded-lg bg-card border-dashed">
                        <div className="text-center space-y-2">
                            <Activity className="h-10 w-10 text-muted-foreground mx-auto" />
                            <h3 className="text-lg font-medium">No Recent Activity</h3>
                            <p className="text-sm text-col text-muted-foreground">Audit logs will appear here.</p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
