import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { getFeedbackByReflection, deleteReflection } from "../../../lib/reflections";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function ReflectionDetail() {
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

  const canDelete = useMemo(() => {
    const raw = (params as any)?.can_delete;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return String(value) === "true";
  }, [params]);

  const reflectionData = useMemo(() => {
    const p: any = params;
    const pick = (key: string) => {
      const v = p?.[key];
      return v ? String(Array.isArray(v) ? v[0] : v) : "";
    };

    return {
      created_at: pick("created_at"),
      feeling_after_session: pick("feeling_after_session"),
      what_learned: pick("what_learned"),
      positive_point: pick("positive_point"),
      resistance_or_disagreement: pick("resistance_or_disagreement"),
    };
  }, [params]);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function goBackSafe() {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(client)/reflections" as any);
  }

  async function loadFeedback() {
    if (!reflectionId) return;

    try {
      setLoading(true);
      setMessage(null);

      const data = await getFeedbackByReflection(reflectionId);
      setFeedback(data);
    } catch {
      setFeedback(null);
      setMessage("Feedback ainda não disponível. Aguardando aprovação do terapeuta.");
    } finally {
      setLoading(false);
    }
  }

  function confirmDelete() {
    if (!reflectionId) return;

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
              await deleteReflection(reflectionId);
              r.replace("/(client)/reflections" as any);
            } catch (e: any) {
              console.log("❌ deleteReflection:", e?.message);
              Alert.alert("Erro", "Não foi possível excluir.");
            }
          },
        },
      ]
    );
  }

  useEffect(() => {
    if (!reflectionId) return;
    loadFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reflectionId]);

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

  // ID inválido
  if (!reflectionId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top", "left", "right"]}>
        <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900", marginBottom: 12 }}>
            Não consegui abrir essa reflexão (ID inválido).
          </Text>

          <Pressable
            onPress={() => r.replace("/(client)/reflections" as any)}
            style={{
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              Voltar para Minhas Reflexões
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top", "left", "right"]}>
      {/* Header (mesmo estilo do ClientHome) */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
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
            Reflexão #{reflectionId}
          </Text>
          <Text style={{ color: theme.muted, marginTop: 2 }}>
            Detalhes e feedback
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {/* Dados da reflexão */}
        {!!reflectionData.created_at && (
          <Text style={{ color: theme.muted, marginBottom: 12 }}>
            {new Date(reflectionData.created_at).toLocaleString()}
          </Text>
        )}

        <View style={{ gap: 12 }}>
          <Card title="Como você se sentiu após a sessão?">
            <Text style={{ color: theme.text, lineHeight: 20 }}>
              {reflectionData.feeling_after_session || "-"}
            </Text>
          </Card>

          <Card title="O que você aprendeu ou percebeu?">
            <Text style={{ color: theme.text, lineHeight: 20 }}>
              {reflectionData.what_learned || "-"}
            </Text>
          </Card>

          <Card title="Qual ponto positivo você destaca?">
            <Text style={{ color: theme.text, lineHeight: 20 }}>
              {reflectionData.positive_point || "-"}
            </Text>
          </Card>

          {!!reflectionData.resistance_or_disagreement && (
            <Card title="Resistência/discordância">
              <Text style={{ color: theme.text, lineHeight: 20 }}>
                {reflectionData.resistance_or_disagreement}
              </Text>
            </Card>
          )}
        </View>

        {/* Feedback */}
        <View style={{ marginTop: 18, gap: 12 }}>
          {loading ? (
            <View style={{ paddingTop: 10, alignItems: "center" }}>
              <ActivityIndicator />
              <Text style={{ marginTop: 10, color: theme.muted }}>
                Carregando feedback...
              </Text>
            </View>
          ) : feedback ? (
            <View style={{ gap: 12 }}>
              <Card title="Feedback">
                <Text style={{ color: theme.text, lineHeight: 20 }}>
                  {feedback?.ia_generated_content ?? ""}
                </Text>
              </Card>

              {!!feedback?.ia_neuro_nutrition_tip && (
                <Card title="Dica Neuro Nutrição">
                  <Text style={{ color: theme.text, lineHeight: 20 }}>
                    {feedback.ia_neuro_nutrition_tip}
                  </Text>
                </Card>
              )}

              {!!feedback?.ia_activity_suggestion && (
                <Card title="Atividade sugerida">
                  <Text style={{ color: theme.text, lineHeight: 20 }}>
                    {feedback.ia_activity_suggestion}
                  </Text>
                </Card>
              )}
            </View>
          ) : (
            <Card title="Ainda não disponível">
              <Text style={{ color: theme.muted, lineHeight: 20 }}>
                {message ?? "Sem feedback ainda."}
              </Text>
            </Card>
          )}

          {/* Botões */}
          <Pressable
            onPress={loadFeedback}
            hitSlop={16}
            style={{
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "800" }}>
              Atualizar feedback
            </Text>
          </Pressable>

          {canDelete ? (
            <Pressable
              onPress={confirmDelete}
              hitSlop={16}
              style={{
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.card,
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.text, fontWeight: "900" }}>
                Excluir reflexão
              </Text>
            </Pressable>
          ) : (
            <Text style={{ color: theme.muted, textAlign: "center" }}>
              Não é possível excluir (feedback aprovado).
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
