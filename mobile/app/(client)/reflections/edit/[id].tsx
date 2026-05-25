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
<<<<<<< HEAD
import { createStyles } from "@/styles/client/reflections/edit/id.styles";
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function EditReflection() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
  const styles = createStyles(theme);
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

  const reflectionId = useMemo(() => {
    const raw = (params as any)?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }, [params]);

<<<<<<< HEAD
=======
  // ✅ NOVO: recebe flag de permissão (enviado pela tela Detail)
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  const canEdit = useMemo(() => {
    const raw = (params as any)?.can_edit;
    const value = Array.isArray(raw) ? raw[0] : raw;

<<<<<<< HEAD
=======
    // Se não vier (fluxo antigo), assume true pra não quebrar
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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
<<<<<<< HEAD
  const [resistance, setResistance] = useState(
    initial.resistance_or_disagreement
  );
=======
  const [resistance, setResistance] = useState(initial.resistance_or_disagreement);

>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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

<<<<<<< HEAD
=======
    // ✅ REGRA: não permitir editar após feedback aprovado
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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
<<<<<<< HEAD
=======
      // ✅ AJUSTE: mostra o "detail" do backend quando existir (ex: 400 por feedback aprovado)
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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

<<<<<<< HEAD
  if (!reflectionId) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.centerContent}>
          <Text style={styles.centerTitle}>
=======
  const inputStyle = {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    marginBottom: 14,
    borderColor: theme.border,
    backgroundColor: theme.input,
    color: theme.text,
  } as const;

  // Se ID inválido, mostra tela simples
  if (!reflectionId) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.background }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            Não consegui abrir essa reflexão (ID inválido).
          </Text>

          <Pressable
            onPress={() => r.replace("/(client)/reflections" as any)}
<<<<<<< HEAD
            style={styles.ghostButton}
          >
            <Text style={styles.ghostButtonText}>
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              Voltar para Minhas Reflexões
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

<<<<<<< HEAD
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
=======
  // ✅ NOVO: se não pode editar, bloqueia a tela inteira (rota forçada / deep link)
  if (!canEdit) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.background }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 56,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
            backgroundColor: theme.background,
            flexDirection: "row",
            alignItems: "center",
            zIndex: 10,
            elevation: 10,
          }}
        >
          <Pressable
            onPress={goBackSafe}
            hitSlop={16}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "900" }}>← Voltar</Text>
          </Pressable>

          <Text
            style={{
              flex: 1,
              textAlign: "center",
              color: theme.text,
              fontSize: 16,
              fontWeight: "900",
              marginRight: 84,
            }}
          >
            Editar Reflexão
          </Text>
        </View>

        <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
          <Text
            style={{
              color: theme.text,
              fontSize: 16,
              fontWeight: "900",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Edição bloqueada
          </Text>

          <Text style={{ color: theme.muted, textAlign: "center", marginBottom: 18 }}>
            Não é possível editar esta reflexão porque já existe feedback aprovado.
          </Text>

          <Pressable
            onPress={goBackSafe}
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
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
<<<<<<< HEAD
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
=======
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header igual ao New */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 56,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          backgroundColor: theme.background,
          flexDirection: "row",
          alignItems: "center",
          zIndex: 10,
          elevation: 10,
        }}
      >
        <Pressable
          onPress={goBackSafe}
          hitSlop={16}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
          }}
        >
          <Text style={{ color: theme.text, fontWeight: "900" }}>← Voltar</Text>
        </Pressable>

        <Text
          style={{
            flex: 1,
            textAlign: "center",
            color: theme.text,
            fontSize: 16,
            fontWeight: "900",
            marginRight: 84,
          }}
        >
          Editar Reflexão
        </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
<<<<<<< HEAD
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
=======
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
      >
        <Text style={{ color: theme.muted, marginBottom: 14 }}>
          Atualize os campos que desejar. Os campos com * são obrigatórios.
        </Text>

        <Text style={{ color: theme.text, fontWeight: "700" }}>
          Como você se sentiu após a sessão? *
        </Text>
        <TextInput
          value={feeling}
          onChangeText={setFeeling}
          style={inputStyle}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          placeholder="Ex: mais leve, ansioso(a), confuso(a)..."
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

<<<<<<< HEAD
        <Text style={styles.label}>O que você aprendeu ou percebeu? *</Text>
        <TextInput
          value={learned}
          onChangeText={setLearned}
          style={styles.input}
=======
        <Text style={{ color: theme.text, fontWeight: "700" }}>
          O que você aprendeu ou percebeu? *
        </Text>
        <TextInput
          value={learned}
          onChangeText={setLearned}
          style={inputStyle}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          placeholder="Ex: percebi um padrão, entendi uma causa..."
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

<<<<<<< HEAD
        <Text style={styles.label}>Qual ponto positivo você destaca? *</Text>
        <TextInput
          value={positive}
          onChangeText={setPositive}
          style={styles.input}
=======
        <Text style={{ color: theme.text, fontWeight: "700" }}>
          Qual ponto positivo você destaca? *
        </Text>
        <TextInput
          value={positive}
          onChangeText={setPositive}
          style={inputStyle}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          placeholder="Ex: consegui me expressar melhor..."
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

<<<<<<< HEAD
        <Text style={styles.label}>
=======
        <Text style={{ color: theme.text, fontWeight: "700" }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          Teve algo que você discordou ou sentiu resistência? (opcional)
        </Text>
        <TextInput
          value={resistance}
          onChangeText={setResistance}
<<<<<<< HEAD
          style={styles.input}
=======
          style={inputStyle}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          placeholder="Se quiser, descreva aqui…"
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

        <Pressable
          onPress={onSubmit}
          disabled={saving}
<<<<<<< HEAD
          style={[styles.submitButton, saving && styles.disabledButton]}
        >
          <Text style={styles.submitButtonText}>
=======
          style={{
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
            backgroundColor: theme.primary,
            opacity: saving ? 0.7 : 1,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 16 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Text>
        </Pressable>

        <Pressable
          onPress={goBackSafe}
          disabled={saving}
<<<<<<< HEAD
          style={[styles.cancelButton, saving && styles.disabledButton]}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
=======
          style={{
            marginTop: 10,
            paddingVertical: 12,
            borderRadius: 12,
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
            opacity: saving ? 0.7 : 1,
          }}
        >
          <Text style={{ color: theme.text, fontWeight: "800" }}>Cancelar</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
