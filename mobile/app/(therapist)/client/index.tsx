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
import { listClients, setClientActive } from "../../../lib/users";
import { createStyles } from "@/styles/therapist/client/clients.styles";

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
  const styles = createStyles((colorScheme ?? "light") as "light" | "dark");

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
    return (
      <View style={active ? styles.statusPillActive : styles.statusPillInactive}>
        <Text style={active ? styles.statusTextActive : styles.statusTextInactive}>
          {active ? "Ativo" : "Inativo"}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Header (agora respeita status bar) */}
      <View style={styles.header}>
        <Pressable onPress={goBackSafe} hitSlop={16} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Meus Clientes</Text>
          <Text style={styles.headerSubtitle}>
            Ative/desative o acesso e gerencie a anamnese
          </Text>
        </View>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        {loading && items.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Carregando clientes...</Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isActive = item.is_active;
              const btnLabel = isActive ? "Desativar" : "Ativar";

              return (
                <View style={styles.card}>
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.clientName}>{item.name}</Text>
                      <Text style={styles.clientEmail}>{item.email}</Text>
                    </View>

                    <StatusPill active={isActive} />
                  </View>

                  {/* ✅ Ações */}
                  <View style={styles.actions}>
                    {/* ✅ NOVO: Sonhos (por cliente) */}
                    <Pressable
                      onPress={() => r.push(`/(therapist)/dreams?client_id=${item.id}` as any)}
                      hitSlop={16}
                      style={[
                        styles.defaultActionButton,
                        loading && styles.defaultActionButtonDisabled,
                      ]}
                    >
                      <Text style={styles.defaultActionButtonText}>Sonhos</Text>
                    </Pressable>

                    {/* ✅ NOVO: Anamnese (por cliente) */}
                    <Pressable
                      onPress={() =>
                        r.push(`/(therapist)/anamnesis/${item.id}` as any)
                      }
                      hitSlop={16}
                      style={[
                        styles.defaultActionButton,
                        loading && styles.defaultActionButtonDisabled,
                      ]}
                    >
                      <Text style={styles.defaultActionButtonText}>Anamnese</Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        r.push({
                          pathname: "/(therapist)/lgpd/delete-client" as any,
                          params: {
                            client_id: String(item.id),
                            client_name: item.name,
                          },
                        } as any)
                      }
                      hitSlop={16}
                      style={[
                        styles.lgpdButton,
                        loading && styles.defaultActionButtonDisabled,
                      ]}
                    >
                      <Text style={styles.lgpdButtonText}>
                        LGPD — Excluir dados
                      </Text>
                    </Pressable>

                    {/* Botão Ativar/Desativar */}
                    <Pressable
                      onPress={() => toggleClient(item)}
                      hitSlop={16}
                      style={[
                        isActive ? styles.toggleButtonActive : styles.toggleButtonInactive,
                        loading && styles.defaultActionButtonDisabled,
                      ]}
                    >
                      <Text
                        style={
                          isActive
                            ? styles.toggleButtonTextActive
                            : styles.toggleButtonTextInactive
                        }
                      >
                        {btnLabel}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              !loading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}