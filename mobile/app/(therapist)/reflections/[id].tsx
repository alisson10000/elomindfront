import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getTherapistReflectionDetail } from "../../../lib/reflections";

type ReflectionDetail = {
  id: number;
  client_id: number;
  client_name: string;
  feeling_after_session: string;
  what_learned: string;
  positive_point: string;
  resistance_or_disagreement?: string | null;
  created_at: string;
};

export default function TherapistReflectionDetail() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const reflectionId = useMemo(() => {
    const raw = (params as any)?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReflectionDetail | null>(null);

  function goBackSafe() {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(therapist)/reflections" as any);
  }

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  }

  async function load() {
    if (!reflectionId) return;

    try {
      setLoading(true);
      const res = await getTherapistReflectionDetail(reflectionId);
      setData(res ?? null);
    } catch (e: any) {
      console.log("❌ getTherapistReflectionDetail:", e?.message);
      setData(null);
      Alert.alert("Erro", "Não foi possível carregar os detalhes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reflectionId]);

  function Card({ title, children }: { title: string; children: any }) {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.card,
          borderRadius: 14,
          padding: 14,
        }}
      >
        <Text style={{ color: theme.text, fontWeight: "900", marginBottom: 8 }}>
          {title}
        </Text>
        {children}
      </View>
    );
  }

  if (!reflectionId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top", "left", "right"]}>
        <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900", marginBottom: 10 }}>
            Não consegui abrir essa reflexão (ID inválido).
          </Text>

          <Pressable
            onPress={() => r.replace("/(therapist)/reflections" as any)}
            hitSlop={16}
            style={{
              paddingVertical: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "900" }}>
              Voltar para Pendentes
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
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
          backgroundColor: theme.background,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Pressable
          onPress={goBackSafe}
          hitSlop={18}
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
            Reflexão #{reflectionId}
          </Text>
          <Text style={{ color: theme.muted, marginTop: 2 }}>
            Detalhe para análise do terapeuta
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {loading && !data ? (
          <View style={{ paddingTop: 30, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: theme.muted }}>
              Carregando detalhes...
            </Text>
          </View>
        ) : data ? (
          <View style={{ gap: 12 }}>
            <Text style={{ color: theme.muted }}>
              Cliente: <Text style={{ color: theme.text, fontWeight: "900" }}>{data.client_name}</Text>
            </Text>

            <Text style={{ color: theme.muted }}>
              {formatDate(data.created_at)}
            </Text>

            <Card title="Como o cliente se sentiu após a sessão?">
              <Text style={{ color: theme.text, lineHeight: 20 }}>
                {data.feeling_after_session}
              </Text>
            </Card>

            <Card title="O que ele(a) aprendeu ou percebeu?">
              <Text style={{ color: theme.text, lineHeight: 20 }}>
                {data.what_learned}
              </Text>
            </Card>

            <Card title="Ponto positivo">
              <Text style={{ color: theme.text, lineHeight: 20 }}>
                {data.positive_point}
              </Text>
            </Card>

            {!!data.resistance_or_disagreement && (
              <Card title="Resistência/discordância">
                <Text style={{ color: theme.text, lineHeight: 20 }}>
                  {data.resistance_or_disagreement}
                </Text>
              </Card>
            )}

            {/* Próximo passo: gerar/aprovar feedback */}
            <Card title="Feedback (próximo passo)">
              <Text style={{ color: theme.muted, lineHeight: 20 }}>
                Aqui vamos adicionar: gerar feedback por IA e aprovar/publicar para o cliente.
              </Text>
            </Card>
          </View>
        ) : (
          <Card title="Não encontrado">
            <Text style={{ color: theme.muted, lineHeight: 20 }}>
              Não encontrei os detalhes dessa reflexão.
            </Text>
          </Card>
        )}

        <Pressable
          onPress={load}
          hitSlop={16}
          style={{
            marginTop: 16,
            paddingVertical: 12,
            borderRadius: 12,
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
          }}
        >
          <Text style={{ color: theme.text, fontWeight: "900" }}>Atualizar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
