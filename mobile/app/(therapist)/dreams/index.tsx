// app/(therapist)/dreams/index.tsx
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
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TherapistDreamsIndex() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

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
        client_id: String(clientId), // ✅ garante que o detail saiba voltar pra lista
      },
    } as any);
  }

  function Card({ title, children }: { title: string; children: any }) {
    return (
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
        {children}
      </View>
    );
  }

  if (!clientId) {
    return (
      <SafeAreaView
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
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
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
            {items.map((d) => {
              const hasNotes = !!String(d.therapist_notes ?? "").trim();
              const hasTags = !!String(d.therapist_tags ?? "").trim();

              return (
                <Pressable key={d.id} onPress={() => openDream(d)}>
                  <Card title={`Sonho #${d.id}`}>
                    <Text style={{ color: theme.muted }}>
                      {new Date(d.created_at).toLocaleString()}
                    </Text>

                    <Text style={{ color: theme.text, marginTop: 6, lineHeight: 20 }}>
                      {String(d.description).slice(0, 120)}
                      {String(d.description).length > 120 ? "…" : ""}
                    </Text>

                    {hasTags ? (
                      <Text style={{ color: theme.muted, marginTop: 10 }}>
                        Tags: {d.therapist_tags}
                      </Text>
                    ) : null}

                    {hasNotes ? (
                      <Text style={{ color: theme.muted, marginTop: 6 }}>
                        📝 Possui notas
                      </Text>
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
