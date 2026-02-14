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

export default function EditReflection() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const reflectionId = useMemo(() => {
    const raw = (params as any)?.id;
    const value = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  // ✅ NOVO: recebe flag de permissão (enviado pela tela Detail)
  const canEdit = useMemo(() => {
    const raw = (params as any)?.can_edit;
    const value = Array.isArray(raw) ? raw[0] : raw;

    // Se não vier (fluxo antigo), assume true pra não quebrar
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
  const [resistance, setResistance] = useState(initial.resistance_or_disagreement);

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

    // ✅ REGRA: não permitir editar após feedback aprovado
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
      // ✅ AJUSTE: mostra o "detail" do backend quando existir (ex: 400 por feedback aprovado)
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
            Não consegui abrir essa reflexão (ID inválido).
          </Text>

          <Pressable
            onPress={() => r.replace("/(client)/reflections" as any)}
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
              Voltar para Minhas Reflexões
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

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
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
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
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
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
            {saving ? "Salvando..." : "Salvar Alterações"}
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
