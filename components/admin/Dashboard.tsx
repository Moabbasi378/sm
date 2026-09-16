"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Loader2, LogOut, RefreshCw, Trash2 } from "lucide-react";
import {
  formatLongDate,
  formatSubmittedAt,
  formatTimeFa,
  locationLabel,
  transportLabel,
} from "@/lib/format";
import { faDigits } from "@/lib/jalali";

interface DateResponse {
  id: string;
  date: string;
  time: string;
  location: string;
  locationCustom: string | null;
  transportation: string;
  createdAt: string;
}

function locationDisplay(r: DateResponse): string {
  const base = locationLabel(r.location);
  if (r.locationCustom) return `${base} — «${r.locationCustom}»`;
  return base;
}

export function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState<DateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/responses", { cache: "no-store" });
      if (res.status === 401) {
        router.refresh();
        return;
      }
      if (!res.ok) throw new Error("نتونستم جواب‌ها رو بگیرم.");
      const data = (await res.json()) as { responses: DateResponse[] };
      setItems(data.responses);
    } catch (e) {
      setError(e instanceof Error ? e.message : "نتونستم جواب‌ها رو بگیرم.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setError(null);
      try {
        const res = await fetch("/api/admin/responses", { cache: "no-store" });
        if (res.status === 401) {
          router.refresh();
          return;
        }
        if (!res.ok) throw new Error("نتونستم جواب‌ها رو بگیرم.");
        const data = (await res.json()) as { responses: DateResponse[] };
        if (!cancelled) setItems(data.responses);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "نتونستم جواب‌ها رو بگیرم.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function remove(id: string) {
    if (!window.confirm("این جواب حذف بشه؟")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/responses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("نتونستم حذفش کنم.");
      setItems((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "نتونستم حذفش کنم.");
    } finally {
      setDeletingId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const latest = items[0];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900">برنامه‌ی قرار</h1>
          <p className="mt-0.5 text-sm text-stone-500">
            {items.length === 0
              ? "فشاری نیست. به‌زودی تصمیم می‌گیره."
              : `${faDigits(items.length)} جواب — جدیدترین اول`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void load(true)}
            disabled={refreshing || loading}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition hover:border-stone-300 hover:text-stone-900 disabled:opacity-50"
            aria-label="تازه‌سازی"
            title="تازه‌سازی"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition hover:border-stone-300 hover:text-stone-900"
            aria-label="خروج"
            title="خروج"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="mt-6 flex items-center justify-center gap-2 rounded-[2rem] border border-stone-200/70 bg-white p-12 text-stone-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">داره میاد…</span>
        </div>
      ) : !latest ? (
        <div className="mt-6 rounded-[2rem] border border-stone-200/70 bg-white p-12 text-center shadow-xl shadow-stone-900/5">
          <p className="text-4xl" aria-hidden="true">👀</p>
          <h2 className="mt-3 text-2xl font-extrabold text-stone-900">هنوز خبری نیست...</h2>
          <p className="mt-1 text-[15px] text-stone-500">هنوز داره تصمیم می‌گیره 👀</p>
        </div>
      ) : (
        <>
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-xl shadow-stone-900/5 sm:p-8"
          >
            <p className="text-xs font-semibold text-stone-400">
              انتخاب فعلی
            </p>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-[13px] font-medium text-stone-400">روز</dt>
                <dd className="mt-0.5 text-lg font-bold text-stone-900">
                  {formatLongDate(latest.date)}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] font-medium text-stone-400">ساعت</dt>
                <dd className="mt-0.5 text-lg font-bold text-stone-900 tabular-nums">{formatTimeFa(latest.time)}</dd>
              </div>
              <div>
                <dt className="text-[13px] font-medium text-stone-400">جا</dt>
                <dd className="mt-0.5 text-lg font-bold text-stone-900">
                  {locationDisplay(latest)}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] font-medium text-stone-400">مسیر</dt>
                <dd className="mt-0.5 text-lg font-bold text-stone-900">
                  {transportLabel(latest.transportation)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-stone-100 pt-3 text-[13px] text-stone-500">
              ثبت‌شده در {formatSubmittedAt(latest.createdAt)}
            </p>
          </motion.section>

          {items.length > 0 && (
            <section className="mt-6 overflow-hidden rounded-[2rem] border border-stone-200/70 bg-white shadow-xl shadow-stone-900/5">
              <div className="border-b border-stone-100 px-5 py-4">
                <h2 className="flex items-center gap-2 text-sm font-bold text-stone-900">
                  <CalendarDays className="h-4 w-4 text-stone-400" />
                  همه‌ی جواب‌ها
                </h2>
              </div>
              {/* Mobile: stacked cards. Desktop: table. */}
              <div className="sm:hidden">
                {items.map((r) => (
                  <div key={r.id} className="border-b border-stone-100 px-5 py-4 last:border-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-[15px] font-bold text-stone-900">
                        {formatLongDate(r.date)} · <span className="tabular-nums">{formatTimeFa(r.time)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => void remove(r.id)}
                        disabled={deletingId === r.id}
                        aria-label={`حذف جواب ${r.date}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        {deletingId === r.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-stone-600">{locationDisplay(r)}</p>
                    <p className="mt-0.5 text-sm text-stone-600">{transportLabel(r.transportation)}</p>
                    <p className="mt-1 text-xs text-stone-400">{formatSubmittedAt(r.createdAt)}</p>
                  </div>
                ))}
              </div>
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-stone-100 text-xs text-stone-400">
                      <th className="px-5 py-3 font-semibold">روز</th>
                      <th className="px-3 py-3 font-semibold">ساعت</th>
                      <th className="px-3 py-3 font-semibold">جا</th>
                      <th className="px-3 py-3 font-semibold">مسیر</th>
                      <th className="px-3 py-3 font-semibold">ثبت‌شده</th>
                      <th className="px-5 py-3 text-left font-semibold">حذف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r) => (
                      <tr key={r.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60">
                        <td className="px-5 py-3 font-medium whitespace-nowrap text-stone-900">
                          {formatLongDate(r.date)}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-stone-700 tabular-nums">{formatTimeFa(r.time)}</td>
                        <td className="px-3 py-3 text-stone-700">{locationDisplay(r)}</td>
                        <td className="px-3 py-3 whitespace-nowrap text-stone-700">
                          {transportLabel(r.transportation)}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-stone-500">
                          {formatSubmittedAt(r.createdAt)}
                        </td>
                        <td className="px-5 py-3 text-left">
                          <button
                            type="button"
                            onClick={() => void remove(r.id)}
                            disabled={deletingId === r.id}
                            aria-label={`حذف جواب ${r.date}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          >
                            {deletingId === r.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
