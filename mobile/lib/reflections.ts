import { api } from "./api";

<<<<<<< HEAD
=======
/**
 * =========================
 * Types
 * =========================
 */

>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
export type PendingReflection = {
  id: number;
  client_id: number;
  client_name: string;
  feeling_after_session: string;
  created_at: string;
  feedback_status?: string | null;
};

<<<<<<< HEAD
=======
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

>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
export type Feedback = {
  id: number;
  reflection_id: number;
  status: "pending" | "approved" | "rejected" | string;
  message?: string | null;
  created_at: string;
};

<<<<<<< HEAD
export type ReflectionDetail = {
  id: number;
  client_id: number;
  client_name?: string;
  feeling_after_session: string;
  what_learned: string;
  positive_point: string;
  resistance_or_disagreement?: string | null;
  created_at: string;
  last_feedback?: Feedback | null;
};

export type MyReflectionListItem = {
  id: number;
  created_at: string;
  feeling_after_session: string;
  feedback_status?: string | null;
};

=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
export type CreateReflectionPayload = {
  feeling_after_session: string;
  what_learned: string;
  positive_point: string;
  resistance_or_disagreement?: string;
};

<<<<<<< HEAD
=======
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
/**
 * =========================
 * CLIENT - UPDATE (PATCH)
 * =========================
 */

>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
export type UpdateReflectionPayload = {
  feeling_after_session: string;
  what_learned: string;
  positive_point: string;
  resistance_or_disagreement?: string;
};

<<<<<<< HEAD
const DEBUG = false;

function log(...args: unknown[]) {
  if (!DEBUG) return;
  console.log(...args);
}

function isValidId(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function asArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];

  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items?: unknown[] }).items)
  ) {
    return (data as { items: T[] }).items;
  }

  return [];
}

// Faz GET com fallback. Só tenta o fallback se a rota principal devolver 404.
async function getWithFallback<T>(
  primaryUrl: string,
  fallbackUrl: string
): Promise<T> {
  try {
    log("GET (primary)", primaryUrl);
    const res = await api.get<T>(primaryUrl);
    return res.data;
  } catch (error: any) {
    const status = error?.response?.status;
    log("primary failed:", { status, primaryUrl });

    if (status !== 404) {
      throw error;
    }

    log("GET (fallback)", fallbackUrl);
    const res = await api.get<T>(fallbackUrl);
    return res.data;
  }
}

// No backend atual, a rota /reflections/... tem prioridade sobre /therapist/reflections/...
export async function listPendingReflections(): Promise<PendingReflection[]> {
  const data = await getWithFallback<unknown>(
    "/reflections/pending",
    "/therapist/reflections/pending"
  );

  const arr = asArray<PendingReflection>(data);
  log("listPendingReflections:", { len: arr.length });
  return arr;
}

export async function getTherapistReflectionDetail(
  id: number
): Promise<ReflectionDetail | null> {
  if (!isValidId(id)) return null;

  try {
    const data = await getWithFallback<ReflectionDetail | null>(
      `/reflections/${id}`,
      `/therapist/reflections/${id}`
    );

    const result = data ?? null;
    log("getTherapistReflectionDetail:", { id, ok: !!result });
    return result;
  } catch (error: any) {
    log("getTherapistReflectionDetail failed:", {
      id,
      message: error?.message,
      status: error?.response?.status,
    });
    return null;
  }
}

export async function listMyReflections(): Promise<MyReflectionListItem[]> {
  const res = await api.get<unknown>("/reflections/me");
  const arr = asArray<MyReflectionListItem>(res.data);
  log("listMyReflections:", { len: arr.length });
  return arr;
}

export async function getMyReflectionDetail(
  id: number
): Promise<ReflectionDetail | null> {
  if (!isValidId(id)) return null;

  try {
    const res = await api.get<ReflectionDetail | null>(`/reflections/${id}`);
    const data = res.data ?? null;
    log("getMyReflectionDetail:", { id, ok: !!data });
    return data;
  } catch (error: any) {
    log("getMyReflectionDetail failed:", {
      id,
      message: error?.message,
      status: error?.response?.status,
    });
    return null;
  }
}

export async function createReflection(payload: CreateReflectionPayload) {
  const res = await api.post("/reflections/", payload);
  log("createReflection:", { ok: !!res.data });
  return res.data;
}

=======
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
export async function updateReflection(
  id: number,
  payload: UpdateReflectionPayload
) {
  const res = await api.patch(`/reflections/${id}`, payload);
<<<<<<< HEAD
  log("updateReflection:", { id, ok: !!res.data });
  return res.data;
}

export async function deleteReflection(id: number): Promise<boolean> {
  if (!isValidId(id)) return false;

  try {
    const res = await api.delete(`/reflections/${id}`);
    const ok = res.status >= 200 && res.status < 300;
    log("deleteReflection:", { id, ok, status: res.status });
    return ok;
  } catch (error: any) {
    log("deleteReflection failed:", {
      id,
      message: error?.message,
      status: error?.response?.status,
    });
    return false;
  }
}

// Tenta a rota principal e só usa fallback em 404.
export async function getFeedbackByReflection(
  reflectionId: number
): Promise<Feedback | null> {
  if (!isValidId(reflectionId)) return null;

  try {
    const data = await getWithFallback<Feedback | null>(
      `/feedback/reflection/${reflectionId}`,
      `/feedback/by-reflection/${reflectionId}`
    );

    const result = data ?? null;
    log("getFeedbackByReflection:", {
      reflectionId,
      ok: !!result,
    });
    return result;
  } catch (error: any) {
    log("getFeedbackByReflection failed:", {
      reflectionId,
      message: error?.message,
      status: error?.response?.status,
    });
    return null;
  }
}
=======
  log("✅ updateReflection:", { id, ok: !!res.data });
  return res.data;
}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
