import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  initialServices,
  initialAvailability,
  weekdays,
  type Booking,
  type BookingStatus,
  type VendorService,
  type Availability,
  type Weekday,
} from "@/data/vendorDashboard";
import { checkSlot, fetchAvailability, persistAvailability } from "@/lib/availability";
import { supabase } from "@/integrations/supabase/client";
import {
  CalendarDays,
  Check,
  Clock,
  AlertTriangle,
  Pencil,
  Plus,
  Scissors,
  Trash2,
  TrendingUp,
  Wallet,
  X,
  Phone,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Tab = "overview" | "bookings" | "services" | "availability";

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-accent/15 text-accent border-accent/30",
  accepted: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
  completed: "bg-secondary text-muted-foreground border-border",
};

const VENDOR_ID = "luxe-crown-salon";

const VendorDashboard = () => {
  const [tab, setTab] = useState<Tab>("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<VendorService[]>(initialServices);
  const [availability, setAvailabilityState] = useState<Availability>(initialAvailability);

  const loadBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("vendor_id", VENDOR_ID)
      .order("booking_date", { ascending: false })
      .order("booking_time", { ascending: false });
    if (error) return toast.error("Failed to load bookings", { description: error.message });
    setBookings(
      (data ?? []).map((r) => ({
        id: r.id,
        customer: r.customer_name,
        phone: r.customer_phone,
        service: r.service_name,
        date: r.booking_date,
        time: (r.booking_time as string).slice(0, 5),
        price: r.price,
        status: r.status as BookingStatus,
      })),
    );
  };

  useEffect(() => {
    fetchAvailability(VENDOR_ID).then(setAvailabilityState).catch(() => {});
    loadBookings();
    const ch = supabase
      .channel("bookings-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings", filter: `vendor_id=eq.${VENDOR_ID}` }, () => loadBookings())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const setAvailability = async (a: Availability) => {
    setAvailabilityState(a);
    try {
      await persistAvailability(VENDOR_ID, a);
    } catch (e: any) {
      toast.error("Could not save availability", { description: e.message });
    }
  };

  const stats = useMemo(() => {
    const accepted = bookings.filter((b) => b.status === "accepted");
    const pending = bookings.filter((b) => b.status === "pending");
    const completed = bookings.filter((b) => b.status === "completed");
    const earnings = [...accepted, ...completed].reduce((s, b) => s + b.price, 0);
    return { accepted: accepted.length, pending: pending.length, completed: completed.length, earnings };
  }, [bookings]);

  const updateBooking = async (id: string, status: BookingStatus) => {
    if (status === "accepted") {
      const b = bookings.find((x) => x.id === id);
      if (b) {
        const check = checkSlot(availability, b.date, b.time);
        if (check.ok === false) {
          if (check.reason === "closed") {
            toast.error("Cannot accept — closed on this day", {
              description: `${b.date} falls on a day you've marked closed. Update availability or reject the booking.`,
            });
          } else {
            toast.error("Cannot accept — outside working hours", {
              description: `Booking is at ${b.time}. Working hours are ${check.from}–${check.to}.`,
            });
          }
          return;
        }
      }
    }
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) {
      return toast.error("Server rejected the change", { description: error.message });
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    toast.success(
      status === "accepted" ? "Booking accepted" : status === "rejected" ? "Booking rejected" : "Booking marked completed",
    );
  };

  const tabs: { id: Tab; label: string; icon: typeof CalendarDays }[] = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "bookings", label: "Bookings", icon: CalendarDays },
    { id: "services", label: "Services", icon: Scissors },
    { id: "availability", label: "Availability", icon: Clock },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <section className="bg-hero text-primary-foreground">
        <div className="container py-10 md:py-14">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.25em]">Vendor dashboard</p>
          <h1 className="font-display mt-2 text-3xl font-bold md:text-4xl">Luxe Crown Salon</h1>
          <p className="text-primary-foreground/70 mt-1 text-sm">Westlands, Nairobi · Open today</p>
        </div>
      </section>

      <div className="border-b border-border bg-card sticky top-16 z-30 backdrop-blur">
        <div className="container flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
                tab === t.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-8 md:py-10">
        {tab === "overview" && (
          <Overview stats={stats} bookings={bookings} availability={availability} onAction={updateBooking} goBookings={() => setTab("bookings")} />
        )}
        {tab === "bookings" && <BookingsTab bookings={bookings} availability={availability} onAction={updateBooking} />}
        {tab === "services" && <ServicesTab services={services} setServices={setServices} />}
        {tab === "availability" && (
          <AvailabilityTab availability={availability} setAvailability={setAvailability} />
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, accent = false }: { icon: typeof Wallet; label: string; value: string; accent?: boolean }) => (
  <div className={`rounded-2xl border p-5 shadow-card ${accent ? "bg-hero text-primary-foreground border-transparent" : "bg-card border-border"}`}>
    <div className="flex items-center justify-between">
      <p className={`text-xs font-semibold uppercase tracking-wider ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{label}</p>
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"}`}>
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <p className="font-display mt-3 text-2xl font-bold md:text-3xl">{value}</p>
  </div>
);

