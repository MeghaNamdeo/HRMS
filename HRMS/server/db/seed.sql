-- HRMS Authentication Seed Data
-- Inserts default roles and permissions

-- Insert Roles
INSERT OR IGNORE INTO roles (id, name, description) VALUES
('ROLE_EMPLOYEE', 'Employee', 'Regular employee with self-service portal access'),
('ROLE_HR_ADMIN', 'HR Admin', 'HR administration and employee lifecycle management'),
('ROLE_FINANCE_ADMIN', 'Finance Admin', 'Payroll and finance administration'),
('ROLE_MANAGER', 'Manager', 'Team management and approvals'),
('ROLE_SUPER_ADMIN', 'Super Admin', 'System administration and configuration');

-- Insert Permissions - Employee
INSERT OR IGNORE INTO permissions (id, name, description, resource, action) VALUES
('PERM_EMPLOYEE_VIEW_PROFILE', 'View Own Profile', 'View own employee profile', 'employee_profile', 'view'),
('PERM_EMPLOYEE_EDIT_PROFILE', 'Edit Own Profile', 'Edit own profile information', 'employee_profile', 'edit'),
('PERM_EMPLOYEE_VIEW_ATTENDANCE', 'View Own Attendance', 'View own attendance records', 'attendance', 'view'),
('PERM_EMPLOYEE_SUBMIT_ATTENDANCE_CORRECTION', 'Submit Attendance Correction', 'Submit attendance correction request', 'attendance', 'create'),
('PERM_EMPLOYEE_VIEW_LEAVES', 'View Own Leaves', 'View own leave balance and history', 'leave', 'view'),
('PERM_EMPLOYEE_REQUEST_LEAVE', 'Request Leave', 'Submit leave request', 'leave', 'create'),
('PERM_EMPLOYEE_VIEW_PAYSLIP', 'View Own Payslip', 'Download own payslip', 'payslip', 'view'),
('PERM_EMPLOYEE_VIEW_DOCUMENTS', 'View Own Documents', 'View own documents', 'documents', 'view'),
('PERM_EMPLOYEE_UPLOAD_DOCUMENTS', 'Upload Documents', 'Upload employee documents', 'documents', 'create'),
('PERM_EMPLOYEE_VIEW_PERFORMANCE', 'View Own Performance', 'View own performance reviews', 'performance', 'view'),
('PERM_EMPLOYEE_DASHBOARD', 'Employee Dashboard', 'Access employee dashboard', 'dashboard', 'view');

-- Insert Permissions - HR Admin
INSERT OR IGNORE INTO permissions (id, name, description, resource, action) VALUES
('PERM_HR_VIEW_EMPLOYEES', 'View All Employees', 'View all employee records', 'employees', 'view'),
('PERM_HR_CREATE_EMPLOYEE', 'Create Employee', 'Create new employee record', 'employees', 'create'),
('PERM_HR_EDIT_EMPLOYEE', 'Edit Employee', 'Edit employee information', 'employees', 'edit'),
('PERM_HR_DELETE_EMPLOYEE', 'Delete Employee', 'Delete employee record', 'employees', 'delete'),
('PERM_HR_VIEW_ATTENDANCE', 'View All Attendance', 'View all attendance records', 'attendance', 'view'),
('PERM_HR_APPROVE_ATTENDANCE_CORRECTION', 'Approve Attendance Correction', 'Approve attendance corrections', 'attendance', 'edit'),
('PERM_HR_VIEW_LEAVES', 'View All Leaves', 'View all leave requests', 'leave', 'view'),
('PERM_HR_APPROVE_LEAVES', 'Approve Leaves', 'Approve/reject leave requests', 'leave', 'edit'),
('PERM_HR_MANAGE_LEAVE_POLICIES', 'Manage Leave Policies', 'Configure leave policies', 'leave_policy', 'edit'),
('PERM_HR_VIEW_DOCUMENTS', 'View All Documents', 'View all employee documents', 'documents', 'view'),
('PERM_HR_MANAGE_DOCUMENTS', 'Manage Documents', 'Manage employee documents', 'documents', 'edit'),
('PERM_HR_MANAGE_RECRUITMENT', 'Manage Recruitment', 'Manage job openings and candidates', 'recruitment', 'edit'),
('PERM_HR_MANAGE_ONBOARDING', 'Manage Onboarding', 'Manage employee onboarding', 'onboarding', 'edit'),
('PERM_HR_VIEW_PERFORMANCE', 'View All Performance', 'View all performance reviews', 'performance', 'view'),
('PERM_HR_MANAGE_PERFORMANCE', 'Manage Performance', 'Manage performance reviews', 'performance', 'edit'),
('PERM_HR_VIEW_REPORTS', 'View HR Reports', 'Access HR reports and analytics', 'reports', 'view'),
('PERM_HR_DASHBOARD', 'HR Dashboard', 'Access HR admin dashboard', 'dashboard', 'view');

