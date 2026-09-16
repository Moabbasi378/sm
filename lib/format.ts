import {
  faDigits,
  fromJalali,
  jalaliMonthLength,
  jalaliMonthName,
  toJalali,
} from "./jalali";

export { faDigits };

/** "2026-09-23" -> "چهارشنبه ۱ مهر ۱۴۰۴" */
export function formatLongDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  const { jy, jm, jd } = toJalali(d);
  const weekday = new Intl.DateTimeFormat("fa-IR", { weekday: "long" }).format(d);
  return `${weekday} ${faDigits(jd)} ${jalaliMonthName(jm)} ${faDigits(jy)}`;
}

/** Submitted timestamp -> "۲۵ شهریور ۱۴۰۴، ساعت ۱۸:۴۲" */
export function formatSubmittedAt(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value);
  const { jy, jm, jd } = toJalali(d);
  const time = new Intl.DateTimeFormat("fa-IR", {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
  return `${faDigits(jd)} ${jalaliMonthName(jm)} ${faDigits(jy)}، ساعت ${time}`;
}

/** "19:30" -> "۱۹:۳۰" */
export function formatTimeFa(time: string): string {
  return faDigits(time);
}

/** Short label for the date step, e.g. "۲۵ شهریور" */
export function formatShortDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  const { jm, jd } = toJalali(d);
  return `${faDigits(jd)} ${jalaliMonthName(jm)}`;
}

export function transportLabel(t: string): string {
  return t === "pickup" ? "🚗 بیام دنبالت" : "🚙 خودم میام";
}

export function locationLabel(id: string): string {
  switch (id) {
    case "cafe":
      return "☕ کافه";
    case "restaurant":
      return "🍝 رستوران";
    case "somewhere-else":
      return "🌆 یه جای دیگه";
    default:
      return id;
  }
}

/** Helpers for the Jalali month grid (Saturday-first weeks). */
export function jalaliMonthGrid(jy: number, jm: number): (Date | null)[] {
  const len = jalaliMonthLength(jy, jm);
  const first = fromJalali(jy, jm, 1);
  // JS getDay: 0=Sunday..6=Saturday. Saturday-first offset: Sat->0, Sun->1, ..., Fri->6
  const lead = (first.getDay() + 1) % 7;
  const cells: (Date | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= len; d++) cells.push(fromJalali(jy, jm, d));
  return cells;
}
