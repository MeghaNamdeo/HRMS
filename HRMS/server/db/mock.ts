import crypto from "crypto";

export interface MockUser {
    id: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    roles: string[];
    department?: string;
    status: "active" | "inactive";
    joined_at: string;
    permissions?: string[];
}

// Initial seed data
export const mockUsers: Record<string, MockUser> = {
    "john.doe@company.com": {
        id: "user-001",
        email: "john.doe@company.com",
        password_hash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", // "demo"
        first_name: "John",
        last_name: "Doe",
        roles: ["employee"],
        department: "Engineering",
        status: "active",
        joined_at: "2024-01-15T00:00:00Z",
        permissions: [],
    },
    "hr.admin@company.com": {
        id: "user-002",
        email: "hr.admin@company.com",
        password_hash: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3", // "demo"
        first_name: "Human",
        last_name: "Resources",
        roles: ["hr_admin"],
        department: "HR",
        status: "active",
        joined_at: "2023-11-01T00:00:00Z",
        permissions: [],
    },
};

// Helper methods
export const db = {
    users: {
        findAll: () => Object.values(mockUsers),
        findByEmail: (email: string) => mockUsers[email],
        findById: (id: string) => Object.values(mockUsers).find((u) => u.id === id),
        create: (user: Omit<MockUser, "id" | "joined_at" | "password_hash"> & { password?: string }) => {
            const id = `user-${Date.now()}`;
            const password_hash = user.password
                ? crypto.createHash("sha256").update(user.password + "salt").digest("hex")
                : "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"; // Default "demo"

            const newUser: MockUser = {
                ...user,
                id,
                password_hash,
                joined_at: new Date().toISOString(),
                status: user.status || "active",
            };

            mockUsers[newUser.email] = newUser;
            return newUser;
        },
        update: (id: string, updates: Partial<MockUser>) => {
            const userIndex = Object.values(mockUsers).findIndex((u) => u.id === id);
            if (userIndex === -1) return null;

            const user = Object.values(mockUsers)[userIndex];
            const updatedUser = { ...user, ...updates };
            mockUsers[updatedUser.email] = updatedUser;

            // If email changed, remove old key (simplified)
            if (updates.email && updates.email !== user.email) {
                delete mockUsers[user.email];
            }

            return updatedUser;
        },
        delete: (id: string) => {
            const user = Object.values(mockUsers).find(u => u.id === id);
            if (user) {
                delete mockUsers[user.email];
                return true;
            }
            return false;
        }
    },
    jobs: {
        findAll: () => Object.values(mockJobs),
        findById: (id: string) => Object.values(mockJobs).find((j) => j.id === id),
        create: (job: Omit<MockJob, "id" | "posted_at" | "status">) => {
            const id = `job-${Date.now()}`;
            const newJob: MockJob = {
                ...job,
                id,
                posted_at: new Date().toISOString(),
                status: "open",
            };
            mockJobs[id] = newJob;
            return newJob;
        },
        update: (id: string, updates: Partial<MockJob>) => {
            const job = mockJobs[id];
            if (!job) return null;
            const updatedJob = { ...job, ...updates };
            mockJobs[id] = updatedJob;
            return updatedJob;
        },
    },
    applications: {
        findAll: () => Object.values(mockApplications),
        findByJobId: (jobId: string) => Object.values(mockApplications).filter(a => a.job_id === jobId),
        create: (app: Omit<MockApplication, "id" | "applied_at" | "status" | "match_score">) => {
            const id = `app-${Date.now()}`;
            // Simple keyword matching for "ATS score"
            const job = mockJobs[app.job_id];
            let match_score = 0;
            if (job && app.resume_text) {
                const text = app.resume_text.toLowerCase();
                const keywords = [...job.requirements, ...job.description.split(" ")];
                let matches = 0;
                keywords.forEach(k => {
                    if (text.includes(k.toLowerCase())) matches++;
                });
                // Arbitrary scoring: cap at 100, simplistic
                match_score = Math.min(100, Math.round((matches / Math.max(1, job.requirements.length)) * 100));
            }

            const newApp: MockApplication = {
                ...app,
                id,
                applied_at: new Date().toISOString(),
                status: "applied",
                match_score
            };
            mockApplications[id] = newApp;
            return newApp;
        },
        updateStatus: (id: string, status: MockApplication["status"]) => {
            const app = mockApplications[id];
            if (!app) return null;
            app.status = status;
            return app;
        }
    }
};

export interface MockJob {
    id: string;
    title: string;
    department: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract" | "Internship";
    description: string;
    requirements: string[];
    salary_range?: string;
    posted_at: string;
    status: "open" | "closed";
}

export interface MockApplication {
    id: string;
    job_id: string;
    candidate_name: string;
    email: string;
    phone: string;
    resume_text?: string; // For parsing
    resume_url?: string; // For file download (mocked)
    status: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";
    applied_at: string;
    match_score: number;
}

