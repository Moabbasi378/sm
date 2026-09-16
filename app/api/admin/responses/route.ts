import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }
  const responses = await db.dateResponse.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ responses });
}
