// app/(therapist)/lgpd/delete-client.tsx
import { useMemo, useState } from "react";
import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { adminExecuteDeletion } from "@/lib/adminDeletion";

export default function DeleteClientLGPD() {
  const r = useRouter();
  const params = useLocalSearchParams();
  const theme = Colors[useColorScheme() ?? "light"];

  const clientId = useMemo(() => {
    const raw = (params as any)?.client_id;
    const v = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  const clientName = String((params as any)?.client_name ?? "");
  const [loading, setLoading] = useState(false);

  function goBackSafe() {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(therapist)/(tabs)/therapist-home" as any);
  }

  function confirm() {
    if (!clientId) return;

    Alert.alert(
      "Executar exclusão (LGPD)",
      `Isso APAGA tudo do cliente${clientName ? ` (${clientName})` : ""}.\n\nNo MVP, essa ação é irreversível. Continuar?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Executar", style: "destructive", onPress: run },
      ]
    );
  }

  async function run() {
    if (!clientId || loading) return;

    try {
      setLoading(true);
      await adminExecuteDeletion(clientId);
      Alert.alert("Concluído", "Exclusão executada com sucesso.");
      goBackSafe();
    } catch (e: any) {
      const msg = e?.response?.data?.detail ?? e?.message ?? "Falha ao executar.";
      Alert.alert("Erro", String(msg));
    } finally {
      setLoading(false);
    }
  }

  if (!clientId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
          <Text style={{ color: theme.text, fontWeight: "900" }}>client_id inválido</Text>
          <Pressable onPress={goBackSafe} style={{ marginTop: 14, padding: 14 }}>
            <Text style={{ color: theme.text }}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top", "left", "right"]}>
      <View style={{
        paddingHorizontal: 16, paddingBottom: 12,
        borderBottomWidth: 1, borderBottomColor: theme.border,
        backgroundColor: theme.background,
        flexDirection: "row", alignItems: "center", gap: 12,
      }}>
        <Pressable onPress={goBackSafe} hitSlop={16} style={{
          paddingVertical: 10, paddingHorizontal: 12,
          borderRadius: 12, borderWidth: 1,
          borderColor: theme.border, backgroundColor: theme.card,
        }}>
          <Text style={{ color: theme.text, fontWeight: "900" }}>← Voltar</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900" }}>
            LGPD — Excluir dados
          </Text>
          <Text style={{ color: theme.muted, marginTop: 2 }}>
            Cliente #{clientId}{clientName ? ` • ${clientName}` : ""}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <View style={{
          padding: 16, borderRadius: 12,
          borderWidth: 1, borderColor: theme.border,
          backgroundColor: theme.card,
        }}>
          <Text style={{ color: theme.text, fontWeight: "900" }}>Atenção</Text>
          <Text style={{ color: theme.muted, marginTop: 8, lineHeight: 18 }}>
            Esta ação executa a exclusão total (reflexões, feedbacks, sonhos, anamnese,
            consents, vínculo terapeuta-cliente e usuário).
          </Text>
        </View>

        <Pressable
          onPress={confirm}
          disabled={loading}
          style={{
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.danger,
            backgroundColor: theme.danger,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={{ color: "#FFF", fontWeight: "900" }}>
              Executar exclusão agora
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
