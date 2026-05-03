import { Scissors } from "lucide-react";

export const Logo = ({ light = false }: { light?: boolean }) => (
  <div className="flex items-center gap-2">
    <div className="bg-gold flex h-9 w-9 items-center justify-center rounded-xl shadow-gold">
      <Scissors className="h-5 w-5 text-primary" strokeWidth={2.5} />
    </div>
    <div className="leading-none">
      <div className={`font-display text-lg font-bold tracking-tight ${light ? "text-primary-foreground" : "text-primary"}`}>
        REALMI<span className="text-gradient-gold"> KENYA</span>
      </div>
      <div className={`text-[10px] uppercase tracking-[0.2em] ${light ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
        Beauty · Grooming
      </div>
    </div>
  </div>
);