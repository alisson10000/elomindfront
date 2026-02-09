import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type CardButtonProps = {
  label: string;
  onPress: () => void;
  theme: any;
};

function CardButton({ label, onPress, theme }: CardButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.card,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "800", color: theme.text }}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function TherapistHome() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: theme.background,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: "900",
          marginBottom: 12,
          color: theme.text,
          textAlign: "center",
        }}
      >
        Painel do Terapeuta
      </Text>

      <Text
        style={{
          color: theme.muted,
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        Gerencie seus clientes e acompanhe as reflexões.
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.card,
          borderRadius: 16,
          padding: 18,
          gap: 14,
        }}
      >
        {/* ✅ Use o group explicitamente para evitar conflito de rotas */}
        <CardButton
          label="Meus Clientes"
          theme={theme}
          onPress={() => router.push("/(therapist)/client" as any)}
        />

        <CardButton
          label="Reflexões pendentes dos Clientes"
          theme={theme}
          onPress={() => router.push("/(therapist)/reflections" as any)}
        />

        <CardButton
          label="Feedbacks já dados"
          theme={theme}
          onPress={() => router.push("/(therapist)/feedbacks" as any)}
        />

        <CardButton
          label="Meu Perfil"
          theme={theme}
          onPress={() => router.push("/(therapist)/(tabs)/profile" as any)}
        />

        <CardButton
          label="Convidar Cliente"
          theme={theme}
          onPress={() => router.push("/(therapist)/invite-client" as any)}
        />
      </View>

      <Text
        style={{
          marginTop: 18,
          color: theme.muted,
          textAlign: "center",
        }}
      >
        EloMind — plataforma de apoio terapêutico
      </Text>
    </View>
  );
}
