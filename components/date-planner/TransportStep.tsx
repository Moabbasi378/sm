"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Car, Check, KeyRound } from "lucide-react";
import { TRANSPORT_OPTIONS, type Transportation } from "@/lib/config";

interface Props {
  value: Transportation | "";
  onSelect: (t: Transportation) => void;
  modalOpen: boolean;
  onConfirmSelfDrive: () => void;
  onSwitchToPickup: () => void;
  onCloseModal: () => void;
}

export function TransportStep({
  value,
  onSelect,
  modalOpen,
  onConfirmSelfDrive,
  onSwitchToPickup,
  onCloseModal,
}: Props) {
  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="چطور میای؟">
        {TRANSPORT_OPTIONS.map((opt) => {
          const selected = value === opt.id;
          return (
            <motion.button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(opt.id)}
              className={[
                "relative flex min-h-[104px] flex-col items-start gap-1 rounded-3xl border p-4 text-right transition-all",
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
              <span className="text-2xl" aria-hidden="true">
                {opt.emoji}
              </span>
              <span className="text-[15px] font-bold">{opt.label}</span>
              <span
                className={`text-[13px] ${selected ? "text-white/70" : "text-stone-500"}`}
              >
                {opt.description}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/40 p-4 backdrop-blur-[2px] sm:items-center"
            onClick={onCloseModal}
            role="presentation"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="transport-modal-title"
              className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
            >
              <p className="text-3xl" aria-hidden="true">
                👀
              </p>
              <h3
                id="transport-modal-title"
                className="mt-2 text-2xl font-extrabold text-stone-900"
              >
                وایسا… مطمئنی؟
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-stone-600">
                اصلاً برام زحمتی نیست بیام دنبالت. اگه وسیله لازم داری، رو من حساب کن.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onSwitchToPickup}
                  className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-stone-900 text-[15px] font-bold text-white transition hover:bg-stone-800 active:scale-[0.99]"
                >
                  <Car className="h-4 w-4" />
                  باشه، بیا دنبالم 🚗
                </button>
                <button
                  type="button"
                  onClick={onConfirmSelfDrive}
                  className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-stone-200 text-[15px] font-medium text-stone-600 transition hover:border-stone-300 hover:text-stone-900"
                >
                  <KeyRound className="h-4 w-4" />
                  آره، خودم میام
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
