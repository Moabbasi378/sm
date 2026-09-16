import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "date_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error("ADMIN_PASSWORD is not set");
  }
  return pw;
}

function sign(payload: string): string {
  return createHmac("sha256", getPassword()).update(payload).digest("hex");
}

export function createAdminSession(): { value: string; expires: Date } {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = String(expiresAt);
  const signature = sign(payload);
  return {
    value: `${payload}.${signature}`,
    expires: new Date(expiresAt),
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const store = await cookies();
    const cookie = store.get(COOKIE_NAME)?.value;
    if (!cookie) return false;
    const [payload, signature] = cookie.split(".");
    if (!payload || !signature) return false;
    const expiresAt = Number(payload);
    if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
    const expected = sign(payload);
    const a = Buffer.from(signature, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
