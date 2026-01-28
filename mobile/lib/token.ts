import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@elomind_token";

export async function setToken(token: string) {
  console.log("🟢 setToken() -> salvando token em:", KEY);
  await AsyncStorage.setItem(KEY, token);
  const check = await AsyncStorage.getItem(KEY);
  console.log("🧪 setToken() check:", check ? "SALVO ✅" : "NÃO SALVO ❌");
}

export async function getToken() {
  const token = await AsyncStorage.getItem(KEY);
  console.log("🔵 getToken() ->", token ? "TEM TOKEN ✅" : "NULL ❌");
  return token;
}

export async function clearToken() {
  console.log("🔴 clearToken() -> APAGANDO token! Stack:", new Error().stack);
  await AsyncStorage.removeItem(KEY);
  const check = await AsyncStorage.getItem(KEY);
  console.log("🧪 clearToken() check:", check ? "AINDA TEM ❌" : "APAGOU ✅");
}
