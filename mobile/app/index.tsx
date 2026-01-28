import { useEffect } from "react";
import { router } from "expo-router";
import { getToken, clearToken } from "../lib/token";
import { isSessionOnly, clearSessionOnly } from "../lib/remember";
import { getUserRoleFromToken } from "../lib/authRole";

type Role = "client" | "therapist";

function pickStartRoute(role: Role | null) {
  if (role === "therapist") return "/(therapist)/(tabs)/therapist-home";
  return "/(client)/(tabs)/client-home";
}

export default function Index() {
  useEffect(() => {
    (async () => {
      const sessionOnly = await isSessionOnly();

      if (sessionOnly) {
        await clearToken();
        await clearSessionOnly();
        router.replace("/(auth)/login");
        return;
      }

      const token = await getToken();
      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const role = getUserRoleFromToken(token) as Role | null;
      const target = pickStartRoute(role);

      router.replace(target as any);
    })();
  }, []);

  return null;
}
