import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createStyles } from "@/styles/therapist/anamnesis/id.styles";

import {
  getAnamnesisByClient,
  createAnamnesis,
  updateAnamnesis,
  type Anamnesis,
} from "../../../lib/anamnesis";

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

// ======================
// Componentes locais
// ======================
function Card({
  theme,
  styles,
  title,
  children,
}: {
  theme: (typeof Colors)["light"];
  styles: ReturnType<typeof createStyles>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          borderColor: theme.border,
          backgroundColor: theme.card,
        },
      ]}
    >
      <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );
}

// ======================
// Page
// ======================
export default function TherapistAnamnesisScreen() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = createStyles(theme);

  const clientId = useMemo(() => {
    const raw = (params as any)?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [anam, setAnam] = useState<Anamnesis | null>(null);
  const [summary, setSummary] = useState("");
  const [exists, setExists] = useState(false); // controla POST vs PATCH

  function goBackSafe() {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(therapist)/client" as any);
  }

  const load = useCallback(async () => {
    if (!clientId) return;

    try {
      setLoading(true);

      const data = await getAnamnesisByClient(clientId);

      setAnam(data);
      setSummary(data?.summary ?? "");
      setExists(true);
    } catch (e: any) {
      const status = e?.response?.status;
      const detail = e?.response?.data?.detail ?? e?.message;

      console.log("❌ getAnamnesisByClient:", status, detail);

      // ✅ Se não existe ainda, tratamos como "criar"
      if (status === 404) {
        setAnam(null);
        setSummary("");
        setExists(false);
        return;
      }

      Alert.alert("Erro", "Não foi possível carregar a anamnese.");
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    load();
  }, [load]);

  async function onSave() {
    if (saving) return;
    if (!clientId) return;

    const sum = summary.trim();
    if (!sum) {
      Alert.alert("Atenção", "A anamnese (summary) não pode ficar vazia.");
      return;
    }

    try {
      setSaving(true);

      // ✅ Se já existe -> PATCH
      if (exists) {
        const updated = await updateAnamnesis(clientId, { summary: sum });
        setAnam(updated);
        setSummary(updated?.summary ?? sum);
        setExists(true);
        Alert.alert("Ok", "Anamnese atualizada.");
        return;
      }

      // ✅ Se não existe -> POST
      const created = await createAnamnesis(clientId, { summary: sum });
      setAnam(created);
      setSummary(created?.summary ?? sum);
      setExists(true);
      Alert.alert("Ok", "Anamnese criada.");
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        "Não foi possível salvar a anamnese.";

      console.log("❌ saveAnamnesis:", msg);
      Alert.alert("Erro", msg);
    } finally {
      setSaving(false);
    }
  }

  // ID inválido
  if (!clientId) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right"]}
      >
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidTitle}>
            Não consegui abrir a anamnese (ID inválido).
          </Text>

          <Pressable
            onPress={() => r.replace("/(therapist)/client" as any)}
            style={styles.invalidButton}
          >
            <Text style={styles.invalidButtonText}>Voltar</Text>
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
      <View
        style={[
          styles.header,
          {
            borderBottomColor: theme.border,
            backgroundColor: theme.background,
          },
        ]}
      >
        <Pressable
          onPress={goBackSafe}
          hitSlop={16}
          style={[
            styles.headerBackButton,
            {
              borderColor: theme.border,
              backgroundColor: theme.card,
            },
          ]}
        >
          <Text
            style={[
              styles.headerBackButtonText,
              { color: theme.text },
            ]}
          >
            ← Voltar
          </Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Anamnese do Cliente #{clientId}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.muted }]}>
            Contexto clínico (usado pela IA no feedback)
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator />
              <Text style={[styles.loadingText, { color: theme.muted }]}>
                Carregando anamnese...
              </Text>
            </View>
          ) : (
            <View style={styles.contentContainer}>
              <Card theme={theme} styles={styles} title="Resumo (summary)">
                <Text style={[styles.helperText, { color: theme.muted }]}>
                  Escreva um resumo objetivo. Isso será usado como contexto ao
                  gerar feedback das reflexões.
                </Text>

                <TextInput
                  value={summary}
                  onChangeText={setSummary}
                  placeholder="Ex: histórico, queixa principal, padrões, objetivos terapêuticos..."
                  placeholderTextColor={theme.icon}
                  multiline
                  textAlignVertical="top"
                  style={[
                    styles.input,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.input,
                      color: theme.text,
                    },
                  ]}
                />
              </Card>

              <Card theme={theme} styles={styles} title="Metadados">
                <Text
                  style={[
                    styles.metadataLine,
                    styles.metadataLineFirst,
                    { color: theme.muted },
                  ]}
                >
                  Situação:{" "}
                  <Text
                    style={[
                      styles.metadataStrong,
                      { color: theme.text },
                    ]}
                  >
                    {exists ? "Existe (PATCH)" : "Ainda não criada (POST)"}
                  </Text>
                </Text>

                <Text style={[styles.metadataLine, { color: theme.muted }]}>
                  Criada em:{" "}
                  <Text
                    style={[
                      styles.metadataStrong,
                      { color: theme.text },
                    ]}
                  >
                    {formatDate(anam?.created_at ?? null)}
                  </Text>
                </Text>

                <Text style={[styles.metadataLine, { color: theme.muted }]}>
                  Atualizada em:{" "}
                  <Text
                    style={[
                      styles.metadataStrong,
                      { color: theme.text },
                    ]}
                  >
                    {formatDate(anam?.updated_at ?? null)}
                  </Text>
                </Text>
              </Card>

              {/* Botões */}
              <Pressable
                onPress={onSave}
                disabled={saving}
                hitSlop={16}
                style={[
                  styles.primaryButton,
                  { backgroundColor: theme.primary },
                  saving && styles.primaryButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: theme.primaryText },
                  ]}
                >
                  {saving ? "Salvando..." : "Salvar"}
                </Text>
              </Pressable>

              <Pressable
                onPress={load}
                disabled={loading || saving}
                hitSlop={16}
                style={[
                  styles.secondaryButton,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.card,
                  },
                  (loading || saving) && styles.secondaryButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { color: theme.text },
                  ]}
                >
                  Atualizar
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}