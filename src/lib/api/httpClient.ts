const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return { ok: false as const, message: data?.error ?? data?.message ?? "Something went wrong." };
    }
    return { ok: true as const, data };
  } catch {
    return { ok: false as const, message: "Unable to reach the server." };
  }
}