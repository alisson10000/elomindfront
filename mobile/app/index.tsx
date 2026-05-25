import { useEffect } from "react";
import { router } from "expo-router";

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
  }, []);

  return null;
}
