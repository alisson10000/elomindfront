import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import AppButton from "@/components/AppButton";
import AppInput from "@/components/AppInput";
import FormField from "@/components/FormField";
import { ROUTES } from "@/constants/routes";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { loginWithSession } from "@/lib/auth";
import { loadRemember } from "@/lib/remember";
import { makeStyles } from "@/styles/auth/login.styles";

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = makeStyles(theme);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { remember, email: savedEmail } = await loadRemember();
        setRememberMe(remember);

        if (savedEmail) {
          setEmail(savedEmail);
        }
      } catch (error: any) {
        console.log(
          "Erro ao carregar preferências de login:",
          error?.message || error
        );
      }
    })();
  }, []);

  async function handleLogin() {
    if (loading) return;

    const emailTrim = email.trim();

    if (!emailTrim || !password) {
      Alert.alert("Atenção", "Preencha email e senha.");
      return;
    }

    try {
      setLoading(true);

      const result = await loginWithSession({
        email: emailTrim,
        password,
        rememberMe,
      });

      setPassword("");
      router.replace(result.redirectTo);
    } catch (err: any) {
      const status = err?.response?.status;
      const detailRaw =
        err?.response?.data?.detail ?? err?.response?.data?.message ?? "";
      const detail = String(detailRaw).toLowerCase();

      if (status === 403 && detail.includes("inactive")) {
        Alert.alert(
          "Conta desativada",
          "Seu acesso foi desativado. Fale com o terapeuta/suporte."
        );
        return;
      }

      if (status === 401) {
        Alert.alert("Credenciais inválidas", "Email ou senha incorretos.");
        return;
      }

      Alert.alert("Erro no login", "Veja o console.");
    } finally {
      setLoading(false);
    }
  }

  function goToInviteCode() {
    router.push(ROUTES.auth.inviteCode);
  }

  function goToForgotPassword() {
    router.push(ROUTES.auth.forgotPassword);
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

          <Text style={styles.subtitle}>
            Entre para registrar suas reflexões
          </Text>

          <View style={styles.form}>
            <FormField label="Email" labelStyle={styles.label}>
              <AppInput
                inputStyle={styles.input}
                testID="login-email-input"
                placeholder="seuemail@exemplo.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                returnKeyType="next"
              />
            </FormField>

            <FormField
              label="Senha"
              labelStyle={[styles.label, styles.labelSpacing]}
            >
              <AppInput
                inputStyle={styles.input}
                testID="login-password-input"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                returnKeyType="done"
              />
            </FormField>

            <View style={styles.rememberRow}>
              <Text style={styles.rememberText}>Lembrar email</Text>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                disabled={loading}
                trackColor={{ false: theme.border, true: theme.primary }}
              />
            </View>

            <AppButton
              title={loading ? "Entrando..." : "Entrar"}
              onPress={handleLogin}
              disabled={loading}
              style={[styles.button, loading && styles.buttonDisabled]}
              testID="login-submit-button"
            />

            <Pressable
              onPress={goToForgotPassword}
              disabled={loading}
              style={{
                marginTop: 10,
                paddingVertical: 8,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text style={{ color: theme.primary, fontWeight: "800" }}>
                Esqueci minha senha
              </Text>
            </Pressable>

            <AppButton
              title="Tenho um código de convite"
              onPress={goToInviteCode}
              disabled={loading}
              variant="secondary"
              style={{
                marginTop: 12,
                borderRadius: 12,
                borderColor: theme.border,
                backgroundColor: theme.input,
              }}
              textStyle={{ fontWeight: "800", color: theme.text }}
            />

            <Text style={styles.footer}>
              Dica: use o mesmo usuário que você criou no Swagger.
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
