import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { api } from "../../lib/api";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { makeStyles } from "@/styles/auth/reset-password.styles";

export default function ResetPasswordScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = makeStyles(theme);

  const params = useLocalSearchParams<{ email?: string }>();
  const emailFromParams = useMemo(
    () => (params.email ? String(params.email) : ""),
    [params.email]
  );

  const [email] = useState(emailFromParams);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!email) {
      Alert.alert("Erro", "Email não encontrado. Volte e informe seu email.");
      return;
    }

    if (!token.trim()) {
      Alert.alert("Atenção", "Digite o código/token recebido no email.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Senha fraca", "Use pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirm) {
      Alert.alert("Senhas diferentes", "Confirme a mesma senha.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        email,
        token: token.trim(),
        password,
      });

      Alert.alert("Sucesso", "Senha atualizada. Faça login novamente.");
      router.replace("/login" as any);
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        "Não foi possível redefinir. Confira o código/token e tente novamente.";

      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Image
            source={require("../../assets/images/EloMind.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Redefinir senha</Text>

          <Text style={styles.subtitle}>
            Digite o código/token do email e crie sua nova senha.
          </Text>

          <View style={styles.form}>
            <View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                editable={false}
                style={[styles.input, styles.disabledInput]}
              />
            </View>

            <View>
              <Text style={styles.label}>Código / Token</Text>
              <TextInput
                placeholder="Cole aqui o código/token"
                placeholderTextColor={theme.placeholder}
                autoCapitalize="none"
                value={token}
                onChangeText={setToken}
                editable={!loading}
                style={styles.input}
              />
            </View>

            <View>
              <Text style={styles.label}>Nova senha</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={theme.placeholder}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                style={styles.input}
              />
            </View>

            <View>
              <Text style={styles.label}>Confirmar senha</Text>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={theme.placeholder}
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
                editable={!loading}
                style={styles.input}
              />
            </View>

            <Pressable
              onPress={handleReset}
              disabled={loading}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                loading && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Salvando..." : "Salvar nova senha"}
              </Text>
            </Pressable>

            <Pressable
              onPress={goBack}
              disabled={loading}
              style={[
                styles.secondaryButton,
                loading && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Voltar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}