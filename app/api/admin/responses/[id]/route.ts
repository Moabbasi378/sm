import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const { id } = await params;
  if (!id || typeof id !== "string" || id.length > 64) {
    return NextResponse.json({ message: "Invalid id." }, { status: 400 });
  }
  try {
    await db.dateResponse.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(
      "DELETE /api/admin/responses failed:",
      e instanceof Error ? e.message : e,
    );
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }
}
