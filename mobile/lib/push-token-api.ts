import { api } from "./api";
import { getToken } from "./token";
import type { SavePushTokenRequest } from "./types/notification";

export async function savePushToken(
  expo_push_token: string,
  platform?: string
) {
  try {
    const authToken = await getToken();

    if (!authToken) {
      return null;
    }

    const payload: SavePushTokenRequest = {
      expo_push_token,
      platform,
    };

    const response = await api.post("/push-tokens/", payload);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao salvar token de push:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });

    return null;
  }
}
