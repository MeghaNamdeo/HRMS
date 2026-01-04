export interface OrgContext {
  orgId: string;
  userId: string;
  roles: string[];
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  HR_ADMIN = 'HR_ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: UserRole;
  orgId: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    orgId: string;
  };
}

