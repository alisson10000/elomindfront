<<<<<<< HEAD
=======
// app/(therapist)/dreams/[id].tsx
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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
<<<<<<< HEAD
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createStyles } from "@/styles/therapist/dreams/detail.styles";
=======
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function DreamDetail() {
  const r = useRouter();
  const params = useLocalSearchParams();

<<<<<<< HEAD
  const colorScheme = useColorScheme();
  const styles = createStyles((colorScheme ?? "light") as "light" | "dark");
=======
  const theme = Colors[useColorScheme() ?? "light"];
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

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
<<<<<<< HEAD
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

=======
    // ✅ volta forçando reload da lista (pra refletir tags/notas salvas)
    if (clientId) r.replace(`/(therapist)/dreams?client_id=${clientId}` as any);
    else if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(therapist)/client" as any);
  }

>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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

<<<<<<< HEAD
  if (!dreamId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidTitle}>
            Não consegui abrir esse sonho (ID inválido).
          </Text>
          <Pressable onPress={goBackToList} style={styles.invalidButton}>
            <Text style={styles.invalidButtonText}>Voltar</Text>
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
<<<<<<< HEAD
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
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          </View>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
<<<<<<< HEAD
          contentContainerStyle={styles.scrollContent}
        >
          {!!createdAt && (
            <Text style={styles.createdAt}>
=======
          contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        >
          {!!createdAt && (
            <Text style={{ color: theme.muted, marginBottom: 12 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              {new Date(createdAt).toLocaleString()}
            </Text>
          )}

<<<<<<< HEAD
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
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          <TextInput
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
<<<<<<< HEAD
            style={[styles.input, styles.notesInput]}
            placeholder="Escreva suas observações..."
            placeholderTextColor="#98A2B3"
=======
            style={[inputStyle, { minHeight: 120 }]}
            placeholder="Escreva suas observações..."
            placeholderTextColor={theme.icon}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          />

          <Pressable
            onPress={save}
            disabled={saving}
<<<<<<< HEAD
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          >
            <Text style={styles.saveButtonText}>
=======
            style={{
              backgroundColor: theme.primary,
              padding: 16,
              borderRadius: 12,
              alignItems: "center",
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "900" }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              {saving ? "Salvando..." : "Salvar"}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
