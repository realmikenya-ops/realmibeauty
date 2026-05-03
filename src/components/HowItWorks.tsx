import { Search, CalendarCheck, Sparkles } from "lucide-react";

const steps = [
  { icon: Search, title: "Discover", text: "Search salons & barbers near you. Filter by price, service or rating." },
  { icon: CalendarCheck, title: "Book", text: "Pick a service and a time slot. Confirm in seconds." },
  { icon: Sparkles, title: "Enjoy & pay", text: "Show up, look amazing. Pay securely via M-Pesa." },
];

export const HowItWorks = () => (
  <section className="bg-secondary/50 py-16 md:py-24">
    <div className="container">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-accent text-xs font-semibold uppercase tracking-[0.25em]">How it works</p>
        <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">Look good in 3 simple steps</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="bg-card rounded-2xl border border-border p-8 shadow-card">
            <div className="bg-gold mb-5 flex h-12 w-12 items-center justify-center rounded-xl shadow-gold">
              <s.icon className="text-primary h-6 w-6" />
            </div>
            <p className="text-muted-foreground text-xs font-semibold">STEP 0{i + 1}</p>
            <h3 className="font-display mt-1 text-xl font-semibold">{s.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);