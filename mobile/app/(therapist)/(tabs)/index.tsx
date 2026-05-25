import { Redirect } from "expo-router";

import { ROUTES } from "@/constants/routes";

export default function TherapistTabsIndex() {
  return <Redirect href={ROUTES.therapist.tabsHome} />;
}
