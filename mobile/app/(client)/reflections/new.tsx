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

import { createReflection } from "../../../lib/reflections";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function NewReflection() {
  const r = useRouter();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [feeling, setFeeling] = useState("");
  const [learned, setLearned] = useState("");
  const [positive, setPositive] = useState("");
  const [resistance, setResistance] = useState("");
  const [saving, setSaving] = useState(false);

  function goBackSafe() {
    // debug para ver se o clique está chegando
    console.log("🔙 goBackSafe chamado");

    // se não houver histórico, vai direto para a lista
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(client)/reflections" as any);
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
      r.replace("/(client)/reflections" as any);
    } catch (e: any) {
      console.log("❌ createReflection:", e?.message);
      Alert.alert("Erro", "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

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
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
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
          placeholder="Ex: mais leve, ansioso(a), confuso(a)..."
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

        <Text style={{ color: theme.text, fontWeight: "700" }}>
          O que você aprendeu ou percebeu? *
        </Text>
        <TextInput
          value={learned}
          onChangeText={setLearned}
          style={inputStyle}
          placeholder="Ex: percebi um padrão, entendi uma causa..."
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

        <Text style={{ color: theme.text, fontWeight: "700" }}>
          Qual ponto positivo você destaca? *
        </Text>
        <TextInput
          value={positive}
          onChangeText={setPositive}
          style={inputStyle}
          placeholder="Ex: consegui me expressar melhor..."
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

        <Text style={{ color: theme.text, fontWeight: "700" }}>
          Teve algo que você discordou ou sentiu resistência? (opcional)
        </Text>
        <TextInput
          value={resistance}
          onChangeText={setResistance}
          style={inputStyle}
          placeholder="Se quiser, descreva aqui…"
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

        <Pressable
          onPress={onSubmit}
          disabled={saving}
          style={{
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
            backgroundColor: theme.primary,
            opacity: saving ? 0.7 : 1,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 16 }}>
            {saving ? "Salvando..." : "Salvar Reflexão"}
          </Text>
        </Pressable>

        <Pressable
          onPress={goBackSafe}
          disabled={saving}
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
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
