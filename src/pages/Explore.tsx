import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { VendorCard } from "@/components/VendorCard";
import { vendors } from "@/data/vendors";
import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Filter } from "lucide-react";

const Explore = () => {
  const [params] = useSearchParams();
  const [type, setType] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const loc = params.get("loc")?.toLowerCase() || "";
  const svc = params.get("svc")?.toLowerCase() || "";

  const filtered = useMemo(
    () =>
      vendors.filter((v) => {
        const t = type === "All" || v.type === type;
        const l = !loc || v.location.toLowerCase().includes(loc);
        const s =
          !svc ||
          v.tags.join(" ").toLowerCase().includes(svc) ||
          v.type.toLowerCase().includes(svc) ||
          v.services.some((sv) => sv.name.toLowerCase().includes(svc));
        return t && l && s && v.priceFrom <= maxPrice;
      }),
    [type, maxPrice, loc, svc],
  );

  const types = ["All", "Salon", "Barber", "Nails", "Braiding"];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <section className="bg-secondary/40 border-b border-border">
        <div className="container py-10">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Explore vendors</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {filtered.length} results{loc && ` in "${loc}"`}{svc && ` for "${svc}"`}
          </p>
        </div>
      </section>
      <section className="container py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="bg-card h-fit rounded-2xl border border-border p-5 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="text-accent h-4 w-4" />
              <h3 className="font-display font-semibold">Filters</h3>
            </div>
            <div className="mb-6">
              <p className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wider">Category</p>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      type === t
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-background hover:border-accent"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-wider">
                Max price: KSh {maxPrice.toLocaleString()}
              </p>
              <input
                type="range"
                min={300}
                max={10000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
                className="accent-accent w-full"
              />
            </div>
          </aside>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((v, i) => <VendorCard key={v.id} vendor={v} index={i} />)}
            {filtered.length === 0 && (
              <p className="text-muted-foreground col-span-full py-16 text-center">No vendors match these filters.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Explore;