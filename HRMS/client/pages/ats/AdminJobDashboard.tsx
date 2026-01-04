import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, Eye, Filter, Briefcase, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    status: string;
    posted_at: string;
}

export default function AdminJobDashboard() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const fetchJobs = () => {
        setLoading(true);
        fetch("http://localhost:5000/api/ats/jobs")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setJobs(data.data);
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            department: formData.get("department"),
            location: formData.get("location"),
            type: formData.get("type"),
            description: formData.get("description"),
            requirements: (formData.get("requirements") as string).split("\n").filter(Boolean),
            salary_range: formData.get("salary_range")
        };

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/ats/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            const result = await res.json();

            if (result.success) {
                toast({
                    title: "Job Created",
                    description: "The job posting is now live.",
                });
                setOpen(false);
                fetchJobs();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create job. Make sure you are logged in as Admin.",
            });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Recruitment Portal</h2>
                    <p className="text-muted-foreground">Manage job postings and candidate pipelines.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
                                <Plus className="mr-2 h-4 w-4" /> Post New Job
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <form onSubmit={handleCreateJob}>
                                <DialogHeader>
                                    <DialogTitle>Create New Job Position</DialogTitle>
                                    <DialogDescription>Add accurate details to attract the best talent.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Job Title</Label>
                                            <Input id="title" name="title" required placeholder="e.g. Senior Developer" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <Input id="department" name="department" required placeholder="e.g. Engineering" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <Input id="location" name="location" placeholder="e.g. Remote / New York" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="type">Type</Label>
                                            <Input id="type" name="type" placeholder="e.g. Full-time" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="salary_range">Salary Range</Label>
                                        <Input id="salary_range" name="salary_range" placeholder="e.g. $100k - $120k" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" name="description" required placeholder="Detailed job description..." className="h-32" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="requirements">Requirements (One per line)</Label>
                                        <Textarea id="requirements" name="requirements" placeholder="- 3+ years experience&#10;- React knowledge" className="h-24" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Post Job</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-primary" />
                                Active Listings
                            </CardTitle>
                            <CardDescription>View and manage all current job openings.</CardDescription>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Search jobs..." className="pl-9 w-[250px] bg-background border-border" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/10">
                                <TableHead className="pl-6 h-12">Job Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Posted On</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">Loading postings...</TableCell>
                                </TableRow>
                            ) : jobs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        No job postings found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                jobs.map((job) => (
                                    <TableRow key={job.id} className="hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0 group">
                                        <TableCell className="pl-6 font-medium text-foreground py-4">
                                            {job.title}
                                            <div className="block md:hidden text-xs text-muted-foreground mt-1">{job.department}</div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-normal">
                                                {job.department}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground flex items-center gap-2 py-4">
                                            <MapPin className="h-3.5 w-3.5" /> {job.location}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground font-mono text-xs">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5 opacity-70" />
                                                {new Date(job.posted_at).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={job.status === "open" ? "default" : "secondary"} className={job.status === "open" ? "bg-green-100 text-green-700 hover:bg-green-200 border-none" : ""}>
                                                {job.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button variant="ghost" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/jobs/${job.id}`} target="_blank">
                                                    View Live <Eye className="ml-2 h-3.5 w-3.5" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
