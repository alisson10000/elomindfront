import axios from "axios";
import { Platform, Alert } from "react-native";
import { router } from "expo-router";

import { getToken, clearToken } from "./token";
import { clearSessionOnly } from "./remember";

/**
 * Fallbacks DEV (se .env estiver vazio)
 */
const DEV_PC_IP = "192.168.1.182";
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
  if (!url) return "/";
  if (url.startsWith("http")) return url;
  return `/${url.replace(/^\/+/, "")}`;
}

/**
 * Rotas públicas (não precisam de token).
 */
function isPublicRoute(url: string) {
  const u = normalizeUrl(url);
  return (
    u.includes("/auth/login") ||
    u.includes("/auth/signup") ||
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
    console.log("⚠️ forceLogout erro:", e?.message);
  } finally {
    router.replace("/(auth)/login");
    isForcingLogout = false;
  }
}

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
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const url = normalizeUrl(error?.config?.url ?? "");

    const detailRaw =
      error?.response?.data?.detail ??
      error?.response?.data?.message ??
      error?.message ??
      "";

    const detail = String(detailRaw).toLowerCase();

    console.log("❌ API error:", status, url, detailRaw);

    if (isForcingLogout) return Promise.reject(error);

    if (status === 401) {
      Alert.alert("Sessão expirada", "Faça login novamente.");
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
