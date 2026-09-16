import { z } from "zod";
import { LOCATION_OPTIONS, TIME_SLOTS, MAX_DAYS_AHEAD, MIN_DAYS_AHEAD } from "./config";

const locationIds = LOCATION_OPTIONS.map((o) => o.id);

function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const min = new Date(today);
  min.setDate(min.getDate() + MIN_DAYS_AHEAD);
  const max = new Date(today);
  max.setDate(max.getDate() + MAX_DAYS_AHEAD);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  return target >= min && target <= max;
}

export const dateResponseSchema = z.object({
  date: z
    .string()
    .min(1, "یه روز انتخاب کن")
    .refine(isValidDateString, "لطفاً یه روز توی دو ماه آینده انتخاب کن"),
  time: z
    .string()
    .min(1, "یه ساعت انتخاب کن")
    .refine(
      (v) => TIME_SLOTS.includes(v) || /^([01]\d|2[0-3]):[0-5]\d$/.test(v),
      "لطفاً یه ساعت معتبر انتخاب کن",
    ),
  location: z
    .string()
    .min(1, "یه جا انتخاب کن")
    .refine(
      (v) => locationIds.includes(v) || v === "custom",
      "لطفاً یه جای معتبر انتخاب کن",
    ),
  locationCustom: z.string().trim().max(120).optional().default(""),
  transportation: z.enum(["pickup", "self_drive"]),
  notes: z.string().trim().max(500).optional().default(""),
});

export type DateResponseInput = z.infer<typeof dateResponseSchema>;

export const adminLoginSchema = z.object({
  password: z.string().min(1, "رمز لازمه").max(256),
});
