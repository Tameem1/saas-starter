// lib/client-api/api.ts

export const BASE_URL = "http://localhost:8000";
// Or point to your FastAPI or any other backend

export function setAuthToken(token: string) {
  localStorage.setItem("token", token);
}

function getAuthToken() {
  const token = localStorage.getItem("token");
  return token ? `Bearer ${token}` : "";
}

/**
 * A small fetch wrapper that sets Authorization if a token is found in localStorage.
 */
export async function apiFetch(
  endpoint: string,
  { method = "GET", body, isFormData = false }: 
  { method?: string; body?: any; isFormData?: boolean } = {}
) {
  const headers: Record<string, string> = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      ...headers,
      Authorization: getAuthToken(),
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `HTTP ${res.status} - ${res.statusText}`);
  }

  try {
    return await res.json();
  } catch {
    return {};
  }
}