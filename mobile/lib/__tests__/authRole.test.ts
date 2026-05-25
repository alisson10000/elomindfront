import { getUserRoleFromToken } from "@/lib/authRole";

function createToken(payload: Record<string, unknown>) {
  const json = JSON.stringify(payload);
  const base64 = Buffer.from(json, "utf-8").toString("base64url");
  return `header.${base64}.signature`;
}

describe("getUserRoleFromToken", () => {
  beforeAll(() => {
    if (typeof global.atob !== "function") {
      global.atob = (value: string) =>
        Buffer.from(value, "base64").toString("binary");
    }
  });

  it("returns client for a client token", () => {
    const token = createToken({ role: "client" });

    expect(getUserRoleFromToken(token)).toBe("client");
  });

  it("returns therapist for a therapist token", () => {
    const token = createToken({ role: "therapist" });

    expect(getUserRoleFromToken(token)).toBe("therapist");
  });

  it("returns null for an unknown role", () => {
    const token = createToken({ role: "admin" });

    expect(getUserRoleFromToken(token)).toBeNull();
  });

  it("returns null for an invalid token", () => {
    expect(getUserRoleFromToken("invalid-token")).toBeNull();
  });
});
