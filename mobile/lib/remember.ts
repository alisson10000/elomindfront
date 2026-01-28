import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_EMAIL = "@elomind_email";
const KEY_REMEMBER = "@elomind_remember";
const KEY_SESSION_ONLY = "@elomind_session_only"; // ✅ novo

export async function saveRemember(email: string, remember: boolean) {
  await AsyncStorage.setItem(KEY_REMEMBER, remember ? "1" : "0");
  if (remember) await AsyncStorage.setItem(KEY_EMAIL, email);
  else await AsyncStorage.removeItem(KEY_EMAIL);
}

export async function loadRemember() {
  const rememberRaw = await AsyncStorage.getItem(KEY_REMEMBER);
  const remember = rememberRaw === null ? true : rememberRaw === "1";
  const email = (await AsyncStorage.getItem(KEY_EMAIL)) ?? "";
  return { remember, email: remember ? email : "" };
}

// ✅ marca se o login é “temporário”
export async function setSessionOnly(sessionOnly: boolean) {
  await AsyncStorage.setItem(KEY_SESSION_ONLY, sessionOnly ? "1" : "0");
}

export async function isSessionOnly() {
  return (await AsyncStorage.getItem(KEY_SESSION_ONLY)) === "1";
}

export async function clearSessionOnly() {
  await AsyncStorage.removeItem(KEY_SESSION_ONLY);
}
