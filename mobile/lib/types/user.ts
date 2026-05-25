export type RawClientRecord = {
  id?: number | string | null;
  client_id?: number | string | null;
  user_id?: number | string | null;
  name?: string | null;
  full_name?: string | null;
  client_name?: string | null;
  email?: string | null;
  user?: {
    name?: string | null;
    full_name?: string | null;
    email?: string | null;
  } | null;
};

export type ClientSummary = {
  id: number;
  name?: string | null;
  email?: string | null;
  role?: "client" | string | null;
  is_active?: boolean;
};
