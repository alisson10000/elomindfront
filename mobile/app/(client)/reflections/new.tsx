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

<<<<<<< HEAD
import { ROUTES } from "@/constants/routes";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createReflection } from "@/lib/reflections";
import { createStyles } from "@/styles/client/reflections/new.styles";
=======
import { createReflection } from "../../../lib/reflections";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function NewReflection() {
  const r = useRouter();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
  const styles = createStyles(theme);
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

  const [feeling, setFeeling] = useState("");
  const [learned, setLearned] = useState("");
  const [positive, setPositive] = useState("");
  const [resistance, setResistance] = useState("");
  const [saving, setSaving] = useState(false);

  function goBackSafe() {
<<<<<<< HEAD
    if (r.canGoBack()) r.back();
    else r.replace(ROUTES.client.reflections);
=======
    // debug para ver se o clique está chegando
    console.log("🔙 goBackSafe chamado");

    // se não houver histórico, vai direto para a lista
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(client)/reflections" as any);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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
<<<<<<< HEAD
      r.replace(ROUTES.client.reflections);
    } catch (e: any) {
      console.log("createReflection:", e?.message);
=======
      r.replace("/(client)/reflections" as any);
    } catch (e: any) {
      console.log("❌ createReflection:", e?.message);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

<<<<<<< HEAD
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header com zIndex/elevation para não “perder” toque */}
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
          onPressIn={() => console.log("✅ pressionou VOLTAR")}
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
          Nova Reflexão
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
          Preencha com calma. Os campos com * são obrigatórios.
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
          Preencha com calma. Os campos com * são obrigatórios.
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
          style={[styles.input, styles.lastInput]}
          placeholder="Se quiser, descreva aqui..."
=======
          style={inputStyle}
          placeholder="Se quiser, descreva aqui…"
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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
            {saving ? "Salvando..." : "Salvar Reflexão"}
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
}
