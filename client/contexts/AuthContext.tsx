import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

export type UserRole =
  | "ROLE_EMPLOYEE"
  | "ROLE_HR_ADMIN"
  | "ROLE_FINANCE_ADMIN"
  | "ROLE_MANAGER"
  | "ROLE_SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = typeof window !== "undefined" ? window.location.origin : "";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setAccessToken(storedToken);
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Login failed");
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = data.data;

      // Store tokens and user
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Login failed";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      if (refreshToken && accessToken) {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  };

  const getCurrentUser = async () => {
    if (!accessToken) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Token might be expired
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        throw new Error("Session expired");
      }

      setUser(data.data.user);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    } catch (err) {
      console.error("Get current user error:", err);
    } finally {
      setIsLoading(false);
    }
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
