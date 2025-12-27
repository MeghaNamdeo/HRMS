import React, { createContext, useState, useContext, ReactNode } from "react";

export type UserRole =
  | "employee"
  | "hr_admin"
  | "finance_admin"
  | "manager"
  | "super_admin";

export interface User {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  department?: string;
  employeeId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, selectedRole?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  currentRole: UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);

  const login = (email: string, password: string, selectedRole?: UserRole) => {
    // Mock login - in production, this would validate against backend
    const mockUser: User = {
      id: "user-123",
      email,
      name: email.split("@")[0],
      roles: selectedRole ? [selectedRole] : ["employee"],
      department: "Engineering",
      employeeId: "EMP-001",
    };

    setUser(mockUser);
    if (selectedRole) {
      setCurrentRole(selectedRole);
    } else {
      setCurrentRole(mockUser.roles[0]);
    }

    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("currentRole", selectedRole || mockUser.roles[0]);
  };

  const logout = () => {
    setUser(null);
    setCurrentRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("currentRole");
  };

  const switchRole = (role: UserRole) => {
    if (user?.roles.includes(role)) {
      setCurrentRole(role);
      localStorage.setItem("currentRole", role);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        currentRole,
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
