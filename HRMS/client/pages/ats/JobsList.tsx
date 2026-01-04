import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, DollarSign, Clock, Search, Briefcase, Filter, ArrowRight } from "lucide-react";

interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
    salary_range?: string;
    posted_at: string;
}

export default function JobsList() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/ats/jobs")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setJobs(data.data);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.department.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-muted/40 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="bg-background border-b border-border/50">
                <div className="container mx-auto px-4 py-16 md:py-24 text-center max-w-4xl">
                    <Badge variant="secondary" className="mb-4 px-3 py-1 bg-primary/10 text-primary border-none text-sm font-medium">
                        Cards Open
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
                        Build the Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">HRMSuite</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join our world-class team and help us reimagine how organizations manage their most valuable asset – their people.
                    </p>

                    <div className="relative max-w-lg mx-auto">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Search capability, department, or role..."
                            className="pl-11 h-12 rounded-full shadow-sm border-muted-foreground/20 focus-visible:ring-primary"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center">
                            <Button size="sm" className="rounded-full h-8 px-4">Find Jobs</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="container mx-auto py-12 px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">Open Positions <span className="text-muted-foreground text-lg font-normal ml-2">({filteredJobs.length})</span></h2>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" /> Filters
                    </Button>
                </div>

                {loading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="h-64 animate-pulse bg-muted/20" />
                        ))}
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
                        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">No positions found</h3>
                        <p className="text-muted-foreground">Try adjusting your search terms.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.map((job) => (
                            <Card key={job.id} className="group flex flex-col border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300 bg-card">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-medium">
                                            {job.department}
                                        </Badge>
                                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                            {new Date(job.posted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{job.title}</CardTitle>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                        <MapPin className="mr-1 h-3.5 w-3.5" /> {job.location}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 pb-4">
                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                        {job.description}
                                    </p>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                                            <Clock className="mr-1 h-3 w-3" /> {job.type}
                                        </div>
                                        {job.salary_range && (
                                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                                                <DollarSign className="mr-1 h-3 w-3" /> {job.salary_range}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-sm" variant="secondary">
                                        <Link to={`/jobs/${job.id}`} className="flex items-center justify-center">
                                            View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
