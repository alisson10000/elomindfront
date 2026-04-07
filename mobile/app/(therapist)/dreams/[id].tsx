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
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createStyles } from "@/styles/therapist/dreams/detail.styles";

export default function DreamDetail() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const styles = createStyles((colorScheme ?? "light") as "light" | "dark");

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
  if ((r as any).canGoBack?.()) {
    (r as any).back();
    return;
  }

  if (clientId) {
    r.replace(`/(therapist)/dreams?client_id=${clientId}` as any);
    return;
  }

  r.replace("/(therapist)/client" as any);
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

  if (!dreamId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidTitle}>
            Não consegui abrir esse sonho (ID inválido).
          </Text>
          <Pressable onPress={goBackToList} style={styles.invalidButton}>
            <Text style={styles.invalidButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right"]}
      >
        <View style={styles.header}>
          <Pressable
            onPress={goBackToList}
            hitSlop={16}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </Pressable>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Sonho #{dreamId}</Text>
            <Text style={styles.headerSubtitle}>Tags e notas do terapeuta</Text>
          </View>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {!!createdAt && (
            <Text style={styles.createdAt}>
              {new Date(createdAt).toLocaleString()}
            </Text>
          )}

          <Text style={styles.sectionTitleStrong}>Descrição do cliente</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{description || "-"}</Text>
          </View>

          <Text style={styles.sectionTitle}>Tags</Text>
          <TextInput
            value={tags}
            onChangeText={setTags}
            style={styles.input}
            placeholder="Ex: ansiedade, infância, água..."
            placeholderTextColor="#98A2B3"
          />

          <Text style={styles.sectionTitle}>Notas</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
            style={[styles.input, styles.notesInput]}
            placeholder="Escreva suas observações..."
            placeholderTextColor="#98A2B3"
          />

          <Pressable
            onPress={save}
            disabled={saving}
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          >
            <Text style={styles.saveButtonText}>
              {saving ? "Salvando..." : "Salvar"}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}