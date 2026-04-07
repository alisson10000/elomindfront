import axios from "axios";
import { Platform, Alert } from "react-native";
import { router } from "expo-router";

import { getToken, clearToken } from "./token";
import { clearSessionOnly } from "./remember";

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
 * Em APK/release, sempre força produção.
 * Em desenvolvimento, respeita EXPO_PUBLIC_API_MODE.
 */
function isProdMode() {
  if (!__DEV__) return true;
  return (process.env.EXPO_PUBLIC_API_MODE || "local").toLowerCase() === "prod";
}

/**
 * Decide baseURL:
 * - WEB -> local ou prod
 * - ANDROID -> por padrão DEVICE
 *    - só usa EMULATOR se EXPO_PUBLIC_ANDROID_TARGET=emulator
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

const FINAL_BASE_URL = pickBaseURL();

console.log(
  "🌐 API BASE_URL:",
  FINAL_BASE_URL,
  "| Platform:",
  Platform.OS,
  "| Mode:",
  isProdMode() ? "prod" : "local",
  "| __DEV__:",
  __DEV__
);

export const api = axios.create({
  baseURL: FINAL_BASE_URL,
  timeout: 15000,
});

/**
 * Normaliza URL para logs e checagens internas.
 */
function normalizeUrl(url?: string) {
  if (!url) return "/";
  if (url.startsWith("http")) return url;
  return `/${url.replace(/^\/+/, "")}`;
}

/**
 * Rotas públicas (não precisam de token).
 */
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

/**
 * Logout seguro.
 */
async function forceLogout(reason: string) {
  if (isForcingLogout) return;
  isForcingLogout = true;

  try {
    console.log("🚪 forceLogout:", reason);
    await clearToken();
    await clearSessionOnly();
  } catch (e: any) {
    console.log("⚠️ forceLogout erro:", e?.message || e);
  } finally {
    router.replace("/(auth)/login");
    isForcingLogout = false;
  }
}

/**
 * Interceptor REQUEST
 */
api.interceptors.request.use(
  async (config) => {
    const url = config.url ?? "";
    const normalizedUrl = normalizeUrl(url);
    const method = (config.method ?? "GET").toUpperCase();
    const publicReq = isPublicRoute(url);

    config.headers = config.headers ?? {};

    if (!publicReq) {
      const token = await getToken();

      console.log(
        "🔐 Interceptor token:",
        token ? "OK" : "NULL",
        "->",
        normalizedUrl
      );

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      console.log("🌍 Public route ->", normalizedUrl);
    }

    console.log("➡️", method, `${config.baseURL}${normalizedUrl}`);

    if (config.data) {
      console.log("📦 Request body:", config.data);
    }

    return config;
  },
  (error) => {
    console.log("❌ Request interceptor error:", error?.message || error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor RESPONSE
 */
api.interceptors.response.use(
  (response) => {
    const url = normalizeUrl(response?.config?.url ?? "");
    console.log("✅ API response:", response.status, url, response.data);
    return response;
  },
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

    console.log("❌ API error status:", status);
    console.log("❌ API error url:", url);
    console.log("❌ API error data:", error?.response?.data);
    console.log("❌ API error message:", error?.message);

    if (isForcingLogout) {
      return Promise.reject(error);
    }

    // Erro de rede sem resposta do servidor
    if (!error?.response) {
      console.log("🌐 Falha de rede ou servidor indisponível");
      return Promise.reject(error);
    }

    // 401 em rota privada
    if (status === 401) {
      // não deslogar por erro no registro de push token
      if (url.includes("/push-tokens/")) {
        console.log("⚠️ 401 em /push-tokens/ ignorado (sem logout)");
        return Promise.reject(error);
      }

      // 401 em rota pública NÃO força logout
      if (publicReq) {
        console.log("⚠️ 401 em rota pública, não vai deslogar");
        return Promise.reject(error);
      }

      Alert.alert("Sessão expirada", "Faça login novamente.");
      await forceLogout("401 Unauthorized");
      return Promise.reject(error);
    }

    // Conta inativa
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