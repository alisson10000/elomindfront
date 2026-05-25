<<<<<<< HEAD
export { sendInvitation } from "@/lib/services/invitation-service";
=======
import { api } from "@/lib/api";
import { getToken } from "@/lib/token"; // o mesmo helper que você usa no resto

export async function sendInvitation(email: string) {
  const token = await getToken();
  if (!token) throw new Error("NO_TOKEN");

  await api.post(
    "/invitations",
    { email },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
>>>>>>> 18fb86c88667169eb7f2572849096180318f03a8
