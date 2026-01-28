import { api } from "./api";

export type FeedbackOut = {
  id: number;
  reflection_id: number;
  therapist_id?: number | null;
  content: string; // ajuste se o campo no schema tiver outro nome
  status: "draft" | "pending" | "approved" | "rejected";
  therapist_notes?: string | null;
  created_at: string;
  updated_at?: string;
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
  payload: { therapist_text?: string } // ajuste conforme FeedbackApproveIn
): Promise<FeedbackOut> {
  const res = await api.patch(`/feedback/${feedbackId}/approve`, payload);
  return res.data;
}

export async function rejectFeedback(
  feedbackId: number,
  payload: { therapist_notes: string } // conforme FeedbackRejectIn
): Promise<FeedbackOut> {
  const res = await api.patch(`/feedback/${feedbackId}/reject`, payload);
  return res.data;
}

/**
 * ⚠️ Essa rota no seu backend é CLIENT ONLY.
 * Só vai funcionar quando o usuário logado for client.
 */
export async function getClientFeedbackByReflection(reflectionId: number): Promise<FeedbackOut> {
  const res = await api.get(`/feedback/by-reflection/${reflectionId}`);
  return res.data;
}
