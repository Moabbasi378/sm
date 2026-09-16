"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { TIME_SLOTS } from "@/lib/config";
import { faDigits } from "@/lib/jalali";

interface Props {
  value: string;
  onChange: (time: string) => void;
}

export function TimeStep({ value, onChange }: Props) {
  const [customOpen, setCustomOpen] = useState(false);
  const [custom, setCustom] = useState("");

  const isCustomValue = value !== "" && !TIME_SLOTS.includes(value);

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="یه ساعت انتخاب کن">
        {TIME_SLOTS.map((slot) => {
          const selected = value === slot;
          return (
            <motion.button
              key={slot}
              type="button"
              role="radio"
              aria-checked={selected}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(slot)}
              className={[
                "flex min-h-[48px] items-center justify-center gap-1 rounded-2xl border text-[15px] font-medium tabular-nums transition-all",
                selected
                  ? "border-stone-900 bg-stone-900 text-white shadow-md"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-400 active:bg-stone-50",
              ].join(" ")}
            >
              {selected && <Check className="h-4 w-4" />}
              {faDigits(slot)}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4">
        {!customOpen && !isCustomValue ? (
          <button
            type="button"
            onClick={() => setCustomOpen(true)}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-stone-300 text-sm font-medium text-stone-500 transition hover:border-stone-400 hover:text-stone-800"
          >
            <Clock className="h-4 w-4" />
            یه ساعت دیگه…
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2 pr-4">
            <Clock className="h-4 w-4 shrink-0 text-stone-400" />
            <input
              type="time"
              aria-label="ساعت دلخواه"
              value={isCustomValue ? value : custom}
              onChange={(e) => {
                setCustom(e.target.value);
                if (e.target.value) onChange(e.target.value);
              }}
              className="h-11 w-full bg-transparent text-[15px] font-medium text-stone-900 tabular-nums outline-none"
            />
            {isCustomValue && (
              <span className="ml-2 rounded-full bg-stone-900 px-2.5 py-1 text-xs font-semibold text-white tabular-nums">
                {faDigits(value)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
