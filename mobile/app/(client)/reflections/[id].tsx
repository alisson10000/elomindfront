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
import { createStyles } from "@/styles/client/reflections/id.styles";

export default function ReflectionDetail() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = createStyles(theme);

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

  function goToEdit() {
    if (!reflectionId) return;

    if (!canDelete) {
      Alert.alert("Edição bloqueada", "Não é possível editar após feedback aprovado.");
      return;
    }

    r.push({
      pathname: "/(client)/reflections/edit/[id]" as any,
      params: {
        id: String(reflectionId),
        can_edit: String(canDelete),
        feeling_after_session: reflectionData.feeling_after_session ?? "",
        what_learned: reflectionData.what_learned ?? "",
        positive_point: reflectionData.positive_point ?? "",
        resistance_or_disagreement:
          reflectionData.resistance_or_disagreement ?? "",
      },
    } as any);
  }

  function Card({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        {children}
      </View>
    );
  }

  useEffect(() => {
    if (!reflectionId) return;
    loadFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reflectionId]);

  if (!reflectionId) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right"]}
      >
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidTitle}>
            Não consegui abrir essa reflexão (ID inválido).
          </Text>

          <Pressable
            onPress={() => r.replace("/(client)/reflections" as any)}
            style={styles.primaryGhostButton}
          >
            <Text style={styles.primaryGhostButtonText}>
              Voltar para Minhas Reflexões
            </Text>
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
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>← Voltar</Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Reflexão #{reflectionId}</Text>
          <Text style={styles.headerSubtitle}>Detalhes e feedback</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!!reflectionData.created_at && (
          <Text style={styles.createdAtText}>
            {new Date(reflectionData.created_at).toLocaleString()}
          </Text>
        )}

        <View style={styles.sectionGroup}>
          <Card title="Como você se sentiu após a sessão?">
            <Text style={styles.cardText}>
              {reflectionData.feeling_after_session || "-"}
            </Text>
          </Card>

          <Card title="O que você aprendeu ou percebeu?">
            <Text style={styles.cardText}>
              {reflectionData.what_learned || "-"}
            </Text>
          </Card>

          <Card title="Qual ponto positivo você destaca?">
            <Text style={styles.cardText}>
              {reflectionData.positive_point || "-"}
            </Text>
          </Card>

          {!!reflectionData.resistance_or_disagreement && (
            <Card title="Resistência/discordância">
              <Text style={styles.cardText}>
                {reflectionData.resistance_or_disagreement}
              </Text>
            </Card>
          )}
        </View>

        <View style={styles.feedbackSection}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator />
              <Text style={styles.loadingText}>Carregando feedback...</Text>
            </View>
          ) : feedback ? (
            <View style={styles.sectionGroup}>
              <Card title="Feedback">
                <Text style={styles.cardText}>
                  {feedback?.ia_generated_content ?? ""}
                </Text>
              </Card>

              {!!feedback?.ia_neuro_nutrition_tip && (
                <Card title="Dica Neuro Nutrição">
                  <Text style={styles.cardText}>
                    {feedback.ia_neuro_nutrition_tip}
                  </Text>
                </Card>
              )}

              {!!feedback?.ia_activity_suggestion && (
                <Card title="Atividade sugerida">
                  <Text style={styles.cardText}>
                    {feedback.ia_activity_suggestion}
                  </Text>
                </Card>
              )}
            </View>
          ) : (
            <Card title="Ainda não disponível">
              <Text style={styles.mutedCardText}>
                {message ?? "Sem feedback ainda."}
              </Text>
            </Card>
          )}

          <Pressable
            onPress={loadFeedback}
            hitSlop={16}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Atualizar feedback</Text>
          </Pressable>

          {canDelete ? (
            <Pressable
              onPress={goToEdit}
              hitSlop={16}
              style={styles.actionButton}
            >
              <Text style={styles.strongActionButtonText}>Editar reflexão</Text>
            </Pressable>
          ) : (
            <Text style={styles.infoTextCenter}>
              Não é possível editar (feedback aprovado).
            </Text>
          )}

          {canDelete ? (
            <Pressable
              onPress={confirmDelete}
              hitSlop={16}
              style={styles.actionButton}
            >
              <Text style={styles.strongActionButtonText}>Excluir reflexão</Text>
            </Pressable>
          ) : (
            <Text style={styles.infoTextCenter}>
              Não é possível excluir (feedback aprovado).
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}