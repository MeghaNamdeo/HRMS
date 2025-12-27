# HRMS Authentication & Authorization System

## Overview

This document describes the complete authentication and authorization system for the Enterprise HRMS platform. The system uses JWT (JSON Web Tokens) for stateless authentication with role-based access control (RBAC).

## Architecture

### Components

1. **JWT Token Management** (`server/utils/jwt.ts`)
   - Token generation and validation
   - Refresh token management
   - Signature verification

2. **Authentication Middleware** (`server/middleware/auth.ts`)
   - JWT verification
   - Role-based access control
   - Permission validation

3. **API Endpoints** (`server/routes/auth.ts`)
   - POST /auth/login
   - POST /auth/refresh
   - GET /auth/me
   - POST /auth/logout

4. **Database Schema** (`server/db/schema.sql`)
   - Users table
   - Roles table
   - Permissions table
   - User-Role mapping
   - Refresh tokens storage

## JWT Payload Structure

```typescript
interface JWTPayload {
  userId: string;           // Unique user identifier
  email: string;            // User email address
  name: string;             // User full name
  roles: string[];          // Array of role IDs (e.g., ROLE_EMPLOYEE, ROLE_HR_ADMIN)
  permissions: string[];    // Array of permission IDs
  iat: number;              // Issued at timestamp
  exp: number;              // Expiration timestamp (15 minutes from issue)
}
```

### Example JWT Payload

```json
{
  "userId": "user-001",
  "email": "john.doe@company.com",
  "name": "John Doe",
  "roles": ["ROLE_EMPLOYEE"],
  "permissions": [
    "PERM_EMPLOYEE_VIEW_PROFILE",
    "PERM_EMPLOYEE_EDIT_PROFILE",
    "PERM_EMPLOYEE_VIEW_ATTENDANCE",
    "PERM_EMPLOYEE_REQUEST_LEAVE",
    "PERM_EMPLOYEE_VIEW_PAYSLIP",
    "PERM_EMPLOYEE_DASHBOARD"
  ],
  "iat": 1702500000,
  "exp": 1702500900
}
```

## Token Types

### Access Token
- **Algorithm**: HS256
- **Expiration**: 15 minutes
- **Usage**: Authentication for API requests
- **Header**: `Authorization: Bearer <access_token>`

### Refresh Token
- **Type**: Random 32-byte hex string
- **Expiration**: 7 days
- **Usage**: Obtain new access tokens without re-entering credentials
- **Storage**: Database with hash for security

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  employee_id TEXT UNIQUE,
  department TEXT,
  is_active BOOLEAN DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Roles Table
```sql
CREATE TABLE roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Permissions Table
```sql
CREATE TABLE permissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Role-Permission Mapping
```sql
CREATE TABLE role_permissions (
  id TEXT PRIMARY KEY,
  role_id TEXT NOT NULL,
  permission_id TEXT NOT NULL,
  UNIQUE(role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);
```

### User-Role Mapping (Multi-role Support)
```sql
CREATE TABLE user_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  assigned_by TEXT,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT 1,
  UNIQUE(user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  revoked_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Audit Logs Table
```sql
CREATE TABLE auth_audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT,
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Roles and Permissions

### System Roles

#### 1. Employee (ROLE_EMPLOYEE)
- View own profile and personal data
- Submit attendance corrections
- Request and view leaves
- View payslips
- Upload and manage personal documents
- View performance reviews

#### 2. HR Admin (ROLE_HR_ADMIN)
- Manage all employee records
- Approve attendance corrections
- Manage leave requests
- Configure leave policies
- Manage recruitment and onboarding
- Conduct performance reviews
- View HR reports

#### 3. Finance Admin (ROLE_FINANCE_ADMIN)
- Manage salary structures
- Process payroll
- Generate payslips
- Manage tax settings (PF, ESIC, Tax)
- View financial reports
- **Cannot access**: Employee personal data, Salary data visibility

#### 4. Manager (ROLE_MANAGER)
- View team members
- Approve team attendance
- Approve/reject team leave requests
- Conduct performance reviews
- Manage team goals
- View team reports
- **Cannot access**: Salary data, Finance data

#### 5. Super Admin (ROLE_SUPER_ADMIN)
- Full system access
- User and role management
- Permission configuration
- Organization hierarchy management
- System settings and integrations
- View audit logs
- Feature flag management

## API Endpoints

### 1. POST /api/auth/login

**Description**: Authenticate user and obtain JWT access token and refresh token

**Request**:
```json
{
  "email": "john.doe@company.com",
  "password": "secure_password"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "user": {
      "id": "user-001",
      "email": "john.doe@company.com",
      "name": "John Doe",
      "roles": ["ROLE_EMPLOYEE"]
    }
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### 2. POST /api/auth/refresh

**Description**: Obtain new access token using refresh token

**Request**:
```json
{
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "error": "Invalid refresh token" or "Refresh token expired"
}
```

---

### 3. GET /api/auth/me

**Description**: Get current authenticated user information

**Headers**:
```
Authorization: Bearer <access_token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "user-001",
      "email": "john.doe@company.com",
      "name": "John Doe",
      "roles": ["ROLE_EMPLOYEE"],
      "permissions": [
        "PERM_EMPLOYEE_VIEW_PROFILE",
        "PERM_EMPLOYEE_EDIT_PROFILE",
        ...
      ]
    }
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

