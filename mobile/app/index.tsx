import { useEffect } from "react";
import { router } from "expo-router";
<<<<<<< HEAD

import { getInitialRouteFromSession, restoreSession } from "../lib/auth";

export default function Index() {
  useEffect(() => {
    let mounted = true;

    (async () => {
      const session = await restoreSession();

      if (!mounted) {
        return;
      }

      router.replace(getInitialRouteFromSession(session));
    })();

    return () => {
      mounted = false;
    };
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  }, []);

  return null;
}
