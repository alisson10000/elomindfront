import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOKEN_KEY = "@elomind_token";

function maskToken(token: string | null) {
  if (!token) return "NULL ❌";
  if (token.length <= 20) return token;
  return `${token.slice(0, 12)}...${token.slice(-8)}`;
}

export async function setToken(token: string) {
  try {
    if (!token || typeof token !== "string" || !token.trim()) {
      console.log("❌ setToken() -> token inválido recebido:", token);
      throw new Error("Token inválido ao salvar");
    }

    const cleanToken = token.trim();

    console.log("🟢 setToken() -> salvando token em:", TOKEN_KEY);
    console.log("🧪 setToken() token:", maskToken(cleanToken));

    await AsyncStorage.setItem(TOKEN_KEY, cleanToken);

    const check = await AsyncStorage.getItem(TOKEN_KEY);

    console.log("🧪 setToken() check:", check ? "SALVO ✅" : "NÃO SALVO ❌");
    console.log("🧪 setToken() salvo:", maskToken(check));
  } catch (error: any) {
    console.log("❌ setToken() erro:", error?.message || error);
    throw error;
  }
}

export async function getToken() {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);

    console.log("🔵 getToken() ->", token ? "TEM TOKEN ✅" : "NULL ❌");
    console.log("🧪 getToken() valor:", maskToken(token));

    return token;
  } catch (error: any) {
    console.log("❌ getToken() erro:", error?.message || error);
    return null;
  }
}

export async function clearToken() {
  try {
    console.log(
      "🔴 clearToken() -> APAGANDO token! Stack:",
      new Error().stack
    );

    await AsyncStorage.removeItem(TOKEN_KEY);

    const check = await AsyncStorage.getItem(TOKEN_KEY);

    console.log("🧪 clearToken() check:", check ? "AINDA TEM ❌" : "APAGOU ✅");
  } catch (error: any) {
    console.log("❌ clearToken() erro:", error?.message || error);
  }
}