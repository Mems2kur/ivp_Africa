const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// Retrieves the stored access token for authenticated API requests
function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("access_token"); // Ensure this matches your token key name
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
        ...options.headers,
      },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return { ok: false, message: data?.error ?? data?.message ?? "Something went wrong." };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, message: "Unable to reach the server." };
  }
}

// For endpoints expecting file uploads — no Content-Type header (the browser
// sets the correct multipart boundary automatically when sending FormData).
export async function apiFetchMultipart<T>(
  path: string,
  formData: FormData,
  options: { method?: string; headers?: HeadersInit } = {}
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: options.method ?? "PATCH",
      headers: {
        ...getAuthHeader(),
        ...options.headers,
      }, // no Content-Type here — must stay unset for multipart
      body: formData,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return { ok: false, message: data?.error ?? data?.message ?? "Something went wrong." };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, message: "Unable to reach the server." };
  }
}