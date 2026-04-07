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
import { api } from "@/lib/api";
import { makeStyles } from "@/styles/auth/invite-code.styles";

export default function InviteCodeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = makeStyles(theme);

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

      const res = await api.get("/invitations/validate", {
        params: { token: cleanCode },
      });

      const email = res?.data?.email ?? "";

      router.push({
        pathname: "/(auth)/invite-signup",
        params: { code: cleanCode, email },
      } as any);
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

            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Ex: ABCD-1234"
              placeholderTextColor={theme.placeholder}
              autoCapitalize="characters"
              editable={!loading}
              style={styles.input}
            />

            <Pressable
              onPress={handleValidate}
              disabled={loading}
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
              )}
            </Pressable>

            <Pressable
              onPress={goBackSafe}
              disabled={loading}
              style={[
                styles.secondaryButton,
                loading && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}