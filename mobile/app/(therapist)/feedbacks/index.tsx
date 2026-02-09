import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { api } from "@/lib/api";
import { getToken } from "@/lib/token";
import { listFeedbacksByClient } from "@/lib/feedback";

type ClientItem = {
  id: number;
  name?: string | null;
  email?: string | null;
};

type ClientWithFeedback = ClientItem & {
  feedbackCount: number;
};

function pickName(c: any): string | null {
  return (
    c?.name ??
    c?.full_name ??
    c?.client_name ??
    c?.user?.name ??
    c?.user?.full_name ??
    null
  );
}

/**
 * ✅ No seu backend (Swagger) existe GET /users/clients
 * então é daqui que vamos puxar a lista de clientes.
 */
async function fetchClients(token: string): Promise<ClientItem[]> {
  const res = await api.get("/users/clients", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const raw = (res.data?.items ?? res.data) as any;
  const arr = Array.isArray(raw) ? raw : [];

  return arr
    .map((c: any) => ({
      id: Number(c?.id ?? c?.client_id ?? c?.user_id),
      name: pickName(c),
      email: c?.email ?? c?.user?.email ?? null,
    }))
    .filter((x: any) => Number.isFinite(x.id) && x.id > 0);
}

export default function TherapistFeedbacksIndexScreen() {
  console.log("✅ ABRIU: therapist/feedbacks/index");

  const r = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<ClientWithFeedback[]>([]);

  const goBackSafe = useCallback(() => {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(therapist)/(tabs)/therapist-home" as any);
  }, [r]);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const token = await getToken();
      if (!token) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        r.replace("/(auth)/login" as any);
        return;
      }

      // 1) pega clientes (via /users/clients)
      const baseClients = await fetchClients(token);

      console.log("✅ baseClients:", baseClients.length, baseClients.slice(0, 3));

      // 2) filtra só quem tem feedback e calcula a contagem
      const results: ClientWithFeedback[] = [];

      for (const c of baseClients) {
        try {
          console.log("➡️ contando feedbacks do cliente", c.id);

          const arr = await listFeedbacksByClient(c.id);
          const count = Array.isArray(arr) ? arr.length : 0;

          if (count > 0) results.push({ ...c, feedbackCount: count });
        } catch (e: any) {
          // não quebra a tela por causa de 1 cliente
          console.log("⚠️ erro contando feedbacks do cliente", c.id, e?.message);
        }
      }

      // 3) ordena por quantidade (desc)
      results.sort((a, b) => b.feedbackCount - a.feedbackCount);

      setClients(results);
    } catch (e: any) {
      console.log("❌ feedbacks/index load:", e?.message);
      setClients([]);
      Alert.alert("Erro", "Não foi possível carregar os clientes com feedback.");
    } finally {
      setLoading(false);
    }
  }, [r]);

  useEffect(() => {
    load();
  }, [load]);

  const subtitle = useMemo(() => {
    if (loading) return "Carregando...";
    return clients.length > 0 ? "Selecione um cliente" : "Nenhum feedback encontrado";
  }, [loading, clients.length]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          backgroundColor: theme.background,
        }}
      >
        <Pressable
          onPress={goBackSafe}
          hitSlop={16}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
          }}
        >
          <Text style={{ color: theme.text, fontWeight: "900" }}>← Voltar</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900" }}>
            Feedbacks já dados
          </Text>
          <Text style={{ color: theme.muted, marginTop: 2 }}>{subtitle}</Text>
        </View>
      </View>

      {/* Conteúdo */}
      <View style={{ flex: 1, padding: 16 }}>
        {loading && clients.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: theme.muted }}>Carregando...</Text>
          </View>
        ) : (
          <FlatList
            data={clients}
            keyExtractor={(item) => String(item.id)}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => {
              const title = item.name?.trim() || `Cliente #${item.id}`;
              return (
                <Pressable
                  onPress={() => r.push(`/(therapist)/feedbacks/${item.id}` as any)}
                  style={{
                    padding: 14,
                    borderWidth: 1,
                    borderRadius: 14,
                    marginBottom: 10,
                    borderColor: theme.border,
                    backgroundColor: theme.card,
                  }}
                >
                  <Text style={{ color: theme.text, fontWeight: "900", fontSize: 15 }}>
                    {title}
                  </Text>

                  {!!item.email && (
                    <Text style={{ color: theme.muted, marginTop: 4 }}>{item.email}</Text>
                  )}

                  <Text style={{ color: theme.muted, marginTop: 8 }}>
                    {item.feedbackCount} feedback(s)
                  </Text>

                  <Text style={{ color: theme.muted, marginTop: 8, fontWeight: "900" }}>
                    Toque para ver a lista
                  </Text>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              !loading ? (
                <View style={{ paddingTop: 18 }}>
                  <Text style={{ color: theme.muted }}>
                    Nenhum cliente com feedback encontrado.
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
