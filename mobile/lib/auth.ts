import { api } from "./api";
import {
  getInitialRouteFromSession,
  getRouteForRole,
} from "./auth-routes";
import { setupPushToken } from "./setup-push-token";
import {
  clearSession,
  restoreSession,
  getAuthToken,
  saveAuthToken,
  saveRememberedEmail,
  saveUserRole,
  setSessionOnlyFlag,
  type UserRole,
} from "./session";

type LoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type LoginResult = {
  role: UserRole | null;
  redirectTo:
    | "/(auth)/consent-lgpd"
    | "/(client)/(tabs)/client-home"
    | "/(therapist)/(tabs)/therapist-home";
};

function normalizeRole(value: unknown): UserRole | null {
  if (!value) return null;

  const role = String(value).toLowerCase();
  return role === "client" || role === "therapist" ? role : null;
}

export async function loginWithSession({
  email,
  password,
  rememberMe,
}: LoginPayload): Promise<LoginResult> {
  await saveRememberedEmail(email, rememberMe);

  const res = await api.post("/auth/login", {
    email,
    password,
  });

  const token: string | undefined =
    res.data?.access_token ?? res.data?.token ?? res.data?.accessToken;

  if (!token) {
    throw new Error("Token não retornou do servidor.");
  }

  await saveAuthToken(token);
  await setSessionOnlyFlag(!rememberMe);

  let role: UserRole | null = null;

  try {
    const me = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    role = normalizeRole(
      me.data?.role ??
        me.data?.user?.role ??
        me.data?.user_type ??
        me.data?.type
    );
  } catch (error: any) {
    console.log("Erro ao carregar role da sessão:", error?.message || error);
  }

  await saveUserRole(role);

  if (role === "client") {
    try {
      const consent = await api.get("/consents/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Boolean(consent.data?.accepted)) {
        return {
          role,
          redirectTo: "/(auth)/consent-lgpd",
        };
      }
    } catch {
      return {
        role,
        redirectTo: "/(auth)/consent-lgpd",
      };
    }
  }

  try {
    await setupPushToken();
  } catch (error: any) {
    console.log("Erro ao registrar push token:", error?.message || error);
  }

  return {
    role,
    redirectTo: getRouteForRole(role),
  };
}

export async function logout() {
  // Best-effort: if the backend supports server-side logout (JWT revocation), notify it.
  // This keeps compatibility with older backends that don't have `/auth/logout`.
  const token = await getAuthToken();

  if (token) {
    try {
      await api.post("/auth/logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error: any) {
      const status = error?.response?.status;

      // Ignore if endpoint doesn't exist (older backend) to avoid breaking the app flow.
      if (status !== 404 && status !== 405) {
        console.log(
          "Falha ao notificar logout no backend:",
          error?.message || error
        );
      }
    }
  }

  await clearSession();
}

export { restoreSession };
export { getInitialRouteFromSession, getRouteForRole };
