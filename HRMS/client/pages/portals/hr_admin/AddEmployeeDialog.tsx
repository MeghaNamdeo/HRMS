
import { useState } from "react";
import { useForm } from "react-hook-form";
import { employeeService, Employee } from "@/services/db/employeeService";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

type FormData = Omit<Employee, "id">;

export default function AddEmployeeDialog({ open, onOpenChange, onSuccess }: Props) {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            role: "ROLE_EMPLOYEE",
            status: "active"
        }
    });

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            await employeeService.create(data);
            toast.success("Employee created successfully");
            onSuccess();
            onOpenChange(false);
            reset();
        } catch (error: any) {
            toast.error("Failed to create employee: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>
                        Create a new employee profile. They will receive an email to set their password.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input id="firstName" {...register("firstName", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" {...register("lastName", { required: true })} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email", { required: true })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select onValueChange={(val: any) => setValue("role", val)} defaultValue="ROLE_EMPLOYEE">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ROLE_EMPLOYEE">Employee</SelectItem>
                                    <SelectItem value="ROLE_HR_ADMIN">HR Admin</SelectItem>
                                    <SelectItem value="ROLE_FINANCE_ADMIN">Finance Admin</SelectItem>
                                    <SelectItem value="ROLE_SUPER_ADMIN">Super Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Input id="department" {...register("department", { required: true })} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="designation">Designation</Label>
                            <Input id="designation" {...register("designation", { required: true })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="doj">Date of Joining</Label>
                            <Input id="doj" type="date" {...register("doj", { required: true })} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Employee"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
