
import { db } from "@/lib/firebase";
import {
    collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, Timestamp
} from "firebase/firestore";

export interface Employee {
    id: string;
    uid?: string; // Link to auth user
    firstName: string;
    lastName: string;
    email: string;
    role: "ROLE_EMPLOYEE" | "ROLE_HR_ADMIN" | "ROLE_FINANCE_ADMIN" | "ROLE_SUPER_ADMIN" | "ROLE_MANAGER";
    designation: string;
    department: string;
    status: "active" | "resigned" | "terminated" | "pending";
    doj: string;
    phone?: string;
    photoURL?: string;
}

// Toggle this based on config
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DB === 'true' || true;

const mockEmployees: Employee[] = [
    { id: "1", firstName: "John", lastName: "Doe", email: "john@company.com", role: "ROLE_EMPLOYEE", designation: "Software Engineer", department: "Engineering", status: "active", doj: "2023-01-15" },
    { id: "2", firstName: "Jane", lastName: "Smith", email: "hr.admin@company.com", role: "ROLE_HR_ADMIN", designation: "HR Manager", department: "Human Resources", status: "active", doj: "2022-05-10" },
    { id: "3", firstName: "Bob", lastName: "Wilson", email: "finance@company.com", role: "ROLE_FINANCE_ADMIN", designation: "Accountant", department: "Finance", status: "active", doj: "2021-11-20" },
];

export const employeeService = {
    getAll: async (): Promise<Employee[]> => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/users", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    getById: async (id: string): Promise<Employee | null> => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`/api/users/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) return null;
            const data = await res.json();
            return data.success ? data.data : null;
        } catch (error) {
            return null;
        }
    },

    create: async (employee: Omit<Employee, "id">): Promise<string> => {
        if (USE_MOCK) {
            const newEmployee = { ...employee, id: Math.random().toString(36).substr(2, 9) };
            mockEmployees.push(newEmployee);
            return newEmployee.id;
        }

        // In real app, we likely use Cloud Function to create Auth user AND Firestore doc
        const docRef = await addDoc(collection(db, "users"), {
            ...employee,
            createdAt: Timestamp.now()
        });
        return docRef.id;
    },

    update: async (id: string, data: Partial<Employee>): Promise<void> => {
        if (USE_MOCK) {
            const index = mockEmployees.findIndex(e => e.id === id);
            if (index !== -1) {
                mockEmployees[index] = { ...mockEmployees[index], ...data };
            }
            return;
        }
        const docRef = doc(db, "users", id);
        await updateDoc(docRef, data);
    }
};
