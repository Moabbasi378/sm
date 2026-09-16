"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { LOCATION_OPTIONS } from "@/lib/config";

interface Props {
  value: string;
  custom: string;
  onChange: (id: string) => void;
  onCustomChange: (text: string) => void;
}

export function LocationStep({ value, custom, onChange, onCustomChange }: Props) {
  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="کجا بریم؟">
        {LOCATION_OPTIONS.map((opt) => {
          const selected = value === opt.id;
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(opt.id)}
              className={[
                "relative flex min-h-[96px] flex-col items-start gap-1 rounded-3xl border p-4 text-right transition-all",
                selected
                  ? "border-stone-900 bg-stone-900 text-white shadow-lg"
                  : "border-stone-200 bg-white text-stone-800 hover:border-stone-400 hover:shadow-sm",
              ].join(" ")}
            >
              {selected && (
                <span className="absolute top-3 left-3 flex h-5 w-5 items-center justify-center rounded-full bg-white">
                  <Check className="h-3.5 w-3.5 text-stone-900" />
                </span>
              )}
              <span className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">
                  {opt.emoji}
                </span>
                <Icon
                  className={`h-4 w-4 ${selected ? "text-white/80" : "text-stone-400"}`}
                />
              </span>
              <span className="text-[15px] font-bold">{opt.label}</span>
              <span
                className={`text-[13px] leading-snug ${selected ? "text-white/70" : "text-stone-500"}`}
              >
                {opt.description}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-3">
        <label
          htmlFor="location-custom"
          className="mb-1.5 block text-[13px] font-medium text-stone-500"
        >
          یه جای خاص مد نظرته؟ <span className="text-stone-400">(اختیاری)</span>
        </label>
        <input
          id="location-custom"
          type="text"
          value={custom}
          onChange={(e) => onCustomChange(e.target.value)}
          maxLength={120}
          placeholder="مثلاً همون کافه‌ی سر خیابون اصلی…"
          className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-[15px] text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 focus:outline-none"
        />
      </div>
    </div>
  );
}
