import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Printer, Scan, Palette, Globe, FileText, MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type Svc = { id: string; name: string; description: string | null; category: string; unit_price: number; unit_label: string };

const ICONS: Record<string, any> = { printing: Printer, scanning: Scan, design: Palette, applications: Globe, general: FileText };

const CyberHome = () => {
  const [services, setServices] = useState<Svc[]>([]);
  useEffect(() => {
    supabase.from("cyber_services").select("*").eq("is_active", true).order("category").then(({ data }) => setServices((data as Svc[]) ?? []));
  }, []);

  const grouped = services.reduce<Record<string, Svc[]>>((acc, s) => {
    (acc[s.category] ||= []).push(s); return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-hero text-primary-foreground">
          <div className="container relative py-20 md:py-28">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
              <span className="bg-accent/15 text-accent border-accent/30 mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium">
                REALMI Cyber & Digital Services
              </span>
              <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
                Printing, Design & <span className="text-gradient-gold">Online Services</span> made easy
              </h1>
              <p className="text-primary-foreground/80 mx-auto mt-5 max-w-xl text-base md:text-lg">
                Upload your documents, place an order online, and pick up or get delivered. Pay with M-Pesa.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild variant="luxe" size="lg"><Link to="/cyber/dashboard">Place an order <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
                <Button asChild variant="outlineGold" size="lg"><a href="#services">View services</a></Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="container py-16 md:py-24">
          <div className="mb-10 text-center">
            <p className="text-accent text-xs font-semibold uppercase tracking-[0.25em]">Our services</p>
            <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">Everything you need under one roof</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(grouped).map(([cat, list]) => {
              const Icon = ICONS[cat] ?? FileText;
              return (
                <Card key={cat} className="p-6 shadow-card transition hover:shadow-luxe">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Icon className="h-6 w-6" /></div>
                  <h3 className="font-display text-xl font-bold capitalize">{cat}</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {list.map((s) => (
                      <li key={s.id} className="flex justify-between gap-2 border-b border-border/60 pb-2 last:border-0">
                        <span className="text-foreground/90">{s.name}</span>
                        <span className="text-accent font-semibold">KES {s.unit_price}/{s.unit_label}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="hero" size="lg"><Link to="/cyber/dashboard">Get started</Link></Button>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="bg-secondary py-16">
          <div className="container grid gap-8 md:grid-cols-3">
            {[
              { n: "1", t: "Place your order", d: "Pick a service, set quantity, upload your file." },
              { n: "2", t: "We process it", d: "Track status from pending to ready in real time." },
              { n: "3", t: "Pay & collect", d: "Pay via M-Pesa and pick up or get delivered." },
            ].map((s) => (
              <Card key={s.n} className="p-6">
                <div className="bg-gold text-primary mb-3 flex h-10 w-10 items-center justify-center rounded-full font-bold">{s.n}</div>
                <h3 className="font-display text-xl font-bold">{s.t}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{s.d}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="container py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-accent text-xs font-semibold uppercase tracking-[0.25em]">Get in touch</p>
              <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">Visit us in Nairobi</h2>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-start gap-3"><MapPin className="text-accent mt-0.5 h-5 w-5" /><div><p className="font-semibold">Address</p><p className="text-muted-foreground">CBD, Nairobi, Kenya</p></div></div>
                <div className="flex items-start gap-3"><Phone className="text-accent mt-0.5 h-5 w-5" /><div><p className="font-semibold">Phone</p><p className="text-muted-foreground">+254 700 000 000</p></div></div>
                <div className="flex items-start gap-3"><Mail className="text-accent mt-0.5 h-5 w-5" /><div><p className="font-semibold">Email</p><p className="text-muted-foreground">hello@realmi.co.ke</p></div></div>
                <div className="flex items-start gap-3"><Clock className="text-accent mt-0.5 h-5 w-5" /><div><p className="font-semibold">Hours</p><p className="text-muted-foreground">Mon–Sat 8:00 AM – 8:00 PM</p></div></div>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border shadow-card">
              <iframe
                title="REALMI KENYA location"
                src="https://www.google.com/maps?q=Nairobi+CBD&output=embed"
                className="h-full min-h-[320px] w-full"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CyberHome;