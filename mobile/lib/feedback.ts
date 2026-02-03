import { api } from "./api";

/**
 * Status que o backend pode retornar.
 * Mantemos "string" para não quebrar caso venha outro status no futuro.
 */
export type FeedbackStatus = "pending_approval" | "approved" | "rejected" | string;

export type FeedbackOut = {
  id: number;
  reflection_id: number;

  ia_generated_content: string;
  ia_neuro_nutrition_tip?: string | null;
  ia_activity_suggestion?: string | null;

  status: FeedbackStatus;

  therapist_approved_by?: number | null;
  therapist_notes?: string | null;

  approved_at?: string | null;
  created_at?: string | null;
};

export type FeedbackApprovePayload = {
  ia_generated_content?: string | null;
  ia_neuro_nutrition_tip?: string | null;
  ia_activity_suggestion?: string | null;
  therapist_notes?: string | null;
};

export type FeedbackRejectPayload = {
  therapist_notes?: string | null;
};

/**
 * ✅ Item de lista (FeedbackOut + extras opcionais)
 * Obs: seu backend /feedback/by-client hoje retorna list[FeedbackOut].
 * Esses extras ficam opcionais para não quebrar.
 */
export type FeedbackListItem = FeedbackOut & {
  client_id?: number | null;
  client_name?: string | null;
  reflection_created_at?: string | null;
};

/**
 * Helper para garantir array
 * - aceita: []  | { items: [] } | { data: [] }
 * (não muda comportamento atual, só fica mais robusto)
 */
function asArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

/**
 * Logs seguros (não quebra se res.data for null/undefined)
 */
function safeKeys(obj: any): string[] | null {
  try {
    return obj && typeof obj === "object" ? Object.keys(obj) : null;
  } catch {
    return null;
  }
}

// ==========================
// Actions
// ==========================
export async function generateFeedbackForReflection(
  reflectionId: number
): Promise<FeedbackOut> {
  const url = `/feedback/generate/${reflectionId}`;
  const res = await api.post(url);

  console.log("✅ generateFeedbackForReflection:", {
    url,
    status: res.status,
    id: res.data?.id,
    reflection_id: res.data?.reflection_id,
    fb_status: res.data?.status,
  });

  return res.data;
}

export async function listPendingFeedback(): Promise<FeedbackOut[]> {
  const url = "/feedback/pending";
  const res = await api.get(url);

  const arr = asArray<FeedbackOut>(res.data);

  console.log("✅ listPendingFeedback:", {
    url,
    status: res.status,
    isArray: Array.isArray(res.data),
    keys: safeKeys(res.data),
    len: arr.length,
    ids: arr.map((x) => x.id),
  });

  return arr;
}

export async function approveFeedback(
  feedbackId: number,
  payload: FeedbackApprovePayload
): Promise<FeedbackOut> {
  const url = `/feedback/${feedbackId}/approve`;
  const res = await api.patch(url, payload);

  console.log("✅ approveFeedback:", {
    url,
    status: res.status,
    id: res.data?.id,
    reflection_id: res.data?.reflection_id,
    fb_status: res.data?.status,
  });

  return res.data;
}

export async function rejectFeedback(
  feedbackId: number,
  payload: FeedbackRejectPayload
): Promise<FeedbackOut> {
  const url = `/feedback/${feedbackId}/reject`;
  const res = await api.patch(url, payload);

  console.log("✅ rejectFeedback:", {
    url,
    status: res.status,
    id: res.data?.id,
    reflection_id: res.data?.reflection_id,
    fb_status: res.data?.status,
  });

  return res.data;
}

/**
 * ⚠️ CLIENT ONLY
 * Só funciona quando o usuário logado for client.
 * Retorna apenas feedback aprovado da reflexão do próprio cliente.
 */
export async function getClientFeedbackByReflection(
  reflectionId: number
): Promise<FeedbackOut> {
  const url = `/feedback/by-reflection/${reflectionId}`;
  const res = await api.get(url);

  console.log("✅ getClientFeedbackByReflection:", {
    url,
    status: res.status,
    id: res.data?.id,
    reflection_id: res.data?.reflection_id,
    fb_status: res.data?.status,
  });

  return res.data;
}

/**
 * ✅ THERAPIST ONLY
 * Terapeuta pode buscar feedback por reflexão (qualquer status).
 * Backend: GET /feedback/therapist/by-reflection/{reflection_id}
 */
export async function getTherapistFeedbackByReflection(
  reflectionId: number
): Promise<FeedbackOut> {
  const url = `/feedback/therapist/by-reflection/${reflectionId}`;
  const res = await api.get(url);

  console.log("✅ getTherapistFeedbackByReflection:", {
    url,
    status: res.status,
    id: res.data?.id,
    reflection_id: res.data?.reflection_id,
    fb_status: res.data?.status,
  });

  return res.data;
}

/**
 * ✅ THERAPIST ONLY
 * Lista feedbacks "já dados" (aprovados/rejeitados) de um cliente.
 * Backend: GET /feedback/by-client/{clientId}?status=approved,rejected
 */
export async function listFeedbacksByClient(
  clientId: number,
  statuses: string = "approved,rejected"
): Promise<FeedbackListItem[]> {
  const url = `/feedback/by-client/${clientId}`;

  try {
    const res = await api.get(url, { params: { status: statuses } });

    const arr = asArray<FeedbackListItem>(res.data);

    // ✅ LOG PRINCIPAL (é esse que a gente vai usar pra cravar)
    console.log("✅ listFeedbacksByClient:", {
      url,
      params: { status: statuses },
      httpStatus: res.status,
      rawIsArray: Array.isArray(res.data),
      rawKeys: safeKeys(res.data),
      len: arr.length,
      ids: arr.map((x) => x.id),
      reflection_ids: arr.map((x) => x.reflection_id),
      statuses: arr.map((x) => String(x.status)),
    });

    return arr;
  } catch (e: any) {
    const httpStatus = e?.response?.status;
    console.log("❌ listFeedbacksByClient ERROR:", {
      url,
      params: { status: statuses },
      httpStatus,
      message: e?.message,
      data: e?.response?.data,
    });
    throw e;
  }
}
