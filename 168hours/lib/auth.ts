const PASSWORD = "RAJA";
const SESSION_KEY = "168hours_auth";

export function checkPassword(input: string): boolean {
  return input === PASSWORD;
}

export function setSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function logout(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}
