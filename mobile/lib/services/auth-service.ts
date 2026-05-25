import { api } from "@/lib/api";
import type {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/lib/types/auth";

export async function requestPasswordReset(
  payload: ForgotPasswordRequest
): Promise<void> {
  await api.post("/auth/forgot-password", payload);
}

export async function resetPassword(
  payload: ResetPasswordRequest
): Promise<void> {
  await api.post("/auth/reset-password", payload);
}