-- Insert Permissions - Finance Admin
INSERT OR IGNORE INTO permissions (id, name, description, resource, action) VALUES
('PERM_FINANCE_VIEW_PAYROLL', 'View Payroll', 'View payroll data', 'payroll', 'view'),
('PERM_FINANCE_MANAGE_SALARY_STRUCTURE', 'Manage Salary Structure', 'Create/edit salary structures', 'salary_structure', 'edit'),
('PERM_FINANCE_PROCESS_PAYROLL', 'Process Payroll', 'Run monthly payroll processing', 'payroll', 'edit'),
('PERM_FINANCE_GENERATE_PAYSLIPS', 'Generate Payslips', 'Generate employee payslips', 'payslip', 'create'),
('PERM_FINANCE_VIEW_PAYSLIPS', 'View Payslips', 'View all payslips', 'payslip', 'view'),
('PERM_FINANCE_MANAGE_TAX', 'Manage Tax', 'Configure tax settings', 'tax', 'edit'),
('PERM_FINANCE_VIEW_ATTENDANCE', 'View Attendance', 'View attendance for payroll', 'attendance', 'view'),
('PERM_FINANCE_VIEW_LEAVES', 'View Leaves', 'View leaves for payroll', 'leave', 'view'),
('PERM_FINANCE_VIEW_REPORTS', 'View Finance Reports', 'Access financial reports', 'reports', 'view'),
('PERM_FINANCE_DASHBOARD', 'Finance Dashboard', 'Access finance dashboard', 'dashboard', 'view');

-- Insert Permissions - Manager
INSERT OR IGNORE INTO permissions (id, name, description, resource, action) VALUES
('PERM_MANAGER_VIEW_TEAM', 'View Team', 'View team members', 'team', 'view'),
('PERM_MANAGER_VIEW_TEAM_ATTENDANCE', 'View Team Attendance', 'View team attendance', 'attendance', 'view'),
('PERM_MANAGER_APPROVE_ATTENDANCE', 'Approve Attendance', 'Approve team attendance', 'attendance', 'edit'),
('PERM_MANAGER_APPROVE_LEAVES', 'Approve Leaves', 'Approve/reject team leave requests', 'leave', 'edit'),
('PERM_MANAGER_VIEW_PERFORMANCE', 'View Team Performance', 'View team performance data', 'performance', 'view'),
('PERM_MANAGER_MANAGE_PERFORMANCE', 'Manage Performance', 'Conduct performance reviews', 'performance', 'edit'),
('PERM_MANAGER_VIEW_GOALS', 'View Goals', 'View team goals', 'goals', 'view'),
('PERM_MANAGER_MANAGE_GOALS', 'Manage Goals', 'Set and manage team goals', 'goals', 'edit'),
('PERM_MANAGER_VIEW_REPORTS', 'View Manager Reports', 'Access team reports', 'reports', 'view'),
('PERM_MANAGER_DASHBOARD', 'Manager Dashboard', 'Access manager dashboard', 'dashboard', 'view');

-- Insert Permissions - Super Admin
INSERT OR IGNORE INTO permissions (id, name, description, resource, action) VALUES
('PERM_SUPER_ADMIN_MANAGE_USERS', 'Manage Users', 'Create/edit/delete users', 'users', 'edit'),
('PERM_SUPER_ADMIN_MANAGE_ROLES', 'Manage Roles', 'Create/edit/delete roles', 'roles', 'edit'),
('PERM_SUPER_ADMIN_MANAGE_PERMISSIONS', 'Manage Permissions', 'Create/edit/delete permissions', 'permissions', 'edit'),
('PERM_SUPER_ADMIN_VIEW_AUDIT_LOGS', 'View Audit Logs', 'View system audit logs', 'audit_logs', 'view'),
('PERM_SUPER_ADMIN_MANAGE_SETTINGS', 'Manage Settings', 'Manage system settings', 'settings', 'edit'),
('PERM_SUPER_ADMIN_MANAGE_INTEGRATIONS', 'Manage Integrations', 'Manage system integrations', 'integrations', 'edit'),
('PERM_SUPER_ADMIN_VIEW_ORGANIZATION', 'View Organization', 'View organization hierarchy', 'organization', 'view'),
('PERM_SUPER_ADMIN_MANAGE_ORGANIZATION', 'Manage Organization', 'Manage organization hierarchy', 'organization', 'edit'),
('PERM_SUPER_ADMIN_DASHBOARD', 'Super Admin Dashboard', 'Access super admin dashboard', 'dashboard', 'view'),
('PERM_SUPER_ADMIN_FEATURE_FLAGS', 'Manage Feature Flags', 'Enable/disable features', 'feature_flags', 'edit');

