<<<<<<< HEAD
=======
// app/(therapist)/dreams/index.tsx
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { listDreamsByClientForTherapist } from "@/lib/dreams";
<<<<<<< HEAD
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createStyles } from "@/styles/therapist/dreams/index.styles";
=======
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function TherapistDreamsIndex() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
<<<<<<< HEAD
  const styles = createStyles((colorScheme ?? "light") as "light" | "dark");
=======
  const theme = Colors[colorScheme ?? "light"];
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

  const clientId = useMemo(() => {
    const raw = (params as any)?.client_id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function goBackSafe() {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(therapist)/client" as any);
  }

  async function load() {
    if (!clientId) return;

    try {
      setLoading(true);
      setMessage(null);

      const data = await listDreamsByClientForTherapist(clientId);
      setItems(Array.isArray(data) ? data : []);
      if (!data?.length) setMessage("Nenhum sonho registrado ainda.");
    } catch (e: any) {
      console.log("❌ load dreams:", e?.message);
      setItems([]);
      setMessage("Não foi possível carregar os sonhos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  function openDream(d: any) {
    r.push({
      pathname: "/(therapist)/dreams/[id]" as any,
      params: {
        id: String(d.id),
        description: d.description ?? "",
        therapist_tags: d.therapist_tags ?? "",
        therapist_notes: d.therapist_notes ?? "",
        created_at: d.created_at ?? "",
<<<<<<< HEAD
        client_id: String(clientId),
=======
        client_id: String(clientId), // ✅ garante que o detail saiba voltar pra lista
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      },
    } as any);
  }

  function Card({ title, children }: { title: string; children: any }) {
    return (
<<<<<<< HEAD
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
=======
      <View
        style={{
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.card,
        }}
      >
        <Text style={{ color: theme.text, fontWeight: "900", marginBottom: 8 }}>
          {title}
        </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        {children}
      </View>
    );
  }

  if (!clientId) {
    return (
      <SafeAreaView
<<<<<<< HEAD
        style={styles.safeArea}
        edges={["top", "left", "right"]}
      >
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidTitle}>
            Não consegui abrir (client_id inválido).
          </Text>

          <Pressable onPress={goBackSafe} style={styles.invalidButton}>
            <Text style={styles.invalidButtonText}>Voltar</Text>
=======
        style={{ flex: 1, backgroundColor: theme.background }}
        edges={["top", "left", "right"]}
      >
        <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
          <Text style={{ color: theme.text, fontWeight: "900", marginBottom: 12 }}>
            Não consegui abrir (client_id inválido).
          </Text>

          <Pressable
            onPress={goBackSafe}
            style={{
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "800" }}>Voltar</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
<<<<<<< HEAD
      style={styles.safeArea}
      edges={["top", "left", "right"]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={goBackSafe}
          hitSlop={16}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Sonhos do cliente #{clientId}</Text>
          <Text style={styles.headerSubtitle}>Toque para abrir e editar</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : message ? (
          <Card title="Aviso">
            <Text style={styles.cardMutedText}>{message}</Text>
          </Card>
        ) : (
          <View style={styles.listContainer}>
=======
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top", "left", "right"]}
    >
      {/* Header com Voltar */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          backgroundColor: theme.background,
          flexDirection: "row",
          alignItems: "center",
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
            Sonhos do cliente #{clientId}
          </Text>
          <Text style={{ color: theme.muted, marginTop: 2 }}>
            Toque para abrir e editar
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {loading ? (
          <View style={{ paddingTop: 10, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: theme.muted }}>Carregando...</Text>
          </View>
        ) : message ? (
          <Card title="Aviso">
            <Text style={{ color: theme.muted }}>{message}</Text>
          </Card>
        ) : (
          <View style={{ gap: 12 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            {items.map((d) => {
              const hasNotes = !!String(d.therapist_notes ?? "").trim();
              const hasTags = !!String(d.therapist_tags ?? "").trim();

              return (
                <Pressable key={d.id} onPress={() => openDream(d)}>
                  <Card title={`Sonho #${d.id}`}>
<<<<<<< HEAD
                    <Text style={styles.cardMutedText}>
                      {new Date(d.created_at).toLocaleString()}
                    </Text>

                    <Text style={styles.cardDescription}>
=======
                    <Text style={{ color: theme.muted }}>
                      {new Date(d.created_at).toLocaleString()}
                    </Text>

                    <Text style={{ color: theme.text, marginTop: 6, lineHeight: 20 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                      {String(d.description).slice(0, 120)}
                      {String(d.description).length > 120 ? "…" : ""}
                    </Text>

                    {hasTags ? (
<<<<<<< HEAD
                      <Text style={styles.cardTags}>
=======
                      <Text style={{ color: theme.muted, marginTop: 10 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                        Tags: {d.therapist_tags}
                      </Text>
                    ) : null}

                    {hasNotes ? (
<<<<<<< HEAD
                      <Text style={styles.cardNotes}>📝 Possui notas</Text>
=======
                      <Text style={{ color: theme.muted, marginTop: 6 }}>
                        📝 Possui notas
                      </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                    ) : null}
                  </Card>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
