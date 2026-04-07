import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  try {
    console.log("🟡 [push/register] Iniciando registerForPushNotificationsAsync");

    const appOwnership = Constants.appOwnership ?? null;
    const isExpoGo = appOwnership === "expo";

    console.log("🔎 [push/register] Constants.appOwnership:", appOwnership);
    console.log("🔎 [push/register] Constants.expoConfig:", Constants.expoConfig);
    console.log("🔎 [push/register] Constants.easConfig:", Constants.easConfig);

    // Android + Expo Go não suporta push remoto como no app nativo
    if (Platform.OS === "android" && isExpoGo) {
      console.log("🚫 [push/register] Push remoto não funciona no Expo Go (Android)");
      return null;
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId ??
      Constants.manifest2?.extra?.expoClient?.extra?.eas?.projectId ??
      null;

    console.log("📌 [push/register] projectId:", projectId);

    if (!projectId) {
      console.log("❌ [push/register] projectId não encontrado");
      return null;
    }

    // Android: garante o canal de notificação
    if (Platform.OS === "android") {
      try {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });

        console.log("✅ [push/register] Notification channel 'default' configurado");
      } catch (channelError: any) {
        console.log(
          "⚠️ [push/register] Erro ao configurar notification channel:",
          channelError?.message || channelError
        );
      }
    }

    const permissionSettings = await Notifications.getPermissionsAsync();
    const existingStatus = permissionSettings.status;

    console.log("🔔 [push/register] existingStatus:", existingStatus);
    console.log("🔔 [push/register] permissionSettings:", permissionSettings);

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const requestResult = await Notifications.requestPermissionsAsync();
      finalStatus = requestResult.status;

      console.log("🔔 [push/register] status após pedir permissão:", finalStatus);
      console.log("🔔 [push/register] requestPermissionsAsync:", requestResult);
    }

    if (finalStatus !== "granted") {
      console.log("❌ [push/register] Permissão negada para notificações");
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    const expoPushToken = tokenData?.data?.trim() || null;

    console.log("📲 [push/register] Token gerado:", expoPushToken);

    if (!expoPushToken) {
      console.log("❌ [push/register] Token veio vazio");
      return null;
    }

    console.log("✅ [push/register] Finalizado com sucesso");
    return expoPushToken;
  } catch (error: any) {
    console.log("❌ [push/register] Erro:", error?.message || error);
    console.log("❌ [push/register] Stack:", error?.stack || "sem stack");
    return null;
  }
}