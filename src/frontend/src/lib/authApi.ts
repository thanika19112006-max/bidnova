const API_BASE = (import.meta.env.VITE_API_URL as string) ?? "";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

// Mock fallback used when no backend URL is configured
function mockAuth(username: string, email: string): AuthResponse {
  return {
    token: `demo-token-${Math.random().toString(36).slice(2)}`,
    user: { id: "1", username, email, role: "user" },
  };
}

export async function apiLogin(
  email: string,
  password: string,
): Promise<AuthResponse> {
  if (!API_BASE) {
    // No backend configured — use mock
    return mockAuth(email.split("@")[0], email);
  }
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data?.message ?? "Login failed. Please try again.");
  return data as AuthResponse;
}

export async function apiRegister(
  username: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  if (!API_BASE) {
    // No backend configured — use mock
    return mockAuth(username, email);
  }
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data?.message ?? "Registration failed. Please try again.");
  return data as AuthResponse;
}
