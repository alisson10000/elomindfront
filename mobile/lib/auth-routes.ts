import type { SessionSnapshot, UserRole } from "./session";

export function getRouteForRole(role: UserRole | null) {
  if (role === "therapist") {
    return "/(therapist)/(tabs)/therapist-home" as const;
  }

  return "/(client)/(tabs)/client-home" as const;
}

export function getInitialRouteFromSession(session: SessionSnapshot) {
  if (!session.isAuthenticated) {
    return "/(auth)/login" as const;
  }

  return getRouteForRole(session.role);
}
