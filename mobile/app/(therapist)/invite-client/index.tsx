// app/(therapist)/invite-client/index.tsx
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
  ScrollView,
} from "react-native";
import { router } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { api } from "@/lib/api";
import { getToken } from "@/lib/token"; // ✅ usa a chave @elomind_token

export default function InviteClientScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function goBackSafe() {
    if (router.canGoBack()) router.back();
    else router.replace("/(therapist)/(tabs)/therapist-home");
  }

  async function handleSendInvite() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      Alert.alert("Email inválido", "Digite um e-mail válido.");
      return;
    }

    try {
      setLoading(true);

      // ✅ pega token do lugar certo
      const token = await getToken();
      if (!token) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        router.replace("/(auth)/login");
        return;
      }

      await api.post(
        "/invitations",
        { email: cleanEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert(
        "Convite enviado!",
        "O cliente receberá um e-mail com o código para criar a conta."
      );

      setEmail("");
      goBackSafe();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Não foi possível enviar o convite.";

      const str = String(msg);

      if (str.includes("Email already registered")) {
        Alert.alert("Já cadastrado", "Esse e-mail já possui usuário.");
      } else if (str.includes("Forbidden")) {
        Alert.alert("Acesso negado", "Somente terapeutas podem enviar convites.");
      } else {
        Alert.alert("Erro", str);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
            marginTop: 10,
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
              marginTop: 4,
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text style={{ fontWeight: "900", color: theme.text }}>
              ← voltar
            </Text>
          </Pressable>

          <Text style={{ fontSize: 18, fontWeight: "900", color: theme.text }}>
            Convidar Cliente
          </Text>
        </View>

        {/* Descrição */}
        <Text style={{ color: theme.muted, marginBottom: 18 }}>
          Digite o e-mail do cliente. Ele receberá um código para criar a conta.
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
          <Text style={{ fontWeight: "800", color: theme.text }}>E-mail</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="cliente@email.com"
            placeholderTextColor={theme.muted}
            autoCapitalize="none"
            keyboardType="email-address"
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
            onPress={handleSendInvite}
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
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "900",
                  color: theme.text,
                }}
              >
                Enviar Convite
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

        <Text style={{ marginTop: 18, color: theme.muted, textAlign: "center" }}>
          EloMind — plataforma de apoio terapêutico
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
