import { api } from "@/lib/api";
import { getToken } from "@/lib/token";
import type {
  InvitationSignupRequest,
  SendInvitationRequest,
  ValidateInvitationParams,
  ValidateInvitationResponse,
} from "@/lib/types/invitation";

async function requireAuthToken() {
  const token = await getToken();

  if (!token) {
    throw new Error("NO_TOKEN");
  }

  return token;
}

export async function sendInvitation(
  payload: SendInvitationRequest
): Promise<void> {
  await requireAuthToken();
  await api.post("/invitations", payload);
}

export async function validateInvitationToken(
  params: ValidateInvitationParams
): Promise<ValidateInvitationResponse> {
  const res = await api.get<ValidateInvitationResponse>(
    "/invitations/validate",
    { params }
  );

  return res.data ?? {};
}

export async function signupWithInvitation(
  payload: InvitationSignupRequest
): Promise<void> {
  await api.post("/invitations/signup", payload);
}
