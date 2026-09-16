import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createAdminSession } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validation";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const { allowed } = rateLimit(`admin-login:${ip}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ message: "تلاش زیاد بود. بعداً امتحان کن." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "درخواست نامعتبره." }, { status: 400 });
  }

  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "رمز لازمه." }, { status: 400 });
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ message: "بخش مدیریت تنظیم نشده." }, { status: 500 });
  }

  if (parsed.data.password !== expected) {
    // Intentionally generic + same timing shape; small delay to slow brute force
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ message: "رمز اشتباهه." }, { status: 401 });
  }

  const session = createAdminSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: session.expires,
  });
  return res;
}
