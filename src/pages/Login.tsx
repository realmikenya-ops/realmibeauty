import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { user, role } = useAuth();

  useEffect(() => {
    if (user) navigate(role === "admin" ? "/admin" : "/", { replace: true });
  }, [user, role, navigate]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    if (!email || password.length < 6) return toast.error("Enter email and password (min 6 chars)");
    setBusy(true);
    if (tab === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Welcome back!");
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { display_name: name || email.split("@")[0], phone },
        },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Account created — check your email to confirm.");
    }
  };

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

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            {tab === "signup" && (
              <input name="name" className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Full name" />
            )}
            <input name="email" type="email" required className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Email" />
            {tab === "signup" && (
              <input name="phone" className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Phone (M-Pesa) e.g. 07XX XXX XXX" />
            )}
            <input name="password" type="password" required minLength={6} className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm" placeholder="Password" />
            <Button type="submit" variant="luxe" size="lg" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : tab === "login" ? "Sign in" : "Create account"}
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