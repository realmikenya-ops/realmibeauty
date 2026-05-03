import { MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [loc, setLoc] = useState("");
  const [svc, setSvc] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = new URLSearchParams();
        if (loc) q.set("loc", loc);
        if (svc) q.set("svc", svc);
        navigate(`/explore?${q.toString()}`);
      }}
      className="bg-card mx-auto flex w-full max-w-3xl flex-col gap-2 rounded-2xl border border-border p-2 shadow-luxe md:flex-row md:items-center"
    >
      <div className="flex flex-1 items-center gap-2 px-3">
        <MapPin className="text-accent h-5 w-5" />
        <input
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          placeholder="Location e.g. Nairobi, Westlands"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="hidden h-8 w-px bg-border md:block" />
      <div className="flex flex-1 items-center gap-2 px-3">
        <Sparkles className="text-accent h-5 w-5" />
        <input
          value={svc}
          onChange={(e) => setSvc(e.target.value)}
          placeholder="Service e.g. haircut, braids, nails"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <Button type="submit" variant="luxe" size="lg" className="md:h-12">
        <Search className="mr-1 h-4 w-4" /> Search
      </Button>
    </form>
  );
};