import type { LucideIcon } from "lucide-react";
import { Coffee, UtensilsCrossed, MapPin } from "lucide-react";

export interface LocationOption {
  id: string;
  label: string;
  description: string;
  emoji: string;
  icon: LucideIcon;
}

export const LOCATION_OPTIONS: LocationOption[] = [
  {
    id: "cafe",
    label: "کافه",
    description: "قهوه‌ی خوب، یه گوشه‌ی دنج",
    emoji: "☕",
    icon: Coffee,
  },
  {
    id: "restaurant",
    label: "رستوران",
    description: "شام، درست و حسابی",
    emoji: "🍝",
    icon: UtensilsCrossed,
  },
  {
    id: "somewhere-else",
    label: "یه جای دیگه",
    description: "سورپرایزم کن — انتخاب با تو",
    emoji: "🌆",
    icon: MapPin,
  },
];

export const TIME_SLOTS: string[] = [
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

/** How far ahead she can pick. Tomorrow .. +60 days. */
export const MIN_DAYS_AHEAD = 1;
export const MAX_DAYS_AHEAD = 60;

export type Transportation = "pickup" | "self_drive";

export const TRANSPORT_OPTIONS = [
  {
    id: "pickup" as Transportation,
    emoji: "🚗",
    label: "بیا دنبالم",
    description: "میام دنبالت.",
  },
  {
    id: "self_drive" as Transportation,
    emoji: "🚙",
    label: "خودم میام",
    description: "خودم میام اونجا.",
  },
] as const;
