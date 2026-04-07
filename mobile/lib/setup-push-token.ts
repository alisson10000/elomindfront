import { Platform } from "react-native";
import { registerForPushNotificationsAsync } from "./push-notifications";
import { savePushToken } from "./push-token-api";
import { getToken } from "./token";

export async function setupPushToken() {
  try {
    console.log("🔔 Iniciando setupPushToken");

    const authToken = await getToken();

    console.log(
      "🔐 Token de autenticação antes do push:",
      authToken ? "TEM TOKEN ✅" : "SEM TOKEN ❌"
    );

    if (!authToken) {
      console.log("⏭️ setupPushToken cancelado: usuário não autenticado");
      return null;
    }

    const expoPushToken = await registerForPushNotificationsAsync();

    console.log("🔔 Token recebido:", expoPushToken);

    if (!expoPushToken) {
      console.log("⚠️ Push ignorado (sem token Expo)");
      return null;
    }

    const platform = Platform.OS;

    console.log("📱 Plataforma detectada:", platform);

    const result = await savePushToken(expoPushToken, platform);

    if (!result) {
      console.log("⚠️ savePushToken não retornou sucesso");
      return null;
    }

    console.log("✅ Push token salvo com sucesso");

    return result;
  } catch (error: any) {
    console.log("❌ Erro ao registrar push token:", error?.message || error);
    return null;
  }
}