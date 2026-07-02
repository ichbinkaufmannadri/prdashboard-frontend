import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth';
import { ApiError, type ApiResponse, type ApiRequest } from '@/types/api';
import type { JwtResponseDTO } from '@/types/domain';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------- Refresh handling: single-flight -------- //

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const currentRefresh = useAuthStore.getState().refreshToken;
  if (!currentRefresh) throw new Error('No refresh token');

  const response = await axios.post<ApiResponse<JwtResponseDTO>>(
    `${BASE_URL}/auth/refresh`,
    { refreshToken: currentRefresh },
    { headers: { 'Content-Type': 'application/json' } },
  );

  const body = response.data;
  if (!body.success) throw new Error(body.message);

  useAuthStore.getState().setAuth({
    accessToken: body.data.accessToken,
    refreshToken: body.data.refreshToken,
    user: body.data.user,
  });
  return body.data.accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown> | ApiRequest>) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // Refresh once on 401 or 403 (Spring Security 6 returns 403 for unauthenticated
    // requests to protected routes), then retry. We deliberately skip /auth/* endpoints
    // to avoid an infinite loop on login/refresh failures.
    if ((status === 401 || status === 403) && !original._retry && !original.url?.includes('/auth/')) {
      original._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newToken = await refreshPromise;
        if (original.headers) original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Unwraps the backend's ApiResponse envelope and throws ApiError on failure.
 */
export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  try {
    const res = await promise;
    if (!res.data.success) {
      throw new ApiError(res.data.statusCode, res.data.message);
    }
    return res.data.data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (axios.isAxiosError(err)) {
      const body = err.response?.data as ApiResponse<unknown> | ApiRequest | undefined;
      throw new ApiError(
        err.response?.status ?? 500,
        body?.message || err.message || 'Request failed',
      );
    }
    throw err;
  }
}

export async function unwrapVoid(promise: Promise<{ data: ApiRequest | ApiResponse<unknown> }>): Promise<void> {
  try {
    const res = await promise;
    if (!res.data.success) {
      throw new ApiError(res.data.statusCode, res.data.message);
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (axios.isAxiosError(err)) {
      const body = err.response?.data as ApiResponse<unknown> | ApiRequest | undefined;
      throw new ApiError(
        err.response?.status ?? 500,
        body?.message || err.message || 'Request failed',
      );
    }
    throw err;
  }
}