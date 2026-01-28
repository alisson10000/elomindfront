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

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // ✅ Carrega email salvo
  useEffect(() => {
    (async () => {
      const { remember, email: savedEmail } = await loadRemember();
      setRememberMe(remember);
      if (savedEmail) setEmail(savedEmail);
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

      // 3) Vai para a área correta
      router.replace(routeForRole(role) as any);
    } catch (err: any) {
      // ✅ AQUI é o ajuste: tratar 403 User inactive e 401 credenciais inválidas
      const status = err?.response?.status;
      const detailRaw =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        "";

      const detail = String(detailRaw).toLowerCase();

      console.log("❌ Erro no login:", err?.message, "|", status, detailRaw);

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

  return (
    <KeyboardAvoidingView
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
          <Image
            source={require("../../assets/images/EloMind.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={[styles.subtitle, { color: theme.muted }]}>
            Entre para registrar suas reflexões
          </Text>

          <View style={styles.form}>
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

            <Text style={[styles.label, styles.labelSpacing, { color: theme.text }]}>
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

            <Text style={[styles.footer, { color: theme.icon }]}>
              Dica: use o mesmo usuário que você criou no Swagger.
            </Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
