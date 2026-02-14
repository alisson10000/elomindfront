import { api } from "./api";

/**
 * Tipos
 */
export type Anamnesis = {
  id: number;
  client_id: number;
  therapist_id: number;
  summary: string;
  created_at: string;
  updated_at: string;
};

export type AnamnesisCreateIn = {
  summary: string;
};

export type AnamnesisUpdateIn = {
  summary: string;
};

/**
 * GET /anamnesis/{client_id}
 * (Apenas terapeuta — client não tem acesso)
 */
export async function getAnamnesisByClient(clientId: number): Promise<Anamnesis> {
  const { data } = await api.get(`/anamnesis/${clientId}`);
  return data;
}

/**
 * POST /anamnesis/{client_id}
 * Cria anamnese do cliente (1 por terapeuta/cliente, conforme seu backend)
 */
export async function createAnamnesis(
  clientId: number,
  payload: AnamnesisCreateIn
): Promise<Anamnesis> {
  const { data } = await api.post(`/anamnesis/${clientId}`, payload);
  return data;
}

/**
 * PATCH /anamnesis/{client_id}
 * Atualiza anamnese do cliente
 */
export async function updateAnamnesis(
  clientId: number,
  payload: AnamnesisUpdateIn
): Promise<Anamnesis> {
  const { data } = await api.patch(`/anamnesis/${clientId}`, payload);
  return data;
}
