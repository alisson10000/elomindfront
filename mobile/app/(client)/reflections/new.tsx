import { useState } from "react";
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
import { useRouter } from "expo-router";

import { ROUTES } from "@/constants/routes";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createReflection } from "@/lib/reflections";
import { createStyles } from "@/styles/client/reflections/new.styles";

export default function NewReflection() {
  const r = useRouter();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = createStyles(theme);

  const [feeling, setFeeling] = useState("");
  const [learned, setLearned] = useState("");
  const [positive, setPositive] = useState("");
  const [resistance, setResistance] = useState("");
  const [saving, setSaving] = useState(false);

  function goBackSafe() {
    if (r.canGoBack()) r.back();
    else r.replace(ROUTES.client.reflections);
  }

  async function onSubmit() {
    if (saving) return;

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

      await createReflection({
        feeling_after_session: feelingV,
        what_learned: learnedV,
        positive_point: positiveV,
        resistance_or_disagreement: resistanceV || undefined,
      });

      Alert.alert("Reflexão enviada!", "Sua reflexão foi salva com sucesso.");
      r.replace(ROUTES.client.reflections);
    } catch (e: any) {
      console.log("createReflection:", e?.message);
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={goBackSafe} hitSlop={16} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>← Voltar</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Nova Reflexão</Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Preencha com calma. Os campos com * são obrigatórios.
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
          style={[styles.input, styles.lastInput]}
          placeholder="Se quiser, descreva aqui..."
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
            {saving ? "Salvando..." : "Salvar Reflexão"}
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
