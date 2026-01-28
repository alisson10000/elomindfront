// app/(therapist)/(tabs)/pending.tsx
import { Redirect } from "expo-router";

export default function PendingTab() {
  return <Redirect href="/(therapist)/reflections" />;
}
