<<<<<<< HEAD
=======
// app/(client)/dreams/new.tsx
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createDream } from "@/lib/dreams";
<<<<<<< HEAD
import { makeStyles } from "@/styles/client/dreams/dream-new.styles";
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function NewDream() {
  const r = useRouter();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
  const styles = makeStyles(theme);
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  function goBackSafe() {
<<<<<<< HEAD
=======
    console.log("🔙 goBackSafe (dreams) chamado");
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(client)" as any);
  }

  async function onSubmit() {
    if (saving) return;

    const desc = description.trim();

    if (desc.length < 10) {
<<<<<<< HEAD
      Alert.alert(
        "Atenção",
        "Descreva um pouco mais o sonho (mín. 10 caracteres)."
      );
=======
      Alert.alert("Atenção", "Descreva um pouco mais o sonho (mín. 10 caracteres).");
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      return;
    }

    try {
      setSaving(true);

      const created = await createDream(desc);

      Alert.alert("Sonho registrado!", "Seu sonho foi salvo com sucesso.");

<<<<<<< HEAD
=======
      // ✅ Navegação igual ao padrão do NewReflection (sempre com `useRouter` + `as any`)
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      r.replace(
        `/(client)/dreams/${created.id}?created_at=${encodeURIComponent(
          created.created_at
        )}` as any
      );
<<<<<<< HEAD
    } catch {
=======
    } catch (e: any) {
      console.log("❌ createDream:", e?.message);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      Alert.alert("Erro", "Não foi possível registrar o sonho.");
    } finally {
      setSaving(false);
    }
  }

<<<<<<< HEAD
  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={goBackSafe} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>

        <Text style={styles.title}>Novo Sonho</Text>
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
      {/* Header (mesmo padrão do NewReflection) */}
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
          onPressIn={() => console.log("✅ pressionou VOLTAR (dreams)")}
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
          Novo Sonho
        </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
<<<<<<< HEAD
        contentContainerStyle={styles.content}
      >
        <Text style={styles.description}>
          Escreva do seu jeito. Depois de salvar, ele fica registrado e visível
          apenas para o terapeuta.
        </Text>

        <Text style={styles.label}>Descrição do sonho *</Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          placeholder="Descreva o sonho..."
=======
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
      >
        <Text style={{ color: theme.muted, marginBottom: 14 }}>
          Escreva do seu jeito. Depois de salvar, ele fica registrado e visível apenas
          para o terapeuta.
        </Text>

        <Text style={{ color: theme.text, fontWeight: "700" }}>
          Descrição do sonho *
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={inputStyle}
          placeholder="Descreva o sonho…"
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

        <Pressable
          onPress={onSubmit}
          disabled={saving}
<<<<<<< HEAD
          style={[
            styles.primaryButton,
            saving && styles.primaryButtonDisabled,
          ]}
        >
          <Text style={styles.primaryButtonText}>
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
            {saving ? "Salvando..." : "Registrar sonho"}
          </Text>
        </Pressable>

        <Pressable
          onPress={goBackSafe}
          disabled={saving}
<<<<<<< HEAD
          style={[
            styles.secondaryButton,
            saving && styles.primaryButtonDisabled,
          ]}
        >
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
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
