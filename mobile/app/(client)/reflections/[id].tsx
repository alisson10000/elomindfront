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
<<<<<<< HEAD
import { createStyles } from "@/styles/client/reflections/id.styles";
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function ReflectionDetail() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
  const styles = createStyles(theme);
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

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

<<<<<<< HEAD
=======
    // ✅ REGRA: não permitir editar após feedback aprovado
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    if (!canDelete) {
      Alert.alert("Edição bloqueada", "Não é possível editar após feedback aprovado.");
      return;
    }

    r.push({
      pathname: "/(client)/reflections/edit/[id]" as any,
      params: {
        id: String(reflectionId),
<<<<<<< HEAD
        can_edit: String(canDelete),
        feeling_after_session: reflectionData.feeling_after_session ?? "",
        what_learned: reflectionData.what_learned ?? "",
        positive_point: reflectionData.positive_point ?? "",
        resistance_or_disagreement:
          reflectionData.resistance_or_disagreement ?? "",
=======
        can_edit: String(canDelete), // ✅ proteção extra para a tela de edição
        feeling_after_session: reflectionData.feeling_after_session ?? "",
        what_learned: reflectionData.what_learned ?? "",
        positive_point: reflectionData.positive_point ?? "",
        resistance_or_disagreement: reflectionData.resistance_or_disagreement ?? "",
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      },
    } as any);
  }

<<<<<<< HEAD
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

=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  useEffect(() => {
    if (!reflectionId) return;
    loadFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reflectionId]);

<<<<<<< HEAD
  if (!reflectionId) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right"]}
      >
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidTitle}>
=======
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
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.background }}
        edges={["top", "left", "right"]}
      >
        <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
          <Text
            style={{
              color: theme.text,
              fontSize: 16,
              fontWeight: "900",
              marginBottom: 12,
            }}
          >
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            Não consegui abrir essa reflexão (ID inválido).
          </Text>

          <Pressable
            onPress={() => r.replace("/(client)/reflections" as any)}
<<<<<<< HEAD
            style={styles.primaryGhostButton}
          >
            <Text style={styles.primaryGhostButtonText}>
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              Voltar para Minhas Reflexões
            </Text>
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
=======
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
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
        {/* Data */}
        {!!reflectionData.created_at && (
          <Text style={{ color: theme.muted, marginBottom: 12 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            {new Date(reflectionData.created_at).toLocaleString()}
          </Text>
        )}

<<<<<<< HEAD
        <View style={styles.sectionGroup}>
          <Card title="Como você se sentiu após a sessão?">
            <Text style={styles.cardText}>
=======
        {/* Dados da reflexão */}
        <View style={{ gap: 12 }}>
          <Card title="Como você se sentiu após a sessão?">
            <Text style={{ color: theme.text, lineHeight: 20 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              {reflectionData.feeling_after_session || "-"}
            </Text>
          </Card>

          <Card title="O que você aprendeu ou percebeu?">
<<<<<<< HEAD
            <Text style={styles.cardText}>
=======
            <Text style={{ color: theme.text, lineHeight: 20 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              {reflectionData.what_learned || "-"}
            </Text>
          </Card>

          <Card title="Qual ponto positivo você destaca?">
<<<<<<< HEAD
            <Text style={styles.cardText}>
=======
            <Text style={{ color: theme.text, lineHeight: 20 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              {reflectionData.positive_point || "-"}
            </Text>
          </Card>

          {!!reflectionData.resistance_or_disagreement && (
            <Card title="Resistência/discordância">
<<<<<<< HEAD
              <Text style={styles.cardText}>
=======
              <Text style={{ color: theme.text, lineHeight: 20 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                {reflectionData.resistance_or_disagreement}
              </Text>
            </Card>
          )}
        </View>

<<<<<<< HEAD
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
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                  {feedback?.ia_generated_content ?? ""}
                </Text>
              </Card>

              {!!feedback?.ia_neuro_nutrition_tip && (
                <Card title="Dica Neuro Nutrição">
<<<<<<< HEAD
                  <Text style={styles.cardText}>
=======
                  <Text style={{ color: theme.text, lineHeight: 20 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                    {feedback.ia_neuro_nutrition_tip}
                  </Text>
                </Card>
              )}

              {!!feedback?.ia_activity_suggestion && (
                <Card title="Atividade sugerida">
<<<<<<< HEAD
                  <Text style={styles.cardText}>
=======
                  <Text style={{ color: theme.text, lineHeight: 20 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                    {feedback.ia_activity_suggestion}
                  </Text>
                </Card>
              )}
            </View>
          ) : (
            <Card title="Ainda não disponível">
<<<<<<< HEAD
              <Text style={styles.mutedCardText}>
=======
              <Text style={{ color: theme.muted, lineHeight: 20 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                {message ?? "Sem feedback ainda."}
              </Text>
            </Card>
          )}

<<<<<<< HEAD
          <Pressable
            onPress={loadFeedback}
            hitSlop={16}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>Atualizar feedback</Text>
          </Pressable>

=======
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

          {/* ✅ Editar reflexão (somente se permitido) */}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          {canDelete ? (
            <Pressable
              onPress={goToEdit}
              hitSlop={16}
<<<<<<< HEAD
              style={styles.actionButton}
            >
              <Text style={styles.strongActionButtonText}>Editar reflexão</Text>
            </Pressable>
          ) : (
            <Text style={styles.infoTextCenter}>
=======
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
                Editar reflexão
              </Text>
            </Pressable>
          ) : (
            <Text style={{ color: theme.muted, textAlign: "center" }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              Não é possível editar (feedback aprovado).
            </Text>
          )}

          {canDelete ? (
            <Pressable
              onPress={confirmDelete}
              hitSlop={16}
<<<<<<< HEAD
              style={styles.actionButton}
            >
              <Text style={styles.strongActionButtonText}>Excluir reflexão</Text>
            </Pressable>
          ) : (
            <Text style={styles.infoTextCenter}>
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              Não é possível excluir (feedback aprovado).
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
