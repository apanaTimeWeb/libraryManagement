/**
 * URL Configuration for the Admin Module
 * Contains all internal routes and external API endpoints.
 */

export const ADMIN_ROUTES = {
  PREFIX: '/admin',
  DASHBOARD: '/admin/admin_dashboard',
  REPORTS: '/admin/admin_reports',
  BRANCHES: '/admin/admin_branches',
  STAFF_USERS: '/admin/admin_staff-users',
  PERMISSIONS: '/admin/admin_permissions',
  PLANS: '/admin/admin_plans',
  COUPONS: '/admin/admin_coupons',
  BLACKLIST: '/admin/admin_blacklist',
  AUDIT_LOGS: '/admin/admin_audit-logs',
  EXPENSES: '/admin/admin_expenses',
  STUDENTS: '/admin/admin_students',
  EXPENSE_CATEGORIES: '/admin/admin_expense-categories',
  SETTINGS: '/admin/admin_settings',
} as const;

export const ADMIN_API_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  STUDENTS: '/admin/admin_students',
} as const;
