import { Planner } from "@/components/date-planner/Planner";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div className="paper-texture pointer-events-none absolute inset-0" aria-hidden="true" />
      <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
        <Planner />
        <footer className="mt-12 text-center">
          <p className="text-[11px] text-stone-300 select-none">
            نسخه‌ی ۱٫۰ — ان‌شاءالله بدون باگ
          </p>
        </footer>
      </main>
    </div>
  );
}
