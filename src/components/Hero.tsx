import { motion } from "framer-motion";
import heroImg from "@/assets/hero-salon.jpg";
import { SearchBar } from "./SearchBar";
import { ShieldCheck, Smartphone, Star } from "lucide-react";

export const Hero = () => (
  <section className="relative overflow-hidden bg-hero text-primary-foreground">
    <div className="absolute inset-0 opacity-40">
      <img src={heroImg} alt="" className="h-full w-full object-cover" width={1536} height={1024} />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/70 to-primary" />
    </div>
    <div className="container relative py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="bg-accent/15 text-accent border-accent/30 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide">
          <Star className="h-3 w-3 fill-current" /> Kenya's #1 booking platform
        </span>
        <h1 className="font-display text-4xl font-bold leading-[1.05] md:text-6xl lg:text-7xl">
          Book Beauty & <br />
          <span className="text-gradient-gold">Grooming</span> Services Instantly
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-primary-foreground/80 md:text-lg">
          Discover top salons and barbershops near you. Reserve your chair in seconds and pay with M-Pesa.
        </p>
        <div className="mt-10">
          <SearchBar />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-primary-foreground/70">
          <div className="flex items-center gap-2"><ShieldCheck className="text-accent h-4 w-4" /> Verified vendors</div>
          <div className="flex items-center gap-2"><Smartphone className="text-accent h-4 w-4" /> M-Pesa payments</div>
          <div className="flex items-center gap-2"><Star className="text-accent h-4 w-4" /> Real reviews</div>
        </div>
      </motion.div>
    </div>
  </section>
);