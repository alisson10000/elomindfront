import { Stack, router } from "expo-router";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

import { registerForPushNotificationsAsync } from "@/lib/push-notifications";
import { savePushToken } from "@/lib/push-token-api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    async function setupNotifications() {
      try {
        const token = await registerForPushNotificationsAsync();

        if (token) {
          await savePushToken(token);
        }
      } catch (error) {
        console.error("Erro no setupNotifications:", error);
      }
    }

    const receivedListener = Notifications.addNotificationReceivedListener(
      () => {}
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        if (data?.type === "feedback_approved" && data?.reflection_id) {
          router.push({
            pathname: "/(client)/reflections/[id]",
            params: { id: String(data.reflection_id) },
          });
        }
      });

    setupNotifications();

    return () => {
      receivedListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(therapist)" />
      <Stack.Screen name="(client)" />
    </Stack>
  );
}
