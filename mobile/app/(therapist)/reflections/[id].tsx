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

import { Colors } from "@/constants/theme";
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

import { makeStyles } from "./styles";

// ======================
// Helpers
// ======================
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
      {children}
    </View>
  );
}

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
      Alert.alert("Atenção", "Informe uma nota/motivo para a rejeição.");
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
    <Card theme={theme} title="Feedback (IA + Aprovação)">
      <View style={{ gap: 10 }}>
        <Text style={s.metaMuted}>
          Status: <Text style={s.metaStrong}>{statusLabel(fb?.status)}</Text>
        </Text>

        {!fb ? (
          <Pressable
            onPress={handleGenerate}
            disabled={fbLoading}
            hitSlop={16}
            style={[
              s.btn,
              s.btnPrimary,
              { opacity: fbLoading ? 0.7 : 1 },
            ]}
          >
            <Text style={s.btnPrimaryText}>
              {fbLoading ? "Gerando..." : "Gerar feedback por IA"}
            </Text>
          </Pressable>
        ) : (
          <>
            <Text style={s.metaMuted}>Você pode editar antes de aprovar.</Text>

            <Text style={s.inputLabel}>Texto do feedback</Text>
            <TextInput
              value={iaContent}
              onChangeText={setIaContent}
              multiline
              placeholder="Edite o feedback aqui..."
              placeholderTextColor={theme.muted}
              style={[s.input, { minHeight: 120 }]}
            />

            <Text style={s.inputLabel}>Dica (Neuro Nutrição)</Text>
            <TextInput
              value={neuroTip}
              onChangeText={setNeuroTip}
              multiline
              placeholder="Opcional..."
              placeholderTextColor={theme.muted}
              style={[s.input, { minHeight: 70 }]}
            />

            <Text style={s.inputLabel}>Sugestão de atividade</Text>
            <TextInput
              value={activity}
              onChangeText={setActivity}
              multiline
              placeholder="Opcional..."
              placeholderTextColor={theme.muted}
              style={[s.input, { minHeight: 70 }]}
            />

            <Text style={s.inputLabel}>Notas do terapeuta</Text>
            <TextInput
              value={therapistNotes}
              onChangeText={setTherapistNotes}
              multiline
              placeholder="Use para justificar rejeição ou registrar observações..."
              placeholderTextColor={theme.muted}
              style={[s.input, { minHeight: 80 }]}
            />

            <View style={s.row}>
              <View style={s.flex1}>
                <Pressable
                  onPress={handleApprove}
                  disabled={fbLoading || fb?.status === "approved"}
                  hitSlop={16}
                  style={[
                    s.btn,
                    s.btnPrimary,
                    {
                      opacity:
                        fbLoading || fb?.status === "approved" ? 0.6 : 1,
                    },
                  ]}
                >
                  <Text style={s.btnPrimaryText}>
                    {fbLoading ? "Salvando..." : "Aprovar"}
                  </Text>
                </Pressable>
              </View>

              <View style={s.flex1}>
                <Pressable
                  onPress={handleReject}
                  disabled={fbLoading || fb?.status === "rejected"}
                  hitSlop={16}
                  style={[
                    s.btn,
                    s.btnDanger,
                    {
                      opacity:
                        fbLoading || fb?.status === "rejected" ? 0.6 : 1,
                    },
                  ]}
                >
                  <Text style={s.btnDangerText}>
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

// ======================
// Page
// ======================
export default function TherapistReflectionDetailScreen() {
  const r = useRouter();
  const params = useLocalSearchParams();

  // ✅ hooks precisam estar dentro do componente
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const s = makeStyles(theme);

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
      <SafeAreaView style={s.safe} edges={["top", "left", "right"]}>
        <View style={s.emptyCenter}>
          <Text style={s.titleBig}>
            Não consegui abrir essa reflexão (ID inválido).
          </Text>

          <Pressable
            onPress={() => r.replace("/(therapist)/reflections" as any)}
            hitSlop={16}
            style={s.btn}
          >
            <Text style={s.btnText}>Voltar para Pendentes</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
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
                {data.client_name ?? `Cliente #${data.client_id}`}
              </Text>
            </Text>

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
                  {data.resistance_or_disagreement}
                </Text>
              </Card>
            )}

            <FeedbackSection
              theme={theme}
              reflectionId={reflectionId}
              onAfterAction={load}
            />
          </View>
        ) : (
          <Card theme={theme} title="Não encontrado">
            <Text style={{ color: theme.muted, lineHeight: 20 }}>
              Não encontrei os detalhes dessa reflexão.
            </Text>
          </Card>
        )}

        {/* Atualizar */}
        <View style={s.mt16}>
          <Pressable
            onPress={load}
            disabled={loading}
            hitSlop={16}
            style={[s.btn, { opacity: loading ? 0.6 : 1 }]}
          >
            <Text style={s.btnText}>
              {loading ? "Atualizando..." : "Atualizar"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
