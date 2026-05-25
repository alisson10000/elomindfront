import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

<<<<<<< HEAD
=======
import { Colors } from "@/constants/theme";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
import { useColorScheme } from "@/hooks/use-color-scheme";

import {
  getTherapistReflectionDetail,
  type ReflectionDetail,
} from "../../../lib/reflections";

import {
  generateFeedbackForReflection,
  approveFeedback,
  rejectFeedback,
  type FeedbackOut,
} from "../../../lib/feedback";

<<<<<<< HEAD
import {
  getTherapistReflectionDetailStyles,
  getTherapistReflectionDetailTheme,
} from "../../../styles/therapist/reflections/id.reflections.styles";

=======
import { makeStyles } from "./styles";

// ======================
// Helpers
// ======================
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
function formatDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function statusLabel(status?: string | null) {
  const s = (status ?? "").toLowerCase();
<<<<<<< HEAD

  if (s === "approved") return "Aprovado";
  if (s === "rejected") return "Rejeitado";
  if (s === "pending_approval") return "Pendente (aguardando terapeuta)";

  return status ?? "—";
}

type DetailStyles = ReturnType<typeof getTherapistReflectionDetailStyles>;

function Card({
  styles,
  title,
  children,
}: {
  styles: DetailStyles;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
=======
  if (s === "approved") return "Aprovado";
  if (s === "rejected") return "Rejeitado";
  if (s === "pending_approval") return "Pendente (aguardando terapeuta)";
  return status ?? "—";
}

// ======================
// Componentes locais
// ======================
function Card({
  theme,
  title,
  children,
}: {
  theme: any;
  title: string;
  children: React.ReactNode;
}) {
  const s = makeStyles(theme);
  return (
    <View style={s.card}>
      <Text style={s.cardTitle}>{title}</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      {children}
    </View>
  );
}

<<<<<<< HEAD
function FeedbackSection({
  styles,
  mutedColor,
  reflectionId,
  onAfterAction,
}: {
  styles: DetailStyles;
  mutedColor: string;
  reflectionId: number;
  onAfterAction: () => Promise<void>;
}) {
  const [fbLoading, setFbLoading] = useState(false);
  const [fb, setFb] = useState<FeedbackOut | null>(null);

=======
// ======================
// Feedback Section
// ======================
function FeedbackSection({
  theme,
  reflectionId,
  onAfterAction,
}: {
  theme: any;
  reflectionId: number;
  onAfterAction: () => Promise<void>;
}) {
  const s = makeStyles(theme);

  const [fbLoading, setFbLoading] = useState(false);
  const [fb, setFb] = useState<FeedbackOut | null>(null);

  // Campos editáveis (terapeuta)
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  const [iaContent, setIaContent] = useState("");
  const [neuroTip, setNeuroTip] = useState("");
  const [activity, setActivity] = useState("");
  const [therapistNotes, setTherapistNotes] = useState("");

  const fillFromFeedback = useCallback((x: FeedbackOut) => {
    setIaContent(x.ia_generated_content ?? "");
    setNeuroTip(x.ia_neuro_nutrition_tip ?? "");
    setActivity(x.ia_activity_suggestion ?? "");
    setTherapistNotes(x.therapist_notes ?? "");
  }, []);

  async function handleGenerate() {
    try {
      setFbLoading(true);
      const created = await generateFeedbackForReflection(reflectionId);
      setFb(created);
      fillFromFeedback(created);
    } catch (e: any) {
      console.log("❌ generateFeedbackForReflection:", e?.message);
      Alert.alert("Erro", "Não foi possível gerar o feedback por IA.");
    } finally {
      setFbLoading(false);
    }
  }

  async function handleApprove() {
    if (!fb?.id) {
      Alert.alert("Atenção", "Gere o feedback primeiro.");
      return;
    }
<<<<<<< HEAD

=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    if (!iaContent.trim()) {
      Alert.alert("Atenção", "O texto do feedback não pode ficar vazio.");
      return;
    }

    try {
      setFbLoading(true);

      const updated = await approveFeedback(fb.id, {
        ia_generated_content: iaContent,
        ia_neuro_nutrition_tip: neuroTip || null,
        ia_activity_suggestion: activity || null,
        therapist_notes: therapistNotes || null,
      });

      setFb(updated);
      fillFromFeedback(updated);

      Alert.alert("Ok", "Feedback aprovado e liberado para o cliente.");
      await onAfterAction();
    } catch (e: any) {
      console.log("❌ approveFeedback:", e?.message);
      Alert.alert("Erro", "Não foi possível aprovar o feedback.");
    } finally {
      setFbLoading(false);
    }
  }

  async function handleReject() {
    if (!fb?.id) {
      Alert.alert("Atenção", "Gere o feedback primeiro.");
      return;
    }
<<<<<<< HEAD

    if (!therapistNotes.trim()) {
      Alert.alert("Atenção", "Informe uma nota ou motivo para a rejeição.");
=======
    if (!therapistNotes.trim()) {
      Alert.alert("Atenção", "Informe uma nota/motivo para a rejeição.");
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      return;
    }

    try {
      setFbLoading(true);

      const updated = await rejectFeedback(fb.id, {
        therapist_notes: therapistNotes,
      });

      setFb(updated);
      fillFromFeedback(updated);

      Alert.alert("Ok", "Feedback rejeitado.");
      await onAfterAction();
    } catch (e: any) {
      console.log("❌ rejectFeedback:", e?.message);
      Alert.alert("Erro", "Não foi possível rejeitar o feedback.");
    } finally {
      setFbLoading(false);
    }
  }

  return (
<<<<<<< HEAD
    <Card styles={styles} title="Feedback (IA + Aprovação)">
      <View style={styles.sectionGap}>
        <Text style={styles.metaMuted}>
          Status: <Text style={styles.metaStrong}>{statusLabel(fb?.status)}</Text>
=======
    <Card theme={theme} title="Feedback (IA + Aprovação)">
      <View style={{ gap: 10 }}>
        <Text style={s.metaMuted}>
          Status: <Text style={s.metaStrong}>{statusLabel(fb?.status)}</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        </Text>

        {!fb ? (
          <Pressable
            onPress={handleGenerate}
            disabled={fbLoading}
            hitSlop={16}
<<<<<<< HEAD
            style={[styles.btn, styles.btnPrimary, fbLoading && styles.disabled]}
          >
            <Text style={styles.btnPrimaryText}>
=======
            style={[
              s.btn,
              s.btnPrimary,
              { opacity: fbLoading ? 0.7 : 1 },
            ]}
          >
            <Text style={s.btnPrimaryText}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              {fbLoading ? "Gerando..." : "Gerar feedback por IA"}
            </Text>
          </Pressable>
        ) : (
          <>
<<<<<<< HEAD
            <Text style={styles.metaMuted}>Você pode editar antes de aprovar.</Text>

            <Text style={styles.inputLabel}>Texto do feedback</Text>
=======
            <Text style={s.metaMuted}>Você pode editar antes de aprovar.</Text>

            <Text style={s.inputLabel}>Texto do feedback</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            <TextInput
              value={iaContent}
              onChangeText={setIaContent}
              multiline
              placeholder="Edite o feedback aqui..."
<<<<<<< HEAD
              placeholderTextColor={mutedColor}
              style={[styles.input, styles.inputLg]}
            />

            <Text style={styles.inputLabel}>Dica (Neuro Nutrição)</Text>
=======
              placeholderTextColor={theme.muted}
              style={[s.input, { minHeight: 120 }]}
            />

            <Text style={s.inputLabel}>Dica (Neuro Nutrição)</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            <TextInput
              value={neuroTip}
              onChangeText={setNeuroTip}
              multiline
              placeholder="Opcional..."
<<<<<<< HEAD
              placeholderTextColor={mutedColor}
              style={[styles.input, styles.inputMd]}
            />

            <Text style={styles.inputLabel}>Sugestão de atividade</Text>
=======
              placeholderTextColor={theme.muted}
              style={[s.input, { minHeight: 70 }]}
            />

            <Text style={s.inputLabel}>Sugestão de atividade</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            <TextInput
              value={activity}
              onChangeText={setActivity}
              multiline
              placeholder="Opcional..."
<<<<<<< HEAD
              placeholderTextColor={mutedColor}
              style={[styles.input, styles.inputMd]}
            />

            <Text style={styles.inputLabel}>Notas do terapeuta</Text>
=======
              placeholderTextColor={theme.muted}
              style={[s.input, { minHeight: 70 }]}
            />

            <Text style={s.inputLabel}>Notas do terapeuta</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            <TextInput
              value={therapistNotes}
              onChangeText={setTherapistNotes}
              multiline
              placeholder="Use para justificar rejeição ou registrar observações..."
<<<<<<< HEAD
              placeholderTextColor={mutedColor}
              style={[styles.input, styles.inputNotes]}
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
=======
              placeholderTextColor={theme.muted}
              style={[s.input, { minHeight: 80 }]}
            />

            <View style={s.row}>
              <View style={s.flex1}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                <Pressable
                  onPress={handleApprove}
                  disabled={fbLoading || fb?.status === "approved"}
                  hitSlop={16}
                  style={[
<<<<<<< HEAD
                    styles.btn,
                    styles.btnPrimary,
                    (fbLoading || fb?.status === "approved") && styles.disabled,
                  ]}
                >
                  <Text style={styles.btnPrimaryText}>
=======
                    s.btn,
                    s.btnPrimary,
                    {
                      opacity:
                        fbLoading || fb?.status === "approved" ? 0.6 : 1,
                    },
                  ]}
                >
                  <Text style={s.btnPrimaryText}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                    {fbLoading ? "Salvando..." : "Aprovar"}
                  </Text>
                </Pressable>
              </View>

<<<<<<< HEAD
              <View style={styles.flex1}>
=======
              <View style={s.flex1}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                <Pressable
                  onPress={handleReject}
                  disabled={fbLoading || fb?.status === "rejected"}
                  hitSlop={16}
                  style={[
<<<<<<< HEAD
                    styles.btn,
                    styles.btnDanger,
                    (fbLoading || fb?.status === "rejected") && styles.disabled,
                  ]}
                >
                  <Text style={styles.btnDangerText}>
=======
                    s.btn,
                    s.btnDanger,
                    {
                      opacity:
                        fbLoading || fb?.status === "rejected" ? 0.6 : 1,
                    },
                  ]}
                >
                  <Text style={s.btnDangerText}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                    {fbLoading ? "Salvando..." : "Rejeitar"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </>
        )}
      </View>
    </Card>
  );
}

