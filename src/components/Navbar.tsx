import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, role, signOut } = useAuth();
  const links = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/vendor-signup", label: "For Vendors" },
    { to: "/vendor-dashboard", label: "Dashboard" },
    { to: "/about", label: "About" },
    ...(role === "admin" ? [{ to: "/admin", label: "Admin" }] : []),
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/"><Logo /></Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-accent ${pathname === l.to ? "text-accent" : "text-foreground/80"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Button variant="ghost" onClick={signOut}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
          ) : (
            <Button variant="ghost" asChild><Link to="/login">Sign in</Link></Button>
          )}
          <Button variant="luxe" asChild><Link to="/explore">Book now</Link></Button>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="container flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium hover:bg-secondary">
                {l.label}
              </Link>
            ))}
            <Button variant="luxe" asChild className="mt-2"><Link to="/explore">Book now</Link></Button>
          </div>
        </div>
      )}
    </header>
  );
};