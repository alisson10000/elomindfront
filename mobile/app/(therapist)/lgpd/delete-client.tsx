import { useMemo, useState } from "react";
import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  createStyles,
  getDeleteClientTheme,
} from "@/styles/therapist/lgpd/delete-client.styles";
import { adminExecuteDeletion } from "@/lib/adminDeletion";

type Scheme = "light" | "dark";

export default function DeleteClientLGPD() {
  const r = useRouter();
  const params = useLocalSearchParams();

  const colorScheme = (useColorScheme() ?? "light") as Scheme;
  const styles = createStyles(colorScheme);
  const ui = getDeleteClientTheme(colorScheme);

  const clientId = useMemo(() => {
    const raw = (params as any)?.client_id;
    const v = Array.isArray(raw) ? raw[0] : raw;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }, [params]);

  const clientName = String((params as any)?.client_name ?? "");
  const [loading, setLoading] = useState(false);

  function goBackSafe() {
    if ((r as any).canGoBack?.()) (r as any).back();
    else r.replace("/(therapist)/(tabs)/therapist-home" as any);
  }

  function confirm() {
    if (!clientId) return;

    Alert.alert(
      "Executar exclusão (LGPD)",
      `Isso APAGA tudo do cliente${clientName ? ` (${clientName})` : ""}.\n\nNo MVP, essa ação é irreversível. Continuar?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Executar", style: "destructive", onPress: run },
      ]
    );
  }

  async function run() {
    if (!clientId || loading) return;

    try {
      setLoading(true);
      await adminExecuteDeletion(clientId);
      Alert.alert("Concluído", "Exclusão executada com sucesso.");
      goBackSafe();
    } catch (e: any) {
      const msg = e?.response?.data?.detail ?? e?.message ?? "Falha ao executar.";
      Alert.alert("Erro", String(msg));
    } finally {
      setLoading(false);
    }
  }

  if (!clientId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.invalidContainer}>
          <Text style={styles.invalidTitle}>client_id inválido</Text>

          <Pressable onPress={goBackSafe} style={styles.invalidBackButton}>
            <Text style={styles.invalidBackButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable onPress={goBackSafe} hitSlop={16} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>LGPD — Excluir dados</Text>
          <Text style={styles.headerSubtitle}>
            Cliente #{clientId}
            {clientName ? ` • ${clientName}` : ""}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>Atenção</Text>
          <Text style={styles.warningText}>
            Esta ação executa a exclusão total (reflexões, feedbacks, sonhos, anamnese,
            consents, vínculo terapeuta-cliente e usuário).
          </Text>
        </View>

        <Pressable
          onPress={confirm}
          disabled={loading}
          style={[
            styles.deleteButton,
            loading && styles.deleteButtonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={ui.activityIndicatorColor} />
          ) : (
            <Text style={styles.deleteButtonText}>
              Executar exclusão agora
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}