import { api } from "./api";

<<<<<<< HEAD
export type FeedbackStatus =
  | "pending_approval"
  | "approved"
  | "rejected"
  | string;
=======
/**
 * Status que o backend pode retornar.
 * Mantemos "string" para não quebrar caso venha outro status no futuro.
 */
export type FeedbackStatus = "pending_approval" | "approved" | "rejected" | string;
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8

export type FeedbackOut = {
  id: number;
  reflection_id: number;
<<<<<<< HEAD
  ia_generated_content: string;
  ia_neuro_nutrition_tip?: string | null;
  ia_activity_suggestion?: string | null;
  status: FeedbackStatus;
  therapist_approved_by?: number | null;
  therapist_notes?: string | null;
=======

  ia_generated_content: string;
  ia_neuro_nutrition_tip?: string | null;
  ia_activity_suggestion?: string | null;

  status: FeedbackStatus;

  therapist_approved_by?: number | null;
  therapist_notes?: string | null;

>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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

<<<<<<< HEAD
=======
/**
 * ✅ Item de lista (FeedbackOut + extras opcionais)
 * Obs: seu backend /feedback/by-client hoje retorna list[FeedbackOut].
 * Esses extras ficam opcionais para não quebrar.
 */
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
export type FeedbackListItem = FeedbackOut & {
  client_id?: number | null;
  client_name?: string | null;
  reflection_created_at?: string | null;
};

<<<<<<< HEAD
const DEBUG = false;

function log(...args: unknown[]) {
  if (!DEBUG) return;
  console.log(...args);
}

=======
/**
 * Helper para garantir array
 * - aceita: []  | { items: [] } | { data: [] }
 * (não muda comportamento atual, só fica mais robusto)
 */
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
function asArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

<<<<<<< HEAD
=======
/**
 * Logs seguros (não quebra se res.data for null/undefined)
 */
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
function safeKeys(obj: any): string[] | null {
  try {
    return obj && typeof obj === "object" ? Object.keys(obj) : null;
  } catch {
    return null;
  }
}

<<<<<<< HEAD
=======
// ==========================
// Actions
// ==========================
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
export async function generateFeedbackForReflection(
  reflectionId: number
): Promise<FeedbackOut> {
  const url = `/feedback/generate/${reflectionId}`;
  const res = await api.post(url);

<<<<<<< HEAD
  log("generateFeedbackForReflection:", {
=======
  console.log("✅ generateFeedbackForReflection:", {
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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
<<<<<<< HEAD
  const arr = asArray<FeedbackOut>(res.data);

  log("listPendingFeedback:", {
=======

  const arr = asArray<FeedbackOut>(res.data);

  console.log("✅ listPendingFeedback:", {
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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

<<<<<<< HEAD
  log("approveFeedback:", {
=======
  console.log("✅ approveFeedback:", {
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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

<<<<<<< HEAD
  log("rejectFeedback:", {
=======
  console.log("✅ rejectFeedback:", {
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    url,
    status: res.status,
    id: res.data?.id,
    reflection_id: res.data?.reflection_id,
    fb_status: res.data?.status,
  });

  return res.data;
}

<<<<<<< HEAD
=======
/**
 * ⚠️ CLIENT ONLY
 * Só funciona quando o usuário logado for client.
 * Retorna apenas feedback aprovado da reflexão do próprio cliente.
 */
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
export async function getClientFeedbackByReflection(
  reflectionId: number
): Promise<FeedbackOut> {
  const url = `/feedback/by-reflection/${reflectionId}`;
  const res = await api.get(url);

<<<<<<< HEAD
  log("getClientFeedbackByReflection:", {
=======
  console.log("✅ getClientFeedbackByReflection:", {
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    url,
    status: res.status,
    id: res.data?.id,
    reflection_id: res.data?.reflection_id,
    fb_status: res.data?.status,
  });

  return res.data;
}

<<<<<<< HEAD
=======
/**
 * ✅ THERAPIST ONLY
 * Terapeuta pode buscar feedback por reflexão (qualquer status).
 * Backend: GET /feedback/therapist/by-reflection/{reflection_id}
 */
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
export async function getTherapistFeedbackByReflection(
  reflectionId: number
): Promise<FeedbackOut> {
  const url = `/feedback/therapist/by-reflection/${reflectionId}`;
  const res = await api.get(url);

<<<<<<< HEAD
  log("getTherapistFeedbackByReflection:", {
=======
  console.log("✅ getTherapistFeedbackByReflection:", {
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
    url,
    status: res.status,
    id: res.data?.id,
    reflection_id: res.data?.reflection_id,
    fb_status: res.data?.status,
  });

  return res.data;
}

<<<<<<< HEAD
=======
/**
 * ✅ THERAPIST ONLY
 * Lista feedbacks "já dados" (aprovados/rejeitados) de um cliente.
 * Backend: GET /feedback/by-client/{clientId}?status=approved,rejected
 */
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
export async function listFeedbacksByClient(
  clientId: number,
  statuses: string = "approved,rejected"
): Promise<FeedbackListItem[]> {
  const url = `/feedback/by-client/${clientId}`;

  try {
    const res = await api.get(url, { params: { status: statuses } });
<<<<<<< HEAD
    const arr = asArray<FeedbackListItem>(res.data);

    log("listFeedbacksByClient:", {
=======

    const arr = asArray<FeedbackListItem>(res.data);

    // ✅ LOG PRINCIPAL (é esse que a gente vai usar pra cravar)
    console.log("✅ listFeedbacksByClient:", {
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
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
<<<<<<< HEAD
    log("listFeedbacksByClient error:", {
      url,
      params: { status: statuses },
      httpStatus: e?.response?.status,
=======
    const httpStatus = e?.response?.status;
    console.log("❌ listFeedbacksByClient ERROR:", {
      url,
      params: { status: statuses },
      httpStatus,
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
      message: e?.message,
      data: e?.response?.data,
    });
    throw e;
  }
}
