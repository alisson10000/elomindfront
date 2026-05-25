import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  createStyles,
  getInviteClientTheme,
} from "@/styles/therapist/invite-client/index.styles";
import { sendInvitation } from "@/lib/services/invitation-service";

type Scheme = "light" | "dark";

export default function InviteClientScreen() {
  const colorScheme = (useColorScheme() ?? "light") as Scheme;
  const styles = createStyles(colorScheme);
  const ui = getInviteClientTheme(colorScheme);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function goBackSafe() {
    if (router.canGoBack()) router.back();
    else router.replace("/(therapist)/(tabs)/therapist-home");
  }

  async function handleSendInvite() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      Alert.alert("Email inválido", "Digite um e-mail válido.");
      return;
    }

    try {
      setLoading(true);

      await sendInvitation({ email: cleanEmail });

      Alert.alert(
        "Convite enviado!",
        "O cliente receberá um e-mail com o código para criar a conta."
      );

      setEmail("");
      goBackSafe();
    } catch (err: any) {
      if (err?.message === "NO_TOKEN") {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        router.replace("/(auth)/login");
        return;
      }

      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Não foi possível enviar o convite.";

      const str = String(msg);

      if (str.includes("Email already registered")) {
        Alert.alert("Já cadastrado", "Esse e-mail já possui usuário.");
      } else if (str.includes("Forbidden")) {
        Alert.alert("Acesso negado", "Somente terapeutas podem enviar convites.");
      } else {
        Alert.alert("Erro", str);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable
            onPress={goBackSafe}
            disabled={loading}
            style={[styles.backButton, loading && styles.disabled]}
          >
            <Text style={styles.backButtonText}>← voltar</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Convidar Cliente</Text>
        </View>

        <Text style={styles.description}>
          Digite o e-mail do cliente. Ele receberá um código para criar a conta.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>E-mail</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="cliente@email.com"
            placeholderTextColor={ui.placeholderColor}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
            style={styles.input}
          />

          <Pressable
            onPress={handleSendInvite}
            disabled={loading}
            style={[styles.submitButton, loading && styles.disabled]}
          >
            {loading ? (
              <ActivityIndicator color={ui.activityIndicatorColor} />
            ) : (
              <Text style={styles.submitButtonText}>Enviar Convite</Text>
            )}
          </Pressable>

          <Pressable
            onPress={goBackSafe}
            disabled={loading}
            style={[styles.cancelButton, loading && styles.disabled]}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
          EloMind — plataforma de apoio terapêutico
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
