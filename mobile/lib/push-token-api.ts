import { api } from "./api";
import { getToken } from "./token";

export async function savePushToken(
  expo_push_token: string,
  platform?: string
) {
  try {
    console.log("🟡 [push/save] Iniciando savePushToken");

    const authToken = await getToken();

    console.log(
      "🔐 [push/save] token de autenticação:",
      authToken ? "TEM TOKEN ✅" : "SEM TOKEN ❌"
    );

    if (!authToken) {
      console.log("⏭️ [push/save] cancelado: sem usuário autenticado");
      return null;
    }

    console.log("📤 [push/save] Enviando push token:", {
      expo_push_token,
      platform,
    });

    const response = await api.post("/push-tokens/", {
      expo_push_token,
      platform,
    });

    console.log("✅ [push/save] Push token salvo com sucesso:", {
      status: response.status,
      data: response.data,
    });

    return response.data;
  } catch (error: any) {
    console.log("❌ [push/save] Erro ao salvar token");
    console.log("❌ [push/save] status:", error?.response?.status);
    console.log("❌ [push/save] data:", error?.response?.data);
    console.log("❌ [push/save] message:", error?.message);

    return null;
  }
}