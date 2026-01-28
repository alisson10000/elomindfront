import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { clearToken, getToken } from "../../../lib/token";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TherapistProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  useEffect(() => {
    console.log("✅ THERAPIST PROFILE ABRIU (mount)");
  }, []);

  async function handleLogout() {
    console.log("🚪 CLICOU EM SAIR (THERAPIST)");

    const before = await getToken();
    console.log("🔍 Token ANTES:", before ? "TEM ✅" : "NÃO ❌");

    await clearToken();
    await AsyncStorage.removeItem("user_role");

    const after = await getToken();
    console.log("🧪 Token DEPOIS:", after ? "TEM ✅" : "NÃO ❌");

    router.replace("/(auth)/login");
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", backgroundColor: theme.background }}>
      <Text style={{ fontSize: 22, fontWeight: "900", marginBottom: 18, color: theme.text, textAlign: "center" }}>
        Perfil do Terapeuta
      </Text>

      <View style={{ borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card, borderRadius: 14, padding: 16 }}>
        <Text style={{ color: theme.muted, textAlign: "center", marginBottom: 12 }}>
          Você pode sair da sua conta a qualquer momento.
        </Text>

        <Pressable
          onPress={handleLogout}
          hitSlop={16}
          style={{
            paddingVertical: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "900", color: theme.text }}>
            Sair 
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
