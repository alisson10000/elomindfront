import { useState } from "react";
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
import { router } from "expo-router";

import { api } from "../../lib/api";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
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

      await api.post("/auth/forgot-password", { email: emailTrim });

      Alert.alert(
        "Pronto!",
        "Se esse email existir, enviamos um código/token. Digite ele na próxima tela junto com sua nova senha."
      );

      router.push({
        pathname: "/reset-password",
        params: { email: emailTrim },
      } as any);
    } catch {
      Alert.alert(
        "Pronto!",
        "Se esse email existir, enviamos um código/token. Digite ele na próxima tela junto com sua nova senha."
      );

      router.push({
        pathname: "/reset-password",
        params: { email: emailTrim },
      } as any);
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

          <Text style={styles.title}>Esqueci minha senha</Text>

          <Text style={styles.subtitle}>
            Vamos enviar um código/token para seu email.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor={theme.placeholder}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              returnKeyType="done"
            />

            <Pressable
              onPress={handleSend}
              disabled={loading}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
                loading && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "Enviando..." : "Enviar código"}
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