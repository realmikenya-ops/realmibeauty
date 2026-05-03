import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const Login = () => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<"customer" | "vendor">("customer");
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <section className="container flex min-h-[80vh] items-center justify-center py-16">
        <div className="bg-card w-full max-w-md rounded-2xl border border-border p-8 shadow-luxe">
          <h1 className="font-display text-3xl font-bold">{tab === "login" ? "Welcome back" : "Create account"}</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {tab === "login" ? "Sign in to your Realmi account" : "Join Realmi Kenya in seconds"}
          </p>

          <div className="bg-secondary mt-6 grid grid-cols-2 rounded-xl p-1">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg py-2 text-sm font-semibold capitalize transition-colors ${
                  tab === t ? "bg-card shadow-card" : "text-muted-foreground"
                }`}
              >
                {t === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          {tab === "signup" && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(["customer", "vendor"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold capitalize transition-colors ${
                    role === r ? "border-accent bg-accent/10 text-accent" : "border-border"
                  }`}
                >
                  I'm a {r}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.info("Connect Lovable Cloud to enable real authentication.");
            }}
            className="mt-5 space-y-3"
          >
            {tab === "signup" && (
              <input className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Full name" />
            )}
            <input type="email" className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Email" />
            <input className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Phone (M-Pesa) e.g. 07XX XXX XXX" />
            <input type="password" className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Password" />
            <Button type="submit" variant="luxe" size="lg" className="w-full">
              {tab === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="text-muted-foreground mt-5 text-center text-xs">
            By continuing, you agree to Realmi's Terms of Service.{" "}
            <Link to="/" className="text-accent">Back home</Link>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;