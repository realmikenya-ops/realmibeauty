import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { TrendingUp, Users, Wallet } from "lucide-react";

export const VendorCTA = () => (
  <section className="container py-16 md:py-24">
    <div className="bg-hero relative overflow-hidden rounded-3xl px-6 py-14 text-primary-foreground md:px-16 md:py-20">
      <div className="bg-accent/20 absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl" />
      <div className="bg-accent/10 absolute -bottom-20 -left-20 h-72 w-72 rounded-full blur-3xl" />
      <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.25em]">For Salon & Kinyozi Owners</p>
          <h2 className="font-display mt-3 text-3xl font-bold leading-tight md:text-5xl">
            Grow your business with <span className="text-gradient-gold">Realmi</span>
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            Reach thousands of customers, manage bookings online, and get paid via M-Pesa — all in one dashboard.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild variant="luxe" size="lg"><Link to="/vendor-signup">List your business</Link></Button>
            <Button asChild variant="outlineGold" size="lg"><Link to="/about">Learn more</Link></Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {[
            { icon: Users, n: "10k+", l: "Customers" },
            { icon: TrendingUp, n: "3×", l: "More bookings" },
            { icon: Wallet, n: "M-Pesa", l: "Instant pay" },
          ].map((s) => (
            <div key={s.l} className="border-primary-foreground/15 bg-primary-foreground/5 rounded-2xl border p-4 text-center backdrop-blur md:p-6">
              <s.icon className="text-accent mx-auto h-6 w-6" />
              <p className="font-display mt-2 text-2xl font-bold md:text-3xl">{s.n}</p>
              <p className="text-primary-foreground/70 text-xs">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);