import { api } from "./api";

/**
 * Tipos
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

/**
 * Helpers
 */
function asArray<T>(data: any): T[] {
  return Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
}

/**
 * =========================
 * THERAPIST
 * =========================
 * Observação:
 * - Novo padrão recomendado: /therapist/reflections/...
 * - Mas aqui tentamos também o legado: /reflections/...
 */

export async function listPendingReflections(): Promise<PendingReflection[]> {
  // tenta novo
  try {
    const res = await api.get("/therapist/reflections/pending");
    return asArray<PendingReflection>(res.data);
  } catch {
    // fallback antigo
    const res = await api.get("/reflections/pending");
    return asArray<PendingReflection>(res.data);
  }
}

export async function getTherapistReflectionDetail(id: number): Promise<ReflectionDetail | null> {
  // tenta novo
  try {
    const res = await api.get(`/therapist/reflections/${id}`);
    return res.data ?? null;
  } catch {
    // fallback antigo
    const res = await api.get(`/reflections/${id}`);
    return res.data ?? null;
  }
}

/**
 * =========================
 * CLIENT
 * =========================
 * Padrão recomendado:
 * - GET /reflections/me
 * - GET /reflections/{id}
 * - DELETE /reflections/{id}
 */

export async function listMyReflections(): Promise<MyReflectionListItem[]> {
  const res = await api.get("/reflections/me");
  return asArray<MyReflectionListItem>(res.data);
}

export async function getMyReflectionDetail(id: number): Promise<ReflectionDetail | null> {
  const res = await api.get(`/reflections/${id}`);
  return res.data ?? null;
}

export async function deleteReflection(id: number): Promise<boolean> {
  // alguns backends retornam 204 No Content
  const res = await api.delete(`/reflections/${id}`);
  return res.status >= 200 && res.status < 300;
}
export type CreateReflectionPayload = {
  feeling_after_session: string;
  what_learned: string;
  positive_point: string;
  resistance_or_disagreement?: string;
};

export async function createReflection(payload: CreateReflectionPayload) {
  const res = await api.post("/reflections", payload);
  return res.data;
}

/**
 * =========================
 * FEEDBACK
 * =========================
 * Função que você citou: getFeedbackByReflection
 *
 * Padrão recomendado:
 * - GET /feedback/reflection/{reflectionId}
 * (se no seu backend for diferente, ajuste aqui)
 */

export async function getFeedbackByReflection(reflectionId: number): Promise<Feedback | null> {
  // tenta rota comum
  try {
    const res = await api.get(`/feedback/reflection/${reflectionId}`);
    return res.data ?? null;
  } catch {
    // fallback: alguns projetos usam /feedback/by-reflection/{id}
    try {
      const res2 = await api.get(`/feedback/by-reflection/${reflectionId}`);
      return res2.data ?? null;
    } catch {
      return null;
    }
  }
}
