import { api } from "./api";

export async function listClients() {
  const res = await api.get("/users/clients");
  return res.data;
}

export async function setClientActive(userId: number, isActive: boolean) {
  const res = await api.patch(`/users/${userId}/status`, { is_active: isActive });
  return res.data;
}
