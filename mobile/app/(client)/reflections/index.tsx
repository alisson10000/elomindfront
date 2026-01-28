import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { listMyReflections, deleteReflection } from "../../../lib/reflections";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function ReflectionsHistory() {
  const r = useRouter();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const data = await listMyReflections();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.log("❌ listMyReflections:", e?.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function goBackSafe() {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(client)/(tabs)/client-home" as any);
  }

  function openDetail(item: any) {
    const id = item?.id;
    if (id === null || id === undefined || String(id).trim() === "") {
      Alert.alert("Erro", "Essa reflexão está sem ID (não dá para abrir).");
      console.log("❌ item sem id:", item);
      return;
    }
    // passa também can_delete e os textos pra tela [id] conseguir mostrar sem endpoint extra
    r.push({
      pathname: "/(client)/reflections/[id]" as any,
      params: {
        id: String(id),
        can_delete: String(!!item?.can_delete),
        feeling_after_session: item?.feeling_after_session ?? "",
        what_learned: item?.what_learned ?? "",
        positive_point: item?.positive_point ?? "",
        resistance_or_disagreement: item?.resistance_or_disagreement ?? "",
        created_at: item?.created_at ?? "",
      },
    } as any);
  }

  function confirmDelete(item: any) {
    const id = Number(item?.id);
    if (!Number.isFinite(id)) return;

    Alert.alert(
      "Excluir reflexão",
      "Tem certeza que deseja excluir esta reflexão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReflection(id);
              setItems((prev) => prev.filter((x) => x.id !== id));
            } catch (e: any) {
              console.log("❌ deleteReflection:", e?.message);
              Alert.alert("Erro", "Não foi possível excluir.");
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top", "left", "right"]}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 12,
          paddingTop: 8,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: theme.background,
          gap: 12,
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
            Minhas Reflexões
          </Text>
          <Text style={{ color: theme.muted, marginTop: 2 }}>
            Toque em uma reflexão para ver detalhes
          </Text>
        </View>

        <Pressable
          onPress={() => r.push("/(client)/reflections/new" as any)}
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
          <Text style={{ color: theme.text, fontWeight: "900" }}>+ Nova</Text>
        </Pressable>
      </View>

      {/* Conteúdo */}
      <View style={{ flex: 1, padding: 16 }}>
        {loading && items.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: theme.muted }}>
              Carregando suas reflexões...
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item, index) => String(item?.id ?? index)}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 14,
                  borderWidth: 1,
                  borderRadius: 14,
                  marginBottom: 10,
                  borderColor: theme.border,
                  backgroundColor: theme.card,
                }}
              >
                <Pressable onPress={() => openDetail(item)}>
                  <Text style={{ fontWeight: "900", color: theme.text }}>
                    Reflexão #{String(item?.id ?? "-")}
                  </Text>

                  <Text numberOfLines={2} style={{ marginTop: 6, color: theme.text }}>
                    {String(item?.feeling_after_session ?? "")}
                  </Text>

                  <Text style={{ marginTop: 6, color: theme.muted }}>
                    Toque para ver detalhes e feedback
                  </Text>
                </Pressable>

                {item?.can_delete ? (
                  <Pressable
                    onPress={() => confirmDelete(item)}
                    style={{
                      marginTop: 12,
                      paddingVertical: 10,
                      borderRadius: 12,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                    }}
                  >
                    <Text style={{ color: theme.text, fontWeight: "900" }}>Excluir</Text>
                  </Pressable>
                ) : (
                  <Text style={{ marginTop: 10, color: theme.muted }}>
                    Não é possível excluir (feedback aprovado).
                  </Text>
                )}
              </View>
            )}
            ListEmptyComponent={
              !loading ? (
                <View style={{ paddingTop: 18 }}>
                  <Text style={{ color: theme.muted }}>
                    Você ainda não criou nenhuma reflexão.
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
