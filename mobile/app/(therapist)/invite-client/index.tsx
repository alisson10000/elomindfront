<<<<<<< HEAD
=======
// app/(therapist)/invite-client/index.tsx
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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

<<<<<<< HEAD
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
=======
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { api } from "@/lib/api";
import { getToken } from "@/lib/token"; // ✅ usa a chave @elomind_token

export default function InviteClientScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

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

<<<<<<< HEAD
      await sendInvitation({ email: cleanEmail });
=======
      // ✅ pega token do lugar certo
      const token = await getToken();
      if (!token) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        router.replace("/(auth)/login");
        return;
      }

      await api.post(
        "/invitations",
        { email: cleanEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

      Alert.alert(
        "Convite enviado!",
        "O cliente receberá um e-mail com o código para criar a conta."
      );

      setEmail("");
      goBackSafe();
    } catch (err: any) {
<<<<<<< HEAD
      if (err?.message === "NO_TOKEN") {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        router.replace("/(auth)/login");
        return;
      }

=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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
<<<<<<< HEAD
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
=======
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
            marginTop: 10,
          }}
        >
          <Pressable
            onPress={goBackSafe}
            disabled={loading}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              marginRight: 12,
              marginTop: 4,
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text style={{ fontWeight: "900", color: theme.text }}>
              ← voltar
            </Text>
          </Pressable>

          <Text style={{ fontSize: 18, fontWeight: "900", color: theme.text }}>
            Convidar Cliente
          </Text>
        </View>

        {/* Descrição */}
        <Text style={{ color: theme.muted, marginBottom: 18 }}>
          Digite o e-mail do cliente. Ele receberá um código para criar a conta.
        </Text>

        {/* Card */}
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
            borderRadius: 16,
            padding: 16,
            gap: 12,
          }}
        >
          <Text style={{ fontWeight: "800", color: theme.text }}>E-mail</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="cliente@email.com"
<<<<<<< HEAD
            placeholderTextColor={ui.placeholderColor}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
            style={styles.input}
=======
            placeholderTextColor={theme.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
            style={{
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.background,
              color: theme.text,
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderRadius: 12,
            }}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          />

          <Pressable
            onPress={handleSendInvite}
            disabled={loading}
<<<<<<< HEAD
            style={[styles.submitButton, loading && styles.disabled]}
          >
            {loading ? (
              <ActivityIndicator color={ui.activityIndicatorColor} />
            ) : (
              <Text style={styles.submitButtonText}>Enviar Convite</Text>
=======
            style={{
              paddingVertical: 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              alignItems: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "900",
                  color: theme.text,
                }}
              >
                Enviar Convite
              </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            )}
          </Pressable>

          <Pressable
            onPress={goBackSafe}
            disabled={loading}
<<<<<<< HEAD
            style={[styles.cancelButton, loading && styles.disabled]}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>
=======
            style={{
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text style={{ fontWeight: "700", color: theme.muted }}>
              Cancelar
            </Text>
          </Pressable>
        </View>

        <Text style={{ marginTop: 18, color: theme.muted, textAlign: "center" }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          EloMind — plataforma de apoio terapêutico
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
