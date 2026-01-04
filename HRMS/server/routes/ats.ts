import { Router, Request, Response } from "express";
import { db } from "../db/mock";
import { authMiddleware, requireRole } from "../middleware/auth";

const router = Router();

// --- Public Endpoints ---

/**
 * GET /api/ats/jobs
 * Get all open jobs
 */
router.get("/jobs", (req: Request, res: Response) => {
    try {
        const jobs = db.jobs.findAll().filter(j => j.status === "open");
        res.json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch jobs" });
    }
});

/**
 * GET /api/ats/jobs/:id
 * Get job details
 */
router.get("/jobs/:id", (req: Request, res: Response) => {
    try {
        const job = db.jobs.findById(req.params.id);
        if (!job) {
            res.status(404).json({ success: false, error: "Job not found" });
            return;
        }
        res.json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch job" });
    }
});

/**
 * POST /api/ats/apply
 * Apply for a job
 */
router.post("/apply", (req: Request, res: Response) => {
    try {
        const { job_id, candidate_name, email, phone, resume_text, resume_url } = req.body;

        if (!job_id || !candidate_name || !email) {
            res.status(400).json({ success: false, error: "Missing required fields" });
            return;
        }

        const application = db.applications.create({
            job_id,
            candidate_name,
            email,
            phone,
            resume_text,
            resume_url
        });

        res.json({ success: true, data: application });
    } catch (error) {
        console.error("Application error:", error);
        res.status(500).json({ success: false, error: "Failed to submit application" });
    }
});

// --- Admin Endpoints (Protected) ---

/**
 * POST /api/ats/jobs
 * Create a new job
 */
router.post("/jobs", authMiddleware, requireRole(["hr_admin", "super_admin"]), (req: Request, res: Response) => {
    try {
        const { title, department, location, type, description, requirements, salary_range } = req.body;

        // Basic validation
        if (!title || !description) {
            res.status(400).json({ success: false, error: "Title and description are required" });
            return;
        }

        const job = db.jobs.create({
            title,
            department: department || "General",
            location: location || "Remote",
            type: type || "Full-time",
            description,
            requirements: requirements || [],
            salary_range
        });

        res.json({ success: true, data: job });
    } catch (error) {
        console.error("Create job error:", error);
        res.status(500).json({ success: false, error: "Failed to create job" });
    }
});

/**
 * GET /api/ats/applications
 * Get all applications (Admin only)
 */
router.get("/applications", authMiddleware, requireRole(["hr_admin", "super_admin"]), (req: Request, res: Response) => {
    try {
        const applications = db.applications.findAll();
        // Enhance with job details for easier display
        const enhancedApps = applications.map(app => ({
            ...app,
            job: db.jobs.findById(app.job_id)
        }));

        res.json({ success: true, data: enhancedApps });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch applications" });
    }
});

/**
 * PATCH /api/ats/applications/:id/status
 * Update application status
 */
router.patch("/applications/:id/status", authMiddleware, requireRole(["hr_admin", "super_admin"]), (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        if (!status) {
            res.status(400).json({ success: false, error: "Status is required" });
            return;
        }

        const updated = db.applications.updateStatus(req.params.id, status);
        if (!updated) {
            res.status(404).json({ success: false, error: "Application not found" });
            return;
        }

        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to update status" });
    }
});

export default router;
