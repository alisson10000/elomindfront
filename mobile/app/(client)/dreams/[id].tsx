<<<<<<< HEAD
=======
// app/(client)/dreams/[id].tsx
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
<<<<<<< HEAD
import { makeStyles } from "@/styles/client/dreams/dream-detail.styles";
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function DreamCreatedScreen() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
  const styles = makeStyles(theme);
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

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
<<<<<<< HEAD
=======
    // typed routes pode não reconhecer "/(client)".
    // Se seu app abre o client em "/(client)" e o TS reclamar, use "as any".
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    r.replace("/(client)" as any);
  }

  function goNew() {
    r.replace("/(client)/dreams/new" as any);
  }

<<<<<<< HEAD
  if (!id) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.invalidTitle}>
=======
  // Se por algum motivo o ID vier inválido, volta pra home com segurança
  if (!id) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
          <Text
            style={{
              color: theme.text,
              fontSize: 16,
              fontWeight: "900",
              marginBottom: 12,
            }}
          >
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            Não consegui abrir essa confirmação (ID inválido).
          </Text>

          <Pressable
            onPress={goHome}
<<<<<<< HEAD
            style={({ pressed }) => [
              styles.cardButton,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.cardButtonText}>Voltar para Home</Text>
=======
            style={{
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              Voltar para Home
            </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "900",
            color: theme.text,
            marginBottom: 10,
          }}
        >
          Sonho registrado 
        </Text>

        <Text style={{ color: theme.muted, fontSize: 15, marginBottom: 18 }}>
          ID:{" "}
          <Text style={{ color: theme.text, fontWeight: "800" }}>
            {id}
          </Text>
          {!!createdAt ? `\nData: ${createdAt}` : ""}
        </Text>

        <View
          style={{
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
            marginBottom: 14,
          }}
        >
          <Text
            style={{
              color: theme.text,
              fontWeight: "800",
              marginBottom: 6,
            }}
          >
            O que acontece agora?
          </Text>
          <Text style={{ color: theme.muted }}>
            Seu sonho foi enviado e ficará disponível para seu terapeuta organizar e comentar.
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          </Text>
        </View>

        <Pressable
          onPress={goHome}
<<<<<<< HEAD
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Voltar para Home</Text>
        </Pressable>

        <Pressable onPress={goNew} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>
=======
          style={{
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.primary,
            backgroundColor: theme.primary,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "800", color: "#FFFFFF" }}>
            Voltar para Home
          </Text>
        </Pressable>

        <Pressable
          onPress={goNew}
          style={{ padding: 14, alignItems: "center" }}
        >
          <Text style={{ color: theme.muted, fontWeight: "800" }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            Registrar outro sonho
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
