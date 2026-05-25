import { Platform } from "react-native";

import { registerForPushNotificationsAsync } from "./push-notifications";
import { savePushToken } from "./push-token-api";
import { getToken } from "./token";

export async function setupPushToken() {
  try {
    const authToken = await getToken();

    if (!authToken) {
      return null;
    }

    const expoPushToken = await registerForPushNotificationsAsync();

    if (!expoPushToken) {
      return null;
    }

    return await savePushToken(expoPushToken, Platform.OS);
  } catch (error: any) {
    console.error("Erro ao registrar push token:", error?.message || error);
    return null;
  }
}
