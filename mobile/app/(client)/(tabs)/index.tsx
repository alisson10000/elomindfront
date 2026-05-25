import { Redirect } from "expo-router";

import { ROUTES } from "@/constants/routes";

export default function ClientTabsIndex() {
  return <Redirect href={ROUTES.client.tabsHome} />;
}
