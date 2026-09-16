"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const MAX_DODGES = 4;

const LABELS = [
  "شاید بعداً",
  "عه، کجا؟",
  "نمی‌گیریم!",
  "نزدیک شدی…",
  "باشه، تسلیمم",
];

/** Easter egg 1: the "Maybe later" button playfully dodges the first few
 *  interactions, then settles and behaves like a normal button.
 *  Never impossible to click.
 *
 *  Mobile note: phones have no hover — a tap fires `touchstart` then `click`
 *  directly. React's synthetic touch listeners are passive, so
 *  `preventDefault()` can't stop the tap-click there. We attach a NATIVE,
 *  non-passive `touchstart` listener that both dodges the button away AND
 *  kills the tap's click while playful. Desktop uses hover/focus instead.
 */
export function MaybeLaterButton({ onAccept }: { onAccept: () => void }) {
  const [dodges, setDodges] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0, r: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  // Mirror in a ref so the native listener never sees a stale closure.
  const dodgesRef = useRef(0);

  /** Returns true if the interaction was "eaten" by a dodge. */
  const dodge = useCallback((): boolean => {
    if (dodgesRef.current >= MAX_DODGES) return false;
    const next = dodgesRef.current + 1;
    dodgesRef.current = next;
    setDodges(next);
    if (next >= MAX_DODGES) {
      setOffset({ x: 0, y: 0, r: 0 });
    } else {
      // Keep jumps on-screen for narrow phones.
      const maxX =
        typeof window !== "undefined" && window.innerWidth < 480 ? 64 : 120;
      const dir = Math.random() < 0.5 ? -1 : 1;
      setOffset({
        x: Math.round(dir * (maxX * 0.6 + Math.random() * maxX * 0.4)),
        y: Math.round((Math.random() - 0.5) * 64),
        r: Math.round(dir * (6 + Math.random() * 10)),
      });
    }
    return true;
  }, []);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const onTouchStart = (e: TouchEvent) => {
      if (dodgesRef.current < MAX_DODGES) {
        // Non-passive: this reliably cancels the tap's click on mobile.
        e.preventDefault();
        dodge();
      }
    };
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
    };
  }, [dodge]);

  return (
    <motion.button
      ref={btnRef}
      type="button"
      onClick={onAccept}
      onMouseEnter={() => {
        dodge();
      }}
      onFocus={() => {
        dodge();
      }}
      onPointerDown={(e) => {
        // Pen has no hover and fires no touchstart — same treatment.
        // Mouse passes through (hover already had its fun), touch is
        // handled by the native listener above.
        if (e.pointerType === "pen" && dodge()) {
          e.preventDefault();
        }
      }}
      animate={{ x: offset.x, y: offset.y, rotate: offset.r }}
      transition={{ type: "spring", stiffness: 550, damping: 14 }}
      style={{ touchAction: "manipulation" }}
      className="rounded-full px-5 py-3 text-sm font-medium text-stone-500 select-none underline decoration-stone-300 decoration-dotted underline-offset-4 transition-colors hover:text-stone-800"
      aria-label="شاید بعداً"
    >
      {LABELS[Math.min(dodges, LABELS.length - 1)]}
    </motion.button>
  );
}
