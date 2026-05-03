import { useEffect, useState } from "react";
import { initialAvailability, weekdays, type Availability, type Weekday } from "@/data/vendorDashboard";

const STORAGE_KEY = "realmi.availability.v1";
const EVENT = "realmi:availability";

export const loadAvailability = (): Availability => {
  if (typeof window === "undefined") return initialAvailability;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Availability) : initialAvailability;
  } catch {
    return initialAvailability;
  }
};

export const saveAvailability = (a: Availability) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
  window.dispatchEvent(new Event(EVENT));
};

export const useAvailability = () => {
  const [availability, setAvailability] = useState<Availability>(loadAvailability);
  useEffect(() => {
    const sync = () => setAvailability(loadAvailability());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return [availability, (a: Availability) => { setAvailability(a); saveAvailability(a); }] as const;
};

export const weekdayFromDate = (iso: string): Weekday => {
  // JS getDay: 0=Sun..6=Sat ; weekdays array starts on Mon
  const d = new Date(iso + "T00:00:00").getDay();
  const map: Record<number, Weekday> = { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };
  return map[d];
};

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export type SlotCheck =
  | { ok: true }
  | { ok: false; reason: "closed" | "outside-hours"; from?: string; to?: string };

export const checkSlot = (a: Availability, dateIso: string, time: string): SlotCheck => {
  const day = a[weekdayFromDate(dateIso)];
  if (!day.open) return { ok: false, reason: "closed" };
  const t = toMinutes(time);
  if (t < toMinutes(day.from) || t >= toMinutes(day.to))
    return { ok: false, reason: "outside-hours", from: day.from, to: day.to };
  return { ok: true };
};

/** Filter a list of HH:MM slots against availability for a given date. */
export const filterSlotsForDate = (a: Availability, dateIso: string, slots: string[]) => {
  const day = a[weekdayFromDate(dateIso)];
  if (!day.open) return [];
  const from = toMinutes(day.from);
  const to = toMinutes(day.to);
  return slots.filter((s) => {
    const m = toMinutes(s);
    return m >= from && m < to;
  });
};

export { weekdays };