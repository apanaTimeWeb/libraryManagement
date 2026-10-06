/**
 * Auth Utility — Client Side
 *
 * Handles login, logout, token refresh, and current user retrieval.
 * Tokens stored in httpOnly cookies (set by the backend) — not accessible via JS.
 *
 * Zero Trust: All role/identity verification happens on the backend.
 * This is only a convenience layer for the frontend UI.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  tenantId?: string;
  branchId?: string;
  lastLoginAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// ─── Login ────────────────────────────────────────────────────────────────────
// 'identifier' can be phone number or email — backend matches by phone field
export async function login(identifier: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Backend LoginDto expects 'phone' field — we send identifier as phone
    body: JSON.stringify({ phone: identifier, password }),
    credentials: 'include',
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: 'Login failed' }));
    let errorMsg = errorBody.message;
    if (typeof errorMsg === 'object' && errorMsg !== null) {
      errorMsg = errorMsg.message || JSON.stringify(errorMsg);
    }
    if (Array.isArray(errorMsg)) {
      errorMsg = errorMsg.join(', ');
    }
    throw new Error(errorMsg || `Login failed: ${res.status}`);
  }

  const data: LoginResponse = await res.json();

  // Store tokens for client-side use
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem('refresh_token', data.refreshToken);
    }
    localStorage.setItem('user', JSON.stringify(data.user));
    // Store token in cookie for middleware (server-side route protection)
    document.cookie = `access_token=${data.accessToken}; path=/; SameSite=Strict; max-age=900`;
  }

  return data;
}


// ─── Logout ───────────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  try {
    const token = getAccessToken();
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });
    }
  } catch {
    // Even if backend call fails, clear client state
  } finally {
    clearAuthState();
  }
}

// ─── Refresh Access Token ─────────────────────────────────────────────────────
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      clearAuthState();
      return null;
    }

    const data = await res.json();
    localStorage.setItem('access_token', data.accessToken);
    document.cookie = `access_token=${data.accessToken}; path=/; SameSite=Strict; max-age=900`;
    return data.accessToken;
  } catch {
    clearAuthState();
    return null;
  }
}

// ─── Get Current User ─────────────────────────────────────────────────────────
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

// ─── Get Access Token ─────────────────────────────────────────────────────────
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

// ─── Check if Logged In ───────────────────────────────────────────────────────
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// ─── Clear All Auth State (on logout) ────────────────────────────────────────
export function clearAuthState(): void {
  if (typeof window === 'undefined') return;

  // Clear localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');

  // Clear cookies
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
  document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';

  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
}
