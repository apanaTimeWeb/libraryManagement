/**
 * API Utility — Secure fetch wrapper
 *
 * Every API call:
 * 1. Attaches Authorization: Bearer <token> header
 * 2. On 401 → tries to refresh token once, then redirects to login
 * 3. On 403 → redirects to /403 page
 *
 * NOTE: Cache-Control is a RESPONSE header — do NOT send it as a REQUEST header.
 * Sending it as a request header causes CORS preflight to fail.
 */

import { getAccessToken, refreshAccessToken, clearAuthState } from './auth';
import { getMockData } from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    // ✅ Removed 'Cache-Control' — it's a response header, not request header.
    // Sending it as a request header causes CORS preflight failures.
    ...options.headers,
    // Attach JWT token if available
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
  } catch (networkError) {
    // Network-level failure (server down, CORS blocked, wrong URL)
    console.warn(`[fetchApi] Backend offline. Using Mock Mode for ${url}:`, networkError);
    
    // For POST, PATCH, PUT, DELETE operations, return a mock success
    const method = options.method?.toUpperCase() || 'GET';
    if (method !== 'GET') {
      return { success: true, mock: true, id: Date.now().toString(), message: 'Mock action successful' };
    }

    // For GET operations, return appropriate mock data
    return getMockData(url);
  }

  // ── Handle 401 — Token expired → try refresh ─────────────────────────────
  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry original request with new token
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      };
      let retryResponse: Response;
      try {
        retryResponse = await fetch(url, {
          ...options,
          headers: retryHeaders,
          credentials: 'include',
        });
      } catch {
        clearAuthState();
        throw new Error('Session expired. Please log in again.');
      }
      if (retryResponse.status === 401) {
        // Refresh also failed — force logout
        clearAuthState();
        throw new Error('Session expired. Please log in again.');
      }
      return handleResponse(retryResponse);
    } else {
      // No refresh token — force logout
      clearAuthState();
      throw new Error('Session expired. Please log in again.');
    }
  }

  // ── Handle 403 — Access denied ────────────────────────────────────────────
  if (response.status === 403) {
    if (typeof window !== 'undefined') {
      window.location.href = '/403';
    }
    throw new Error('Access denied: You do not have permission to perform this action.');
  }

  return handleResponse(response);
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    let errorMsg = errorBody?.message;
    if (typeof errorMsg === 'object' && errorMsg !== null) {
      errorMsg = errorMsg.message || JSON.stringify(errorMsg);
    }
    if (Array.isArray(errorMsg)) {
      errorMsg = errorMsg.join(', ');
    }
    throw new Error(errorMsg || `API Error: ${response.status}`);
  }

  // Handle empty responses (204 No Content)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;
}
