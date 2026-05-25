import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
<<<<<<< HEAD
=======
  ActivityIndicator,
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

<<<<<<< HEAD
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { ROUTES } from "@/constants/routes";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { deleteReflection, listMyReflections } from "@/lib/reflections";
import { createStyles } from "@/styles/client/reflections/index.styles";
=======
import { listMyReflections, deleteReflection } from "../../../lib/reflections";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function ReflectionsHistory() {
  const r = useRouter();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
  const styles = createStyles(theme);
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const data = await listMyReflections();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
<<<<<<< HEAD
      console.log("listMyReflections:", e?.message);
=======
      console.log("❌ listMyReflections:", e?.message);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function goBackSafe() {
<<<<<<< HEAD
    if (r.canGoBack()) r.back();
    else r.replace(ROUTES.client.tabsHome);
=======
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(client)/(tabs)/client-home" as any);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  }

  function openDetail(item: any) {
    const id = item?.id;
    if (id === null || id === undefined || String(id).trim() === "") {
      Alert.alert("Erro", "Essa reflexão está sem ID (não dá para abrir).");
<<<<<<< HEAD
      console.log("item sem id:", item);
      return;
    }

    r.push({
      pathname: "/(client)/reflections/[id]",
=======
      console.log("❌ item sem id:", item);
      return;
    }
    // passa também can_delete e os textos pra tela [id] conseguir mostrar sem endpoint extra
    r.push({
      pathname: "/(client)/reflections/[id]" as any,
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      params: {
        id: String(id),
        can_delete: String(!!item?.can_delete),
        feeling_after_session: item?.feeling_after_session ?? "",
        what_learned: item?.what_learned ?? "",
        positive_point: item?.positive_point ?? "",
        resistance_or_disagreement: item?.resistance_or_disagreement ?? "",
        created_at: item?.created_at ?? "",
      },
<<<<<<< HEAD
    });
=======
    } as any);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  }

  function confirmDelete(item: any) {
    const id = Number(item?.id);
    if (!Number.isFinite(id)) return;

<<<<<<< HEAD
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
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            Toque em uma reflexão para ver detalhes
          </Text>
        </View>

        <Pressable
<<<<<<< HEAD
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
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item, index) => String(item?.id ?? index)}
<<<<<<< HEAD
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
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                    Toque para ver detalhes e feedback
                  </Text>
                </Pressable>

                {item?.can_delete ? (
                  <Pressable
                    onPress={() => confirmDelete(item)}
<<<<<<< HEAD
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Excluir</Text>
                  </Pressable>
                ) : (
                  <Text style={styles.blockedDeleteText}>
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                    Não é possível excluir (feedback aprovado).
                  </Text>
                )}
              </View>
            )}
            ListEmptyComponent={
              !loading ? (
<<<<<<< HEAD
                <EmptyState
                  message="Você ainda não criou nenhuma reflexão."
                  style={styles.emptyContainer}
                  messageStyle={styles.emptyText}
                />
=======
                <View style={{ paddingTop: 18 }}>
                  <Text style={{ color: theme.muted }}>
                    Você ainda não criou nenhuma reflexão.
                  </Text>
                </View>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
