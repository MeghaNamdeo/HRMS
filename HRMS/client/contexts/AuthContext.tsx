import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { authService } from "../services/authService";

export type UserRole =
  | "employee"
  | "hr_admin"
  | "finance_admin"
  | "manager"
  | "super_admin";

// ... (User interface remains same)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // User persistence handled by Firebase listener or local storage for mock
  useEffect(() => {
    // 1. Check LocalStorage (Fast load)
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setAccessToken(storedToken);
    }

    // 2. Subscribe to Firebase Auth (if not mock)
    // The authService.onAuthStateChanged returns an unsubscribe function
    const unsubscribe = authService.onAuthStateChanged((u) => {
      // Logic for Firebase auth... 
      // Note: If using mock, this might overwrite local storage if not careful, 
      // but assuming onAuthStateChanged handles it or isn't firing immediately with null to wipe it out.
      // For now, let's prioritize the local restoration for the mock flow.
      if (u) {
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
        setAccessToken("firebase-token-placeholder");
      }
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = await authService.login(email, password);

      setUser(userData);
      setAccessToken("mock-token"); // or real token if we fetched it
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", "mock-token");

    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setAccessToken(null);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = async () => {
    // Handled by onAuthStateChanged mostly, but can force refresh here
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        logout,
        getCurrentUser,
        error,
        accessToken,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
