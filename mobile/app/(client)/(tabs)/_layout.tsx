import { Tabs } from "expo-router";
<<<<<<< HEAD
import { useEffect } from "react";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { savePushToken } from "@/lib/push-token-api";
import { registerForPushNotificationsAsync } from "@/lib/push-notifications";

export default function ClientTabsLayout() {
  useEffect(() => {
    async function setupPushToken() {
      try {
        const token = await registerForPushNotificationsAsync();

        if (!token) {
          return;
        }

        await savePushToken(token, Platform.OS);
      } catch (error: any) {
        console.error("Erro push:", error?.message || error);
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
=======

export default function ClientTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="client-home" options={{ title: "Início" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    </Tabs>
  );
}
