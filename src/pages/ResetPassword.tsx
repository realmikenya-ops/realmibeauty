import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const type = params.get("type");
    if (type === "recovery") {
      setRecoveryMode(true);
    } else {
      supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
      });
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirm) return toast.error("Passwords do not match");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated! Redirecting…");
    setTimeout(() => navigate("/login", { replace: true }), 1500);
  };

  if (!recoveryMode) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <section className="container flex min-h-[80vh] items-center justify-center py-16">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border p-8 shadow-luxe text-center">
            <h1 className="font-display text-2xl font-bold">Invalid or expired link</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Please request a new password reset link from the login page.
            </p>
            <Button variant="luxe" className="mt-6" onClick={() => navigate("/login")}>
              Go to login
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <section className="container flex min-h-[80vh] items-center justify-center py-16">
        <div className="bg-card w-full max-w-md rounded-2xl border border-border p-8 shadow-luxe">
          <h1 className="font-display text-3xl font-bold">Set new password</h1>
          <p className="text-muted-foreground mt-1 text-sm">Enter your new password below.</p>

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <input
              type="password"
              required
              minLength={6}
              className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              required
              minLength={6}
              className="border-input w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <Button type="submit" variant="luxe" size="lg" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : "Update password"}
            </Button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ResetPassword;
