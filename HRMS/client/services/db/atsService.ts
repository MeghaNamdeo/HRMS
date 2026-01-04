import { Application } from "@/types/ats"; // We might need to define this type shared or locally
// For now, defining local interface matching screen requirements

export interface Application {
    id: string;
    candidate_name: string;
    email: string;
    phone: string;
    match_score: number;
    status: string;
    job_id: string;
    job?: {
        title: string;
    };
    resume_text?: string;
}

export const atsService = {
    getAllApplications: async (): Promise<Application[]> => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("/api/ats/applications", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch applications");
            const data = await res.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    updateStatus: async (id: string, status: string): Promise<boolean> => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`/api/ats/applications/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            return res.ok;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
};
