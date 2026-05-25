import type { SessionSnapshot } from "@/lib/session";
import {
  getInitialRouteFromSession,
  getRouteForRole,
} from "@/lib/auth-routes";

describe("auth routing helpers", () => {
  it("sends unauthenticated users to login", () => {
    const session: SessionSnapshot = {
      token: null,
      role: null,
      sessionOnly: false,
      isAuthenticated: false,
    };

    expect(getInitialRouteFromSession(session)).toBe("/(auth)/login");
  });

  it("sends therapist users to the therapist home", () => {
    expect(getRouteForRole("therapist")).toBe(
      "/(therapist)/(tabs)/therapist-home"
    );
  });

  it("sends client users to the client home", () => {
    expect(getRouteForRole("client")).toBe("/(client)/(tabs)/client-home");
  });
});
