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
import { makeStyles } from "@/styles/client/dreams/dream-new.styles";

export default function NewDream() {
  const r = useRouter();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = makeStyles(theme);

  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  function goBackSafe() {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(client)" as any);
  }

  async function onSubmit() {
    if (saving) return;

    const desc = description.trim();

    if (desc.length < 10) {
      Alert.alert(
        "Atenção",
        "Descreva um pouco mais o sonho (mín. 10 caracteres)."
      );
      return;
    }

    try {
      setSaving(true);

      const created = await createDream(desc);

      Alert.alert("Sonho registrado!", "Seu sonho foi salvo com sucesso.");

      r.replace(
        `/(client)/dreams/${created.id}?created_at=${encodeURIComponent(
          created.created_at
        )}` as any
      );
    } catch {
      Alert.alert("Erro", "Não foi possível registrar o sonho.");
    } finally {
      setSaving(false);
    }
  }

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
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
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
          placeholderTextColor={theme.icon}
          multiline
          textAlignVertical="top"
        />

        <Pressable
          onPress={onSubmit}
          disabled={saving}
          style={[
            styles.primaryButton,
            saving && styles.primaryButtonDisabled,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {saving ? "Salvando..." : "Registrar sonho"}
          </Text>
        </Pressable>

        <Pressable
          onPress={goBackSafe}
          disabled={saving}
          style={[
            styles.secondaryButton,
            saving && styles.primaryButtonDisabled,
          ]}
        >
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