-- Assign permissions to roles

-- Employee Role Permissions
INSERT OR IGNORE INTO role_permissions (id, role_id, permission_id) VALUES
('RP_EMP_1', 'ROLE_EMPLOYEE', 'PERM_EMPLOYEE_VIEW_PROFILE'),
('RP_EMP_2', 'ROLE_EMPLOYEE', 'PERM_EMPLOYEE_EDIT_PROFILE'),
('RP_EMP_3', 'ROLE_EMPLOYEE', 'PERM_EMPLOYEE_VIEW_ATTENDANCE'),
('RP_EMP_4', 'ROLE_EMPLOYEE', 'PERM_EMPLOYEE_SUBMIT_ATTENDANCE_CORRECTION'),
('RP_EMP_5', 'ROLE_EMPLOYEE', 'PERM_EMPLOYEE_VIEW_LEAVES'),
('RP_EMP_6', 'ROLE_EMPLOYEE', 'PERM_EMPLOYEE_REQUEST_LEAVE'),
('RP_EMP_7', 'ROLE_EMPLOYEE', 'PERM_EMPLOYEE_VIEW_PAYSLIP'),
('RP_EMP_8', 'ROLE_EMPLOYEE', 'PERM_EMPLOYEE_VIEW_DOCUMENTS'),
('RP_EMP_9', 'ROLE_EMPLOYEE', 'PERM_EMPLOYEE_UPLOAD_DOCUMENTS'),
('RP_EMP_10', 'ROLE_EMPLOYEE', 'PERM_EMPLOYEE_VIEW_PERFORMANCE'),
('RP_EMP_11', 'ROLE_EMPLOYEE', 'PERM_EMPLOYEE_DASHBOARD');

-- HR Admin Role Permissions
INSERT OR IGNORE INTO role_permissions (id, role_id, permission_id) VALUES
('RP_HR_1', 'ROLE_HR_ADMIN', 'PERM_HR_VIEW_EMPLOYEES'),
('RP_HR_2', 'ROLE_HR_ADMIN', 'PERM_HR_CREATE_EMPLOYEE'),
('RP_HR_3', 'ROLE_HR_ADMIN', 'PERM_HR_EDIT_EMPLOYEE'),
('RP_HR_4', 'ROLE_HR_ADMIN', 'PERM_HR_DELETE_EMPLOYEE'),
('RP_HR_5', 'ROLE_HR_ADMIN', 'PERM_HR_VIEW_ATTENDANCE'),
('RP_HR_6', 'ROLE_HR_ADMIN', 'PERM_HR_APPROVE_ATTENDANCE_CORRECTION'),
('RP_HR_7', 'ROLE_HR_ADMIN', 'PERM_HR_VIEW_LEAVES'),
('RP_HR_8', 'ROLE_HR_ADMIN', 'PERM_HR_APPROVE_LEAVES'),
('RP_HR_9', 'ROLE_HR_ADMIN', 'PERM_HR_MANAGE_LEAVE_POLICIES'),
('RP_HR_10', 'ROLE_HR_ADMIN', 'PERM_HR_VIEW_DOCUMENTS'),
('RP_HR_11', 'ROLE_HR_ADMIN', 'PERM_HR_MANAGE_DOCUMENTS'),
('RP_HR_12', 'ROLE_HR_ADMIN', 'PERM_HR_MANAGE_RECRUITMENT'),
('RP_HR_13', 'ROLE_HR_ADMIN', 'PERM_HR_MANAGE_ONBOARDING'),
('RP_HR_14', 'ROLE_HR_ADMIN', 'PERM_HR_VIEW_PERFORMANCE'),
('RP_HR_15', 'ROLE_HR_ADMIN', 'PERM_HR_MANAGE_PERFORMANCE'),
('RP_HR_16', 'ROLE_HR_ADMIN', 'PERM_HR_VIEW_REPORTS'),
('RP_HR_17', 'ROLE_HR_ADMIN', 'PERM_HR_DASHBOARD');

