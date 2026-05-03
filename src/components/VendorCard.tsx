import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import type { Vendor } from "@/data/vendors";
import { motion } from "framer-motion";

export const VendorCard = ({ vendor, index = 0 }: { vendor: Vendor; index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.06 }}
  >
    <Link
      to={`/vendor/${vendor.id}`}
      className="group bg-card hover:shadow-luxe block overflow-hidden rounded-2xl border border-border shadow-card transition-all hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={vendor.image}
          alt={vendor.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="bg-gold absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-primary">
          {vendor.type}
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">
          <Star className="text-accent h-3 w-3 fill-current" />
          {vendor.rating} <span className="text-muted-foreground">({vendor.reviews})</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold leading-tight">{vendor.name}</h3>
        <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
          <MapPin className="h-3 w-3" /> {vendor.location}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {vendor.tags.slice(0, 3).map((t) => (
            <span key={t} className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-muted-foreground text-xs">From</p>
            <p className="font-display text-xl font-bold">
              KSh {vendor.priceFrom.toLocaleString()}
            </p>
          </div>
          <span className="text-accent text-xs font-semibold group-hover:underline">View & Book →</span>
        </div>
      </div>
    </Link>
  </motion.div>
);