---

### 4. POST /api/auth/logout

**Description**: Logout user and invalidate refresh token

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request**:
```json
{
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Middleware Usage

### Authentication Middleware
```typescript
// Requires valid JWT token
app.get("/api/protected", authMiddleware, (req, res) => {
  console.log(req.user); // Authenticated user payload
});
```

### Role-Based Access Control
```typescript
// Requires one of the specified roles
app.post("/api/approve-leaves", 
  authMiddleware,
  requireRole(["ROLE_HR_ADMIN", "ROLE_MANAGER"]),
  (req, res) => {
    // Handle leave approval
  }
);
```

### Permission-Based Access Control
```typescript
// Requires specific permission
app.post("/api/process-payroll",
  authMiddleware,
  requirePermission(["PERM_FINANCE_PROCESS_PAYROLL"]),
  (req, res) => {
    // Handle payroll processing
  }
);
```

## Security Best Practices

### 1. Password Security
- Use bcrypt with 10+ salt rounds (currently using SHA256, upgrade to bcrypt in production)
- Store only password hashes
- Enforce minimum password requirements
- Implement password expiration policies

### 2. Token Security
- Store tokens in secure HTTP-only cookies (currently in localStorage, use cookies for production)
- Implement token rotation for refresh tokens
- Short expiration times for access tokens (15 minutes)
- Revoke tokens on logout

### 3. HTTPS Only
- Enforce HTTPS in production
- Use secure flag on cookies
- Use SameSite cookie attribute

### 4. CORS Configuration
- Whitelist allowed origins
- Limit HTTP methods
- Validate request headers

### 5. Rate Limiting
- Implement rate limiting on login endpoint
- Prevent brute force attacks
- Lock accounts after failed attempts

### 6. Audit Logging
- Log all authentication events
- Track failed login attempts
- Monitor permission changes
- Maintain audit trail for compliance

### 7. Data Privacy
- Encrypt sensitive data in transit (HTTPS)
- Encrypt sensitive data at rest
- Implement proper data retention policies
- GDPR compliance for user data

## Demo Accounts

For testing and development:

| Email | Password | Role |
|-------|----------|------|
| john.doe@company.com | demo | Employee |
| hr.admin@company.com | demo | HR Admin |
| finance.admin@company.com | demo | Finance Admin |
| manager@company.com | demo | Manager |
| super.admin@company.com | demo | Super Admin |

**Note**: Change these credentials in production and use proper password management.

## Frontend Integration

### Using useAuth Hook

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    accessToken 
  } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Hello, {user?.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### Protected Routes

```typescript
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}
```

## Error Handling

### Common Errors

| Status | Error | Meaning |
|--------|-------|---------|
| 400 | Missing email or password | Incomplete login credentials |
| 401 | Invalid email or password | Authentication failed |
| 401 | Invalid or expired token | Token verification failed |
| 403 | Insufficient permissions | User lacks required role/permission |
| 500 | Internal server error | Server error |

## Token Refresh Flow

```
┌─────────────────────────────────────────────────────────┐
│ User attempts protected endpoint                        │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │ Token still valid?  │
          └──────┬─────────┬────┘
                 │         │
            YES  │         │  NO
                 │         │
        ┌────────▼─┐   ┌──▼──────────┐
        │ Continue │   │ Use refresh  │
        │ request  │   │ token to get │
        └──────────┘   │ new access   │
                       │ token        │
                       └──┬───────────┘
                          │
                   ┌──────▼──────┐
                   │ New token   │
                   │ valid?      │
                   └──┬───────┬──┘
                      │       │
                 YES  │       │  NO
                      │       │
              ┌───────▼─┐  ┌──▼────────┐
              │ Continue│  │ Redirect  │
              │ request │  │ to login  │
              └─────────┘  └───────────┘
```

## Compliance

- **GDPR**: Right to delete user data
- **SOC 2**: Audit logging and access controls
- **ISO 27001**: Information security management
- **India Compliance**: Employee data residency requirements

## Future Enhancements

1. **Multi-Factor Authentication (MFA)**
   - TOTP (Time-based One-Time Password)
   - SMS/Email verification

2. **OAuth2/OpenID Connect**
   - SSO with external providers
   - Google/Microsoft account integration

3. **Advanced RBAC**
   - Attribute-Based Access Control (ABAC)
   - Dynamic permissions based on context

4. **Session Management**
   - Multiple device sessions
   - Session timeout and reminder

5. **Biometric Authentication**
   - Fingerprint/Face recognition
   - Secure enrollment process

## Support

For questions or issues related to authentication:
- Check the API error messages
- Review audit logs for debugging
- Consult the security best practices section
- Contact the development team
