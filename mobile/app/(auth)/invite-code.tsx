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

export default function InviteCodeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

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

            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Ex: ABCD-1234"
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
            />

            <Pressable
              onPress={handleValidate}
              disabled={loading}
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
              )}
            </Pressable>

            <Pressable
              onPress={goBackSafe}
              disabled={loading}
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
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
