import { Redirect } from "expo-router";

<<<<<<< HEAD
import { ROUTES } from "@/constants/routes";

export default function TherapistTabsIndex() {
  return <Redirect href={ROUTES.therapist.tabsHome} />;
=======
export default function TherapistTabsIndex() {
  return <Redirect href={"/(therapist)/(tabs)/therapist-home" as any} />;
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
}
