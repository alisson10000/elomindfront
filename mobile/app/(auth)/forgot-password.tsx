import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import AppButton from "@/components/AppButton";
import AppInput from "@/components/AppInput";
import FormField from "@/components/FormField";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { requestPasswordReset } from "@/lib/services/auth-service";
import { makeStyles } from "@/styles/auth/forgot-password.styles";

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = makeStyles(theme);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    const emailTrim = email.trim();

    if (!emailTrim) {
      Alert.alert("Atenção", "Digite seu email.");
      return;
    }

    try {
      setLoading(true);
      await requestPasswordReset({ email: emailTrim });
    } catch {
      // Mantém o comportamento atual: a resposta é sempre genérica.
    } finally {
      setLoading(false);
    }

    Alert.alert(
      "Pronto!",
      "Se esse email existir, enviamos um código/token. Digite ele na próxima tela junto com sua nova senha."
    );

    router.push({
      pathname: "/(auth)/reset-password",
      params: { email: emailTrim },
    });
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

          <Text style={styles.title}>Esqueci minha senha</Text>

          <Text style={styles.subtitle}>
            Vamos enviar um código/token para seu email.
          </Text>

          <View style={styles.form}>
            <FormField label="Email" labelStyle={styles.label}>
              <AppInput
                inputStyle={styles.input}
                testID="forgot-password-email-input"
                placeholder="seuemail@exemplo.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                returnKeyType="done"
              />
            </FormField>

            <AppButton
              title={loading ? "Enviando..." : "Enviar código"}
              onPress={handleSend}
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
