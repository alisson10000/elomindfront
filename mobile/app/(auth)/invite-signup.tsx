import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { api } from "@/lib/api";

export default function InviteSignupScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const params = useLocalSearchParams();

  const code = useMemo(() => {
    const raw = (params as any)?.code;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const email = useMemo(() => {
    const raw = (params as any)?.email;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function goBackSafe() {
    if (router.canGoBack()) router.back();
    else router.replace("/(auth)/login");
  }

  async function handleSignup() {
    const cleanName = name.trim();
    const cleanPass = password.trim();
    const cleanCode = String(code || "").trim();

    if (!cleanCode) {
      Alert.alert("Convite inválido", "Volte e valide o código novamente.");
      router.replace("/(auth)/invite-code");
      return;
    }

    if (!cleanName) {
      Alert.alert("Atenção", "Digite seu nome.");
      return;
    }

    if (cleanPass.length < 6) {
      Alert.alert("Senha fraca", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

      // ⚠️ Seu backend pode esperar "token" ao invés de "code"
      // Como no validate ele pediu token, aqui vamos mandar "token" também.
      await api.post("/invitations/signup", {
        token: cleanCode,
        name: cleanName,
        password: cleanPass,
        email: email || undefined, // se o backend ignorar, ok
      });

      Alert.alert("Conta criada!", "Agora faça login com seu e-mail e senha.");
      router.replace("/(auth)/login");
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Não foi possível criar a conta.";

      Alert.alert("Erro", String(detail));
    } finally {
      setLoading(false);
    }
  }

  // Se entrou aqui sem params, evita tela “vazia”
  if (!code) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "900", color: theme.text, marginBottom: 10 }}>
            Convite inválido
          </Text>
          <Text style={{ color: theme.muted, marginBottom: 16 }}>
            Volte e valide seu código novamente.
          </Text>

          <Pressable
            onPress={() => router.replace("/(auth)/invite-code")}
            style={{
              paddingVertical: 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "900", color: theme.text }}>
              Ir para validar código
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
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
              <Text style={{ fontWeight: "900", color: theme.text }}>← voltar</Text>
            </Pressable>

            <Text style={{ fontSize: 18, fontWeight: "900", color: theme.text }}>
              Criar conta
            </Text>
          </View>

          <Text style={{ color: theme.muted, marginBottom: 18 }}>
            Complete seu cadastro usando o convite.
            {email ? ` (${email})` : ""}
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
            <Text style={{ fontWeight: "800", color: theme.text }}>Nome</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              placeholderTextColor={theme.muted}
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

            <Text style={{ fontWeight: "800", color: theme.text }}>Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Crie uma senha"
              placeholderTextColor={theme.muted}
              secureTextEntry
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
              onPress={handleSignup}
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
                  Criar conta
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => router.replace("/(auth)/login")}
              disabled={loading}
              style={{ paddingVertical: 12, borderRadius: 12, alignItems: "center" }}
            >
              <Text style={{ fontWeight: "700", color: theme.muted }}>
                Já tenho conta (Login)
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
