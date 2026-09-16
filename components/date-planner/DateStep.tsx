"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MAX_DAYS_AHEAD, MIN_DAYS_AHEAD } from "@/lib/config";
import {
  faDigits,
  fromJalali,
  jalaliMonthLength,
  jalaliMonthName,
  jalaliWeekdayNamesShort,
  toISODate,
  toJalali,
} from "@/lib/jalali";
import { jalaliMonthGrid } from "@/lib/format";

interface Props {
  value: string; // YYYY-MM-DD (Gregorian, stored)
  onChange: (iso: string) => void;
}

function startOfDay(d: Date): Date {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

export function DateStep({ value, onChange }: Props) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const minDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + MIN_DAYS_AHEAD);
    return startOfDay(d);
  }, [today]);
  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + MAX_DAYS_AHEAD);
    return startOfDay(d);
  }, [today]);

  const [cursor, setCursor] = useState(() => {
    if (value) {
      const parsed = new Date(`${value}T12:00:00`);
      if (!Number.isNaN(parsed.getTime())) {
        const j = toJalali(parsed);
        return { jy: j.jy, jm: j.jm };
      }
    }
    const j = toJalali(minDate);
    return { jy: j.jy, jm: j.jm };
  });

  const cells = useMemo(
    () => jalaliMonthGrid(cursor.jy, cursor.jm),
    [cursor],
  );

  const monthLabel = `${jalaliMonthName(cursor.jm)} ${faDigits(cursor.jy)}`;

  function shiftCursor(delta: number) {
    let { jy, jm } = cursor;
    jm += delta;
    while (jm < 1) {
      jm += 12;
      jy -= 1;
    }
    while (jm > 12) {
      jm -= 12;
      jy += 1;
    }
    setCursor({ jy, jm });
  }

  const minJ = toJalali(minDate);
  const canPrev =
    cursor.jy > minJ.jy || (cursor.jy === minJ.jy && cursor.jm > minJ.jm);
  const cursorEnd = fromJalali(
    cursor.jy,
    cursor.jm,
    jalaliMonthLength(cursor.jy, cursor.jm),
  );
  const canNext = startOfDay(cursorEnd) < maxDate;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        {/* In RTL, "next month" points left */}
        <button
          type="button"
          onClick={() => canNext && shiftCursor(1)}
          disabled={!canNext}
          aria-label="ماه بعد"
          className="flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <p className="text-lg font-extrabold text-stone-900">{monthLabel}</p>
        <button
          type="button"
          onClick={() => canPrev && shiftCursor(-1)}
          disabled={!canPrev}
          aria-label="ماه قبل"
          className="flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div
        className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-stone-400"
        aria-hidden="true"
      >
        {jalaliWeekdayNamesShort().map((d, i) => (
          <div key={i} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" role="listbox" aria-label="یه روز انتخاب کن">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;
          const iso = toISODate(date);
          const disabled =
            startOfDay(date) < minDate || startOfDay(date) > maxDate;
          const selected = value === iso;
          const j = toJalali(date);
          return (
            <motion.button
              key={iso}
              type="button"
              role="option"
              aria-selected={selected}
              disabled={disabled}
              whileTap={disabled ? undefined : { scale: 0.92 }}
              onClick={() => onChange(iso)}
              className={[
                "flex aspect-square min-h-[44px] items-center justify-center rounded-full text-[15px] transition-colors",
                selected
                  ? "bg-stone-900 font-bold text-white shadow-md"
                  : disabled
                    ? "text-stone-300"
                    : "text-stone-700 hover:bg-stone-900/5 active:bg-stone-900/10",
              ].join(" ")}
            >
              {faDigits(j.jd)}
            </motion.button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-stone-400">
        از فردا تا دو ماه آینده، هر روزی که دوست داری.
      </p>
    </div>
  );
}
