import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { makeStyles } from "@/styles/client/dreams/dream-detail.styles";

export default function DreamCreatedScreen() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = makeStyles(theme);

  const id = (() => {
    const raw = (params as any)?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value ? String(value) : null;
  })();

  const createdAt = (() => {
    const raw = (params as any)?.created_at;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value ? String(value) : "";
  })();

  function goHome() {
    r.replace("/(client)" as any);
  }

  function goNew() {
    r.replace("/(client)/dreams/new" as any);
  }

  if (!id) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.invalidTitle}>
            Não consegui abrir essa confirmação (ID inválido).
          </Text>

          <Pressable
            onPress={goHome}
            style={({ pressed }) => [
              styles.cardButton,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.cardButtonText}>Voltar para Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Sonho registrado</Text>

        <Text style={styles.meta}>
          ID: <Text style={styles.metaStrong}>{id}</Text>
          {!!createdAt ? `\nData: ${createdAt}` : ""}
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>O que acontece agora?</Text>
          <Text style={styles.infoText}>
            Seu sonho foi enviado e ficará disponível para seu terapeuta
            organizar e comentar.
          </Text>
        </View>

        <Pressable
          onPress={goHome}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Voltar para Home</Text>
        </Pressable>

        <Pressable onPress={goNew} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
            Registrar outro sonho
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}