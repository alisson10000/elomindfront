import { Tabs } from "expo-router";
<<<<<<< HEAD
import { Ionicons } from "@expo/vector-icons";
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export default function TherapistTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
<<<<<<< HEAD
      <Tabs.Screen
        name="therapist-home"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
=======
      <Tabs.Screen name="therapist-home" options={{ title: "Início" }} />
      <Tabs.Screen name="pending" options={{ title: "Pendentes" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
