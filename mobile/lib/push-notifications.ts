import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    const appOwnership = Constants.appOwnership ?? null;
    const isExpoGo = appOwnership === "expo";

    // Android + Expo Go não suporta push remoto como no app nativo.
    if (Platform.OS === "android" && isExpoGo) {
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId ??
      Constants.manifest2?.extra?.expoClient?.extra?.eas?.projectId ??
      null;

    if (!projectId) {
      console.error("projectId não encontrado para push notifications");
      return null;
    }

    if (Platform.OS === "android") {
      try {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      } catch (channelError: any) {
        console.error(
          "Erro ao configurar notification channel:",
          channelError?.message || channelError
        );
      }
    }

    const permissionSettings = await Notifications.getPermissionsAsync();
    let finalStatus = permissionSettings.status;

    if (finalStatus !== "granted") {
      const requestResult = await Notifications.requestPermissionsAsync();
      finalStatus = requestResult.status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const expoPushToken = tokenData?.data?.trim() || null;

    if (!expoPushToken) {
      console.error("Token de push veio vazio");
      return null;
    }

    return expoPushToken;
  } catch (error: any) {
    console.error(
      "Erro ao registrar push notifications:",
      error?.message || error
    );
    return null;
  }
}
