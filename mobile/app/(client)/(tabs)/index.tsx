import { Redirect } from "expo-router";

export default function ClientTabsIndex() {
  return <Redirect href={"/(client)/(tabs)/client-home" as any} />;
}
