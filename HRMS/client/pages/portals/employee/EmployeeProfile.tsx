
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function EmployeeProfile() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="col-span-1">
                    <CardHeader className="text-center">
                        <div className="w-full flex justify-center mb-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                        <div className="mt-2">
                            {user.roles.map(r => <Badge key={r} variant="secondary" className="mr-1">{r.replace('ROLE_', '')}</Badge>)}
                        </div>
                    </CardHeader>
                </Card>

                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Personal & Employment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Department</Label>
                                <div className="font-medium">Engineering (Mock)</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Designation</Label>
                                <div className="font-medium">Software Engineer (Mock)</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Date of Joining</Label>
                                <div className="font-medium">Jan 15, 2023</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground">Employee ID</Label>
                                <div className="font-medium">{user.id}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
