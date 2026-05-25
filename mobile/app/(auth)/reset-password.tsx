import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import AppButton from "@/components/AppButton";
import AppInput from "@/components/AppInput";
import FormField from "@/components/FormField";
import { ROUTES } from "@/constants/routes";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { resetPassword } from "@/lib/services/auth-service";
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

      await resetPassword({
        email,
        token: token.trim(),
        password,
      });

      Alert.alert("Sucesso", "Senha atualizada. Faça login novamente.");
      router.replace(ROUTES.auth.login);
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
            <FormField label="Email" labelStyle={styles.label}>
              <AppInput
                inputStyle={[styles.input, styles.disabledInput]}
                testID="reset-password-email-input"
                value={email}
                editable={false}
                selectTextOnFocus={false}
              />
            </FormField>

            <FormField label="Código / Token" labelStyle={styles.label}>
              <AppInput
                inputStyle={styles.input}
                testID="reset-password-token-input"
                placeholder="Cole aqui o código/token"
                autoCapitalize="none"
                value={token}
                onChangeText={setToken}
                editable={!loading}
              />
            </FormField>

            <FormField label="Nova senha" labelStyle={styles.label}>
              <AppInput
                inputStyle={styles.input}
                testID="reset-password-password-input"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </FormField>

            <FormField label="Confirmar senha" labelStyle={styles.label}>
              <AppInput
                inputStyle={styles.input}
                testID="reset-password-confirm-input"
                placeholder="••••••••"
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
                editable={!loading}
              />
            </FormField>

            <AppButton
              title={loading ? "Salvando..." : "Salvar nova senha"}
              onPress={handleReset}
              disabled={loading}
              style={[
                styles.primaryButton,
                loading && styles.primaryButtonDisabled,
              ]}
            />

            <AppButton
              title="Voltar"
              onPress={goBack}
              disabled={loading}
              variant="secondary"
              style={[
                styles.secondaryButton,
                loading && styles.primaryButtonDisabled,
              ]}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
