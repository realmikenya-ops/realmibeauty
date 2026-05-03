import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import { vendors } from "@/data/vendors";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { checkSlot, filterSlotsForDate, useAvailability, weekdayFromDate } from "@/lib/availability";

const slots = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00"];

const VendorDetail = () => {
  const { id } = useParams();
  const vendor = vendors.find((v) => v.id === id);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [slot, setSlot] = useState<string | null>(null);
  const [availability] = useAvailability();
  const day = availability[weekdayFromDate(date)];
  const availableSlots = filterSlotsForDate(availability, date, slots);

  if (!vendor) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <div className="container py-32 text-center">
          <h1 className="font-display text-3xl">Vendor not found</h1>
          <Link to="/explore" className="text-accent mt-4 inline-block underline">Back to explore</Link>
        </div>
      </div>
    );
  }

  const service = vendor.services.find((s) => s.name === selectedService) ?? vendor.services[0];

  const handleBook = () => {
    if (!slot) return toast.error("Please pick a time slot");
    const check = checkSlot(availability, date, slot);
    if (!check.ok) {
      if (check.reason === "closed")
        return toast.error("Vendor is closed on this day", { description: "Please choose another date." });
      return toast.error("Outside working hours", {
        description: `This vendor only takes bookings between ${check.from} and ${check.to}.`,
      });
    }
    toast.success(`Booking confirmed at ${vendor.name}`, {
      description: `${service.name} · ${date} · ${slot}. M-Pesa STK push sent to your phone.`,
    });
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="relative h-72 md:h-96">
        <img src={vendor.image} alt={vendor.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>
      <div className="container -mt-20 pb-16 md:-mt-32">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-luxe md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="bg-accent/15 text-accent rounded-full px-2.5 py-0.5 text-xs font-semibold">
                    {vendor.type}
                  </span>
                  <h1 className="font-display mt-2 text-3xl font-bold md:text-4xl">{vendor.name}</h1>
                  <p className="text-muted-foreground mt-2 flex items-center gap-1 text-sm">
                    <MapPin className="h-4 w-4" /> {vendor.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold">
                  <Star className="text-accent h-4 w-4 fill-current" />
                  {vendor.rating} <span className="text-muted-foreground font-normal">({vendor.reviews})</span>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="outline" size="sm"><Phone className="h-4 w-4" /> Call</Button>
                <Button variant="outline" size="sm"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
              </div>
            </div>

            <div className="bg-card mt-6 rounded-2xl border border-border p-6 shadow-card md:p-8">
              <h2 className="font-display text-xl font-bold">Services</h2>
              <div className="mt-4 divide-y divide-border">
                {vendor.services.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedService(s.name)}
                    className={`flex w-full items-center justify-between py-4 text-left transition-colors ${
                      selectedService === s.name ? "text-accent" : ""
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" /> {s.duration}
                      </p>
                    </div>
                    <p className="font-display text-lg font-bold">KSh {s.price.toLocaleString()}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card mt-6 rounded-2xl border border-border p-6 shadow-card md:p-8">
              <h2 className="font-display text-xl font-bold">Reviews</h2>
              <div className="mt-4 space-y-4">
                {[
                  { n: "Wanjiku M.", r: 5, c: "Amazing service. My braids look perfect!" },
                  { n: "Brian K.", r: 5, c: "Best fade in Nairobi. Highly recommend." },
                  { n: "Aisha O.", r: 4, c: "Clean shop, friendly stylists. Will book again." },
                ].map((rv) => (
                  <div key={rv.n} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{rv.n}</p>
                      <div className="flex">
                        {Array.from({ length: rv.r }).map((_, i) => (
                          <Star key={i} className="text-accent h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">{rv.c}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-luxe">
              <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em]">Book your slot</p>
              <h3 className="font-display mt-2 text-xl font-bold">{service.name}</h3>
              <p className="font-display mt-1 text-2xl font-bold">KSh {service.price.toLocaleString()}</p>

              <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
              />

              <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {slots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                      slot === s
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border hover:border-accent"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <Button onClick={handleBook} variant="luxe" size="lg" className="mt-6 w-full">
                Confirm & Pay with M-Pesa
              </Button>
              <p className="text-muted-foreground mt-3 text-center text-xs">
                You'll receive an STK push on your phone to complete payment securely.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VendorDetail;