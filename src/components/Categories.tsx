import barber from "@/assets/cat-barber.jpg";
import braids from "@/assets/cat-braids.jpg";
import nails from "@/assets/cat-nails.jpg";
import dreads from "@/assets/cat-dreads.jpg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const cats = [
  { name: "Barber & Kinyozi", img: barber, q: "barber" },
  { name: "Braiding", img: braids, q: "braids" },
  { name: "Nails & Beauty", img: nails, q: "nails" },
  { name: "Dreadlocks", img: dreads, q: "dreads" },
];

export const Categories = () => (
  <section className="container py-16 md:py-24">
    <div className="mb-10 flex items-end justify-between">
      <div>
        <p className="text-accent text-xs font-semibold uppercase tracking-[0.25em]">Categories</p>
        <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">Explore by service</h2>
      </div>
      <Link to="/explore" className="text-accent hidden text-sm font-semibold hover:underline md:block">
        View all →
      </Link>
    </div>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cats.map((c, i) => (
        <motion.div
          key={c.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          <Link
            to={`/explore?svc=${c.q}`}
            className="group relative block aspect-square overflow-hidden rounded-2xl shadow-card"
          >
            <img src={c.img} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-display text-base font-semibold text-primary-foreground md:text-lg">{c.name}</p>
              <p className="text-accent mt-0.5 text-xs">Browse →</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);