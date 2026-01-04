import { Router, Request, Response } from "express";
import { db, MockLeave } from "../db/mock";
import { authMiddleware, requireRole } from "../middleware/auth";

const router = Router();

// Helper to map DB snake_case to Frontend camelCase
const mapLeaveToFrontend = (leave: MockLeave) => ({
    id: leave.id,
    employeeId: leave.employee_id,
    type: leave.type,
    startDate: leave.start_date,
    endDate: leave.end_date,
    reason: leave.reason,
    status: leave.status
});

/**
 * GET /api/leaves
 * Get leaves for current user
 */
router.get("/", authMiddleware, (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });

        // If admin, maybe show all? For now, let's stick to "My Leaves" context or filter by query
        // Re-using same endpoint for simplicity: if ?employeeId is present and user is admin, search.
        // Otherwise return own leaves.

        const leaves = (db as any).leaves.findByEmployeeId(req.user.userId);
        res.json({ success: true, data: leaves.map(mapLeaveToFrontend) });
    } catch (error) {
        console.error("Fetch leaves error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch leaves" });
    }
});

/**
 * POST /api/leaves
 * Apply for leave
 */
router.post("/", authMiddleware, (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });

        const { type, startDate, endDate, reason } = req.body;

        if (!type || !startDate || !endDate || !reason) {
            res.status(400).json({ success: false, error: "Missing required fields" });
            return;
        }

        const newLeave = (db as any).leaves.create({
            employee_id: req.user.userId,
            type,
            start_date: startDate,
            end_date: endDate,
            reason
        });

        res.json({ success: true, data: mapLeaveToFrontend(newLeave) });

    } catch (error) {
        console.error("Apply leave error:", error);
        res.status(500).json({ success: false, error: "Failed to apply for leave" });
    }
});

export default router;
