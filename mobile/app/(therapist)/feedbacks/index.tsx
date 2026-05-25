import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ROUTES } from "@/constants/routes";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { listFeedbacksByClient } from "@/lib/feedback";
import { listClients } from "@/lib/services/user-service";
import type { ClientSummary } from "@/lib/types/user";
import { createStyles } from "@/styles/therapist/feedbacks/index.styles";

type ClientWithFeedback = ClientSummary & {
  feedbackCount: number;
};

export default function TherapistFeedbacksIndexScreen() {
  const r = useRouter();
  const colorScheme = useColorScheme();
  const styles = createStyles((colorScheme ?? "light") as "light" | "dark");

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<ClientWithFeedback[]>([]);

  const goBackSafe = useCallback(() => {
    if (r.canGoBack()) r.back();
    else r.replace(ROUTES.therapist.tabsHome);
  }, [r]);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const baseClients = await listClients();
      const results: ClientWithFeedback[] = [];

      for (const client of baseClients) {
        try {
          const arr = await listFeedbacksByClient(client.id);
          const count = Array.isArray(arr) ? arr.length : 0;

          if (count > 0) {
            results.push({ ...client, feedbackCount: count });
          }
        } catch (error: any) {
          console.log(
            "Erro contando feedbacks do cliente",
            client.id,
            error?.message
          );
        }
      }

      results.sort((a, b) => b.feedbackCount - a.feedbackCount);
      setClients(results);
    } catch (error: any) {
      if (error?.message === "NO_TOKEN") {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        r.replace(ROUTES.auth.login);
        return;
      }

      console.log("feedbacks/index load:", error?.message);
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
    return clients.length > 0
      ? "Selecione um cliente"
      : "Nenhum feedback encontrado";
  }, [loading, clients.length]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable onPress={goBackSafe} hitSlop={16} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Feedbacks já dados</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>

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
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={load} />
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const title = item.name?.trim() || `Cliente #${item.id}`;

              return (
                <Pressable
                  onPress={() =>
                    r.push({
                      pathname: "/(therapist)/feedbacks/[id]",
                      params: { id: String(item.id) },
                    })
                  }
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
