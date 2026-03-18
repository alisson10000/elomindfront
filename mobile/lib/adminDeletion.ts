// lib/adminDeletion.ts
import { api } from "./api";

type AdminDeletionResponse = { status: string; client_id: number };

export async function adminExecuteDeletion(clientId: number): Promise<AdminDeletionResponse> {
  const adminKey = process.env.EXPO_PUBLIC_ADMIN_KEY || "";
  if (!adminKey) throw new Error("ADMIN KEY não configurada (EXPO_PUBLIC_ADMIN_KEY).");

  const res = await api.post<AdminDeletionResponse>(
    `/admin/data-deletion-execute/${clientId}`,
    {},
    { headers: { "X-Admin-Key": adminKey } }
  );

  return res.data;
}