export const mockJobs: Record<string, MockJob> = {
    "job-001": {
        id: "job-001",
        title: "Senior Frontend Engineer",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        description: "We are looking for an experienced Frontend Engineer to build world-class user interfaces.",
        requirements: ["React", "TypeScript", "Tailwind CSS", "Voice Interfaces"],
        salary_range: "$120k - $160k",
        posted_at: "2024-03-01T10:00:00Z",
        status: "open"
    },
    "job-002": {
        id: "job-002",
        title: "Product Designer",
        department: "Design",
        location: "New York, NY",
        type: "Full-time",
        description: "Design beautiful and intuitive expereinces for our HRMS platform.",
        requirements: ["Figma", "UI/UX", "Prototyping"],
        salary_range: "$100k - $140k",
        posted_at: "2024-03-05T14:30:00Z",
        status: "open"
    }
};

export const mockApplications: Record<string, MockApplication> = {
    "app-001": {
        id: "app-001",
        job_id: "job-001",
        candidate_name: "Alice Smith",
        email: "alice@example.com",
        phone: "+1 555-0123",
        resume_text: "Experienced Frontend Developer with strong skills in React, TypeScript, and Tailwind CSS. Built multiple voice interface projects.",
        status: "interview",
        applied_at: "2024-03-10T09:15:00Z",
        match_score: 95
    },
    "app-002": {
        id: "app-002",
        job_id: "job-001",
        candidate_name: "Bob Jones",
        email: "bob@example.com",
        phone: "+1 555-0456",
        resume_text: "Junior Web Developer familiar with HTML, CSS, and some JavaScript.",
        status: "rejected",
        applied_at: "2024-03-12T11:20:00Z",
        match_score: 30
    },
    "app-003": {
        id: "app-003",
        job_id: "job-002",
        candidate_name: "Charlie Brown",
        email: "charlie@example.com",
        phone: "+1 555-0789",
        resume_text: "Senior Product Designer with 5 years experience in SaaS.",
        status: "screening",
        applied_at: "2024-03-14T10:00:00Z",
        match_score: 85
    },
    "app-004": {
        id: "app-004",
        job_id: "job-001",
        candidate_name: "Diana Prince",
        email: "diana@example.com",
        phone: "+1 555-0001",
        resume_text: "Full Stack Engineer with React and Node.js expertise.",
        status: "offer",
        applied_at: "2024-03-15T14:20:00Z",
        match_score: 95
    },
    "app-005": {
        id: "app-005",
        job_id: "job-002",
        candidate_name: "Evan Wright",
        email: "evan@example.com",
        phone: "+1 555-0002",
        resume_text: "UX Researcher looking for new opportunities.",
        status: "hired",
        applied_at: "2024-02-20T09:00:00Z",
        match_score: 75
    }
};

export interface MockPayslip {
    id: string;
    employee_id: string;
    month: string; // e.g., "October 2024"
    net_salary: number;
    status: "Paid" | "Pending" | "Processing";
    generated_at: string;
}

export const mockPayslips: Record<string, MockPayslip> = {
    "slip-001": {
        id: "slip-001",
        employee_id: "user-001",
        month: "November 2024",
        net_salary: 4500,
        status: "Paid",
        generated_at: "2024-11-30T10:00:00Z"
    },
    "slip-002": {
        id: "slip-002",
        employee_id: "user-001",
        month: "December 2024",
        net_salary: 4500,
        status: "Paid",
        generated_at: "2024-12-31T10:00:00Z"
    }
};

// Update db object to include payroll
Object.assign(db, {
    payroll: {
        findAll: () => Object.values(mockPayslips),
        create: (slip: Omit<MockPayslip, "id" | "generated_at" | "status">) => {
            const id = `slip-${Date.now()}`;
            const newSlip: MockPayslip = {
                ...slip,
                id,
                status: "Paid", // Auto-pay for demo
                generated_at: new Date().toISOString()
            };
            // ... (existing payroll code)
            mockPayslips[id] = newSlip;
            return newSlip;
        }
    },
    leaves: {
        findAll: () => Object.values(mockLeaves),
        findByEmployeeId: (empId: string) => Object.values(mockLeaves).filter(l => l.employee_id === empId),
        create: (leave: Omit<MockLeave, "id" | "status">) => {
            const id = `leave-${Date.now()}`;
            const newLeave: MockLeave = {
                ...leave,
                id,
                status: "pending"
            };
            mockLeaves[id] = newLeave;
            return newLeave;
        },
        updateStatus: (id: string, status: MockLeave["status"]) => {
            const leave = mockLeaves[id];
            if (!leave) return null;
            leave.status = status;
            return leave;
        }
    }
});

export interface MockLeave {
    id: string;
    employee_id: string;
    type: "Sick Leave" | "Casual Leave" | "Earned Leave";
    start_date: string;
    end_date: string;
    reason: string;
    status: "pending" | "approved" | "rejected";
}

export const mockLeaves: Record<string, MockLeave> = {
    "leave-001": {
        id: "leave-001",
        employee_id: "user-001",
        type: "Sick Leave",
        start_date: "2024-03-01",
        end_date: "2024-03-02",
        reason: "Flu",
        status: "approved"
    }
};
