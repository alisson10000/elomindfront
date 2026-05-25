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

<<<<<<< HEAD
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createStyles } from "@/styles/therapist/feedbacks/list.styles";

import {
  listFeedbacksByClient,
  type FeedbackListItem,
} from "../../../lib/feedback";
=======
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { listFeedbacksByClient, type FeedbackListItem } from "../../../lib/feedback";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

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
<<<<<<< HEAD
  const styles = createStyles((colorScheme ?? "light") as "light" | "dark");
=======
  const theme = Colors[colorScheme ?? "light"];
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

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

<<<<<<< HEAD
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
=======
  if (!clientId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top", "left", "right"]}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
          <Text style={{ color: theme.text, fontWeight: "900", textAlign: "center" }}>
            ID do cliente inválido.
          </Text>

          <Pressable
            onPress={goBackSafe}
            style={{
              marginTop: 14,
              paddingVertical: 12,
              paddingHorizontal: 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "900" }}>← Voltar</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top", "left", "right"]}>
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
            Feedbacks do Cliente
          </Text>
          <Text style={{ color: theme.muted, marginTop: 2 }}>
            Cliente #{clientId}
          </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        </View>
      </View>

      {/* Conteúdo */}
<<<<<<< HEAD
      <View style={styles.content}>
        {loading && items.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Carregando...</Text>
=======
      <View style={{ flex: 1, padding: 16 }}>
        {loading && items.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: theme.muted }}>Carregando...</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          </View>
        ) : (
          <FlatList
            data={items}
<<<<<<< HEAD
            keyExtractor={(item) => `${item.id}-${item.reflection_id}`}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={load} />
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
=======
            // ✅ evita colisão de key
            keyExtractor={(item) => `${item.id}-${item.reflection_id}`}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => {
              const s = String(item.status ?? "").toLowerCase();
              const isApproved = s === "approved";
              const isRejected = s === "rejected";

              const badgeBg = isApproved ? theme.primary : isRejected ? theme.danger : theme.card;
              const badgeText = isApproved ? "#0B1220" : isRejected ? "#FFFFFF" : theme.text;

>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              const date = item.approved_at ?? item.created_at;

              return (
                <Pressable
<<<<<<< HEAD
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
=======
                  // ✅ aqui abrimos o detalhe por reflectionId
                  onPress={() => r.push(`/(therapist)/feedbacks/details/${item.reflection_id}` as any)}
                  style={{
                    padding: 14,
                    borderWidth: 1,
                    borderRadius: 14,
                    marginBottom: 10,
                    borderColor: theme.border,
                    backgroundColor: theme.card,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.text, fontWeight: "900", fontSize: 15 }}>
                        Reflexão #{item.reflection_id}
                      </Text>
                      <Text style={{ color: theme.muted, marginTop: 4 }}>{formatDate(date)}</Text>
                    </View>

                    <View
                      style={{
                        alignSelf: "flex-start",
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: badgeBg,
                        backgroundColor: badgeBg,
                      }}
                    >
                      <Text style={{ color: badgeText, fontWeight: "900", fontSize: 12 }}>
                        {statusLabel(item.status)}
                      </Text>
                    </View>
                  </View>

                  <Text style={{ color: theme.muted, marginTop: 10 }}>
                    {excerpt(item.ia_generated_content)}
                  </Text>

                  <Text style={{ color: theme.muted, marginTop: 10, fontWeight: "900" }}>
                    Toque para abrir o detalhe
                  </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                </Pressable>
              );
            }}
            ListEmptyComponent={
              !loading ? (
<<<<<<< HEAD
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
=======
                <View style={{ paddingTop: 18 }}>
                  <Text style={{ color: theme.muted }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
