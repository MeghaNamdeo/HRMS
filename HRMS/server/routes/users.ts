import { Router, Request, Response } from "express";
import { db, MockUser } from "../db/mock";
import { authMiddleware, requireRole } from "../middleware/auth";

const router = Router();

// Helper to map MockUser to Employee
const mapUserToEmployee = (user: MockUser) => ({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.roles[0].toUpperCase().startsWith("ROLE_") ? user.roles[0] : `ROLE_${user.roles[0].toUpperCase()}`,
    designation: "Employee", // Default mock designation
    department: user.department || "General",
    status: user.status,
    doj: user.joined_at.split("T")[0],
    phone: "+1 555-0000" // Default mock phone
});

/**
 * GET /api/users
 * Get all users (Admin only)
 */
router.get("/", authMiddleware, requireRole(["hr_admin", "super_admin", "finance_admin"]), (req: Request, res: Response) => {
    try {
        const users = db.users.findAll();
        const employees = users.map(mapUserToEmployee);
        res.json({ success: true, data: employees });
    } catch (error) {
        console.error("Fetch users error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch users" });
    }
});

/**
 * GET /api/users/:id
 * Get single user
 */
router.get("/:id", authMiddleware, requireRole(["hr_admin", "super_admin", "finance_admin", "employee"]), (req: Request, res: Response) => {
    try {
        const user = db.users.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, error: "User not found" });
            return;
        }
        res.json({ success: true, data: mapUserToEmployee(user) });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch user" });
    }
});

export default router;
