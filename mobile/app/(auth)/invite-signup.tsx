import { useMemo, useState } from "react";
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
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
<<<<<<< HEAD
import { signupWithInvitation } from "@/lib/services/invitation-service";
import { makeStyles } from "@/styles/auth/invite-signup.styles";
=======
import { api } from "@/lib/api";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function InviteSignupScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
  const styles = makeStyles(theme);
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  const params = useLocalSearchParams();

  const code = useMemo(() => {
    const raw = (params as any)?.code;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const email = useMemo(() => {
    const raw = (params as any)?.email;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function goBackSafe() {
    if (router.canGoBack()) router.back();
    else router.replace("/(auth)/login");
  }

  async function handleSignup() {
    const cleanName = name.trim();
    const cleanPass = password.trim();
    const cleanCode = String(code || "").trim();

    if (!cleanCode) {
      Alert.alert("Convite inválido", "Volte e valide o código novamente.");
      router.replace("/(auth)/invite-code");
      return;
    }

    if (!cleanName) {
      Alert.alert("Atenção", "Digite seu nome.");
      return;
    }

    if (cleanPass.length < 6) {
      Alert.alert("Senha fraca", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);

<<<<<<< HEAD
      await signupWithInvitation({
        token: cleanCode,
        name: cleanName,
        password: cleanPass,
        email: email || undefined,
=======
      // ⚠️ Seu backend pode esperar "token" ao invés de "code"
      // Como no validate ele pediu token, aqui vamos mandar "token" também.
      await api.post("/invitations/signup", {
        token: cleanCode,
        name: cleanName,
        password: cleanPass,
        email: email || undefined, // se o backend ignorar, ok
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      });

      Alert.alert("Conta criada!", "Agora faça login com seu e-mail e senha.");
      router.replace("/(auth)/login");
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Não foi possível criar a conta.";

      Alert.alert("Erro", String(detail));
    } finally {
      setLoading(false);
    }
  }

<<<<<<< HEAD
  if (!code) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidTitle}>Convite inválido</Text>
          <Text style={styles.invalidText}>
=======
  // Se entrou aqui sem params, evita tela “vazia”
  if (!code) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "900", color: theme.text, marginBottom: 10 }}>
            Convite inválido
          </Text>
          <Text style={{ color: theme.muted, marginBottom: 16 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            Volte e valide seu código novamente.
          </Text>

          <Pressable
            onPress={() => router.replace("/(auth)/invite-code")}
<<<<<<< HEAD
            style={styles.invalidButton}
          >
            <Text style={styles.invalidButtonText}>
=======
            style={{
              paddingVertical: 14,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "900", color: theme.text }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              Ir para validar código
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
<<<<<<< HEAD
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboard}
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
              style={[
                styles.backButton,
                loading && styles.backButtonDisabled,
              ]}
            >
              <Text style={styles.backButtonText}>← voltar</Text>
            </Pressable>

            <Text style={styles.title}>Criar conta</Text>
          </View>

          <Text style={styles.subtitle}>
=======
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
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
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text style={{ fontWeight: "900", color: theme.text }}>← voltar</Text>
            </Pressable>

            <Text style={{ fontSize: 18, fontWeight: "900", color: theme.text }}>
              Criar conta
            </Text>
          </View>

          <Text style={{ color: theme.muted, marginBottom: 18 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            Complete seu cadastro usando o convite.
            {email ? ` (${email})` : ""}
          </Text>

<<<<<<< HEAD
          <View style={styles.card}>
            <Text style={styles.label}>Nome</Text>
=======
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
            <Text style={{ fontWeight: "800", color: theme.text }}>Nome</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
<<<<<<< HEAD
              placeholderTextColor={theme.placeholder}
              editable={!loading}
              style={styles.input}
            />

            <Text style={styles.label}>Senha</Text>
=======
              placeholderTextColor={theme.muted}
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
            />

            <Text style={{ fontWeight: "800", color: theme.text }}>Senha</Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Crie uma senha"
<<<<<<< HEAD
              placeholderTextColor={theme.placeholder}
              secureTextEntry
              editable={!loading}
              style={styles.input}
=======
              placeholderTextColor={theme.muted}
              secureTextEntry
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
              onPress={handleSignup}
              disabled={loading}
<<<<<<< HEAD
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                loading && styles.primaryButtonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color={theme.primaryText} />
              ) : (
                <Text style={styles.primaryButtonText}>Criar conta</Text>
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
                <Text style={{ fontSize: 16, fontWeight: "900", color: theme.text }}>
                  Criar conta
                </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              )}
            </Pressable>

            <Pressable
              onPress={() => router.replace("/(auth)/login")}
              disabled={loading}
<<<<<<< HEAD
              style={[
                styles.secondaryButton,
                loading && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.secondaryButtonText}>
=======
              style={{ paddingVertical: 12, borderRadius: 12, alignItems: "center" }}
            >
              <Text style={{ fontWeight: "700", color: theme.muted }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
                Já tenho conta (Login)
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
