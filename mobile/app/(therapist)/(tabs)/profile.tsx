import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

import { logout } from "@/lib/auth";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { makeStyles } from "@/styles/therapist/tabs/profile.styles";

export default function TherapistProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = makeStyles(theme);

  async function handleLogout() {
    await logout();
    router.replace("/(auth)/login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do Terapeuta</Text>

      <View style={styles.card}>
        <Text style={styles.description}>
          Você pode sair da sua conta a qualquer momento.
        </Text>

        <Pressable
          onPress={handleLogout}
          hitSlop={16}
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
      </View>
    </View>
  );
}
