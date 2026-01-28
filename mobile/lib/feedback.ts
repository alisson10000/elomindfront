import { api } from "./api";

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

export async function generateFeedbackForReflection(reflectionId: number): Promise<FeedbackOut> {
  const res = await api.post(`/feedback/generate/${reflectionId}`);
  return res.data;
}

export async function listPendingFeedback(): Promise<FeedbackOut[]> {
  const res = await api.get("/feedback/pending");
  return Array.isArray(res.data) ? res.data : [];
}

export async function approveFeedback(
  feedbackId: number,
  payload: FeedbackApprovePayload
): Promise<FeedbackOut> {
  const res = await api.patch(`/feedback/${feedbackId}/approve`, payload);
  return res.data;
}

export async function rejectFeedback(
  feedbackId: number,
  payload: FeedbackRejectPayload
): Promise<FeedbackOut> {
  const res = await api.patch(`/feedback/${feedbackId}/reject`, payload);
  return res.data;
}

/**
 * ⚠️ Essa rota no seu backend é CLIENT ONLY.
 * Só funciona quando o usuário logado for client.
 */
export async function getClientFeedbackByReflection(reflectionId: number): Promise<FeedbackOut> {
  const res = await api.get(`/feedback/by-reflection/${reflectionId}`);
  return res.data;
}
