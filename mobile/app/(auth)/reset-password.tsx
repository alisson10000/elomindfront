import { useMemo, useState } from "react";
import {
<<<<<<< HEAD
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
=======
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

// ✅ tema EloMind (Colors) + hook de esquema
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function ResetPasswordScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
  const styles = makeStyles(theme);
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

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
<<<<<<< HEAD

=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    if (!token.trim()) {
      Alert.alert("Atenção", "Digite o código/token recebido no email.");
      return;
    }
<<<<<<< HEAD

=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    if (password.length < 8) {
      Alert.alert("Senha fraca", "Use pelo menos 8 caracteres.");
      return;
    }
<<<<<<< HEAD

=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    if (password !== confirm) {
      Alert.alert("Senhas diferentes", "Confirme a mesma senha.");
      return;
    }

    try {
      setLoading(true);

<<<<<<< HEAD
      await resetPassword({
=======
      await api.post("/auth/reset-password", {
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        email,
        token: token.trim(),
        password,
      });

      Alert.alert("Sucesso", "Senha atualizada. Faça login novamente.");
<<<<<<< HEAD
      router.replace(ROUTES.auth.login);
=======
      router.replace("/login" as any);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        "Não foi possível redefinir. Confira o código/token e tente novamente.";
<<<<<<< HEAD

=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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
<<<<<<< HEAD
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
=======
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <View
          style={{
            borderRadius: 18,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
            padding: 18,
            shadowColor: theme.text,
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 2,
          }}
        >
          <Image
            source={require("../../assets/images/EloMind.png")}
            style={{ width: 140, height: 60, alignSelf: "center", marginBottom: 10 }}
            resizeMode="contain"
          />

          <Text style={{ fontSize: 20, fontWeight: "800", color: theme.text, textAlign: "center" }}>
            Redefinir senha
          </Text>

          <Text style={{ marginTop: 8, color: theme.muted, textAlign: "center" }}>
            Digite o código/token do email e crie sua nova senha.
          </Text>

          <View style={{ marginTop: 16, gap: 10 }}>
            <Text style={{ fontWeight: "800", color: theme.text, marginBottom: 6 }}>
              Email
            </Text>
            <TextInput
              value={email}
              editable={false}
              style={{
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.input,
                color: theme.text,
                padding: 12,
                borderRadius: 12,
                opacity: 0.75,
              }}
            />

            <Text style={{ fontWeight: "800", color: theme.text, marginBottom: 6 }}>
              Código / Token
            </Text>
            <TextInput
              placeholder="Cole aqui o código/token"
              placeholderTextColor={theme.icon}
              autoCapitalize="none"
              value={token}
              onChangeText={setToken}
              editable={!loading}
              style={{
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.input,
                color: theme.text,
                padding: 12,
                borderRadius: 12,
              }}
            />

            <Text style={{ fontWeight: "800", color: theme.text, marginBottom: 6 }}>
              Nova senha
            </Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={theme.icon}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              style={{
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.input,
                color: theme.text,
                padding: 12,
                borderRadius: 12,
              }}
            />

            <Text style={{ fontWeight: "800", color: theme.text, marginBottom: 6 }}>
              Confirmar senha
            </Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={theme.icon}
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
              editable={!loading}
              style={{
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.input,
                color: theme.text,
                padding: 12,
                borderRadius: 12,
              }}
            />

            <Pressable
              onPress={handleReset}
              disabled={loading}
              style={({ pressed }) => ({
                marginTop: 6,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
                backgroundColor: theme.primary,
                opacity: loading ? 0.7 : pressed ? 0.9 : 1,
              })}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>
                {loading ? "Salvando..." : "Salvar nova senha"}
              </Text>
            </Pressable>

            <Pressable
              onPress={goBack}
              disabled={loading}
              style={{
                marginTop: 8,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.input,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text style={{ fontWeight: "900", color: theme.text }}>Voltar</Text>
            </Pressable>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
