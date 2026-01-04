
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast"; // Assuming useToast exists based on Toaster import in App.tsx
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    requirements: string[];
    salary_range?: string;
    posted_at: string;
}

export default function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const { toast } = useToast();

    useEffect(() => {
        fetch(`http://localhost:5000/api/ats/jobs/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setJob(data.data);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmissionStatus("submitting");
        const formData = new FormData(e.currentTarget);
        const data = {
            job_id: id,
            candidate_name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            resume_text: formData.get("resume_text"),
            // resume_url is skipped for now
        };

        try {
            const res = await fetch("http://localhost:5000/api/ats/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (result.success) {
                setSubmissionStatus("success");
                toast({
                    title: "Application Submitted!",
                    description: "We have received your application. Good luck!",
                });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            setSubmissionStatus("error");
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: "Please try again later.",
            });
        }
    };

    if (loading) return <div className="p-8 text-center">Loading job details...</div>;
    if (!job) return <div className="p-8 text-center">Job not found.</div>;

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <Button variant="ghost" asChild className="mb-6">
                <Link to="/jobs"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs</Link>
            </Button>

            <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">{job.title}</h1>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="secondary">{job.department}</Badge>
                            <Badge variant="outline">{job.location}</Badge>
                            <Badge variant="outline">{job.type}</Badge>
                        </div>
                    </div>

                    <section>
                        <h3 className="text-xl font-semibold mb-3">About the Role</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {job.description}
                        </p>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            {job.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ready to Apply?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full" size="lg">Apply Now</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    {submissionStatus === "success" ? (
                                        <div className="text-center py-8">
                                            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                            <h3 className="text-2xl font-bold mb-2">Application Sent!</h3>
                                            <p className="text-muted-foreground">
                                                Thank you for applying to the {job.title} position.
                                                We will review your resume and get back to you soon.
                                            </p>
                                            <Button className="mt-6" onClick={() => {
                                                setOpen(false);
                                                setSubmissionStatus("idle");
                                            }}>Close</Button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit}>
                                            <DialogHeader>
                                                <DialogTitle>Apply for {job.title}</DialogTitle>
                                                <DialogDescription>
                                                    Fill out the form below to submit your application.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input id="name" name="name" required placeholder="John Doe" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="phone">Phone</Label>
                                                    <Input id="phone" name="phone" required placeholder="+1 234 567 890" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="resume_text">Resume (Text Paste)</Label>
                                                    <Textarea
                                                        id="resume_text"
                                                        name="resume_text"
                                                        required
                                                        placeholder="Paste your resume content here..."
                                                        className="h-40"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        We currently only accept text-based resume submission for parsing.
                                                    </p>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" disabled={submissionStatus === "submitting"}>
                                                    {submissionStatus === "submitting" ? "Submitting..." : "Submit Application"}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
