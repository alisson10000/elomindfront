import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
<<<<<<< HEAD

import { ROUTES } from "@/constants/routes";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { makeStyles } from "@/styles/client/tabs/client-home.styles";
=======
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function ClientHome() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao EloMind</Text>

      <Pressable
        onPress={() => router.push(ROUTES.client.reflections)}
        style={({ pressed }) => [
          styles.cardButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.cardButtonText}>Minhas Reflexões</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push(ROUTES.client.newReflection)}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.primaryButtonText}>Nova Reflexão</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push(ROUTES.client.dreamsNew)}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.primaryButtonText}>Novo Sonho</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push(ROUTES.client.privacy)}
        style={({ pressed }) => [
          styles.cardButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.cardButtonText}>Privacidade (LGPD)</Text>
      </Pressable>

      <Text style={styles.footerText}>
=======

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", backgroundColor: theme.background }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 24, color: theme.text }}>
        Bem-vindo ao EloMind
      </Text>

      <Pressable
        onPress={() => router.push("/(client)/reflections" as any)}
        style={{
          padding: 16, borderRadius: 12, borderWidth: 1,
          borderColor: theme.border, backgroundColor: theme.card,
          marginBottom: 12, alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text }}>
          Minhas Reflexões
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(client)/reflections/new" as any)}
        style={{
          padding: 16, borderRadius: 12, borderWidth: 1,
          borderColor: theme.primary, backgroundColor: theme.primary,
          alignItems: "center", marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>
          Nova Reflexão
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(client)/dreams/new" as any)}
        style={{
          padding: 16, borderRadius: 12, borderWidth: 1,
          borderColor: theme.primary, backgroundColor: theme.primary,
          alignItems: "center", marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>
          Novo Sonho
        </Text>
      </Pressable>

      {/* ✅ Privacidade LGPD */}
      <Pressable
        onPress={() =>
          router.push({ pathname: "/(client)/privacy" as any })
        }
        style={{
          padding: 16, borderRadius: 12, borderWidth: 1,
          borderColor: theme.border, backgroundColor: theme.card,
          alignItems: "center", marginTop: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text }}>
          Privacidade (LGPD)
        </Text>
      </Pressable>

      <Text style={{ marginTop: 14, color: theme.muted, textAlign: "center" }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        Registre suas reflexões e sonhos para seu terapeuta acompanhar.
      </Text>
    </View>
  );
}
