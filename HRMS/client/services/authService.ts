
import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { User, UserRole } from "../contexts/AuthContext";

// Toggle this to force mock mode if keys are missing
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true' || true; 
// ^ Setting to true by default for now to prevent crash until user provides keys.

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    if (USE_MOCK) {
      // Mock Login Logic
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (password === "demo" || password.length > 3) {
             const role = determineMockRole(email);
             resolve({
                id: "mock-user-id",
                email,
                name: email.split("@")[0],
                roles: [role]
             });
          } else {
            reject(new Error("Invalid credentials (try password 'demo')"));
          }
        }, 800);
      });
    }

    // Real Firebase Login
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      
      // Fetch role from Firestore
      const userDoc = await getDoc(doc(db, "users", fbUser.uid));
      let role: UserRole = "ROLE_EMPLOYEE";
      let name = fbUser.displayName || email.split("@")[0];

      if (userDoc.exists()) {
        const data = userDoc.data();
        role = data.role || "ROLE_EMPLOYEE";
        name = data.name || name;
      }

      return {
        id: fbUser.uid,
        email: fbUser.email!,
        name,
        roles: [role]
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  logout: async () => {
    if (USE_MOCK) return;
    await signOut(auth);
  },

  // Helper to sync Firebase state
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    if (USE_MOCK) return () => {}; // No-op for mock

    return onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        callback(null);
        return;
      }
      // Fetch extra details
      try {
        const userDoc = await getDoc(doc(db, "users", fbUser.uid));
        let role: UserRole = "ROLE_EMPLOYEE";
        let name = fbUser.displayName || fbUser.email!.split("@")[0];

        if (userDoc.exists()) {
            const data = userDoc.data();
            role = data.role || "ROLE_EMPLOYEE";
            name = data.name || name;
        }

        callback({
            id: fbUser.uid,
            email: fbUser.email!,
            name,
            roles: [role]
        });
      } catch (e) {
        console.error("Error fetching user profile", e);
        // Fallback
        callback({
            id: fbUser.uid,
            email: fbUser.email!,
            name: fbUser.displayName || fbUser.email!.split("@")[0],
            roles: ["ROLE_EMPLOYEE"]
        });
      }
    });
  }
};

function determineMockRole(email: string): UserRole {
    if (email.includes("super")) return "ROLE_SUPER_ADMIN";
    if (email.includes("hr")) return "ROLE_HR_ADMIN";
    if (email.includes("finance")) return "ROLE_FINANCE_ADMIN";
    if (email.includes("manager")) return "ROLE_MANAGER";
    return "ROLE_EMPLOYEE";
}
