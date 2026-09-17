import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveUrl(url: string): string {
  if (process.env.TURSO_DATABASE_URL || !url.startsWith("file:")) {
    return url;
  }
  // Local SQLite file: Prisma CLI resolves `file:` URLs relative to the
  // prisma/ directory, but libsql resolves them relative to the process
  // working directory (project root). Align both on prisma/<file>.
  const p = url.slice("file:".length);
  if (path.isAbsolute(p)) return url;
  return `file:${path.join(process.cwd(), "prisma", p)}`;
}

function createClient(): PrismaClient {
  // Production (Vercel): Turso remote. Local dev: SQLite file.
  // Set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN to use Turso locally too.
  const raw = process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!raw) {
    console.error(
      "Missing database env: set TURSO_DATABASE_URL (+TURSO_AUTH_TOKEN) or DATABASE_URL",
    );
    throw new Error("TURSO_DATABASE_URL or DATABASE_URL is not set");
  }
  const adapter = new PrismaLibSQL({
    url: resolveUrl(raw),
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return new PrismaClient({ adapter });
}

export const db: PrismaClient =
  globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
