import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { makeStyles } from "@/styles/therapist/tabs/therapist-home.styles";

type CardButtonProps = {
  label: string;
  onPress: () => void;
  styles: ReturnType<typeof makeStyles>;
};

function CardButton({ label, onPress, styles }: CardButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardButton,
        pressed && styles.cardButtonPressed,
      ]}
    >
      <Text style={styles.cardButtonText}>{label}</Text>
    </Pressable>
  );
}

export default function TherapistHome() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel do Terapeuta</Text>

      <Text style={styles.subtitle}>
        Gerencie seus clientes e acompanhe as reflexões.
      </Text>

      <View style={styles.card}>
        <CardButton
          label="Meus Clientes"
          styles={styles}
          onPress={() => router.push("/(therapist)/client" as any)}
        />

        <CardButton
          label="Reflexões pendentes dos Clientes"
          styles={styles}
          onPress={() => router.push("/(therapist)/reflections" as any)}
        />

        <CardButton
          label="Feedbacks já dados"
          styles={styles}
          onPress={() => router.push("/(therapist)/feedbacks" as any)}
        />

        <CardButton
          label="Meu Perfil"
          styles={styles}
          onPress={() => router.push("/(therapist)/(tabs)/profile" as any)}
        />

        <CardButton
          label="Convidar Cliente"
          styles={styles}
          onPress={() => router.push("/(therapist)/invite-client" as any)}
        />
      </View>

      <Text style={styles.footer}>
        EloMind — plataforma de apoio terapêutico
      </Text>
    </View>
  );
}