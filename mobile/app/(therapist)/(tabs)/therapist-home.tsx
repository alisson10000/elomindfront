import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

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

      {/* Card principal */}
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
        <Pressable
          onPress={() => router.push("/(therapist)/client")}
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
            Meus Clientes
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(therapist)/reflections")}
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
            Reflexões dos Clientes
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(therapist)/(tabs)/profile")}
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
            Meu Perfil
          </Text>
        </Pressable>
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
