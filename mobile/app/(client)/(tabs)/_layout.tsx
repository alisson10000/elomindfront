import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { registerForPushNotificationsAsync } from "../../../lib/push-notifications";
import { savePushToken } from "@/lib/push-token-api";

export default function ClientTabsLayout() {
  useEffect(() => {
    async function setupPushToken() {
      try {
        console.log("🔔 Iniciando setupPushToken");

        const token = await registerForPushNotificationsAsync();
        console.log("🔔 Token recebido:", token);

        if (!token) {
          console.log("⚠️ Push ignorado (Expo Go ou erro)");
          return;
        }

        await savePushToken(token, Platform.OS);
        console.log("✅ Push token salvo");
      } catch (error: any) {
        console.log("❌ Erro push:", error?.message || error);
      }
    }

    setupPushToken();
  }, []);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="client-home"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}