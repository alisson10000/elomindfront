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

// ✅ tema EloMind (Colors) + hook de esquema
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function ResetPasswordScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

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
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
