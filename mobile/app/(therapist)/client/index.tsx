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
import { listClients, setClientActive } from "../../../lib/users";

type Client = {
  id: number;
  name: string;
  email: string;
  role: "client";
  is_active: boolean;
};

export default function TherapistClientsScreen() {
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

  async function toggleClient(item: Client) {
    const next = !item.is_active;

    // atualização otimista
    setItems((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, is_active: next } : c))
    );

    try {
      await setClientActive(item.id, next);
    } catch (e: any) {
      console.log("❌ setClientActive:", e?.message);

      // rollback
      setItems((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, is_active: !next } : c))
      );

      Alert.alert("Erro", "Não foi possível atualizar o status do cliente.");
    }
  }

  function goBackSafe() {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(therapist)/(tabs)/therapist-home" as any);
  }

  function StatusPill({ active }: { active: boolean }) {
    const bg = active ? theme.primary : theme.danger;
    const textColor = "#0B1220"; // bom contraste com o verde do EloMind
    const textColorDanger = "#FFFFFF";

    return (
      <View
        style={{
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: active ? theme.primary : theme.danger,
          backgroundColor: bg,
        }}
      >
        <Text
          style={{
            color: active ? textColor : textColorDanger,
            fontWeight: "900",
            fontSize: 12,
          }}
        >
          {active ? "Ativo" : "Inativo"}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top", "left", "right"]}
    >
      {/* Header (agora respeita status bar) */}
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
            Meus Clientes
          </Text>
          <Text style={{ color: theme.muted, marginTop: 2 }}>
            Ative/desative o acesso e gerencie a anamnese
          </Text>
        </View>
      </View>

      {/* Conteúdo */}
      <View style={{ flex: 1, padding: 16 }}>
        {loading && items.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: theme.muted }}>
              Carregando clientes...
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item }) => {
              const isActive = item.is_active;

              // Botão: se está ativo -> mostra "Desativar" em vermelho
              // se está inativo -> mostra "Ativar" em verde
              const btnBg = isActive ? theme.danger : theme.primary;
              const btnBorder = isActive ? theme.danger : theme.primary;
              const btnTextColor = isActive ? "#FFFFFF" : "#0B1220";
              const btnLabel = isActive ? "Desativar" : "Ativar";

              return (
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
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "900", color: theme.text, fontSize: 16 }}>
                        {item.name}
                      </Text>
                      <Text style={{ color: theme.muted, marginTop: 4 }}>
                        {item.email}
                      </Text>
                    </View>

                    <StatusPill active={isActive} />
                  </View>

                  {/* ✅ Ações */}
                  <View style={{ marginTop: 12, gap: 10 }}>
                    {/* ✅ NOVO: Anamnese (por cliente) */}
                    <Pressable
                      onPress={() =>
                        r.push(`/(therapist)/anamnesis/${item.id}` as any)
                      }
                      hitSlop={16}
                      style={{
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: theme.border,
                        backgroundColor: theme.card,
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                      <Text style={{ color: theme.text, fontWeight: "900" }}>
                        Anamnese
                      </Text>
                    </Pressable>

                    {/* Botão Ativar/Desativar */}
                    <Pressable
                      onPress={() => toggleClient(item)}
                      hitSlop={16}
                      style={{
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: btnBorder,
                        backgroundColor: btnBg,
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                      <Text style={{ color: btnTextColor, fontWeight: "900" }}>
                        {btnLabel}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              !loading ? (
                <View style={{ paddingTop: 18 }}>
                  <Text style={{ color: theme.muted }}>
                    Nenhum cliente encontrado.
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
