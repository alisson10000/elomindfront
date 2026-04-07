import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { createStyles } from "@/styles/therapist/feedbacks/detail.styles";

import {
  getTherapistReflectionDetail,
  type ReflectionDetail,
} from "../../../../lib/reflections";
import {
  getTherapistFeedbackByReflection,
  type FeedbackOut,
} from "../../../../lib/feedback";

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso ?? "—";
  }
}

function statusLabel(status?: string | null) {
  const s = String(status ?? "").toLowerCase();
  if (s === "approved") return "Aprovado";
  if (s === "rejected") return "Rejeitado";
  if (s === "pending_approval") return "Pendente";
  return status ?? "—";
}

export default function TherapistFeedbackDetailReadOnly() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const styles = createStyles((colorScheme ?? "light") as "light" | "dark");

  // ✅ aqui [id] = reflectionId
  const reflectionId = useMemo(() => {
    const raw = (params as any)?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState<ReflectionDetail | null>(null);
  const [feedback, setFeedback] = useState<FeedbackOut | null>(null);

  const goBackSafe = useCallback(() => {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(therapist)/(tabs)/therapist-home" as any);
  }, [r]);

  const load = useCallback(async () => {
    if (!reflectionId) return;

    try {
      setLoading(true);

      console.log("✅ detail loading reflectionId:", reflectionId);

      const [rf, fb] = await Promise.all([
        getTherapistReflectionDetail(reflectionId),
        getTherapistFeedbackByReflection(reflectionId),
      ]);

      setReflection(rf);
      setFeedback(fb);

      console.log("✅ detail loaded:", {
        reflectionId,
        reflection_ok: !!rf,
        feedback_ok: !!fb,
        fb_id: fb?.id,
        fb_status: fb?.status,
      });
    } catch (e: any) {
      console.log("❌ detail error:", e?.message);
      setReflection(null);
      setFeedback(null);
      Alert.alert("Erro", "Não foi possível carregar o detalhe do feedback.");
    } finally {
      setLoading(false);
    }
  }, [reflectionId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!reflectionId) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right"]}
      >
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidText}>ID da reflexão inválido.</Text>

          <Pressable onPress={goBackSafe} style={styles.invalidButton}>
            <Text style={styles.invalidButtonText}>← Voltar</Text>
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={goBackSafe}
          hitSlop={16}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Detalhe do Feedback</Text>
          <Text style={styles.headerSubtitle}>Reflexão #{reflectionId}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading && !reflection ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : (
          <>
            {/* Meta */}
            <View style={styles.card}>
              <Text style={styles.metaText}>
                Cliente:{" "}
                <Text style={styles.metaStrong}>
                  {reflection?.client_name ?? `#${reflection?.client_id ?? "—"}`}
                </Text>
              </Text>

              <Text style={[styles.metaText, styles.spacingTop6]}>
                Enviada em:{" "}
                <Text style={styles.metaStrong}>
                  {formatDate(reflection?.created_at)}
                </Text>
              </Text>

              <Text style={[styles.metaText, styles.spacingTop6]}>
                Status do feedback:{" "}
                <Text style={styles.metaStrong}>
                  {statusLabel(feedback?.status ?? "—")}
                </Text>
              </Text>
            </View>

            {/* Perguntas */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                Como se sentiu após a sessão?
              </Text>
              <Text style={styles.sectionContent}>
                {reflection?.feeling_after_session ?? "—"}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>O que aprendeu ou percebeu?</Text>
              <Text style={styles.sectionContent}>
                {reflection?.what_learned ?? "—"}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Ponto positivo</Text>
              <Text style={styles.sectionContent}>
                {reflection?.positive_point ?? "—"}
              </Text>
            </View>

            {!!reflection?.resistance_or_disagreement && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Resistência / discordância</Text>
                <Text style={styles.sectionContent}>
                  {reflection.resistance_or_disagreement}
                </Text>
              </View>
            )}

            {/* Feedback */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Feedback dado</Text>

              <Text style={styles.sectionContent}>
                {feedback?.ia_generated_content ?? "—"}
              </Text>

              {!!feedback?.ia_neuro_nutrition_tip && (
                <>
                  <Text style={[styles.sectionTitle, styles.spacingTop12]}>
                    Dica (Neuro Nutrição)
                  </Text>
                  <Text style={styles.subSectionContent}>
                    {feedback.ia_neuro_nutrition_tip}
                  </Text>
                </>
              )}

              {!!feedback?.ia_activity_suggestion && (
                <>
                  <Text style={[styles.sectionTitle, styles.spacingTop12]}>
                    Sugestão de atividade
                  </Text>
                  <Text style={styles.subSectionContent}>
                    {feedback.ia_activity_suggestion}
                  </Text>
                </>
              )}

              {!!feedback?.therapist_notes && (
                <>
                  <Text style={[styles.sectionTitle, styles.spacingTop12]}>
                    Notas do terapeuta
                  </Text>
                  <Text style={styles.subSectionContent}>
                    {feedback.therapist_notes}
                  </Text>
                </>
              )}
            </View>

            <Pressable
              onPress={load}
              disabled={loading}
              style={[
                styles.refreshButton,
                loading && styles.refreshButtonDisabled,
              ]}
            >
              <Text style={styles.refreshButtonText}>
                {loading ? "Atualizando..." : "Atualizar"}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}