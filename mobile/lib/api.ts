import axios from "axios";
import { Platform, Alert } from "react-native";
import { router } from "expo-router";

import { clearSession, getAuthToken } from "./session";

/**
 * Fallbacks DEV (se .env estiver vazio)
 */
const DEV_PC_IP = "192.168.0.101";
const DEV_DEVICE_URL = `http://${DEV_PC_IP}:8000`;
const DEV_ANDROID_EMULATOR_URL = "http://10.0.2.2:8000";
const DEV_WEB_URL = "http://localhost:8000";

/**
 * Fallback PROD
 */
const PROD_URL = "https://elomind.penademorte.org";

/**
 * Em APK/release, sempre forÃ§a produÃ§Ã£o.
 * Em desenvolvimento, respeita EXPO_PUBLIC_API_MODE.
 */
function isProdMode() {
  if (!__DEV__) return true;
  return (process.env.EXPO_PUBLIC_API_MODE || "local").toLowerCase() === "prod";
}

/**
 * Decide baseURL:
 * - WEB -> local ou prod
 * - ANDROID -> por padrÃ£o DEVICE
 *    - sÃ³ usa EMULATOR se EXPO_PUBLIC_ANDROID_TARGET=emulator
 * - iOS/outros -> DEVICE
 */
function pickBaseURL() {
  const prod = isProdMode();

  if (Platform.OS === "web") {
    return prod
      ? process.env.EXPO_PUBLIC_API_URL_WEB_PROD || PROD_URL
      : process.env.EXPO_PUBLIC_API_URL_WEB || DEV_WEB_URL;
  }

  if (Platform.OS === "android") {
    const target = (
      process.env.EXPO_PUBLIC_ANDROID_TARGET || "device"
    ).toLowerCase();

    const emulatorUrl = prod
      ? process.env.EXPO_PUBLIC_API_URL_ANDROID_EMULATOR_PROD || PROD_URL
      : process.env.EXPO_PUBLIC_API_URL_ANDROID_EMULATOR ||
          DEV_ANDROID_EMULATOR_URL;

    const deviceUrl = prod
      ? process.env.EXPO_PUBLIC_API_URL_DEVICE_PROD || PROD_URL
      : process.env.EXPO_PUBLIC_API_URL_DEVICE || DEV_DEVICE_URL;

    return target === "emulator" ? emulatorUrl : deviceUrl;
  }

  return prod
    ? process.env.EXPO_PUBLIC_API_URL_DEVICE_PROD || PROD_URL
    : process.env.EXPO_PUBLIC_API_URL_DEVICE || DEV_DEVICE_URL;
}

export const api = axios.create({
  baseURL: pickBaseURL(),
  timeout: 15000,
});

function normalizeUrl(url?: string) {
  if (!url) return "/";
  if (url.startsWith("http")) return url;
  return `/${url.replace(/^\/+/, "")}`;
}

function isPublicRoute(url?: string) {
  const u = normalizeUrl(url);

  return (
    u.includes("/auth/login") ||
    u.includes("/auth/signup") ||
    u.includes("/auth/forgot-password") ||
    u.includes("/auth/reset-password") ||
    u.includes("/docs") ||
    u.includes("/openapi.json") ||
    u.includes("/health")
  );
}

let isForcingLogout = false;

async function forceLogout(reason: string) {
  if (isForcingLogout) return;
  isForcingLogout = true;

  try {
    console.log("ForÃ§ando logout da sessÃ£o:", reason);
    await clearSession();
  } catch (error: any) {
    console.log(
      "Erro ao limpar sessÃ£o durante logout forÃ§ado:",
      error?.message || error
    );
  } finally {
    router.replace("/(auth)/login");
    isForcingLogout = false;
  }
}

api.interceptors.request.use(
  async (config) => {
    const url = config.url ?? "";

    config.headers = config.headers ?? {};

    if (!isPublicRoute(url)) {
      const token = await getAuthToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    console.log("Erro no interceptor de request:", error?.message || error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const url = normalizeUrl(error?.config?.url ?? "");
    const publicReq = isPublicRoute(url);

    const detailRaw =
      error?.response?.data?.detail ??
      error?.response?.data?.message ??
      error?.message ??
      "";

    const detail = String(detailRaw).toLowerCase();

    if (isForcingLogout) {
      return Promise.reject(error);
    }

    if (!error?.response) {
      console.log("Falha de rede ou servidor indisponÃ­vel");
      return Promise.reject(error);
    }

    if (status === 401) {
      if (url.includes("/push-tokens/")) {
        return Promise.reject(error);
      }

      if (url.includes("/auth/logout")) {
        return Promise.reject(error);
      }

      if (publicReq) {
        return Promise.reject(error);
      }

      Alert.alert("SessÃ£o expirada", "FaÃ§a login novamente.");
      await forceLogout("401 Unauthorized");
      return Promise.reject(error);
    }

    if (status === 403 && detail.includes("inactive")) {
      if (url.includes("/auth/login")) {
        return Promise.reject(error);
      }

      Alert.alert(
        "Conta desativada",
        "Seu acesso foi desativado. Fale com o terapeuta/suporte."
      );
      await forceLogout("403 User inactive");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

