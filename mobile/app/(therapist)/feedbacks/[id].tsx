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

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { listFeedbacksByClient, type FeedbackListItem } from "../../../lib/feedback";

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
  const theme = Colors[colorScheme ?? "light"];

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
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
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
        </View>
      </View>

      {/* Conteúdo */}
      <View style={{ flex: 1, padding: 16 }}>
        {loading && items.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: theme.muted }}>Carregando...</Text>
          </View>
        ) : (
          <FlatList
            data={items}
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

              const date = item.approved_at ?? item.created_at;

              return (
                <Pressable
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
                </Pressable>
              );
            }}
            ListEmptyComponent={
              !loading ? (
                <View style={{ paddingTop: 18 }}>
                  <Text style={{ color: theme.muted }}>
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
