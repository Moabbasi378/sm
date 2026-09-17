import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { dateResponseSchema } from "@/lib/validation";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // Basic rate limiting: 10 submissions per 10 minutes per IP
  const ip = getClientIp(req.headers);
  const { allowed } = rateLimit(`submit:${ip}`, 10, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { message: "یه کم آروم‌تر — چند دقیقه‌ی دیگه امتحان کن." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "درخواست نامعتبره." }, { status: 400 });
  }

  const parsed = dateResponseSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid details." },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Normalize custom location: store free text inside locationCustom,
  // keep location as the picked option id for easy grouping.
  const locationCustom = data.locationCustom?.trim() ? data.locationCustom.trim().slice(0, 120) : null;
  const notes = data.notes?.trim() ? data.notes.trim().slice(0, 500) : null;

  try {
    const created = await db.dateResponse.create({
      data: {
        date: data.date,
        time: data.time,
        location: data.location,
        locationCustom,
        transportation: data.transportation,
        notes,
      },
      select: { id: true },
    });
    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (e) {
    console.error("POST /api/date failed:", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { message: "نتونستم ثبتش کنم — دوباره امتحان می‌کنی؟" },
      { status: 500 },
    );
  }
}
