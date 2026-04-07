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
import { useLocalSearchParams, useRouter } from "expo-router";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { createStyles } from "@/styles/therapist/feedbacks/list.styles";

import {
  listFeedbacksByClient,
  type FeedbackListItem,
} from "../../../lib/feedback";

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso ?? "—";
  }
}

function statusLabel(status?: string | null) {
  const s = String(status ?? "").toLowerCase();
  if (s === "approved") return "Aprovado";
  if (s === "rejected") return "Rejeitado";
  if (s === "pending_approval") return "Pendente";
  return status ?? "—";
}

function excerpt(text?: string | null, max = 120) {
  const t = (text ?? "").trim();
  if (!t) return "—";
  return t.length > max ? t.slice(0, max).trim() + "..." : t;
}

export default function TherapistClientFeedbacksScreen() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const styles = createStyles((colorScheme ?? "light") as "light" | "dark");

  // ✅ aqui [id] = clientId
  const clientId = useMemo(() => {
    const raw = (params as any)?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  const [items, setItems] = useState<FeedbackListItem[]>([]);
  const [loading, setLoading] = useState(false);

  const goBackSafe = useCallback(() => {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(therapist)/(tabs)/therapist-home" as any);
  }, [r]);

  const load = useCallback(async () => {
    if (!clientId) return;

    try {
      setLoading(true);

      const arr = await listFeedbacksByClient(clientId);
      setItems(Array.isArray(arr) ? arr : []);

      console.log("✅ feedbacks list screen:", {
        clientId,
        len: Array.isArray(arr) ? arr.length : 0,
        items: (Array.isArray(arr) ? arr : []).map((x) => ({
          fb_id: x.id,
          reflection_id: x.reflection_id,
          status: x.status,
        })),
      });
    } catch (e: any) {
      console.log("❌ listFeedbacksByClient:", e?.message);
      setItems([]);
      Alert.alert("Erro", "Não foi possível carregar os feedbacks desse cliente.");
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  function renderStatusBadge(item: FeedbackListItem) {
    const s = String(item.status ?? "").toLowerCase();
    const isApproved = s === "approved";
    const isRejected = s === "rejected";

    const badgeStyle = isApproved
      ? styles.badgeApproved
      : isRejected
      ? styles.badgeRejected
      : styles.badgePending;

    const badgeTextStyle = isApproved
      ? styles.badgeTextApproved
      : isRejected
      ? styles.badgeTextRejected
      : styles.badgeTextPending;

    return (
      <View style={[styles.badgeBase, badgeStyle]}>
        <Text style={badgeTextStyle}>{statusLabel(item.status)}</Text>
      </View>
    );
  }

  if (!clientId) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right"]}
      >
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidText}>ID do cliente inválido.</Text>

          <Pressable onPress={goBackSafe} style={styles.invalidButton}>
            <Text style={styles.invalidButtonText}>← Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Feedbacks do Cliente</Text>
          <Text style={styles.headerSubtitle}>Cliente #{clientId}</Text>
        </View>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        {loading && items.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => `${item.id}-${item.reflection_id}`}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={load} />
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const date = item.approved_at ?? item.created_at;

              return (
                <Pressable
                  onPress={() =>
                    r.push(`/(therapist)/feedbacks/details/${item.reflection_id}` as any)
                  }
                  style={styles.card}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>
                        Reflexão #{item.reflection_id}
                      </Text>
                      <Text style={styles.cardDate}>{formatDate(date)}</Text>
                    </View>

                    {renderStatusBadge(item)}
                  </View>

                  <Text style={styles.excerptText}>
                    {excerpt(item.ia_generated_content)}
                  </Text>

                  <Text style={styles.hintText}>Toque para abrir o detalhe</Text>
                </Pressable>
              );
            }}
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Nenhum feedback encontrado para este cliente.
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