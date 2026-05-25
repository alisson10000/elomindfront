import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { ROUTES } from "@/constants/routes";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { deleteReflection, listMyReflections } from "@/lib/reflections";
import { createStyles } from "@/styles/client/reflections/index.styles";

export default function ReflectionsHistory() {
  const r = useRouter();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = createStyles(theme);

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const data = await listMyReflections();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.log("listMyReflections:", e?.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function goBackSafe() {
    if (r.canGoBack()) r.back();
    else r.replace(ROUTES.client.tabsHome);
  }

  function openDetail(item: any) {
    const id = item?.id;
    if (id === null || id === undefined || String(id).trim() === "") {
      Alert.alert("Erro", "Essa reflexão está sem ID (não dá para abrir).");
      console.log("item sem id:", item);
      return;
    }

    r.push({
      pathname: "/(client)/reflections/[id]",
      params: {
        id: String(id),
        can_delete: String(!!item?.can_delete),
        feeling_after_session: item?.feeling_after_session ?? "",
        what_learned: item?.what_learned ?? "",
        positive_point: item?.positive_point ?? "",
        resistance_or_disagreement: item?.resistance_or_disagreement ?? "",
        created_at: item?.created_at ?? "",
      },
    });
  }

  function confirmDelete(item: any) {
    const id = Number(item?.id);
    if (!Number.isFinite(id)) return;

    Alert.alert("Excluir reflexão", "Tem certeza que deseja excluir esta reflexão?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteReflection(id);
            setItems((prev) => prev.filter((x) => x.id !== id));
          } catch (e: any) {
            console.log("deleteReflection:", e?.message);
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable
          onPress={goBackSafe}
          hitSlop={16}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>← Voltar</Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Minhas Reflexões</Text>
          <Text style={styles.subtitle}>
            Toque em uma reflexão para ver detalhes
          </Text>
        </View>

        <Pressable
          onPress={() => r.push(ROUTES.client.newReflection)}
          hitSlop={16}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>+ Nova</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {loading && items.length === 0 ? (
          <LoadingState
            message="Carregando suas reflexões..."
            style={styles.loadingContainer}
            textStyle={styles.loadingText}
          />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item, index) => String(item?.id ?? index)}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={load} />
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Pressable onPress={() => openDetail(item)}>
                  <Text style={styles.cardTitle}>
                    Reflexão #{String(item?.id ?? "-")}
                  </Text>

                  <Text numberOfLines={2} style={styles.cardDescription}>
                    {String(item?.feeling_after_session ?? "")}
                  </Text>

                  <Text style={styles.cardHint}>
                    Toque para ver detalhes e feedback
                  </Text>
                </Pressable>

                {item?.can_delete ? (
                  <Pressable
                    onPress={() => confirmDelete(item)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </Pressable>
                ) : (
                  <Text style={styles.blockedDeleteText}>
                    Não é possível excluir (feedback aprovado).
                  </Text>
                )}
              </View>
            )}
            ListEmptyComponent={
              !loading ? (
                <EmptyState
                  message="Você ainda não criou nenhuma reflexão."
                  style={styles.emptyContainer}
                  messageStyle={styles.emptyText}
                />
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
