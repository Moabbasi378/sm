"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Car,
  Check,
  Clock3,
  Loader2,
  MapPin,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { DateStep } from "./DateStep";
import { TimeStep } from "./TimeStep";
import { LocationStep } from "./LocationStep";
import { TransportStep } from "./TransportStep";
import { MaybeLaterButton } from "./MaybeLaterButton";
import { type Transportation } from "@/lib/config";
import {
  formatLongDate,
  formatTimeFa,
  locationLabel,
  transportLabel,
} from "@/lib/format";

const STEPS = ["یه روز انتخاب کن", "یه ساعت انتخاب کن", "کجا بریم؟", "چطور میای؟"] as const;

interface SubmitError {
  message: string;
}

export function Planner() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [maybeLater, setMaybeLater] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [locationCustom, setLocationCustom] = useState("");
  const [transport, setTransport] = useState<Transportation | "">("");
  const [modalOpen, setModalOpen] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Easter egg 2: double-click the little calendar icon
  const [foundIt, setFoundIt] = useState(false);
  const [clickTimer, setClickTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  function handleIconClick() {
    if (foundIt) return;
    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);
      setFoundIt(true);
    } else {
      const t = setTimeout(() => setClickTimer(null), 350);
      setClickTimer(t);
    }
  }

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return date !== "";
      case 1:
        return time !== "";
      case 2:
        return location !== "";
      case 3:
        return transport !== "";
      default:
        return false;
    }
  }, [step, date, time, location, transport]);

  function handleTransportSelect(t: Transportation) {
    if (t === "self_drive" && transport !== "self_drive") {
      setModalOpen(true);
      return;
    }
    setTransport(t);
  }

  const placeLabel = useMemo(() => {
    const base = locationLabel(location);
    if (locationCustom.trim()) return `${base} — «${locationCustom.trim()}»`;
    return base;
  }, [location, locationCustom]);

  const rideLabel = transport === "" ? "" : transportLabel(transport);

  async function submit() {
    if (submitting || submitted) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time,
          location,
          locationCustom,
          transportation: transport,
        }),
      });
      const data: SubmitError & { ok?: boolean } = await res.json().catch(() => ({ message: "یه مشکلی پیش اومد" }));
      if (!res.ok) {
        throw new Error(data.message || "یه مشکلی پیش اومد. دوباره امتحان کن؟");
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "یه مشکلی پیش اومد. دوباره امتحان کن؟");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <MotionConfig reducedMotion="user">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto w-full max-w-md rounded-[2rem] border border-stone-200/70 bg-white p-8 text-center shadow-xl shadow-stone-900/5 sm:p-10"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-stone-900"
          >
            <PartyPopper className="h-7 w-7 text-white" />
          </motion.div>
          <h2 className="mt-5 text-3xl font-extrabold text-stone-900">
            قرارمون رسمی شد.
          </h2>
          <p className="mt-2 text-[15px] text-stone-500">می‌بینمت :)</p>
          <div className="mt-6 space-y-2 rounded-2xl bg-stone-50 p-5 text-right text-[15px]">
            <p><span className="text-stone-400">روز — </span><span className="font-bold text-stone-900">{formatLongDate(date)}</span></p>
            <p><span className="text-stone-400">ساعت — </span><span className="font-bold text-stone-900 tabular-nums">{formatTimeFa(time)}</span></p>
            <p><span className="text-stone-400">جا — </span><span className="font-bold text-stone-900">{placeLabel}</span></p>
            <p><span className="text-stone-400">مسیر — </span><span className="font-bold text-stone-900">{rideLabel}</span></p>
          </div>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-stone-400">
            <Sparkles className="h-3.5 w-3.5" />
            دیگه راه برگشتی نیست. (شوخی کردم، هست — فقط پیام بده.)
          </p>
        </motion.div>
      </MotionConfig>
    );
  }

  if (!started) {
    return (
      <MotionConfig reducedMotion="user">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto w-full max-w-xl text-center"
        >
          <p className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-stone-500">
            <Sparkles className="h-3.5 w-3.5" />
            یه سایت کوچیک، فقط برای همین
          </p>
          <h1 className="mt-6 text-5xl leading-[1.25] font-black text-stone-900 sm:text-6xl">
            بریم سر قرار؟
          </h1>
          <p className="mt-4 text-lg text-stone-500">
            تو جزئیاتش رو انتخاب می‌کنی.
          </p>
          <div className="mt-8 flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="group flex min-h-[56px] items-center gap-2 rounded-full bg-stone-900 px-8 text-base font-bold text-white shadow-lg shadow-stone-900/15 transition hover:bg-stone-800 active:scale-[0.99]"
            >
              شروع برنامه‌ریزی
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <MaybeLaterButton onAccept={() => setMaybeLater(true)} />
            <AnimatePresence>
              {maybeLater && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-1 text-sm text-stone-500"
                >
                  عجله‌ای نیست. پیشنهاد سر جاشه. 🙂
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </MotionConfig>
    );
  }

  const isSummary = step === STEPS.length;

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto w-full max-w-xl">
        {/* Progress */}
        <div className="mb-6 flex items-center justify-center gap-1.5" aria-label="پیشرفت">
          {[...STEPS, "Done"].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? "w-8 bg-stone-900" : "w-4 bg-stone-200"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={isSummary ? "summary" : step}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-[2rem] border border-stone-200/70 bg-white p-5 shadow-xl shadow-stone-900/5 sm:p-8"
            aria-live="polite"
          >
            {!isSummary ? (
              <>
                <p className="text-xs font-semibold text-stone-400">
                  مرحله‌ی {["اول", "دوم", "سوم", "چهارم"][step]} از چهار مرحله
                </p>
                <h2 className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-stone-900 sm:text-3xl">
                  {step === 0 && (
                    <button
                      type="button"
                      onClick={handleIconClick}
                      onDoubleClick={() => setFoundIt(true)}
                      title="یه روز انتخاب کن"
                      aria-label="آیکون تقویم"
                      className="rounded-lg p-0.5 transition hover:bg-stone-100"
                    >
                      <CalendarDays className="h-6 w-6 text-stone-400" />
                    </button>
                  )}
                  {step === 1 && <Clock3 className="h-6 w-6 text-stone-400" />}
                  {step === 2 && <MapPin className="h-6 w-6 text-stone-400" />}
                  {step === 3 && <Car className="h-6 w-6 text-stone-400" />}
                  {STEPS[step]}
                </h2>

                <AnimatePresence>
                  {step === 0 && foundIt && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-2 inline-block rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white"
                    >
                      باشه، پیداش کردی. 👀
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="mt-5">
                  {step === 0 && <DateStep value={date} onChange={setDate} />}
                  {step === 1 && <TimeStep value={time} onChange={setTime} />}
                  {step === 2 && (
                    <LocationStep
                      value={location}
                      custom={locationCustom}
                      onChange={setLocation}
                      onCustomChange={setLocationCustom}
                    />
                  )}
                  {step === 3 && (
                    <TransportStep
                      value={transport}
                      onSelect={handleTransportSelect}
                      modalOpen={modalOpen}
                      onConfirmSelfDrive={() => {
                        setTransport("self_drive");
                        setModalOpen(false);
                      }}
                      onSwitchToPickup={() => {
                        setTransport("pickup");
                        setModalOpen(false);
                      }}
                      onCloseModal={() => setModalOpen(false)}
                    />
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => (step === 0 ? setStarted(false) : setStep(step - 1))}
                    className="flex min-h-[52px] items-center gap-1.5 rounded-full px-5 text-[15px] font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
                  >
                    <ArrowRight className="h-4 w-4" />
                    برگرد
                  </button>
                  <button
                    type="button"
                    disabled={!canContinue}
                    onClick={() => setStep(step + 1)}
                    className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 text-[15px] font-bold text-white shadow-md transition hover:bg-stone-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-30 disabled:shadow-none sm:flex-none sm:px-8"
                  >
                    {step === STEPS.length - 1 ? "مرور" : "ادامه"}
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold text-stone-400">
                  تقریباً تمومه
                </p>
                <h2 className="mt-1 flex items-center gap-2 text-2xl font-extrabold text-stone-900 sm:text-3xl">
                  <Check className="h-6 w-6 text-stone-400" />
                  قرارمون
                </h2>
                <dl className="mt-5 space-y-3 rounded-3xl bg-stone-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-stone-400">روز</dt>
                    <dd className="text-right text-[15px] font-bold text-stone-900">
                      {formatLongDate(date)}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-stone-400">ساعت</dt>
                    <dd className="text-right text-[15px] font-bold text-stone-900 tabular-nums">{formatTimeFa(time)}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-stone-400">جا</dt>
                    <dd className="text-right text-[15px] font-bold text-stone-900">{placeLabel}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-stone-400">مسیر</dt>
                    <dd className="text-right text-[15px] font-bold text-stone-900">{rideLabel}</dd>
                  </div>
                </dl>

                {error && (
                  <p role="alert" className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex min-h-[52px] items-center gap-1.5 rounded-full px-5 text-[15px] font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
                  >
                    <ArrowRight className="h-4 w-4" />
                    برگرد
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitting || submitted}
                    className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 text-[15px] font-bold text-white shadow-md transition hover:bg-stone-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-8"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        داره ثبت میشه…
                      </>
                    ) : (
                      <>
                        قراره، باشه
                        <ArrowLeft className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </motion.section>
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
