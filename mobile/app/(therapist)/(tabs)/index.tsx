import { Redirect } from "expo-router";

export default function TherapistTabsIndex() {
  return <Redirect href={"/(therapist)/(tabs)/therapist-home" as any} />;
}
