type Role = "client" | "therapist";

function base64UrlDecode(input: string) {
  // converte base64url -> base64
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = base64 + (pad ? "=".repeat(4 - pad) : "");
  // decode
  try {
    return decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return atob(padded);
  }
}

export function getUserRoleFromToken(token: string): Role | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const payloadStr = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadStr);

    const role = payload?.role;
    if (role === "client" || role === "therapist") return role;

    return null;
  } catch {
    return null;
  }
}
