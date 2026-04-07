import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { api } from "@/lib/api";

// 👉 Faz a notificação aparecer mesmo com app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("❌ Permissão de notificação negada");
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    console.log("❌ projectId não encontrado");
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  console.log("✅ Expo push token:", tokenData.data);

  return tokenData.data;
}

async function savePushToken(token: string) {
  try {
    await api.post("/push-tokens/", {
      expo_push_token: token,
      platform: Platform.OS,
    });

    console.log("✅ Token salvo no backend");
  } catch (error) {
    console.log("❌ Erro ao salvar token no backend:", error);
  }
}

export default function RootLayout() {
  useEffect(() => {
    async function setupNotifications() {
      try {
        const token = await registerForPushNotificationsAsync();

        if (token) {
          await savePushToken(token);
        }
      } catch (error) {
        console.log("❌ Erro no setupNotifications:", error);
      }
    }

    // 🔔 quando recebe
    const receivedListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("🔔 Notificação recebida:", notification);

        const data = notification.request.content.data;
        console.log("📦 data da notificação:", data);
      }
    );

    // 👆 quando toca
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Tocou na notificação:", response);

        const data = response.notification.request.content.data;
        console.log("📦 data ao tocar:", data);

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