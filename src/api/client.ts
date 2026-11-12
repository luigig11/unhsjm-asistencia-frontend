export interface ApiErrorResponse {
  status: number;
  error: string;
  message: string;
  details?: Record<string, string[]>;
}

export class ApiError extends Error {
  public status: number;
  public errorCode: string;
  public details?: Record<string, string[]>;

  constructor(errorResponse: ApiErrorResponse) {
    super(errorResponse.message || 'Error en la petición al servidor.');
    this.name = 'ApiError';
    this.status = errorResponse.status;
    this.errorCode = errorResponse.error;
    this.details = errorResponse.details;
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:5089/api/v1';

export const getAccessToken = (): string | null => {
  return sessionStorage.getItem('access_token');
};

export const getRefreshToken = (): string | null => {
  return sessionStorage.getItem('refresh_token');
};

export const setSession = (accessToken: string, refreshToken?: string): void => {
  sessionStorage.setItem('access_token', accessToken);
  if (refreshToken) {
    sessionStorage.setItem('refresh_token', refreshToken);
  }
};

export const clearSession = (): void => {
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
  sessionStorage.removeItem('auth_user');
};

interface RequestOptions extends RequestInit {
  params?: object;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;

  let url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}/${endpoint.replace(/^\//, '')}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = getAccessToken();

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json; charset=utf-8',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  const config: RequestInit = {
    ...customConfig,
    headers: reqHeaders,
  };

  const response = await fetch(url, config);

  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }

    if (isJson) {
      const errorJson = await response.json();
      throw new ApiError({
        status: response.status,
        error: errorJson.error || 'API_ERROR',
        message: errorJson.message || `Error ${response.status}: ${response.statusText}`,
        details: errorJson.details,
      });
    }

    const errorText = await response.text();
    throw new ApiError({
      status: response.status,
      error: 'HTTP_ERROR',
      message: errorText || `Error ${response.status}: ${response.statusText}`,
    });
  }

  if (isJson) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}

export const apiClient = {
  get: <T>(endpoint: string, params?: object) =>
    request<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
