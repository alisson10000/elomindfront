import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { clearToken, getToken } from "../../../lib/token";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { makeStyles } from "@/styles/client/tabs/profile.styles";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = makeStyles(theme);

  useEffect(() => {
    console.log("✅ PROFILE ABRIU (mount)");
  }, []);

  async function handleLogout() {
    console.log("🚪 CLICOU EM SAIR");

    const before = await getToken();
    console.log("🔍 Token ANTES:", before ? "TEM ✅" : "NÃO ❌");

    await clearToken();
    await AsyncStorage.removeItem("user_role");

    const after = await getToken();
    const role = await AsyncStorage.getItem("user_role");
    console.log("🧪 Token DEPOIS:", after ? "TEM ✅" : "NÃO ❌");
    console.log("🧪 Role DEPOIS:", role);

    router.replace("/(auth)/login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

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
      </View>

      <Text style={styles.footerText}>
        EloMind — cuide de você com consistência.
      </Text>
    </View>
  );
}