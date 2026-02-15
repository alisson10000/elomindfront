// app/(therapist)/dreams/[id].tsx
import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { updateDreamAsTherapist } from "@/lib/dreams";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function DreamDetail() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const theme = Colors[useColorScheme() ?? "light"];

  const dreamId = useMemo(() => {
    const raw = (params as any)?.id;
    const v = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  const clientId = useMemo(() => {
    const raw = (params as any)?.client_id;
    const v = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  const createdAt = String((params as any)?.created_at ?? "");
  const description = String((params as any)?.description ?? "");

  const [tags, setTags] = useState(String((params as any)?.therapist_tags ?? ""));
  const [notes, setNotes] = useState(String((params as any)?.therapist_notes ?? ""));
  const [saving, setSaving] = useState(false);

  function goBackToList() {
    // ✅ volta forçando reload da lista (pra refletir tags/notas salvas)
    if (clientId) r.replace(`/(therapist)/dreams?client_id=${clientId}` as any);
    else if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(therapist)/client" as any);
  }

  async function save() {
    if (!dreamId || saving) return;

    try {
      setSaving(true);

      await updateDreamAsTherapist(dreamId, {
        therapist_tags: tags.trim() ? tags.trim() : null,
        therapist_notes: notes.trim() ? notes.trim() : null,
      });

      Alert.alert("Salvo com sucesso");
      goBackToList();
    } catch (e: any) {
      console.log("❌ updateDreamAsTherapist:", e?.message);
      Alert.alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 14,
    color: theme.text,
    backgroundColor: theme.input,
  } as const;

  if (!dreamId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
          <Text style={{ color: theme.text, fontWeight: "900", marginBottom: 12 }}>
            Não consegui abrir esse sonho (ID inválido).
          </Text>
          <Pressable
            onPress={goBackToList}
            style={{
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "800" }}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.background }}
        edges={["top", "left", "right"]}
      >
        {/* Header com Voltar */}
        <View
          style={{
            paddingHorizontal: 16,
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
            onPress={goBackToList}
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
              Sonho #{dreamId}
            </Text>
            <Text style={{ color: theme.muted, marginTop: 2 }}>
              Tags e notas do terapeuta
            </Text>
          </View>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        >
          {!!createdAt && (
            <Text style={{ color: theme.muted, marginBottom: 12 }}>
              {new Date(createdAt).toLocaleString()}
            </Text>
          )}

          <Text style={{ color: theme.text, fontWeight: "900" }}>Descrição do cliente</Text>
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 12,
              marginTop: 8,
              marginBottom: 16,
              backgroundColor: theme.card,
            }}
          >
            <Text style={{ color: theme.text, lineHeight: 20 }}>
              {description || "-"}
            </Text>
          </View>

          <Text style={{ color: theme.text, fontWeight: "700" }}>Tags</Text>
          <TextInput
            value={tags}
            onChangeText={setTags}
            style={inputStyle}
            placeholder="Ex: ansiedade, infância, água..."
            placeholderTextColor={theme.icon}
          />

          <Text style={{ color: theme.text, fontWeight: "700" }}>Notas</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
            style={[inputStyle, { minHeight: 120 }]}
            placeholder="Escreva suas observações..."
            placeholderTextColor={theme.icon}
          />

          <Pressable
            onPress={save}
            disabled={saving}
            style={{
              backgroundColor: theme.primary,
              padding: 16,
              borderRadius: 12,
              alignItems: "center",
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "900" }}>
              {saving ? "Salvando..." : "Salvar"}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
