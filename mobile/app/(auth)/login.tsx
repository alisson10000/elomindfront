import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "@/lib/api";
import { setToken } from "@/lib/token";
import { loadRemember, saveRemember, setSessionOnly } from "@/lib/remember";
import { setupPushToken } from "@/lib/setup-push-token";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { makeStyles } from "@/styles/auth/login.styles";

type Role = "client" | "therapist";

function normalizeRole(value: any): Role | null {
  if (!value) return null;

  const role = String(value).toLowerCase();

  if (role === "client" || role === "therapist") {
    return role as Role;
  }

  return null;
}

function routeForRole(role: Role | null) {
  if (role === "therapist") return "/(therapist)/(tabs)";
  return "/(client)/(tabs)";
}

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

        console.log("📥 loadRemember:", { remember, savedEmail });

        setRememberMe(remember);

        if (savedEmail) {
          setEmail(savedEmail);
        }
      } catch (error: any) {
        console.log("❌ Erro ao carregar remember:", error?.message || error);
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

      console.log("🟡 Iniciando login...");
      console.log("📦 payload login:", {
        email: emailTrim,
        password,
      });

      await saveRemember(emailTrim, rememberMe);
      console.log("✅ saveRemember executado");

      const res = await api.post("/auth/login", {
        email: emailTrim,
        password,
      });

      console.log("✅ resposta /auth/login:", res.data);

      const token: string | undefined =
        res.data?.access_token ?? res.data?.token ?? res.data?.accessToken;

      console.log("🔑 token encontrado:", token ? "SIM ✅" : "NÃO ❌");

      if (!token) {
        Alert.alert("Erro", "Token não retornou do servidor.");
        return;
      }

      await setToken(token);
      console.log("✅ setToken executado");

      await setSessionOnly(!rememberMe);
      console.log("✅ setSessionOnly executado:", !rememberMe);

      let role: Role | null = null;

      try {
        console.log("➡️ GET /auth/me");

        const me = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ resposta /auth/me:", me.data);

        role = normalizeRole(
          me.data?.role ??
            me.data?.user?.role ??
            me.data?.user_type ??
            me.data?.type
        );

        console.log("👤 role detectada:", role);

        if (role) {
          await AsyncStorage.setItem("user_role", role);
          console.log("✅ user_role salva:", role);
        } else {
          await AsyncStorage.removeItem("user_role");
          console.log("⚠️ role não encontrada, user_role removida");
        }
      } catch (error: any) {
        console.log("❌ erro /auth/me status:", error?.response?.status);
        console.log("❌ erro /auth/me data:", error?.response?.data);
        console.log("❌ erro /auth/me message:", error?.message);

        await AsyncStorage.removeItem("user_role");
        role = null;
      }

      setPassword("");

      if (role === "client") {
        try {
          console.log("➡️ GET /consents/me");

          const consent = await api.get("/consents/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log("✅ resposta /consents/me:", consent.data);

          const accepted = Boolean(consent.data?.accepted);
          console.log("📄 accepted LGPD:", accepted);

          if (!accepted) {
            console.log("➡️ redirecionando para /consent-lgpd");
            router.replace("/consent-lgpd" as any);
            return;
          }
        } catch (error: any) {
          console.log("❌ erro /consents/me status:", error?.response?.status);
          console.log("❌ erro /consents/me data:", error?.response?.data);
          console.log("❌ erro /consents/me message:", error?.message);

          router.replace("/consent-lgpd" as any);
          return;
        }
      }

      try {
        console.log("🔔 Chamando setupPushToken após login...");
        await setupPushToken();
        console.log("✅ setupPushToken concluído");
      } catch (error: any) {
        console.log("❌ Erro ao registrar push:", error?.message || error);
      }

      const finalRoute = routeForRole(role);
      console.log("➡️ redirecionando para rota final:", finalRoute);
      router.replace(finalRoute as any);
    } catch (err: any) {
      const status = err?.response?.status;
      const detailRaw =
        err?.response?.data?.detail ?? err?.response?.data?.message ?? "";
      const detail = String(detailRaw).toLowerCase();

      console.log("❌ Erro no login message:", err?.message);
      console.log("❌ Erro no login status:", status);
      console.log("❌ Erro no login data:", err?.response?.data);
      console.log("❌ Erro no login headers:", err?.response?.headers);

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
      console.log("🏁 Finalizando handleLogin");
    }
  }

  function goToInviteCode() {
    router.push("/invite-code" as any);
  }

  function goToForgotPassword() {
    router.push("/forgot-password" as any);
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
              returnKeyType="next"
            />

            <Text style={[styles.label, styles.labelSpacing]}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={theme.placeholder}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
              returnKeyType="done"
            />

            <View style={styles.rememberRow}>
              <Text style={styles.rememberText}>Lembrar email</Text>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                disabled={loading}
                trackColor={{ false: theme.border, true: theme.primary }}
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Entrando..." : "Entrar"}
              </Text>
            </Pressable>

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

            <Text style={styles.footer}>
              Dica: use o mesmo usuário que você criou no Swagger.
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}