import AsyncStorage from "@react-native-async-storage/async-storage";

import { getUserRoleFromToken } from "./authRole";

export type UserRole = "client" | "therapist";

export type SessionSnapshot = {
  token: string | null;
  role: UserRole | null;
  sessionOnly: boolean;
  isAuthenticated: boolean;
};

export const TOKEN_KEY = "@elomind_token";
export const USER_ROLE_KEY = "user_role";
const KEY_EMAIL = "@elomind_email";
const KEY_REMEMBER = "@elomind_remember";
const KEY_SESSION_ONLY = "@elomind_session_only";

export async function saveAuthToken(token: string) {
  if (!token || typeof token !== "string" || !token.trim()) {
    throw new Error("Token inválido ao salvar");
  }

  await AsyncStorage.setItem(TOKEN_KEY, token.trim());
}

export async function getAuthToken() {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error: any) {
    console.log("Erro ao ler token da sessão:", error?.message || error);
    return null;
  }
}

export async function clearAuthToken() {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error: any) {
    console.log("Erro ao limpar token da sessão:", error?.message || error);
  }
}

export async function saveUserRole(role: UserRole | null) {
  if (!role) {
    await AsyncStorage.removeItem(USER_ROLE_KEY);
    return;
  }

  await AsyncStorage.setItem(USER_ROLE_KEY, role);
}

export async function getStoredUserRole(): Promise<UserRole | null> {
  try {
    const role = await AsyncStorage.getItem(USER_ROLE_KEY);
    return role === "client" || role === "therapist" ? role : null;
  } catch (error: any) {
    console.log("Erro ao ler role da sessão:", error?.message || error);
    return null;
  }
}

export async function saveRememberedEmail(email: string, remember: boolean) {
  await AsyncStorage.setItem(KEY_REMEMBER, remember ? "1" : "0");

  if (remember) {
    await AsyncStorage.setItem(KEY_EMAIL, email);
    return;
  }

  await AsyncStorage.removeItem(KEY_EMAIL);
}

export async function loadRememberedEmail() {
  const rememberRaw = await AsyncStorage.getItem(KEY_REMEMBER);
  const remember = rememberRaw === null ? true : rememberRaw === "1";
  const email = (await AsyncStorage.getItem(KEY_EMAIL)) ?? "";

  return { remember, email: remember ? email : "" };
}

export async function setSessionOnlyFlag(sessionOnly: boolean) {
  await AsyncStorage.setItem(KEY_SESSION_ONLY, sessionOnly ? "1" : "0");
}

export async function isSessionOnlySession() {
  return (await AsyncStorage.getItem(KEY_SESSION_ONLY)) === "1";
}

export async function clearSessionOnlyFlag() {
  await AsyncStorage.removeItem(KEY_SESSION_ONLY);
}

export async function clearSession() {
  await Promise.all([
    clearAuthToken(),
    saveUserRole(null),
    clearSessionOnlyFlag(),
  ]);
}

export async function restoreSession(): Promise<SessionSnapshot> {
  const sessionOnly = await isSessionOnlySession();

  if (sessionOnly) {
    await clearSession();
    return {
      token: null,
      role: null,
      sessionOnly: true,
      isAuthenticated: false,
    };
  }

  const token = await getAuthToken();
  const storedRole = await getStoredUserRole();

  if (!token) {
    if (storedRole) {
      await saveUserRole(null);
    }

    return {
      token: null,
      role: null,
      sessionOnly: false,
      isAuthenticated: false,
    };
  }

  const decodedRole = getUserRoleFromToken(token);
  const role = storedRole ?? decodedRole;

  if (decodedRole && decodedRole !== storedRole) {
    await saveUserRole(decodedRole);
  }

  return {
    token,
    role,
    sessionOnly: false,
    isAuthenticated: true,
  };
}
