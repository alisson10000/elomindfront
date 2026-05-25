import { api } from "@/lib/api";
import { getToken } from "@/lib/token";
import type { ClientSummary, RawClientRecord } from "@/lib/types/user";

function pickClientName(client: RawClientRecord): string | null {
  return (
    client?.name ??
    client?.full_name ??
    client?.client_name ??
    client?.user?.name ??
    client?.user?.full_name ??
    null
  );
}

function normalizeClient(client: RawClientRecord): ClientSummary | null {
  const id = Number(client?.id ?? client?.client_id ?? client?.user_id);

  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  return {
    id,
    name: pickClientName(client),
    email: client?.email ?? client?.user?.email ?? null,
    role: "client",
    is_active: Boolean((client as { is_active?: boolean | null })?.is_active),
  };
}

async function requireAuthToken() {
  const token = await getToken();

  if (!token) {
    throw new Error("NO_TOKEN");
  }

  return token;
}

export async function listClients(): Promise<ClientSummary[]> {
  await requireAuthToken();

  const res = await api.get<RawClientRecord[] | { items?: RawClientRecord[] }>(
    "/users/clients"
  );

  const raw = Array.isArray(res.data) ? res.data : res.data?.items ?? [];

  return raw
    .map(normalizeClient)
    .filter((client): client is ClientSummary => client !== null);
}
