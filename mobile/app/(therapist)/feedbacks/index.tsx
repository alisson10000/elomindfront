// app/(therapist)/invite-client/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { sendInvitation } from "@/lib/invitations";

export default function InviteClientScreen() {
  const r = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function goBackSafe() {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(therapist)/(tabs)/therapist-home" as any);
  }

  async function handleSendInvite() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      Alert.alert("Email inválido", "Digite um e-mail válido.");
      return;
    }

    try {
      setLoading(true);

      await sendInvitation(cleanEmail);

      Alert.alert(
        "Convite enviado!",
        "O cliente receberá um e-mail com o código para criar a conta."
      );

      setEmail("");
      goBackSafe();
    } catch (e: any) {
      const msg = String(e?.message || "");

      if (msg === "NO_TOKEN") {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        r.replace("/(auth)/login" as any);
        return;
      }

      Alert.alert("Erro", "Não foi possível enviar o convite.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingTop: 10,
          paddingBottom: 12,
        }}
      >
        <Pressable
          onPress={goBackSafe}
          disabled={loading}
          hitSlop={18}
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
          <Text style={{ fontWeight: "900", color: theme.text }}>← Voltar</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "900", color: theme.text }}>
            Convidar Cliente
          </Text>
          <Text style={{ color: theme.muted }}>
            Envie um convite por e-mail
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
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
              <Text style={{ fontSize: 16, fontWeight: "900", color: theme.text }}>
                Enviar Convite
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={goBackSafe}
            disabled={loading}
            style={{ paddingVertical: 12, borderRadius: 12, alignItems: "center", opacity: loading ? 0.7 : 1 }}
          >
            <Text style={{ fontWeight: "700", color: theme.muted }}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
