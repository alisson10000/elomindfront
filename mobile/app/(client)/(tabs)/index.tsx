import { Redirect } from "expo-router";

<<<<<<< HEAD
import { ROUTES } from "@/constants/routes";

export default function ClientTabsIndex() {
  return <Redirect href={ROUTES.client.tabsHome} />;
=======
export default function ClientTabsIndex() {
  return <Redirect href={"/(client)/(tabs)/client-home" as any} />;
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
}
