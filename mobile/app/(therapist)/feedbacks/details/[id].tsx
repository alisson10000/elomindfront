import { useCallback, useEffect, useMemo, useState } from "react";
<<<<<<< HEAD
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
=======
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { getTherapistReflectionDetail, type ReflectionDetail } from "../../../../lib/reflections";
import { getTherapistFeedbackByReflection, type FeedbackOut } from "../../../../lib/feedback";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

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
<<<<<<< HEAD
  const styles = createStyles((colorScheme ?? "light") as "light" | "dark");
=======
  const theme = Colors[colorScheme ?? "light"];
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

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
<<<<<<< HEAD
=======
        // ⚠️ se seu backend não tem /therapist/reflections/:id, ajuste no lib/reflections.ts
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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
<<<<<<< HEAD
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right"]}
      >
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidText}>ID da reflexão inválido.</Text>

          <Pressable onPress={goBackSafe} style={styles.invalidButton}>
            <Text style={styles.invalidButtonText}>← Voltar</Text>
=======
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top","left","right"]}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
          <Text style={{ color: theme.text, fontWeight: "900", textAlign: "center" }}>
            ID da reflexão inválido.
          </Text>
          <Pressable
            onPress={goBackSafe}
            style={{
              marginTop: 14,
              paddingVertical: 12,
              paddingHorizontal: 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "900" }}>← Voltar</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={["top","left","right"]}>
      {/* Header */}
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
            Detalhe do Feedback
          </Text>
          <Text style={{ color: theme.muted, marginTop: 2 }}>
            Reflexão #{reflectionId}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {loading && !reflection ? (
          <View style={{ paddingTop: 30, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: theme.muted }}>Carregando...</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          </View>
        ) : (
          <>
            {/* Meta */}
<<<<<<< HEAD
            <View style={styles.card}>
              <Text style={styles.metaText}>
                Cliente:{" "}
                <Text style={styles.metaStrong}>
=======
            <View style={{ borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card, borderRadius: 14, padding: 14 }}>
              <Text style={{ color: theme.muted }}>
                Cliente:{" "}
                <Text style={{ color: theme.text, fontWeight: "900" }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                  {reflection?.client_name ?? `#${reflection?.client_id ?? "—"}`}
                </Text>
              </Text>

<<<<<<< HEAD
              <Text style={[styles.metaText, styles.spacingTop6]}>
                Enviada em:{" "}
                <Text style={styles.metaStrong}>
=======
              <Text style={{ color: theme.muted, marginTop: 6 }}>
                Enviada em:{" "}
                <Text style={{ color: theme.text, fontWeight: "900" }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                  {formatDate(reflection?.created_at)}
                </Text>
              </Text>

<<<<<<< HEAD
              <Text style={[styles.metaText, styles.spacingTop6]}>
                Status do feedback:{" "}
                <Text style={styles.metaStrong}>
=======
              <Text style={{ color: theme.muted, marginTop: 6 }}>
                Status do feedback:{" "}
                <Text style={{ color: theme.text, fontWeight: "900" }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                  {statusLabel(feedback?.status ?? "—")}
                </Text>
              </Text>
            </View>

            {/* Perguntas */}
<<<<<<< HEAD
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
=======
            <View style={{ borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card, borderRadius: 14, padding: 14 }}>
              <Text style={{ color: theme.text, fontWeight: "900" }}>Como se sentiu após a sessão?</Text>
              <Text style={{ color: theme.muted, marginTop: 8 }}>{reflection?.feeling_after_session ?? "—"}</Text>
            </View>

            <View style={{ borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card, borderRadius: 14, padding: 14 }}>
              <Text style={{ color: theme.text, fontWeight: "900" }}>O que aprendeu ou percebeu?</Text>
              <Text style={{ color: theme.muted, marginTop: 8 }}>{reflection?.what_learned ?? "—"}</Text>
            </View>

            <View style={{ borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card, borderRadius: 14, padding: 14 }}>
              <Text style={{ color: theme.text, fontWeight: "900" }}>Ponto positivo</Text>
              <Text style={{ color: theme.muted, marginTop: 8 }}>{reflection?.positive_point ?? "—"}</Text>
            </View>

            {!!reflection?.resistance_or_disagreement && (
              <View style={{ borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card, borderRadius: 14, padding: 14 }}>
                <Text style={{ color: theme.text, fontWeight: "900" }}>Resistência / discordância</Text>
                <Text style={{ color: theme.muted, marginTop: 8 }}>{reflection.resistance_or_disagreement}</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              </View>
            )}

            {/* Feedback */}
<<<<<<< HEAD
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Feedback dado</Text>

              <Text style={styles.sectionContent}>
=======
            <View style={{ borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card, borderRadius: 14, padding: 14 }}>
              <Text style={{ color: theme.text, fontWeight: "900" }}>Feedback dado</Text>

              <Text style={{ color: theme.muted, marginTop: 8 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                {feedback?.ia_generated_content ?? "—"}
              </Text>

              {!!feedback?.ia_neuro_nutrition_tip && (
                <>
<<<<<<< HEAD
                  <Text style={[styles.sectionTitle, styles.spacingTop12]}>
                    Dica (Neuro Nutrição)
                  </Text>
                  <Text style={styles.subSectionContent}>
                    {feedback.ia_neuro_nutrition_tip}
                  </Text>
=======
                  <Text style={{ color: theme.text, fontWeight: "900", marginTop: 12 }}>Dica (Neuro Nutrição)</Text>
                  <Text style={{ color: theme.muted, marginTop: 6 }}>{feedback.ia_neuro_nutrition_tip}</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                </>
              )}

              {!!feedback?.ia_activity_suggestion && (
                <>
<<<<<<< HEAD
                  <Text style={[styles.sectionTitle, styles.spacingTop12]}>
                    Sugestão de atividade
                  </Text>
                  <Text style={styles.subSectionContent}>
                    {feedback.ia_activity_suggestion}
                  </Text>
=======
                  <Text style={{ color: theme.text, fontWeight: "900", marginTop: 12 }}>Sugestão de atividade</Text>
                  <Text style={{ color: theme.muted, marginTop: 6 }}>{feedback.ia_activity_suggestion}</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                </>
              )}

              {!!feedback?.therapist_notes && (
                <>
<<<<<<< HEAD
                  <Text style={[styles.sectionTitle, styles.spacingTop12]}>
                    Notas do terapeuta
                  </Text>
                  <Text style={styles.subSectionContent}>
                    {feedback.therapist_notes}
                  </Text>
=======
                  <Text style={{ color: theme.text, fontWeight: "900", marginTop: 12 }}>Notas do terapeuta</Text>
                  <Text style={{ color: theme.muted, marginTop: 6 }}>{feedback.therapist_notes}</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                </>
              )}
            </View>

            <Pressable
              onPress={load}
              disabled={loading}
<<<<<<< HEAD
              style={[
                styles.refreshButton,
                loading && styles.refreshButtonDisabled,
              ]}
            >
              <Text style={styles.refreshButtonText}>
=======
              style={{
                marginTop: 6,
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                {loading ? "Atualizando..." : "Atualizar"}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
