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

import { useColorScheme } from "@/hooks/use-color-scheme";
import { getTherapistReflectionsStyles } from "@/styles/therapist/reflections/reflections.styles";
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
  const styles = getTherapistReflectionsStyles(colorScheme);

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
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable
          onPress={goBackSafe}
          hitSlop={16}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.title}>Reflexões Pendentes</Text>
          <Text style={styles.subtitle}>Itens sem feedback aprovado</Text>
        </View>
      </View>

      <View style={styles.content}>
        {loading && items.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Carregando reflexões...</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={load} />
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => openDetail(item)}
                style={styles.card}
              >
                <Text style={styles.clientName}>{item.client_name}</Text>

                <Text numberOfLines={2} style={styles.reflectionText}>
                  {item.feeling_after_session}
                </Text>

                <Text style={styles.dateText}>
                  {formatDate(item.created_at)}
                </Text>

                <Text style={styles.openDetailText}>Abrir detalhe →</Text>
              </Pressable>
            )}
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
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