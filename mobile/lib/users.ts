import { api } from "./api";
<<<<<<< HEAD
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
=======

export async function listClients() {
  const res = await api.get("/users/clients");
  return res.data;
}

export async function setClientActive(userId: number, isActive: boolean) {
  const res = await api.patch(`/users/${userId}/status`, { is_active: isActive });
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
  return res.data;
}
