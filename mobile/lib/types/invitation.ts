export type SendInvitationRequest = {
  email: string;
};

export type ValidateInvitationParams = {
  token: string;
};

export type ValidateInvitationResponse = {
  email?: string | null;
};

export type InvitationSignupRequest = {
  token: string;
  name: string;
  password: string;
  email?: string;
};
