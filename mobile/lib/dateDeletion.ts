// lib/dataDeletion.ts
import { api } from "./api";

export type DataDeletionRequestOut = {
  id: number;
  client_id: number;
  client_email?: string | null;
  client_name?: string | null;
  requested_at: string;
  status: "pending" | "completed" | string;
  completed_at?: string | null;
};

export async function getMyDeletionRequest(): Promise<DataDeletionRequestOut | null> {
  const res = await api.get<DataDeletionRequestOut | null>("/data-deletion-request");
  return res.data;
}

export async function createMyDeletionRequest(): Promise<DataDeletionRequestOut> {
  // backend aceita body vazio; mandamos {} por padrão
  const res = await api.post<DataDeletionRequestOut>("/data-deletion-request", {});
  return res.data;
}
