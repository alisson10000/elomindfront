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

import { useColorScheme } from "@/hooks/use-color-scheme";
import { createStyles } from "@/styles/therapist/feedbacks/index.styles";

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
  const styles = createStyles((colorScheme ?? "light") as "light" | "dark");

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
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={goBackSafe}
          hitSlop={16}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Feedbacks já dados</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        {loading && clients.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : (
          <FlatList
            data={clients}
            keyExtractor={(item) => String(item.id)}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const title = item.name?.trim() || `Cliente #${item.id}`;

              return (
                <Pressable
                  onPress={() => r.push(`/(therapist)/feedbacks/${item.id}` as any)}
                  style={styles.card}
                >
                  <Text style={styles.cardTitle}>{title}</Text>

                  {!!item.email && (
                    <Text style={styles.cardEmail}>{item.email}</Text>
                  )}

                  <Text style={styles.cardCount}>
                    {item.feedbackCount} feedback(s)
                  </Text>

                  <Text style={styles.cardHint}>Toque para ver a lista</Text>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
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