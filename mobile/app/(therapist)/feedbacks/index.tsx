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
import { listClients } from "../../../lib/users";

type Client = {
  id: number;
  name: string;
  email: string;
  role: "client";
  is_active: boolean;
};

export default function TherapistFeedbackClientsScreen() {
  const r = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [items, setItems] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const data = await listClients();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.log("❌ listClients:", e?.message);
      setItems([]);
      Alert.alert("Erro", "Não foi possível carregar os clientes.");
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
            Feedbacks já dados
          </Text>
          <Text style={{ color: theme.muted, marginTop: 2 }}>
            Selecione um cliente para ver os feedbacks
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        {loading && items.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: theme.muted }}>Carregando...</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => r.push(`/(therapist)/feedbacks/${item.id}` as any)}
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
                  {item.name}
                </Text>
                <Text style={{ color: theme.muted, marginTop: 4 }}>{item.email}</Text>

                <Text style={{ color: theme.muted, marginTop: 8 }}>
                  {item.is_active ? "Ativo" : "Inativo"}
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              !loading ? (
                <View style={{ paddingTop: 18 }}>
                  <Text style={{ color: theme.muted }}>Nenhum cliente encontrado.</Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
