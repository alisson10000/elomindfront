import { api } from "@/lib/api";
import type { AcceptConsentRequest } from "@/lib/types/consent";

export async function acceptConsent(): Promise<void> {
  const payload: AcceptConsentRequest = { accepted: true };
  await api.post("/consents", payload);
}
