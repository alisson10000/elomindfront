import { useEffect, useState } from "react";
import {
<<<<<<< HEAD
=======
  View,
  Text,
  TextInput,
  Pressable,
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
<<<<<<< HEAD
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
=======
  Switch,
} from "react-native";
import { router } from "expo-router";

import { api } from "../../lib/api";
import { setToken } from "../../lib/token";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../styles/login.styles";
import { loadRemember, saveRemember, setSessionOnly } from "../../lib/remember";

// ✅ tema EloMind (Colors) + hook de esquema
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Role = "client" | "therapist";

function normalizeRole(value: any): Role | null {
  if (!value) return null;
  const r = String(value).toLowerCase();
  if (r === "client" || r === "therapist") return r as Role;
  return null;
}

function routeForRole(role: Role | null) {
  if (role === "therapist") return "/(therapist)/(tabs)";
  return "/(client)/(tabs)";
}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
  const styles = makeStyles(theme);
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

<<<<<<< HEAD
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
=======
  // ✅ Carrega email salvo
  useEffect(() => {
    (async () => {
      const { remember, email: savedEmail } = await loadRemember();
      setRememberMe(remember);
      if (savedEmail) setEmail(savedEmail);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    })();
  }, []);

  async function handleLogin() {
    if (loading) return;

    const emailTrim = email.trim();
<<<<<<< HEAD

=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    if (!emailTrim || !password) {
      Alert.alert("Atenção", "Preencha email e senha.");
      return;
    }

    try {
      setLoading(true);

<<<<<<< HEAD
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

=======
      // ✅ salva email se rememberMe ON
      await saveRemember(emailTrim, rememberMe);

      // 1) Login
      const res = await api.post("/auth/login", { email: emailTrim, password });
      const token: string | undefined = res.data?.access_token;

      if (!token) {
        Alert.alert("Erro", "Token não retornou do servidor.");
        return;
      }

      // ✅ salvar token antes de chamar rotas privadas
      await setToken(token);

      // ✅ marca sessão:
      await setSessionOnly(!rememberMe);

      // 2) Descobrir role (preferência: /auth/me)
      let role: Role | null = null;

      try {
        const me = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        role = normalizeRole(
          me.data?.role ??
            me.data?.user?.role ??
            me.data?.user_type ??
            me.data?.type
        );

        if (role) {
          await AsyncStorage.setItem("user_role", role);
        } else {
          await AsyncStorage.removeItem("user_role");
        }
      } catch {
        await AsyncStorage.removeItem("user_role");
        role = null;
      }

      // limpa senha do estado (boa prática)
      setPassword("");

      // ✅ 3) LGPD: só para CLIENTE e só aparece 1x
      if (role === "client") {
        try {
          const c = await api.get("/consents/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const accepted = Boolean(c.data?.accepted);

          if (!accepted) {
            router.replace("/consent-lgpd" as any);
            return;
          }
        } catch {
          // Se falhar a checagem, por segurança mostra LGPD
          router.replace("/consent-lgpd" as any);
          return;
        }
      }

      // 4) Vai para a área correta
      router.replace(routeForRole(role) as any);
    } catch (err: any) {
      // ✅ tratar 403 User inactive e 401 credenciais inválidas
      const status = err?.response?.status;
      const detailRaw =
        err?.response?.data?.detail ?? err?.response?.data?.message ?? "";

      const detail = String(detailRaw).toLowerCase();

      console.log("❌ Erro no login:", err?.message, "|", status, detailRaw);

>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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

<<<<<<< HEAD
  function goToInviteCode() {
    router.push(ROUTES.auth.inviteCode);
  }

  function goToForgotPassword() {
    router.push(ROUTES.auth.forgotPassword);
=======
  // ✅ rota REAL (group não entra na URL)
  function goToInviteCode() {
    router.push("/invite-code" as any);
  }

  // ✅ rota REAL (group não entra na URL)
  function goToForgotPassword() {
    router.push("/forgot-password" as any);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  }

  return (
    <KeyboardAvoidingView
<<<<<<< HEAD
      style={styles.safe}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.card}>
=======
      style={[styles.safe, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              shadowColor: theme.text,
            },
          ]}
        >
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
          <Image
            source={require("../../assets/images/EloMind.png")}
            style={styles.logo}
            resizeMode="contain"
          />

<<<<<<< HEAD
          <Text style={styles.subtitle}>
=======
          <Text style={[styles.subtitle, { color: theme.muted }]}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            Entre para registrar suas reflexões
          </Text>

          <View style={styles.form}>
<<<<<<< HEAD
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
=======
            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.input,
                  color: theme.text,
                },
              ]}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor={theme.icon}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              returnKeyType="next"
            />

            <Text
              style={[styles.label, styles.labelSpacing, { color: theme.text }]}
            >
              Senha
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.input,
                  color: theme.text,
                },
              ]}
              placeholder="••••••••"
              placeholderTextColor={theme.icon}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              returnKeyType="done"
            />

            <View
              style={[
                styles.rememberRow,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.input,
                },
              ]}
            >
              <Text style={[styles.rememberText, { color: theme.text }]}>
                Lembrar email
              </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                disabled={loading}
                trackColor={{ false: theme.border, true: theme.primary }}
              />
            </View>

<<<<<<< HEAD
            <AppButton
              title={loading ? "Entrando..." : "Entrar"}
              onPress={handleLogin}
              disabled={loading}
              style={[styles.button, loading && styles.buttonDisabled]}
              testID="login-submit-button"
            />

=======
            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.primary, shadowColor: theme.text },
                pressed && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
                {loading ? "Entrando..." : "Entrar"}
              </Text>
            </Pressable>

            {/* ✅ Esqueci minha senha */}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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

<<<<<<< HEAD
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
=======
            {/* ✅ link para fluxo de convite */}
            <Pressable
              onPress={goToInviteCode}
              disabled={loading}
              style={{
                marginTop: 12,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.input,
                alignItems: "center",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text style={{ fontWeight: "800", color: theme.text }}>
                Tenho um código de convite
              </Text>
            </Pressable>

            <Text style={[styles.footer, { color: theme.icon }]}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
              Dica: use o mesmo usuário que você criou no Swagger.
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
