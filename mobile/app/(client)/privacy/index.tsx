import { useEffect, useState } from "react";
import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

<<<<<<< HEAD
import { ROUTES } from "@/constants/routes";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { makeStyles } from "@/styles/client/privacy/privacy.styles";

=======
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
import {
  getMyDeletionRequest,
  createMyDeletionRequest,
  type DataDeletionRequestOut,
} from "../../../lib/dateDeletion";

export default function PrivacyScreen() {
  const r = useRouter();
<<<<<<< HEAD

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = makeStyles(theme);
=======
  const theme = Colors[useColorScheme() ?? "light"];
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [req, setReq] = useState<DataDeletionRequestOut | null>(null);

  function goBackSafe() {
<<<<<<< HEAD
    if (r.canGoBack()) r.back();
    else r.replace(ROUTES.client.tabsHome);
=======
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(client)" as any);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  }

  async function load() {
    try {
      setLoading(true);
      const data = await getMyDeletionRequest();
      setReq(data ?? null);
<<<<<<< HEAD
=======
    } catch (e: any) {
      console.log("❌ getMyDeletionRequest:", e?.message);
      setReq(null);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function confirmRequest() {
    Alert.alert(
      "Excluir meus dados (LGPD)",
<<<<<<< HEAD
      "Isso solicitará a exclusão total da sua conta e dados.",
=======
      "Isso solicitará a exclusão total da sua conta e dados. No MVP a execução é manual (administrador). Deseja continuar?",
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Solicitar", style: "destructive", onPress: submit },
      ]
    );
  }

  async function submit() {
    try {
      setSaving(true);
      const created = await createMyDeletionRequest();
      setReq(created);
<<<<<<< HEAD
=======
      Alert.alert("Solicitação registrada", "Seu pedido foi registrado como PENDENTE.");
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ??
        e?.message ??
        "Não foi possível solicitar.";
      Alert.alert("Erro", String(msg));
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    } finally {
      setSaving(false);
    }
  }

  const isPending = req?.status === "pending";

  return (
<<<<<<< HEAD
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={goBackSafe} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Privacidade (LGPD)</Text>
          <Text style={styles.headerSubtitle}>
=======
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background }}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
          backgroundColor: theme.background,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Pressable
          onPress={goBackSafe}
          hitSlop={16}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
          }}
        >
          <Text style={{ color: theme.text, fontWeight: "900" }}>← Voltar</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: "900" }}>
            Privacidade (LGPD)
          </Text>
          <Text style={{ color: theme.muted, marginTop: 2 }}>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
            Solicitar exclusão total de dados
          </Text>
        </View>
      </View>

<<<<<<< HEAD
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {req ? "Status do pedido" : "Nenhum pedido registrado"}
            </Text>

            {req ? (
              <>
                <Text style={styles.textMuted}>
                  Status: <Text style={styles.strong}>{req.status}</Text>
                </Text>

                <Text style={styles.textMuted}>
                  Solicitado em:{" "}
                  {new Date(req.requested_at).toLocaleString()}
                </Text>
              </>
            ) : (
              <Text style={styles.textMuted}>
                Você pode solicitar a exclusão total da sua conta.
              </Text>
            )}
          </View>
=======
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        {loading ? (
          <View style={{ paddingTop: 10, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={{ marginTop: 10, color: theme.muted }}>
              Carregando...
            </Text>
          </View>
        ) : req ? (
          <View
            style={{
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "900" }}>
              Status do pedido
            </Text>

            <Text style={{ color: theme.muted, marginTop: 8 }}>
              Status:{" "}
              <Text style={{ color: theme.text, fontWeight: "900" }}>
                {req.status}
              </Text>
            </Text>

            <Text style={{ color: theme.muted, marginTop: 6 }}>
              Solicitado em: {new Date(req.requested_at).toLocaleString()}
            </Text>

            {req.completed_at ? (
              <Text style={{ color: theme.muted, marginTop: 6 }}>
                Concluído em: {new Date(req.completed_at).toLocaleString()}
              </Text>
            ) : null}

            {isPending ? (
              <Text style={{ color: theme.muted, marginTop: 10 }}>
                Seu pedido está pendente. No MVP, a exclusão é executada manualmente pelo administrador.
              </Text>
            ) : (
              <Text style={{ color: theme.muted, marginTop: 10 }}>
                Se você ainda tem acesso ao app, significa que a exclusão ainda não foi executada (ou você entrou com outro usuário).
              </Text>
            )}
          </View>
        ) : (
          <View
            style={{
              padding: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.border,
              backgroundColor: theme.card,
            }}
          >
            <Text style={{ color: theme.text, fontWeight: "900" }}>
              Nenhum pedido registrado
            </Text>
            <Text style={{ color: theme.muted, marginTop: 8 }}>
              Você pode solicitar a exclusão total da sua conta e dados.
            </Text>
          </View>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        )}

        <Pressable
          onPress={load}
<<<<<<< HEAD
          style={[styles.button, (loading || saving) && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>Atualizar status</Text>
=======
          disabled={loading || saving}
          style={{
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.card,
            opacity: loading || saving ? 0.7 : 1,
          }}
        >
          <Text style={{ color: theme.text, fontWeight: "900" }}>
            Atualizar status
          </Text>
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        </Pressable>

        <Pressable
          onPress={confirmRequest}
<<<<<<< HEAD
          style={[
            styles.buttonDanger,
            (saving || isPending) && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonDangerText}>
            {isPending
              ? "Pedido já está pendente"
              : saving
                ? "Solicitando..."
                : "Solicitar exclusão total"}
          </Text>
        </Pressable>

        <Text style={styles.footerText}>
          Após a execução manual sua conta será apagada.
=======
          disabled={saving || isPending}
          style={{
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.danger,
            backgroundColor: isPending ? theme.border : theme.danger,
            opacity: saving ? 0.7 : 1,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>
            {isPending
              ? "Pedido já está pendente"
              : saving
              ? "Solicitando..."
              : "Solicitar exclusão total"}
          </Text>
        </Pressable>

        <Text style={{ color: theme.muted, lineHeight: 18 }}>
          Importante: após a execução manual, sua conta será apagada.
          Se você tentar usar o app, vai receber 401 e será deslogado automaticamente.
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        </Text>
      </View>
    </SafeAreaView>
  );
}
