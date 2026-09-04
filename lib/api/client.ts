export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
}

function failMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;
  const data = payload as { message?: string; errors?: { field?: string; message?: string }[] };
  if (typeof data.message === "string" && data.message) return data.message;
  if (Array.isArray(data.errors) && data.errors.length) {
    return data.errors
      .map((item) => (item.field ? `${item.field}: ${item.message ?? "Invalid value"}` : (item.message ?? "Invalid value")))
      .join(". ");
  }
  return fallback;
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const json = await res.json().catch(() => null);

  if (json?.status === "success") {
    return json.data as T;
  }

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nest_access_token");
      document.cookie = "nest_session=; path=/; max-age=0";
    }
    throw new ApiError("Session expired. Please log in again.", 401);
  }

  if (json?.status === "fail") {
    throw new ApiError(failMessage(json.data, "Request failed"), res.status);
  }

  throw new ApiError(json?.message ?? "Server error", res.status || 500);
}

export function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function publicFetch<T>(path: string): Promise<T> {
  if (typeof window === "undefined") {
    const res = await fetch(`${getBaseUrl()}${path}`, { next: { revalidate: 60 } });
    if (res.status === 204) return undefined as T;
    const json = await res.json().catch(() => null);
    if (json?.status === "success") return json.data as T;
    throw new ApiError(failMessage(json?.data, json?.message ?? "Request failed"), res.status);
  }

  return api<T>(path);
}
