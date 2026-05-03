import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const benefits = [
  "Reach thousands of customers in Kenya",
  "Manage bookings & schedule online",
  "M-Pesa payouts directly to your account",
  "Vendor dashboard with real-time analytics",
  "Free profile listing — pay commission only on bookings",
];

const VendorSignup = () => (
  <div className="bg-background min-h-screen">
    <Navbar />
    <section className="bg-hero text-primary-foreground">
      <div className="container py-20 text-center">
        <p className="text-accent text-xs font-semibold uppercase tracking-[0.25em]">Become a Realmi Vendor</p>
        <h1 className="font-display mx-auto mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          Turn empty chairs into <span className="text-gradient-gold">paying clients</span>
        </h1>
        <p className="text-primary-foreground/70 mx-auto mt-4 max-w-xl">
          Join hundreds of salons & kinyozi growing on Realmi Kenya.
        </p>
      </div>
    </section>

    <section className="container py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold">Why Realmi?</h2>
          <ul className="mt-6 space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <CheckCircle2 className="text-accent mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Application submitted!", { description: "Our team will review and reach out within 24 hours." });
          }}
          className="bg-card space-y-3 rounded-2xl border border-border p-6 shadow-luxe md:p-8"
        >
          <h3 className="font-display text-xl font-bold">Apply now</h3>
          <input className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Business name" required />
          <select className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" required>
            <option>Salon</option>
            <option>Barber / Kinyozi</option>
            <option>Nails & Beauty</option>
            <option>Braiding</option>
          </select>
          <input className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Owner name" required />
          <input className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Phone (M-Pesa)" required />
          <input type="email" className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Email" required />
          <input className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Location e.g. Westlands, Nairobi" required />
          <textarea rows={3} className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Tell us about your business" />
          <Button type="submit" variant="luxe" size="lg" className="w-full">Submit application</Button>
        </form>
      </div>
    </section>
    <Footer />
  </div>
);

export default VendorSignup;