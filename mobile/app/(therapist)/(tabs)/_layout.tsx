import { Tabs } from "expo-router";

export default function TherapistTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="therapist-home" options={{ title: "Início" }} />
      <Tabs.Screen name="pending" options={{ title: "Pendentes" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
