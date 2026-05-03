import { vendors } from "@/data/vendors";
import { VendorCard } from "./VendorCard";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const FeaturedVendors = () => (
  <section className="container py-16 md:py-24">
    <div className="mb-10 flex items-end justify-between">
      <div>
        <p className="text-accent text-xs font-semibold uppercase tracking-[0.25em]">Featured</p>
        <h2 className="font-display mt-2 text-3xl font-bold md:text-4xl">Top-rated near you</h2>
      </div>
      <Link to="/explore"><Button variant="outlineGold" className="hidden md:inline-flex">View all</Button></Link>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {vendors.map((v, i) => <VendorCard key={v.id} vendor={v} index={i} />)}
    </div>
  </section>
);