// app/(auth)/consent-lgpd.tsx
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ActivityIndicator,
  Switch,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { api } from "@/lib/api";

export default function ConsentLgpdScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!accepted) {
      Alert.alert("Atenção", "Você precisa aceitar para continuar.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/consents", { accepted: true });

      Alert.alert("Obrigado!", "Consentimento registrado.");
      router.replace("/(client)/(tabs)" as any);
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Não foi possível registrar o consentimento.";

      Alert.alert("Erro", String(detail));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "900", color: theme.text, marginBottom: 8 }}>
          Consentimento LGPD
        </Text>

        <Text style={{ color: theme.muted, marginBottom: 18 }}>
          Para usar o EloMind, precisamos do seu consentimento para tratar seus dados.
        </Text>

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
          <Text style={{ color: theme.text, lineHeight: 20 }}>
            • Seus dados (ex.: reflexões, informações de sessão) serão usados para
            apoiar seu acompanhamento terapêutico.
            {"\n\n"}
            • Você pode solicitar acesso, correção e exclusão de dados, conforme a LGPD.
            {"\n\n"}
            • O terapeuta responsável terá acesso às suas respostas e reflexões.
            {"\n\n"}
            • Ao aceitar, você concorda com o tratamento desses dados para fins de
            acompanhamento terapêutico.
          </Text>

          <View
            style={{
              marginTop: 10,
              paddingTop: 10,
              borderTopWidth: 1,
              borderTopColor: theme.border,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "900", color: theme.text }}>
              Eu li e aceito
            </Text>

            <Switch
              value={accepted}
              onValueChange={setAccepted}
              disabled={loading}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </View>

          <Pressable
            onPress={handleContinue}
            disabled={loading}
            style={{
              marginTop: 8,
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
                Continuar
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
