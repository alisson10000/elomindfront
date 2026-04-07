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

import {
  getTherapistReflectionDetailStyles,
  getTherapistReflectionDetailTheme,
} from "../../../styles/therapist/reflections/id.reflections.styles";

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
      {children}
    </View>
  );
}

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

    if (!therapistNotes.trim()) {
      Alert.alert("Atenção", "Informe uma nota ou motivo para a rejeição.");
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
    <Card styles={styles} title="Feedback (IA + Aprovação)">
      <View style={styles.sectionGap}>
        <Text style={styles.metaMuted}>
          Status: <Text style={styles.metaStrong}>{statusLabel(fb?.status)}</Text>
        </Text>

        {!fb ? (
          <Pressable
            onPress={handleGenerate}
            disabled={fbLoading}
            hitSlop={16}
            style={[styles.btn, styles.btnPrimary, fbLoading && styles.disabled]}
          >
            <Text style={styles.btnPrimaryText}>
              {fbLoading ? "Gerando..." : "Gerar feedback por IA"}
            </Text>
          </Pressable>
        ) : (
          <>
            <Text style={styles.metaMuted}>Você pode editar antes de aprovar.</Text>

            <Text style={styles.inputLabel}>Texto do feedback</Text>
            <TextInput
              value={iaContent}
              onChangeText={setIaContent}
              multiline
              placeholder="Edite o feedback aqui..."
              placeholderTextColor={mutedColor}
              style={[styles.input, styles.inputLg]}
            />

            <Text style={styles.inputLabel}>Dica (Neuro Nutrição)</Text>
            <TextInput
              value={neuroTip}
              onChangeText={setNeuroTip}
              multiline
              placeholder="Opcional..."
              placeholderTextColor={mutedColor}
              style={[styles.input, styles.inputMd]}
            />

            <Text style={styles.inputLabel}>Sugestão de atividade</Text>
            <TextInput
              value={activity}
              onChangeText={setActivity}
              multiline
              placeholder="Opcional..."
              placeholderTextColor={mutedColor}
              style={[styles.input, styles.inputMd]}
            />

            <Text style={styles.inputLabel}>Notas do terapeuta</Text>
            <TextInput
              value={therapistNotes}
              onChangeText={setTherapistNotes}
              multiline
              placeholder="Use para justificar rejeição ou registrar observações..."
              placeholderTextColor={mutedColor}
              style={[styles.input, styles.inputNotes]}
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Pressable
                  onPress={handleApprove}
                  disabled={fbLoading || fb?.status === "approved"}
                  hitSlop={16}
                  style={[
                    styles.btn,
                    styles.btnPrimary,
                    (fbLoading || fb?.status === "approved") && styles.disabled,
                  ]}
                >
                  <Text style={styles.btnPrimaryText}>
                    {fbLoading ? "Salvando..." : "Aprovar"}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.flex1}>
                <Pressable
                  onPress={handleReject}
                  disabled={fbLoading || fb?.status === "rejected"}
                  hitSlop={16}
                  style={[
                    styles.btn,
                    styles.btnDanger,
                    (fbLoading || fb?.status === "rejected") && styles.disabled,
                  ]}
                >
                  <Text style={styles.btnDangerText}>
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

export default function TherapistReflectionDetailScreen() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const styles = getTherapistReflectionDetailStyles(colorScheme);
  const theme = getTherapistReflectionDetailTheme(colorScheme);

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
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={styles.emptyCenter}>
          <Text style={styles.titleBig}>
            Não consegui abrir essa reflexão (ID inválido).
          </Text>

          <Pressable
            onPress={() => r.replace("/(therapist)/reflections" as any)}
            hitSlop={16}
            style={styles.btn}
          >
            <Text style={styles.btnText}>Voltar para Pendentes</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
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
                {data.client_name ?? `Cliente #${data.client_id}`}
              </Text>
            </Text>

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
                  {data.resistance_or_disagreement}
                </Text>
              </Card>
            )}

            <FeedbackSection
              styles={styles}
              mutedColor={theme.muted}
              reflectionId={reflectionId}
              onAfterAction={load}
            />
          </View>
        ) : (
          <Card styles={styles} title="Não encontrado">
            <Text style={styles.emptyCardText}>
              Não encontrei os detalhes dessa reflexão.
            </Text>
          </Card>
        )}

        <View style={styles.mt16}>
          <Pressable
            onPress={load}
            disabled={loading}
            hitSlop={16}
            style={[styles.btn, loading && styles.disabled]}
          >
            <Text style={styles.btnText}>
              {loading ? "Atualizando..." : "Atualizar"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}