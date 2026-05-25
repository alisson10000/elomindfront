import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

import { ROUTES } from "@/constants/routes";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { makeStyles } from "@/styles/client/tabs/client-home.styles";

export default function ClientHome() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
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
        Registre suas reflexões e sonhos para seu terapeuta acompanhar.
      </Text>
    </View>
  );
}
