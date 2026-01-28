import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { listPendingReflections } from "../../../lib/reflections";

type PendingReflection = {
  id: number;
  client_id: number;
  client_name: string;
  feeling_after_session: string;
  created_at: string;
};

export default function TherapistReflectionsIndex() {
  const r = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [items, setItems] = useState<PendingReflection[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const data = await listPendingReflections();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.log("❌ listPendingReflections:", e?.message);
      setItems([]);
      Alert.alert("Erro", "Não foi possível carregar as reflexões pendentes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function goBackSafe() {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(therapist)/(tabs)/therapist-home" as any);
  }

  function openDetail(item: PendingReflection) {
    // manda o ID via rota dinâmica
    r.push(`/(therapist)/reflections/${item.id}` as any);
  }

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  }

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
            Reflexões Pendentes
          </Text>
          <Text style={{ color: theme.muted, marginTop: 2 }}>
            Itens sem feedback aprovado
          </Text>
        </View>
      </View>

      {/* Conteúdo */}
      <View style={{ flex: 1, padding: 16 }}>
        {loading && items.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: theme.muted }}>
              Carregando reflexões...
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => openDetail(item)}
                style={{
                  padding: 14,
                  borderWidth: 1,
                  borderRadius: 14,
                  marginBottom: 10,
                  borderColor: theme.border,
                  backgroundColor: theme.card,
                }}
              >
                <Text style={{ fontWeight: "900", color: theme.text, fontSize: 16 }}>
                  {item.client_name}
                </Text>

                <Text numberOfLines={2} style={{ marginTop: 6, color: theme.text }}>
                  {item.feeling_after_session}
                </Text>

                <Text style={{ marginTop: 6, color: theme.muted }}>
                  {formatDate(item.created_at)}
                </Text>

                <Text style={{ marginTop: 6, color: theme.primary, fontWeight: "900" }}>
                  Abrir detalhe →
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              !loading ? (
                <View style={{ paddingTop: 18 }}>
                  <Text style={{ color: theme.muted }}>
                    Nenhuma reflexão pendente no momento.
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
