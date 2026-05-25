import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

<<<<<<< HEAD
import { ROUTES } from "@/constants/routes";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { makeStyles } from "@/styles/therapist/tabs/therapist-home.styles";
=======
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

type CardButtonProps = {
  label: string;
  onPress: () => void;
<<<<<<< HEAD
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
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    </Pressable>
  );
}

export default function TherapistHome() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
<<<<<<< HEAD
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
          onPress={() => router.push(ROUTES.therapist.clients)}
=======

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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        />

        <CardButton
          label="Reflexões pendentes dos Clientes"
<<<<<<< HEAD
          styles={styles}
          onPress={() => router.push(ROUTES.therapist.reflections)}
=======
          theme={theme}
          onPress={() => router.push("/(therapist)/reflections" as any)}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        />

        <CardButton
          label="Feedbacks já dados"
<<<<<<< HEAD
          styles={styles}
          onPress={() => router.push(ROUTES.therapist.feedbacks)}
=======
          theme={theme}
          onPress={() => router.push("/(therapist)/feedbacks" as any)}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        />

        <CardButton
          label="Meu Perfil"
<<<<<<< HEAD
          styles={styles}
          onPress={() => router.push(ROUTES.therapist.profile)}
=======
          theme={theme}
          onPress={() => router.push("/(therapist)/(tabs)/profile" as any)}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        />

        <CardButton
          label="Convidar Cliente"
<<<<<<< HEAD
          styles={styles}
          onPress={() => router.push(ROUTES.therapist.inviteClient)}
        />
      </View>

      <Text style={styles.footer}>
=======
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
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
        EloMind — plataforma de apoio terapêutico
      </Text>
    </View>
  );
}
