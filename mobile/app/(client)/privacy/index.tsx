import { useEffect, useState } from "react";
import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { makeStyles } from "@/styles/client/privacy/privacy.styles";

import {
  getMyDeletionRequest,
  createMyDeletionRequest,
  type DataDeletionRequestOut,
} from "../../../lib/dateDeletion";

export default function PrivacyScreen() {
  const r = useRouter();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = makeStyles(theme);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [req, setReq] = useState<DataDeletionRequestOut | null>(null);

  function goBackSafe() {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(client)" as any);
  }

  async function load() {
    try {
      setLoading(true);
      const data = await getMyDeletionRequest();
      setReq(data ?? null);
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
      "Isso solicitará a exclusão total da sua conta e dados.",
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
    } finally {
      setSaving(false);
    }
  }

  const isPending = req?.status === "pending";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={goBackSafe} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Privacidade (LGPD)</Text>
          <Text style={styles.headerSubtitle}>
            Solicitar exclusão total de dados
          </Text>
        </View>
      </View>

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
        )}

        <Pressable
          onPress={load}
          style={[
            styles.button,
            (loading || saving) && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>Atualizar status</Text>
        </Pressable>

        <Pressable
          onPress={confirmRequest}
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
        </Text>
      </View>
    </SafeAreaView>
  );
}