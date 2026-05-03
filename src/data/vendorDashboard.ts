export type BookingStatus = "pending" | "accepted" | "rejected" | "completed";

export type Booking = {
  id: string;
  customer: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  price: number;
  status: BookingStatus;
};

export const initialBookings: Booking[] = [
  { id: "BK-1042", customer: "Wanjiku Mwangi", phone: "0712 345 678", service: "Silk Press", date: "2026-05-04", time: "10:30", price: 2500, status: "pending" },
  { id: "BK-1041", customer: "Brian Kiptoo", phone: "0722 998 110", service: "Skin Fade", date: "2026-05-04", time: "12:00", price: 600, status: "pending" },
  { id: "BK-1040", customer: "Aisha Otieno", phone: "0733 221 540", service: "Gel Manicure", date: "2026-05-05", time: "14:00", price: 1200, status: "accepted" },
  { id: "BK-1039", customer: "Kevin Njoroge", phone: "0701 552 909", service: "Beard Trim & Shave", date: "2026-05-03", time: "16:30", price: 350, status: "accepted" },
  { id: "BK-1038", customer: "Mary Atieno", phone: "0741 880 224", service: "Knotless Braids", date: "2026-05-02", time: "09:00", price: 4500, status: "completed" },
  { id: "BK-1037", customer: "James Omondi", phone: "0758 410 663", service: "Classic Haircut", date: "2026-05-02", time: "11:00", price: 400, status: "completed" },
  { id: "BK-1036", customer: "Faith Wairimu", phone: "0729 113 875", service: "Spa Pedicure", date: "2026-05-01", time: "15:30", price: 1500, status: "rejected" },
];

export type VendorService = {
  id: string;
  name: string;
  price: number;
  duration: string;
  active: boolean;
};

export const initialServices: VendorService[] = [
  { id: "s1", name: "Wash & Blow Dry", price: 1200, duration: "45 min", active: true },
  { id: "s2", name: "Silk Press", price: 2500, duration: "1h 30m", active: true },
  { id: "s3", name: "Deep Conditioning", price: 1500, duration: "1h", active: true },
  { id: "s4", name: "Haircut & Style", price: 1800, duration: "1h", active: false },
];

export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type Weekday = typeof weekdays[number];

export type Availability = Record<Weekday, { open: boolean; from: string; to: string }>;

export const initialAvailability: Availability = {
  Mon: { open: true, from: "09:00", to: "19:00" },
  Tue: { open: true, from: "09:00", to: "19:00" },
  Wed: { open: true, from: "09:00", to: "19:00" },
  Thu: { open: true, from: "09:00", to: "19:00" },
  Fri: { open: true, from: "09:00", to: "20:00" },
  Sat: { open: true, from: "08:00", to: "20:00" },
  Sun: { open: false, from: "10:00", to: "16:00" },
};