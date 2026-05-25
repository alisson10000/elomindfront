<<<<<<< HEAD
﻿import axios from "axios";
import { Platform, Alert } from "react-native";
import { router } from "expo-router";

import { clearSession, getAuthToken } from "./session";
=======
import axios from "axios";
import { Platform, Alert } from "react-native";
import { router } from "expo-router";

import { getToken, clearToken } from "./token";
import { clearSessionOnly } from "./remember";
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

/**
 * Fallbacks DEV (se .env estiver vazio)
 */
<<<<<<< HEAD
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
=======
const DEV_PC_IP = "192.168.0.100";
const DEV_DEVICE_URL = `http://${DEV_PC_IP}:8000`;
const DEV_ANDROID_EMULATOR_URL = "http://10.0.2.2:8000";

/**
 * Decide baseURL:
 * - WEB -> localhost (ou .env)
 * - ANDROID -> por padrão DEVICE (celular físico)
 *    - só usa EMULATOR se EXPO_PUBLIC_ANDROID_TARGET=emulator
 * - iOS/outros -> DEVICE
 */
function pickBaseURL() {
  // WEB
  if (Platform.OS === "web") {
    return process.env.EXPO_PUBLIC_API_URL_WEB || "http://localhost:8000";
  }

  // ANDROID
  if (Platform.OS === "android") {
    const target = (process.env.EXPO_PUBLIC_ANDROID_TARGET || "device").toLowerCase();

    const emulatorUrl =
      process.env.EXPO_PUBLIC_API_URL_ANDROID_EMULATOR || DEV_ANDROID_EMULATOR_URL;

    const deviceUrl =
      process.env.EXPO_PUBLIC_API_URL_DEVICE || DEV_DEVICE_URL;

    // ✅ padrão: device (celular físico)
    return target === "emulator" ? emulatorUrl : deviceUrl;
  }

  // iOS / outros
  return process.env.EXPO_PUBLIC_API_URL_DEVICE || DEV_DEVICE_URL;
}

const FINAL_BASE_URL = pickBaseURL();

console.log("🌐 API BASE_URL:", FINAL_BASE_URL, "| Platform:", Platform.OS);

export const api = axios.create({
  baseURL: FINAL_BASE_URL,
  timeout: 15000,
});

/**
 * Normaliza URL para logs e para checar se é pública.
 */
function normalizeUrl(url: string) {
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  if (!url) return "/";
  if (url.startsWith("http")) return url;
  return `/${url.replace(/^\/+/, "")}`;
}

<<<<<<< HEAD
function isPublicRoute(url?: string) {
  const u = normalizeUrl(url);

  return (
    u.includes("/auth/login") ||
    u.includes("/auth/signup") ||
    u.includes("/auth/forgot-password") ||
    u.includes("/auth/reset-password") ||
=======
/**
 * Rotas públicas (não precisam de token).
 */
function isPublicRoute(url: string) {
  const u = normalizeUrl(url);
  return (
    u.includes("/auth/login") ||
    u.includes("/auth/signup") ||
    u.includes("/auth/forgot-password") || // ✅ novo (reset via email/token)
    u.includes("/auth/reset-password") ||  // ✅ novo (salvar nova senha)
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    u.includes("/docs") ||
    u.includes("/openapi.json") ||
    u.includes("/health")
  );
}

let isForcingLogout = false;

<<<<<<< HEAD
=======
/**
 * Logout seguro.
 */
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
async function forceLogout(reason: string) {
  if (isForcingLogout) return;
  isForcingLogout = true;

  try {
<<<<<<< HEAD
    console.log("ForÃ§ando logout da sessÃ£o:", reason);
    await clearSession();
  } catch (error: any) {
    console.log(
      "Erro ao limpar sessÃ£o durante logout forÃ§ado:",
      error?.message || error
    );
=======
    console.log("🚪 forceLogout:", reason);
    await clearToken();
    await clearSessionOnly();
  } catch (e: any) {
    console.log("⚠️ forceLogout erro:", e?.message);
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  } finally {
    router.replace("/(auth)/login");
    isForcingLogout = false;
  }
}

<<<<<<< HEAD
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

=======
/**
 * Interceptor REQUEST
 */
api.interceptors.request.use(async (config) => {
  const url = config.url ?? "";
  const u = normalizeUrl(url);
  const method = (config.method ?? "GET").toUpperCase();

  if (u.includes("/auth/me")) {
    console.log("🕵️ /auth/me foi chamado! Stack:", new Error().stack);
  }

  const publicReq = isPublicRoute(url);

  if (!publicReq) {
    const token = await getToken();
    console.log("🔐 Interceptor token:", token ? "OK" : "NULL", "->", u);

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    console.log("🌍 Public route ->", u);
  }

  console.log("➡️", method, `${config.baseURL}${u}`);
  return config;
});

/**
 * Interceptor RESPONSE
 */
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const url = normalizeUrl(error?.config?.url ?? "");
<<<<<<< HEAD
    const publicReq = isPublicRoute(url);
=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

    const detailRaw =
      error?.response?.data?.detail ??
      error?.response?.data?.message ??
      error?.message ??
      "";

    const detail = String(detailRaw).toLowerCase();

<<<<<<< HEAD
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
=======
    console.log("❌ API error:", status, url, detailRaw);

    if (isForcingLogout) return Promise.reject(error);

    if (status === 401) {
      Alert.alert("Sessão expirada", "Faça login novamente.");
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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
<<<<<<< HEAD

=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
