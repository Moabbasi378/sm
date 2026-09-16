"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          (data as { message?: string } | null)?.message ?? "رمز اشتباهه.",
        );
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "یه مشکلی پیش اومد.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-[2rem] border border-stone-200/70 bg-white p-8 shadow-xl shadow-stone-900/5">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
        <Lock className="h-5 w-5 text-stone-600" />
      </div>
      <h1 className="mt-4 text-center text-2xl font-extrabold text-stone-900">
        برنامه‌ی قرار
      </h1>
      <p className="mt-1 text-center text-sm text-stone-500">
        این قسمت فقط برای خودمه.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <label htmlFor="admin-password" className="sr-only">
          رمز عبور
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز"
          className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-[15px] text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 focus:outline-none"
        />
        {error && (
          <p role="alert" className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || password.length === 0}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 text-[15px] font-bold text-white transition hover:bg-stone-800 disabled:opacity-40"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          باز کن
        </button>
      </form>
    </div>
  );
}
