import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
<<<<<<< HEAD
import { validateInvitationToken } from "@/lib/services/invitation-service";
import { makeStyles } from "@/styles/auth/invite-code.styles";
=======
import { api } from "@/lib/api";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function InviteCodeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
  const styles = makeStyles(theme);
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  function goBackSafe() {
    if (router.canGoBack()) router.back();
    else router.replace("/(auth)/login");
  }

  async function handleValidate() {
    const cleanCode = code.trim();

    if (!cleanCode) {
      Alert.alert("Código vazio", "Digite o código que chegou no e-mail.");
      return;
    }

    try {
      setLoading(true);

<<<<<<< HEAD
      const res = await validateInvitationToken({ token: cleanCode });
      const email = res?.email ?? "";

      router.push({
        pathname: "/(auth)/invite-signup",
        params: { code: cleanCode, email },
      });
=======
      // ✅ IMPORTANTE: seu backend espera query param "token" (não "code")
      const res = await api.get("/invitations/validate", {
        params: { token: cleanCode },
      });

      const email = res?.data?.email ?? "";

      router.push({
        pathname: "/(auth)/invite-signup",
        // No app mantemos o nome "code" porque faz sentido pro usuário,
        // mas no backend isso é o "token" do convite
        params: { code: cleanCode, email },
      } as any);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Código inválido ou expirado.";

      Alert.alert("Não validou", String(detail));
    } finally {
      setLoading(false);
    }
  }

  return (
<<<<<<< HEAD
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable
              onPress={goBackSafe}
              disabled={loading}
              style={[
                styles.backButton,
                loading && styles.backButtonDisabled,
              ]}
            >
              <Text style={styles.backButtonText}>← voltar</Text>
            </Pressable>

            <Text style={styles.title}>Código do convite</Text>
          </View>

          <Text style={styles.subtitle}>
            Digite o código que você recebeu no e-mail para continuar o cadastro.
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>Código</Text>
=======
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ flex: 1, padding: 24 }}>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <Pressable
              onPress={goBackSafe}
              disabled={loading}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.card,
                marginRight: 12,
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text style={{ fontWeight: "900", color: theme.text }}>
                ← voltar
              </Text>
            </Pressable>

            <Text style={{ fontSize: 18, fontWeight: "900", color: theme.text }}>
              Código do convite
            </Text>
          </View>

          <Text style={{ color: theme.muted, marginBottom: 18 }}>
            Digite o código que você recebeu no e-mail para continuar o cadastro.
          </Text>

          {/* Card */}
          <View
            style={{
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              borderRadius: 16,
              padding: 16,
              gap: 12,
            }}
          >
            <Text style={{ fontWeight: "800", color: theme.text }}>Código</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Ex: ABCD-1234"
<<<<<<< HEAD
              placeholderTextColor={theme.placeholder}
              autoCapitalize="characters"
              editable={!loading}
              style={styles.input}
=======
              placeholderTextColor={theme.muted}
              autoCapitalize="characters"
              editable={!loading}
              style={{
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.background,
                color: theme.text,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 12,
              }}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            />

            <Pressable
              onPress={handleValidate}
              disabled={loading}
<<<<<<< HEAD
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                loading && styles.primaryButtonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color={theme.primaryText} />
              ) : (
                <Text style={styles.primaryButtonText}>Validar código</Text>
=======
              style={{
                paddingVertical: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.card,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text style={{ fontSize: 16, fontWeight: "900", color: theme.text }}>
                  Validar código
                </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              )}
            </Pressable>

            <Pressable
              onPress={goBackSafe}
              disabled={loading}
<<<<<<< HEAD
              style={[
                styles.secondaryButton,
                loading && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
=======
              style={{
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text style={{ fontWeight: "700", color: theme.muted }}>
                Cancelar
              </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
