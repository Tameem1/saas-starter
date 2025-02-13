// lib/client-api/jwt.ts

export function parseJwt(token: string) {
    if (!token) return null;
    const cleaned = token.replace(/^Bearer\s+/, "");
    const parts = cleaned.split(".");
    if (parts.length !== 3) return null;
  
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    try {
      const decodedPayload = atob(base64);
      return JSON.parse(decodedPayload);
    } catch (err) {
      console.error("Failed to parse JWT:", err);
      return null;
    }
  }