-- Finance Admin Role Permissions
INSERT OR IGNORE INTO role_permissions (id, role_id, permission_id) VALUES
('RP_FIN_1', 'ROLE_FINANCE_ADMIN', 'PERM_FINANCE_VIEW_PAYROLL'),
('RP_FIN_2', 'ROLE_FINANCE_ADMIN', 'PERM_FINANCE_MANAGE_SALARY_STRUCTURE'),
('RP_FIN_3', 'ROLE_FINANCE_ADMIN', 'PERM_FINANCE_PROCESS_PAYROLL'),
('RP_FIN_4', 'ROLE_FINANCE_ADMIN', 'PERM_FINANCE_GENERATE_PAYSLIPS'),
('RP_FIN_5', 'ROLE_FINANCE_ADMIN', 'PERM_FINANCE_VIEW_PAYSLIPS'),
('RP_FIN_6', 'ROLE_FINANCE_ADMIN', 'PERM_FINANCE_MANAGE_TAX'),
('RP_FIN_7', 'ROLE_FINANCE_ADMIN', 'PERM_FINANCE_VIEW_ATTENDANCE'),
('RP_FIN_8', 'ROLE_FINANCE_ADMIN', 'PERM_FINANCE_VIEW_LEAVES'),
('RP_FIN_9', 'ROLE_FINANCE_ADMIN', 'PERM_FINANCE_VIEW_REPORTS'),
('RP_FIN_10', 'ROLE_FINANCE_ADMIN', 'PERM_FINANCE_DASHBOARD');

-- Manager Role Permissions
INSERT OR IGNORE INTO role_permissions (id, role_id, permission_id) VALUES
('RP_MGR_1', 'ROLE_MANAGER', 'PERM_MANAGER_VIEW_TEAM'),
('RP_MGR_2', 'ROLE_MANAGER', 'PERM_MANAGER_VIEW_TEAM_ATTENDANCE'),
('RP_MGR_3', 'ROLE_MANAGER', 'PERM_MANAGER_APPROVE_ATTENDANCE'),
('RP_MGR_4', 'ROLE_MANAGER', 'PERM_MANAGER_APPROVE_LEAVES'),
('RP_MGR_5', 'ROLE_MANAGER', 'PERM_MANAGER_VIEW_PERFORMANCE'),
('RP_MGR_6', 'ROLE_MANAGER', 'PERM_MANAGER_MANAGE_PERFORMANCE'),
('RP_MGR_7', 'ROLE_MANAGER', 'PERM_MANAGER_VIEW_GOALS'),
('RP_MGR_8', 'ROLE_MANAGER', 'PERM_MANAGER_MANAGE_GOALS'),
('RP_MGR_9', 'ROLE_MANAGER', 'PERM_MANAGER_VIEW_REPORTS'),
('RP_MGR_10', 'ROLE_MANAGER', 'PERM_MANAGER_DASHBOARD');

-- Super Admin Role Permissions (All permissions)
INSERT OR IGNORE INTO role_permissions (id, role_id, permission_id) VALUES
('RP_SA_1', 'ROLE_SUPER_ADMIN', 'PERM_SUPER_ADMIN_MANAGE_USERS'),
('RP_SA_2', 'ROLE_SUPER_ADMIN', 'PERM_SUPER_ADMIN_MANAGE_ROLES'),
('RP_SA_3', 'ROLE_SUPER_ADMIN', 'PERM_SUPER_ADMIN_MANAGE_PERMISSIONS'),
('RP_SA_4', 'ROLE_SUPER_ADMIN', 'PERM_SUPER_ADMIN_VIEW_AUDIT_LOGS'),
('RP_SA_5', 'ROLE_SUPER_ADMIN', 'PERM_SUPER_ADMIN_MANAGE_SETTINGS'),
('RP_SA_6', 'ROLE_SUPER_ADMIN', 'PERM_SUPER_ADMIN_MANAGE_INTEGRATIONS'),
('RP_SA_7', 'ROLE_SUPER_ADMIN', 'PERM_SUPER_ADMIN_VIEW_ORGANIZATION'),
('RP_SA_8', 'ROLE_SUPER_ADMIN', 'PERM_SUPER_ADMIN_MANAGE_ORGANIZATION'),
('RP_SA_9', 'ROLE_SUPER_ADMIN', 'PERM_SUPER_ADMIN_DASHBOARD'),
('RP_SA_10', 'ROLE_SUPER_ADMIN', 'PERM_SUPER_ADMIN_FEATURE_FLAGS');
