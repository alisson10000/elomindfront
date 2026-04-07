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
import { api } from "@/lib/api";
import { makeStyles } from "@/styles/auth/invite-signup.styles";

export default function InviteSignupScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = makeStyles(theme);
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

      await api.post("/invitations/signup", {
        token: cleanCode,
        name: cleanName,
        password: cleanPass,
        email: email || undefined,
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

  if (!code) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidTitle}>Convite inválido</Text>
          <Text style={styles.invalidText}>
            Volte e valide seu código novamente.
          </Text>

          <Pressable
            onPress={() => router.replace("/(auth)/invite-code")}
            style={styles.invalidButton}
          >
            <Text style={styles.invalidButtonText}>
              Ir para validar código
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
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
            Complete seu cadastro usando o convite.
            {email ? ` (${email})` : ""}
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              placeholderTextColor={theme.placeholder}
              editable={!loading}
              style={styles.input}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Crie uma senha"
              placeholderTextColor={theme.placeholder}
              secureTextEntry
              editable={!loading}
              style={styles.input}
            />

            <Pressable
              onPress={handleSignup}
              disabled={loading}
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
              )}
            </Pressable>

            <Pressable
              onPress={() => router.replace("/(auth)/login")}
              disabled={loading}
              style={[
                styles.secondaryButton,
                loading && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.secondaryButtonText}>
                Já tenho conta (Login)
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}