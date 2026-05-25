import { useState } from "react";
import {
<<<<<<< HEAD
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
import { router } from "expo-router";

import { api } from "../../lib/api";

// ✅ tema EloMind (Colors) + hook de esquema
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
  const styles = makeStyles(theme);
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

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
<<<<<<< HEAD
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
=======

      await api.post("/auth/forgot-password", { email: emailTrim });

      Alert.alert(
        "Pronto!",
        "Se esse email existir, enviamos um código/token. Digite ele na próxima tela junto com sua nova senha."
      );

      router.push({ pathname: "/reset-password", params: { email: emailTrim } } as any);
    } catch {
      // ✅ resposta neutra (segurança)
      Alert.alert(
        "Pronto!",
        "Se esse email existir, enviamos um código/token. Digite ele na próxima tela junto com sua nova senha."
      );

      router.push({ pathname: "/reset-password", params: { email: emailTrim } } as any);
    } finally {
      setLoading(false);
    }
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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
            Esqueci minha senha
          </Text>

          <Text style={{ marginTop: 8, color: theme.muted, textAlign: "center" }}>
            Vamos enviar um código/token para seu email.
          </Text>

          <View style={{ marginTop: 16 }}>
            <Text style={{ fontWeight: "800", color: theme.text, marginBottom: 6 }}>
              Email
            </Text>

            <TextInput
              style={{
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.input,
                color: theme.text,
                padding: 12,
                borderRadius: 12,
              }}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor={theme.icon}
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
              style={({ pressed }) => ({
                marginTop: 14,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
                backgroundColor: theme.primary,
                opacity: loading ? 0.7 : pressed ? 0.9 : 1,
              })}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>
                {loading ? "Enviando..." : "Enviar código"}
              </Text>
            </Pressable>

            <Pressable
              onPress={goBack}
              disabled={loading}
              style={{
                marginTop: 10,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.input,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text style={{ fontWeight: "900", color: theme.text }}>
                Voltar
              </Text>
            </Pressable>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