<<<<<<< HEAD
=======
// ======================
// Page
// ======================
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
export default function TherapistReflectionDetailScreen() {
  const r = useRouter();
  const params = useLocalSearchParams();

<<<<<<< HEAD
  const colorScheme = useColorScheme();
  const styles = getTherapistReflectionDetailStyles(colorScheme);
  const theme = getTherapistReflectionDetailTheme(colorScheme);
=======
  // ✅ hooks precisam estar dentro do componente
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const s = makeStyles(theme);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

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

  const load = useCallback(async () => {
    if (!reflectionId) return;

    try {
      setLoading(true);
      const res = await getTherapistReflectionDetail(reflectionId);
      setData(res);
    } catch (e: any) {
      console.log("❌ getTherapistReflectionDetail:", e?.message);
      setData(null);
      Alert.alert("Erro", "Não foi possível carregar os detalhes.");
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
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.emptyCenter}>
          <Text style={styles.titleBig}>
=======
      <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
        <View style={s.emptyCenter}>
          <Text style={s.titleBig}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            Não consegui abrir essa reflexão (ID inválido).
          </Text>

          <Pressable
            onPress={() => r.replace("/(therapist)/reflections" as any)}
            hitSlop={16}
<<<<<<< HEAD
            style={styles.btn}
          >
            <Text style={styles.btnText}>Voltar para Pendentes</Text>
=======
            style={s.btn}
          >
            <Text style={s.btnText}>Voltar para Pendentes</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
<<<<<<< HEAD
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable onPress={goBackSafe} hitSlop={18} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Voltar</Text>
        </Pressable>

        <View style={styles.flex1}>
          <Text style={styles.headerTitle}>Reflexão #{reflectionId}</Text>
          <Text style={styles.headerSubtitle}>
            Detalhe para análise do terapeuta
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading && !data ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Carregando detalhes...</Text>
          </View>
        ) : data ? (
          <View style={styles.gap12}>
            <Text style={styles.metaMuted}>
              Cliente:{" "}
              <Text style={styles.metaStrong}>
=======
    <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={goBackSafe} hitSlop={18} style={s.backBtn}>
          <Text style={s.backBtnText}>← Voltar</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Reflexão #{reflectionId}</Text>
          <Text style={s.headerSubtitle}>Detalhe para análise do terapeuta</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {loading && !data ? (
          <View style={s.loadingWrap}>
            <ActivityIndicator />
            <Text style={s.loadingText}>Carregando detalhes...</Text>
          </View>
        ) : data ? (
          <View style={s.gap12}>
            <Text style={s.metaMuted}>
              Cliente:{" "}
              <Text style={s.metaStrong}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                {data.client_name ?? `Cliente #${data.client_id}`}
              </Text>
            </Text>

<<<<<<< HEAD
            <Text style={styles.metaMuted}>{formatDate(data.created_at)}</Text>

            <Card styles={styles} title="Como o cliente se sentiu após a sessão?">
              <Text style={styles.bodyText}>{data.feeling_after_session}</Text>
            </Card>

            <Card styles={styles} title="O que ele(a) aprendeu ou percebeu?">
              <Text style={styles.bodyText}>{data.what_learned}</Text>
            </Card>

            <Card styles={styles} title="Ponto positivo">
              <Text style={styles.bodyText}>{data.positive_point}</Text>
            </Card>

            {!!data.resistance_or_disagreement && (
              <Card styles={styles} title="Resistência/discordância">
                <Text style={styles.bodyText}>
=======
            <Text style={s.metaMuted}>{formatDate(data.created_at)}</Text>

            <Card theme={theme} title="Como o cliente se sentiu após a sessão?">
              <Text style={{ color: theme.text, lineHeight: 20 }}>
                {data.feeling_after_session}
              </Text>
            </Card>

            <Card theme={theme} title="O que ele(a) aprendeu ou percebeu?">
              <Text style={{ color: theme.text, lineHeight: 20 }}>
                {data.what_learned}
              </Text>
            </Card>

            <Card theme={theme} title="Ponto positivo">
              <Text style={{ color: theme.text, lineHeight: 20 }}>
                {data.positive_point}
              </Text>
            </Card>

            {!!data.resistance_or_disagreement && (
              <Card theme={theme} title="Resistência/discordância">
                <Text style={{ color: theme.text, lineHeight: 20 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                  {data.resistance_or_disagreement}
                </Text>
              </Card>
            )}

            <FeedbackSection
<<<<<<< HEAD
              styles={styles}
              mutedColor={theme.muted}
=======
              theme={theme}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              reflectionId={reflectionId}
              onAfterAction={load}
            />
          </View>
        ) : (
<<<<<<< HEAD
          <Card styles={styles} title="Não encontrado">
            <Text style={styles.emptyCardText}>
=======
          <Card theme={theme} title="Não encontrado">
            <Text style={{ color: theme.muted, lineHeight: 20 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              Não encontrei os detalhes dessa reflexão.
            </Text>
          </Card>
        )}

<<<<<<< HEAD
        <View style={styles.mt16}>
=======
        {/* Atualizar */}
        <View style={s.mt16}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          <Pressable
            onPress={load}
            disabled={loading}
            hitSlop={16}
<<<<<<< HEAD
            style={[styles.btn, loading && styles.disabled]}
          >
            <Text style={styles.btnText}>
=======
            style={[s.btn, { opacity: loading ? 0.6 : 1 }]}
          >
            <Text style={s.btnText}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              {loading ? "Atualizando..." : "Atualizar"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
