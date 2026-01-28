import axios from "axios";
import { Platform, Alert } from "react-native";
import { router } from "expo-router";

import { getToken, clearToken } from "./token";
import { clearSessionOnly } from "./remember";

/**
 * Mantém sua lógica atual de escolha de baseURL.
 */
function pickBaseURL() {
  if (Platform.OS === "web") return process.env.EXPO_PUBLIC_API_URL_WEB;

  // ✅ Android (emulador e celular) -> SEMPRE usar o IP do PC (DEVICE)
  if (Platform.OS === "android") {
    return process.env.EXPO_PUBLIC_API_URL_DEVICE;
  }

  // iOS / outros
  return process.env.EXPO_PUBLIC_API_URL_DEVICE;
}

const BASE_URL = pickBaseURL();

// ✅ fallback DEV (troque pelo IP do seu PC)
const FALLBACK_DEVICE = "http://192.168.0.106:8000";

const FINAL_BASE_URL =
  BASE_URL ||
  (Platform.OS === "android" ? FALLBACK_DEVICE : "http://localhost:8000");

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
 * Interceptor REQUEST (mantém seu comportamento)
 */
api.interceptors.request.use(async (config) => {
  const url = config.url ?? "";
  const u = normalizeUrl(url);
  const method = (config.method ?? "GET").toUpperCase();

  // rastreio
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
 * Interceptor RESPONSE (IMPORTANTE)
 * - 401: sessão expirada em rota privada -> desloga
 * - 403 inactive:
 *    - se for /auth/login -> NÃO desloga aqui (LoginScreen mostra mensagem)
 *    - se for rota privada -> alerta + desloga
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

    // Evita spam de logout simultâneo
    if (isForcingLogout) return Promise.reject(error);

    // 401: token inválido/expirado
    if (status === 401) {
      Alert.alert("Sessão expirada", "Faça login novamente.");
      await forceLogout("401 Unauthorized");
      return Promise.reject(error);
    }

    // 403: usuário inativo
    if (status === 403 && detail.includes("inactive")) {
      // ✅ Se for erro no LOGIN, deixa o LoginScreen tratar e mostrar a mensagem correta
      if (url.includes("/auth/login")) {
        return Promise.reject(error);
      }

      // ✅ Se for rota privada, aí sim desloga
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
