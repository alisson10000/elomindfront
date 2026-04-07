import { useState } from "react";
import { View, Text, Alert, Switch } from "react-native";
import { router } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { api } from "@/lib/api";

import Screen from "@/components/Screen";
import Card from "@/components/Card";
import Button from "@/components/Button";

import { createStyles } from "../../../styles/auth/consent-lgpd.styles";

export default function ConsentLgpdScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = createStyles(theme);

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!accepted) {
      Alert.alert("Atenção", "Você precisa aceitar para continuar.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/consents", { accepted: true });
      Alert.alert("Obrigado!", "Consentimento registrado.");
      router.replace("/(client)/(tabs)" as any);
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Não foi possível registrar o consentimento.";
      Alert.alert("Erro", String(detail));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll contentStyle={styles.scrollContainer}>
      <Text style={styles.title}>Consentimento LGPD</Text>

      <Text style={styles.subtitle}>
        Para usar o EloMind, precisamos do seu consentimento para tratar seus dados.
      </Text>

      <Card style={{ gap: 12 }}>
        <Text style={styles.cardText}>
          • Seus dados (ex.: reflexões, informações de sessão) serão usados para
          apoiar seu acompanhamento terapêutico.
          {"\n\n"}
          • Você pode solicitar acesso, correção e exclusão de dados, conforme a LGPD.
          {"\n\n"}
          • O terapeuta responsável terá acesso às suas respostas e reflexões.
          {"\n\n"}
          • Ao aceitar, você concorda com o tratamento desses dados para fins de
          acompanhamento terapêutico.
        </Text>

        <View style={styles.acceptRow}>
          <Text style={styles.acceptLabel}>Eu li e aceito</Text>

          <Switch
            value={accepted}
            onValueChange={setAccepted}
            disabled={loading}
            trackColor={{ false: theme.border, true: theme.primary }}
          />
        </View>

        <Button title="Continuar" loading={loading} onPress={handleContinue} />
      </Card>
    </Screen>
  );
}
