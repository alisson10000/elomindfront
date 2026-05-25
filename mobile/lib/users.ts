import { api } from "./api";
import { listClients as listClientsSummary } from "@/lib/services/user-service";

export async function listClients() {
  const clients = await listClientsSummary();

  return clients.map((client) => ({
    id: client.id,
    name: client.name ?? `Cliente #${client.id}`,
    email: client.email ?? "",
    role: (client.role ?? "client") as "client",
    is_active: Boolean(client.is_active),
  }));
}

export async function setClientActive(userId: number, isActive: boolean) {
  const res = await api.patch(`/users/${userId}/status`, {
    is_active: isActive,
  });
  return res.data;
}
