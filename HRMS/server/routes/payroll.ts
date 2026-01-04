import { Router, Request, Response } from "express";
import { db, MockPayslip } from "../db/mock";
import { authMiddleware, requireRole } from "../middleware/auth";

const router = Router();

// Helper to join employee details
const enhancePayslip = (slip: MockPayslip) => {
    const employee = db.users.findById(slip.employee_id);
    return {
        ...slip,
        employeeName: employee ? `${employee.first_name} ${employee.last_name}` : "Unknown Employee",
        employeeEmail: employee?.email
    };
};

/**
 * GET /api/payroll/history
 * Get all payroll history
 */
router.get("/history", authMiddleware, requireRole(["finance_admin", "super_admin"]), (req: Request, res: Response) => {
    try {
        const payslips = (db as any).payroll.findAll();
        const enhanced = payslips.map(enhancePayslip);
        res.json({ success: true, data: enhanced });
    } catch (error) {
        console.error("Fetch payroll error:", error);
        res.status(500).json({ success: false, error: "Failed to fetch payroll history" });
    }
});

/**
 * POST /api/payroll/generate
 * Generate a payslip for an employee
 */
router.post("/generate", authMiddleware, requireRole(["finance_admin", "super_admin"]), (req: Request, res: Response) => {
    try {
        const { employeeId, amount, month } = req.body;

        if (!employeeId || !amount) {
            res.status(400).json({ success: false, error: "Employee ID and Amount are required" });
            return;
        }

        const employee = db.users.findById(employeeId);
        if (!employee) {
            res.status(404).json({ success: false, error: "Employee not found" });
            return;
        }

        const currentMonth = month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

        const newSlip = (db as any).payroll.create({
            employee_id: employeeId,
            month: currentMonth,
            net_salary: Number(amount)
        });

        res.json({ success: true, data: enhancePayslip(newSlip) });

    } catch (error) {
        console.error("Generate payroll error:", error);
        res.status(500).json({ success: false, error: "Failed to generate payroll" });
    }
});

export default router;
