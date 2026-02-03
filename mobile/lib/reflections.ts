import { api } from "./api";

/**
 * =========================
 * Types
 * =========================
 */

export type PendingReflection = {
  id: number;
  client_id: number;
  client_name: string;
  feeling_after_session: string;
  created_at: string;
  feedback_status?: string | null;
};

export type ReflectionDetail = {
  id: number;
  client_id: number;
  client_name?: string; // no client pode não vir
  feeling_after_session: string;
  what_learned: string;
  positive_point: string;
  resistance_or_disagreement?: string | null;
  created_at: string;

  // opcional: se o backend devolver
  last_feedback?: Feedback | null;
};

export type MyReflectionListItem = {
  id: number;
  created_at: string;
  feeling_after_session: string;
  feedback_status?: string | null;
};

export type Feedback = {
  id: number;
  reflection_id: number;
  status: "pending" | "approved" | "rejected" | string;
  message?: string | null;
  created_at: string;
};

export type CreateReflectionPayload = {
  feeling_after_session: string;
  what_learned: string;
  positive_point: string;
  resistance_or_disagreement?: string;
};

/**
 * =========================
 * Helpers
 * =========================
 */

const DEBUG = true; // se enjoar dos logs, troca pra false

function log(...args: any[]) {
  if (!DEBUG) return;
  console.log(...args);
}

/**
 * Normaliza resposta para array.
 * - aceita [] direto
 * - aceita { items: [] } (padrão comum em paginação)
 */
function asArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

/**
 * Faz GET tentando rota "nova" e caindo pra "legado".
 * Retorna o data do response.
 */
async function getWithFallback<T>(primaryUrl: string, fallbackUrl: string): Promise<T> {
  try {
    log("➡️ GET (primary)", primaryUrl);
    const res = await api.get(primaryUrl);
    return res.data as T;
  } catch (e: any) {
    const code = e?.response?.status;
    log("⚠️ primary failed:", code, primaryUrl);

    log("➡️ GET (fallback)", fallbackUrl);
    const res2 = await api.get(fallbackUrl);
    return res2.data as T;
  }
}

/**
 * =========================
 * THERAPIST
 * =========================
 *
 * Observação:
 * - Novo padrão recomendado: /therapist/reflections/...
 * - Fallback legado: /reflections/...
 *
 * ⚠️ Pelo seu log: /therapist/reflections/{id} está dando 404.
 * Se você quiser forçar o legado, basta alterar os URLs aqui
 * (ou comentar o "primary" e deixar só o fallback).
 */

export async function listPendingReflections(): Promise<PendingReflection[]> {
  const data = await getWithFallback<any>(
    "/therapist/reflections/pending",
    "/reflections/pending"
  );

  const arr = asArray<PendingReflection>(data);
  log("✅ listPendingReflections:", { len: arr.length });
  return arr;
}

export async function getTherapistReflectionDetail(
  id: number
): Promise<ReflectionDetail | null> {
  if (!Number.isFinite(id)) return null;

  try {
    const data = await getWithFallback<any>(
      `/therapist/reflections/${id}`,
      `/reflections/${id}`
    );

    const result = (data ?? null) as ReflectionDetail | null;
    log("✅ getTherapistReflectionDetail:", { id, ok: !!result });
    return result;
  } catch (e: any) {
    log("❌ getTherapistReflectionDetail failed:", e?.message);
    return null;
  }
}

/**
 * =========================
 * CLIENT
 * =========================
 *
 * Padrão recomendado:
 * - GET /reflections/me
 * - GET /reflections/{id}
 * - DELETE /reflections/{id}
 */

export async function listMyReflections(): Promise<MyReflectionListItem[]> {
  const res = await api.get("/reflections/me");
  const arr = asArray<MyReflectionListItem>(res.data);
  log("✅ listMyReflections:", { len: arr.length });
  return arr;
}

export async function getMyReflectionDetail(id: number): Promise<ReflectionDetail | null> {
  if (!Number.isFinite(id)) return null;

  try {
    const res = await api.get(`/reflections/${id}`);
    const data = (res.data ?? null) as ReflectionDetail | null;
    log("✅ getMyReflectionDetail:", { id, ok: !!data });
    return data;
  } catch (e: any) {
    log("❌ getMyReflectionDetail failed:", e?.message);
    return null;
  }
}

export async function deleteReflection(id: number): Promise<boolean> {
  try {
    const res = await api.delete(`/reflections/${id}`);
    const ok = res.status >= 200 && res.status < 300;
    log("✅ deleteReflection:", { id, ok, status: res.status });
    return ok;
  } catch (e: any) {
    log("❌ deleteReflection failed:", e?.message);
    return false;
  }
}

export async function createReflection(payload: CreateReflectionPayload) {
  const res = await api.post("/reflections/", payload);
  log("✅ createReflection:", { ok: !!res.data });
  return res.data;
}

/**
 * =========================
 * FEEDBACK (Client-side helper)
 * =========================
 *
 * Função citada: getFeedbackByReflection
 * - tenta rota comum /feedback/reflection/{id}
 * - fallback /feedback/by-reflection/{id}
 *
 * ⚠️ Atenção: essa função é "genérica" e não separa permissões.
 * Se no seu backend /feedback/by-reflection é client-only, isso pode dar 403/404
 * quando terapeuta estiver logado.
 */

export async function getFeedbackByReflection(reflectionId: number): Promise<Feedback | null> {
  if (!Number.isFinite(reflectionId)) return null;

  // tenta rota comum
  try {
    log("➡️ GET feedback (primary)", `/feedback/reflection/${reflectionId}`);
    const res = await api.get(`/feedback/reflection/${reflectionId}`);
    return (res.data ?? null) as Feedback | null;
  } catch {
    // fallback
    try {
      log("➡️ GET feedback (fallback)", `/feedback/by-reflection/${reflectionId}`);
      const res2 = await api.get(`/feedback/by-reflection/${reflectionId}`);
      return (res2.data ?? null) as Feedback | null;
    } catch (e: any) {
      log("❌ getFeedbackByReflection failed:", e?.message);
      return null;
    }
  }
}
