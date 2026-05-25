<<<<<<< HEAD
import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

import { logout } from "@/lib/auth";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { makeStyles } from "@/styles/therapist/tabs/profile.styles";
=======
import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { clearToken, getToken } from "../../../lib/token";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function TherapistProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
  const styles = makeStyles(theme);

  async function handleLogout() {
    await logout();
=======

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

>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    router.replace("/(auth)/login");
  }

  return (
<<<<<<< HEAD
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Terapeuta</Text>

      <View style={styles.card}>
        <Text style={styles.description}>
=======
    <View style={{ flex: 1, padding: 24, justifyContent: "center", backgroundColor: theme.background }}>
      <Text style={{ fontSize: 22, fontWeight: "900", marginBottom: 18, color: theme.text, textAlign: "center" }}>
        Perfil do Terapeuta
      </Text>

      <View style={{ borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card, borderRadius: 14, padding: 16 }}>
        <Text style={{ color: theme.muted, textAlign: "center", marginBottom: 12 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          Você pode sair da sua conta a qualquer momento.
        </Text>

        <Pressable
          onPress={handleLogout}
          hitSlop={16}
<<<<<<< HEAD
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
        </Pressable>

        <Text style={styles.footerText}>
          Ao sair, será necessário fazer login novamente.
        </Text>
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      </View>
    </View>
  );
}