const conflictLabel = (a: Availability, b: Booking): string | undefined => {
  const c = checkSlot(a, b.date, b.time);
  if (c.ok === true) return undefined;
  return c.reason === "closed" ? "closed day" : `outside ${c.from}–${c.to}`;
};

const Overview = ({
  stats, bookings, availability, onAction, goBookings,
}: {
  stats: { accepted: number; pending: number; completed: number; earnings: number };
  bookings: Booking[];
  availability: Availability;
  onAction: (id: string, status: BookingStatus) => void;
  goBookings: () => void;
}) => {
  const pending = bookings.filter((b) => b.status === "pending").slice(0, 4);
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Wallet} label="Earnings (KSh)" value={stats.earnings.toLocaleString()} accent />
        <StatCard icon={Clock} label="Pending" value={String(stats.pending)} />
        <StatCard icon={Check} label="Upcoming" value={String(stats.accepted)} />
        <StatCard icon={CalendarDays} label="Completed" value={String(stats.completed)} />
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Pending requests</h2>
          <Button variant="ghost" size="sm" onClick={goBookings}>View all →</Button>
        </div>
        {pending.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">No pending requests. You're all caught up ✨</p>
        ) : (
          <ul className="divide-y divide-border">
            {pending.map((b) => (
              <BookingRow key={b.id} b={b} onAction={onAction} conflict={conflictLabel(availability, b)} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const BookingRow = ({ b, onAction, conflict }: { b: Booking; onAction: (id: string, status: BookingStatus) => void; conflict?: string }) => (
  <li className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className="truncate font-semibold">{b.customer}</p>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusStyles[b.status]}`}>
          {b.status}
        </span>
        {conflict && b.status === "pending" && (
          <span className="bg-destructive/10 text-destructive border-destructive/30 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            <AlertTriangle className="h-3 w-3" /> {conflict}
          </span>
        )}
      </div>
      <p className="text-muted-foreground mt-1 text-sm">{b.service} · KSh {b.price.toLocaleString()}</p>
      <p className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
        <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {b.date} · {b.time}</span>
        <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {b.phone}</span>
        <span className="text-muted-foreground/70">#{b.id}</span>
      </p>
    </div>
    <div className="flex shrink-0 gap-2">
      {b.status === "pending" && (
        <>
          <Button size="sm" variant="luxe" onClick={() => onAction(b.id, "accepted")}>
            <Check className="h-4 w-4" /> Accept
          </Button>
          <Button size="sm" variant="outline" onClick={() => onAction(b.id, "rejected")}>
            <X className="h-4 w-4" /> Reject
          </Button>
        </>
      )}
      {b.status === "accepted" && (
        <Button size="sm" variant="outline" onClick={() => onAction(b.id, "completed")}>
          <Check className="h-4 w-4" /> Mark done
        </Button>
      )}
    </div>
  </li>
);

const BookingsTab = ({ bookings, availability, onAction }: { bookings: Booking[]; availability: Availability; onAction: (id: string, status: BookingStatus) => void }) => {
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const filters: (BookingStatus | "all")[] = ["all", "pending", "accepted", "completed", "rejected"];
  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filter === f ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card hover:border-accent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="bg-card rounded-2xl border border-border p-2 shadow-card md:p-4">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground py-12 text-center text-sm">No bookings in this view.</p>
        ) : (
          <ul className="divide-y divide-border px-3">
            {filtered.map((b) => <BookingRow key={b.id} b={b} onAction={onAction} conflict={conflictLabel(availability, b)} />)}
          </ul>
        )}
      </div>
    </div>
  );
};

const ServicesTab = ({ services, setServices }: { services: VendorService[]; setServices: React.Dispatch<React.SetStateAction<VendorService[]>> }) => {
  const [editing, setEditing] = useState<VendorService | null>(null);
  const [form, setForm] = useState({ name: "", price: "", duration: "" });

  const startNew = () => {
    setEditing({ id: "", name: "", price: 0, duration: "", active: true });
    setForm({ name: "", price: "", duration: "" });
  };
  const startEdit = (s: VendorService) => {
    setEditing(s);
    setForm({ name: s.name, price: String(s.price), duration: s.duration });
  };
  const cancel = () => setEditing(null);
  const save = () => {
    if (!form.name || !form.price || !form.duration) return toast.error("Fill all fields");
    if (!editing) return;
    if (editing.id === "") {
      const ns: VendorService = { id: `s${Date.now()}`, name: form.name, price: +form.price, duration: form.duration, active: true };
      setServices((p) => [...p, ns]);
      toast.success("Service added");
    } else {
      setServices((p) => p.map((s) => (s.id === editing.id ? { ...s, name: form.name, price: +form.price, duration: form.duration } : s)));
      toast.success("Service updated");
    }
    setEditing(null);
  };
  const remove = (id: string) => {
    setServices((p) => p.filter((s) => s.id !== id));
    toast.success("Service deleted");
  };
  const toggle = (id: string) => setServices((p) => p.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="bg-card rounded-2xl border border-border shadow-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-display text-xl font-bold">Your services</h2>
          <Button size="sm" variant="luxe" onClick={startNew}><Plus className="h-4 w-4" /> Add service</Button>
        </div>
        <ul className="divide-y divide-border">
          {services.map((s) => (
            <li key={s.id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{s.name}</p>
                  {!s.active && (
                    <span className="bg-secondary text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mt-1 text-sm">KSh {s.price.toLocaleString()} · {s.duration}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toggle(s.id)}>
                  {s.active ? "Hide" : "Show"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => startEdit(s)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </li>
          ))}
          {services.length === 0 && <li className="text-muted-foreground p-8 text-center text-sm">No services yet.</li>}
        </ul>
      </div>

      <aside className="bg-card h-fit rounded-2xl border border-border p-6 shadow-card lg:sticky lg:top-36">
        <h3 className="font-display text-lg font-bold">{editing ? (editing.id ? "Edit service" : "New service") : "Service editor"}</h3>
        {!editing ? (
          <p className="text-muted-foreground mt-2 text-sm">Select a service to edit, or add a new one.</p>
        ) : (
          <div className="mt-4 space-y-3">
            <input className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Service name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input type="number" className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Price (KSh)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Duration e.g. 45 min" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            <div className="flex gap-2 pt-1">
              <Button variant="luxe" className="flex-1" onClick={save}>Save</Button>
              <Button variant="outline" onClick={cancel}>Cancel</Button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

const AvailabilityTab = ({ availability, setAvailability }: { availability: Availability; setAvailability: (a: Availability) => void }) => {
  const update = (d: Weekday, patch: Partial<Availability[Weekday]>) =>
    setAvailability({ ...availability, [d]: { ...availability[d], ...patch } });

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h2 className="font-display text-xl font-bold">Working hours</h2>
          <p className="text-muted-foreground text-sm">Set when customers can book your chair.</p>
        </div>
        <Button variant="luxe" size="sm" onClick={() => toast.success("Availability saved")}>Save changes</Button>
      </div>
      <ul className="divide-y divide-border">
        {weekdays.map((d) => {
          const day = availability[d];
          return (
            <li key={d} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => update(d, { open: !day.open })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${day.open ? "bg-accent" : "bg-muted"}`}
                  aria-label={`Toggle ${d}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-card transition-all ${day.open ? "left-5" : "left-0.5"}`} />
                </button>
                <span className="font-display w-12 text-base font-semibold">{d}</span>
                {!day.open && <span className="text-muted-foreground text-xs">Closed</span>}
              </div>
              {day.open && (
                <div className="flex items-center gap-2">
                  <input type="time" value={day.from} onChange={(e) => update(d, { from: e.target.value })} className="border-input rounded-lg border bg-background px-3 py-2 text-sm" />
                  <span className="text-muted-foreground text-sm">–</span>
                  <input type="time" value={day.to} onChange={(e) => update(d, { to: e.target.value })} className="border-input rounded-lg border bg-background px-3 py-2 text-sm" />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VendorDashboard;