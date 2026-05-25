import { api } from "./api";

export type FeedbackStatus =
  | "pending_approval"
  | "approved"
  | "rejected"
  | string;

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

export type FeedbackListItem = FeedbackOut & {
  client_id?: number | null;
  client_name?: string | null;
  reflection_created_at?: string | null;
};

const DEBUG = false;

function log(...args: unknown[]) {
  if (!DEBUG) return;
  console.log(...args);
}

function asArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function safeKeys(obj: any): string[] | null {
  try {
    return obj && typeof obj === "object" ? Object.keys(obj) : null;
  } catch {
    return null;
  }
}

export async function generateFeedbackForReflection(
  reflectionId: number
): Promise<FeedbackOut> {
  const url = `/feedback/generate/${reflectionId}`;
  const res = await api.post(url);

  log("generateFeedbackForReflection:", {
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

  log("listPendingFeedback:", {
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

  log("approveFeedback:", {
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

  log("rejectFeedback:", {
    url,
    status: res.status,
    id: res.data?.id,
    reflection_id: res.data?.reflection_id,
    fb_status: res.data?.status,
  });

  return res.data;
}

export async function getClientFeedbackByReflection(
  reflectionId: number
): Promise<FeedbackOut> {
  const url = `/feedback/by-reflection/${reflectionId}`;
  const res = await api.get(url);

  log("getClientFeedbackByReflection:", {
    url,
    status: res.status,
    id: res.data?.id,
    reflection_id: res.data?.reflection_id,
    fb_status: res.data?.status,
  });

  return res.data;
}

export async function getTherapistFeedbackByReflection(
  reflectionId: number
): Promise<FeedbackOut> {
  const url = `/feedback/therapist/by-reflection/${reflectionId}`;
  const res = await api.get(url);

  log("getTherapistFeedbackByReflection:", {
    url,
    status: res.status,
    id: res.data?.id,
    reflection_id: res.data?.reflection_id,
    fb_status: res.data?.status,
  });

  return res.data;
}

export async function listFeedbacksByClient(
  clientId: number,
  statuses: string = "approved,rejected"
): Promise<FeedbackListItem[]> {
  const url = `/feedback/by-client/${clientId}`;

  try {
    const res = await api.get(url, { params: { status: statuses } });
    const arr = asArray<FeedbackListItem>(res.data);

    log("listFeedbacksByClient:", {
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
    log("listFeedbacksByClient error:", {
      url,
      params: { status: statuses },
      httpStatus: e?.response?.status,
      message: e?.message,
      data: e?.response?.data,
    });
    throw e;
  }
}
