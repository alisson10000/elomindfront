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

<<<<<<< HEAD
import { ROUTES } from "@/constants/routes";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { listClients, setClientActive } from "../../../lib/users";
import { createStyles } from "@/styles/therapist/client/clients.styles";
=======
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { listClients, setClientActive } from "../../../lib/users";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

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
<<<<<<< HEAD
  const styles = createStyles((colorScheme ?? "light") as "light" | "dark");
=======
  const theme = Colors[colorScheme ?? "light"];
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

  const [items, setItems] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      const data = await listClients();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
<<<<<<< HEAD
      console.log("listClients:", e?.message);
=======
      console.log("❌ listClients:", e?.message);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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

<<<<<<< HEAD
=======
    // atualização otimista
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    setItems((prev) =>
      prev.map((c) => (c.id === item.id ? { ...c, is_active: next } : c))
    );

    try {
      await setClientActive(item.id, next);
    } catch (e: any) {
<<<<<<< HEAD
      console.log("setClientActive:", e?.message);

=======
      console.log("❌ setClientActive:", e?.message);

      // rollback
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      setItems((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, is_active: !next } : c))
      );

      Alert.alert("Erro", "Não foi possível atualizar o status do cliente.");
    }
  }

  function goBackSafe() {
<<<<<<< HEAD
    if (r.canGoBack()) r.back();
    else r.replace(ROUTES.therapist.tabsHome);
  }

  function StatusPill({ active }: { active: boolean }) {
    return (
      <View style={active ? styles.statusPillActive : styles.statusPillInactive}>
        <Text style={active ? styles.statusTextActive : styles.statusTextInactive}>
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          {active ? "Ativo" : "Inativo"}
        </Text>
      </View>
    );
  }

  return (
<<<<<<< HEAD
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable onPress={goBackSafe} hitSlop={16} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Meus Clientes</Text>
          <Text style={styles.headerSubtitle}>
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            Ative/desative o acesso e gerencie a anamnese
          </Text>
        </View>
      </View>

<<<<<<< HEAD
      <View style={styles.content}>
        {loading && items.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Carregando clientes...</Text>
=======
      {/* Conteúdo */}
      <View style={{ flex: 1, padding: 16 }}>
        {loading && items.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: theme.muted }}>
              Carregando clientes...
            </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
<<<<<<< HEAD
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
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                    </View>

                    <StatusPill active={isActive} />
                  </View>

<<<<<<< HEAD
                  <View style={styles.actions}>
                    <Pressable
                      onPress={() =>
                        r.push({
                          pathname: ROUTES.therapist.dreams,
                          params: { client_id: String(item.id) },
                        })
                      }
                      hitSlop={16}
                      style={[
                        styles.defaultActionButton,
                        loading && styles.defaultActionButtonDisabled,
                      ]}
                    >
                      <Text style={styles.defaultActionButtonText}>Sonhos</Text>
                    </Pressable>

                    <Pressable
                      onPress={() =>
                        r.push({
                          pathname: "/(therapist)/anamnesis/[id]",
                          params: { id: String(item.id) },
                        })
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
                          pathname: ROUTES.therapist.deleteClientLgpd,
                          params: {
                            client_id: String(item.id),
                            client_name: item.name,
                          },
                        })
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
=======
                  {/* ✅ Ações */}
                  <View style={{ marginTop: 12, gap: 10 }}>
                    {/* ✅ NOVO: Sonhos (por cliente) */}
<Pressable
  onPress={() => r.push(`/(therapist)/dreams?client_id=${item.id}` as any)}
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
    Sonhos
  </Text>
</Pressable>

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
  style={{
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.danger,
    backgroundColor: theme.card,
    opacity: loading ? 0.7 : 1,
  }}
>
  <Text style={{ color: theme.danger, fontWeight: "900" }}>
    LGPD — Excluir dados
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                        {btnLabel}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              !loading ? (
<<<<<<< HEAD
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Nenhum cliente encontrado.</Text>
=======
                <View style={{ paddingTop: 18 }}>
                  <Text style={{ color: theme.muted }}>
                    Nenhum cliente encontrado.
                  </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
