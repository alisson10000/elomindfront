import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { updateReflection } from "../../../../lib/reflections";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createStyles } from "@/styles/client/reflections/edit/id.styles";

export default function EditReflection() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = createStyles(theme);

  const reflectionId = useMemo(() => {
    const raw = (params as any)?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  const canEdit = useMemo(() => {
    const raw = (params as any)?.can_edit;
    const value = Array.isArray(raw) ? raw[0] : raw;

    if (value == null) return true;

    return String(value) === "true";
  }, [params]);

  const initial = useMemo(() => {
    const p: any = params;
    const pick = (key: string) => {
      const v = p?.[key];
      return v ? String(Array.isArray(v) ? v[0] : v) : "";
    };

    return {
      feeling_after_session: pick("feeling_after_session"),
      what_learned: pick("what_learned"),
      positive_point: pick("positive_point"),
      resistance_or_disagreement: pick("resistance_or_disagreement"),
    };
  }, [params]);

  const [feeling, setFeeling] = useState(initial.feeling_after_session);
  const [learned, setLearned] = useState(initial.what_learned);
  const [positive, setPositive] = useState(initial.positive_point);
  const [resistance, setResistance] = useState(
    initial.resistance_or_disagreement
  );
  const [saving, setSaving] = useState(false);

  function goBackSafe() {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(client)/reflections" as any);
  }

  async function onSubmit() {
    if (saving) return;

    if (!reflectionId) {
      Alert.alert("Erro", "ID inválido da reflexão.");
      return;
    }

    if (!canEdit) {
      Alert.alert("Bloqueado", "Não é possível editar após feedback aprovado.");
      return;
    }

    const feelingV = feeling.trim();
    const learnedV = learned.trim();
    const positiveV = positive.trim();
    const resistanceV = resistance.trim();

    if (!feelingV || !learnedV || !positiveV) {
      Alert.alert("Atenção", "Preencha os campos obrigatórios (*)");
      return;
    }

    try {
      setSaving(true);

      await updateReflection(reflectionId, {
        feeling_after_session: feelingV,
        what_learned: learnedV,
        positive_point: positiveV,
        resistance_or_disagreement: resistanceV || undefined,
      });

      Alert.alert("Atualizado!", "Sua reflexão foi atualizada com sucesso.");
      goBackSafe();
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        "Não foi possível atualizar.";

      console.log("❌ updateReflection:", msg);
      Alert.alert("Erro", msg);
    } finally {
      setSaving(false);
    }
  }

  if (!reflectionId) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.centerContent}>
          <Text style={styles.centerTitle}>
            Não consegui abrir essa reflexão (ID inválido).
          </Text>

          <Pressable
            onPress={() => r.replace("/(client)/reflections" as any)}
            style={styles.ghostButton}
          >
            <Text style={styles.ghostButtonText}>
              Voltar para Minhas Reflexões
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (!canEdit) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable
            onPress={goBackSafe}
            hitSlop={16}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>← Voltar</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Editar Reflexão</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.centerContent}>
          <Text style={styles.centerTitleText}>Edição bloqueada</Text>

          <Text style={styles.centerDescription}>
            Não é possível editar esta reflexão porque já existe feedback
            aprovado.
          </Text>

          <Pressable onPress={goBackSafe} style={styles.ghostButton}>
            <Text style={styles.ghostButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable
          onPress={goBackSafe}
          hitSlop={16}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>← Voltar</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Editar Reflexão</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Atualize os campos que desejar. Os campos com * são obrigatórios.
        </Text>

        <Text style={styles.label}>Como você se sentiu após a sessão? *</Text>
        <TextInput
          value={feeling}
          onChangeText={setFeeling}
          style={styles.input}
          placeholder="Ex: mais leve, ansioso(a), confuso(a)..."
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>O que você aprendeu ou percebeu? *</Text>
        <TextInput
          value={learned}
          onChangeText={setLearned}
          style={styles.input}
          placeholder="Ex: percebi um padrão, entendi uma causa..."
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>Qual ponto positivo você destaca? *</Text>
        <TextInput
          value={positive}
          onChangeText={setPositive}
          style={styles.input}
          placeholder="Ex: consegui me expressar melhor..."
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>
          Teve algo que você discordou ou sentiu resistência? (opcional)
        </Text>
        <TextInput
          value={resistance}
          onChangeText={setResistance}
          style={styles.input}
          placeholder="Se quiser, descreva aqui…"
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

        <Pressable
          onPress={onSubmit}
          disabled={saving}
          style={[styles.submitButton, saving && styles.disabledButton]}
        >
          <Text style={styles.submitButtonText}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Text>
        </Pressable>

        <Pressable
          onPress={goBackSafe}
          disabled={saving}
          style={[styles.cancelButton, saving && styles.disabledButton]}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}