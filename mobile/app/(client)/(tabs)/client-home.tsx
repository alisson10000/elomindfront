import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function ClientHome() {
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
          fontWeight: "700",
          marginBottom: 24,
          color: theme.text,
        }}
      >
        Bem-vindo ao EloMind
      </Text>

      {/* Reflexões */}
      <Pressable
        onPress={() => router.push("/(client)/reflections")}
        style={{
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.card,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text }}>
          Minhas Reflexões
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/(client)/reflections/new")}
        style={{
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.primary,
          backgroundColor: theme.primary,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>
          Nova Reflexão
        </Text>
      </Pressable>

      {/* Sonhos */}
      <Pressable
        onPress={() => router.push("/(client)/dreams/new")}
        style={{
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.primary,
          backgroundColor: theme.primary,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}>
          Novo Sonho
        </Text>
      </Pressable>

      <Text
        style={{
          marginTop: 14,
          color: theme.muted,
          textAlign: "center",
        }}
      >
        Registre suas reflexões e sonhos para seu terapeuta acompanhar.
      </Text>
    </View>
  );
}
