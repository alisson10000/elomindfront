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
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createStyles } from "@/styles/therapist/dreams/index.styles";

export default function TherapistDreamsIndex() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const styles = createStyles((colorScheme ?? "light") as "light" | "dark");

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
        client_id: String(clientId),
      },
    } as any);
  }

  function Card({ title, children }: { title: string; children: any }) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        {children}
      </View>
    );
  }

  if (!clientId) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right"]}
      >
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidTitle}>
            Não consegui abrir (client_id inválido).
          </Text>

          <Pressable onPress={goBackSafe} style={styles.invalidButton}>
            <Text style={styles.invalidButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
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
            {items.map((d) => {
              const hasNotes = !!String(d.therapist_notes ?? "").trim();
              const hasTags = !!String(d.therapist_tags ?? "").trim();

              return (
                <Pressable key={d.id} onPress={() => openDream(d)}>
                  <Card title={`Sonho #${d.id}`}>
                    <Text style={styles.cardMutedText}>
                      {new Date(d.created_at).toLocaleString()}
                    </Text>

                    <Text style={styles.cardDescription}>
                      {String(d.description).slice(0, 120)}
                      {String(d.description).length > 120 ? "…" : ""}
                    </Text>

                    {hasTags ? (
                      <Text style={styles.cardTags}>
                        Tags: {d.therapist_tags}
                      </Text>
                    ) : null}

                    {hasNotes ? (
                      <Text style={styles.cardNotes}>📝 Possui notas</Text>
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
}