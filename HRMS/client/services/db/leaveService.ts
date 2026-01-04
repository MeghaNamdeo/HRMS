
import { db } from "@/lib/firebase";
import {
    collection, addDoc, getDocs, query, where
} from "firebase/firestore";

export interface Leave {
    id: string;
    employeeId: string;
    type: "Sick Leave" | "Casual Leave" | "Earned Leave";
    startDate: string;
    endDate: string;
    reason: string;
    status: "pending" | "approved" | "rejected";
}

// Mock Data
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DB === 'true' || true;

const mockLeaves: Leave[] = [
    {
        id: "l1", employeeId: "1", type: "Sick Leave", startDate: "2024-03-01", endDate: "2024-03-02",
        reason: "Flu", status: "approved"
    }
];

export const leaveService = {
    getMyLeaves: async (employeeId: string): Promise<Leave[]> => {
        const token = localStorage.getItem("token");
        try {
            // Note: In a real app, the token determines the user, so empId param might be redundant 
            // unless admins are viewing others. The API currently returns leaves for the authenticated user.
            const res = await fetch("/api/leaves", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch leaves");
            const data = await res.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    apply: async (data: Omit<Leave, "id" | "status">): Promise<void> => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/leaves", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error("Failed to apply");
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
