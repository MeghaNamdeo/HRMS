
import { db } from "@/lib/firebase";
import {
    collection, addDoc, getDocs, query, where, Timestamp
} from "firebase/firestore";

export interface Payslip {
    id: string;
    employeeId: string;
    employeeName: string;
    month: string; // "March 2024"
    basic: number;
    hra: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    status: "generated" | "paid";
    generatedAt: string;
}

// Mock Data
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DB === 'true' || true;

const mockPayslips: Payslip[] = [
    {
        id: "p1", employeeId: "1", employeeName: "John Doe", month: "February 2024",
        basic: 5000, hra: 2000, allowances: 1000, deductions: 500, netSalary: 7500,
        status: "paid", generatedAt: "2024-02-28"
    }
];

export const payrollService = {
    getHistory: async (): Promise<Payslip[]> => {
        // Real Backend API
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/payroll/history", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to fetch history");
            const data = await res.json();
            if (data.success) {
                // Map API response to Payslip interface
                // API returns: { id, employee_id, month, net_salary, status, generated_at, employeeName, employeeEmail }
                // Frontend expects: { id, employeeId, employeeName, month, basic, hra, allowances, deductions, netSalary, status, generatedAt }
                return data.data.map((item: any) => ({
                    id: item.id,
                    employeeId: item.employee_id,
                    employeeName: item.employeeName,
                    month: item.month,
                    basic: item.net_salary * 0.7, // approximation for display
                    hra: item.net_salary * 0.2,
                    allowances: item.net_salary * 0.1,
                    deductions: 0,
                    netSalary: item.net_salary,
                    status: item.status.toLowerCase(),
                    generatedAt: item.generated_at.split('T')[0]
                }));
            }
            return [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    generate: async (employeeId: string, employeeName: string, basic: number): Promise<void> => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/payroll/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    employeeId,
                    amount: basic // using basic as net for simplicity or send breakdown
                })
            });
            if (!res.ok) throw new Error("Failed to generate payroll");
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
