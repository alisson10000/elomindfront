// lib/dreams.ts
import { api } from "./api";

/**
 * Tipos (backend -> mobile)
 */

export type DreamClientSavedOut = {
  id: number;
  created_at: string;
};

export type DreamOut = {
  id: number;
  client_id: number;
  therapist_id: number;
  description: string;
  therapist_tags?: string | null;
  therapist_notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type DreamTherapistUpdate = {
  therapist_tags?: string | null;
  therapist_notes?: string | null;
};

/**
 * CLIENT
 * - registra sonho (cliente não lista depois no MVP)
 */
export async function createDream(
  description: string
): Promise<DreamClientSavedOut> {
  const desc = (description ?? "").trim();

  // Mantém um guard leve aqui (não quebra o cliente e ajuda a evitar chamadas ruins)
  if (desc.length < 1) {
    throw new Error("Descrição do sonho é obrigatória.");
  }

  const res = await api.post<DreamClientSavedOut>("/dreams", { description: desc });
  return res.data;
}

/**
 * THERAPIST
 * - lista sonhos do cliente
 * - atualiza tags / notas
 */
export async function listDreamsByClientForTherapist(
  clientId: number
): Promise<DreamOut[]> {
  if (!Number.isFinite(clientId)) {
    throw new Error("clientId inválido.");
  }

  const res = await api.get<DreamOut[]>(`/dreams/${clientId}`);
  return res.data;
}

export async function updateDreamAsTherapist(
  dreamId: number,
  payload: DreamTherapistUpdate
): Promise<DreamOut> {
  if (!Number.isFinite(dreamId)) {
    throw new Error("dreamId inválido.");
  }

  // Não “inventar” campos: só normaliza strings -> null quando vierem vazias
  const normalized: DreamTherapistUpdate = {
    therapist_tags:
      payload?.therapist_tags === undefined
        ? undefined
        : payload.therapist_tags?.trim()
        ? payload.therapist_tags.trim()
        : null,
    therapist_notes:
      payload?.therapist_notes === undefined
        ? undefined
        : payload.therapist_notes?.trim()
        ? payload.therapist_notes.trim()
        : null,
  };

  const res = await api.patch<DreamOut>(`/dreams/${dreamId}`, normalized);
  return res.data;
}
