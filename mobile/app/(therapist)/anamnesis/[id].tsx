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
  title,
  children,
}: {
  theme: any;
  title: string;
  children: React.ReactNode;
}) {
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

// ======================
// Page
// ======================
export default function TherapistAnamnesisScreen() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

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
            Não consegui abrir a anamnese (ID inválido).
          </Text>

          <Pressable
            onPress={() => r.replace("/(therapist)/client" as any)}
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
              Voltar
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
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
            Anamnese do Cliente #{clientId}
          </Text>
          <Text style={{ color: theme.muted, marginTop: 2 }}>
            Contexto clínico (usado pela IA no feedback)
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
          {loading ? (
            <View style={{ paddingTop: 10, alignItems: "center" }}>
              <ActivityIndicator />
              <Text style={{ marginTop: 10, color: theme.muted }}>
                Carregando anamnese...
              </Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              <Card theme={theme} title="Resumo (summary)">
                <Text style={{ color: theme.muted, marginBottom: 10 }}>
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
                  style={{
                    minHeight: 180,
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: 12,
                    borderColor: theme.border,
                    backgroundColor: theme.input,
                    color: theme.text,
                    lineHeight: 20,
                  }}
                />
              </Card>

              <Card theme={theme} title="Metadados">
                <Text style={{ color: theme.muted }}>
                  Situação:{" "}
                  <Text style={{ color: theme.text, fontWeight: "800" }}>
                    {exists ? "Existe (PATCH)" : "Ainda não criada (POST)"}
                  </Text>
                </Text>

                <Text style={{ color: theme.muted, marginTop: 6 }}>
                  Criada em:{" "}
                  <Text style={{ color: theme.text, fontWeight: "800" }}>
                    {formatDate(anam?.created_at ?? null)}
                  </Text>
                </Text>

                <Text style={{ color: theme.muted, marginTop: 6 }}>
                  Atualizada em:{" "}
                  <Text style={{ color: theme.text, fontWeight: "800" }}>
                    {formatDate(anam?.updated_at ?? null)}
                  </Text>
                </Text>
              </Card>

              {/* Botões */}
              <Pressable
                onPress={onSave}
                disabled={saving}
                hitSlop={16}
                style={{
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  backgroundColor: theme.primary,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 16 }}>
                  {saving ? "Salvando..." : "Salvar"}
                </Text>
              </Pressable>

              <Pressable
                onPress={load}
                disabled={loading || saving}
                hitSlop={16}
                style={{
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.border,
                  backgroundColor: theme.card,
                  alignItems: "center",
                  opacity: loading || saving ? 0.6 : 1,
                }}
              >
                <Text style={{ color: theme.text, fontWeight: "800" }}>
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
