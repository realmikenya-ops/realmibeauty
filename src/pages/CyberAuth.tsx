import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { Monitor } from "lucide-react";

const signupSchema = z.object({
  displayName: z.string().trim().min(2, "Name too short").max(80),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7).max(20),
  password: z.string().min(6, "Min 6 characters").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6).max(72),
});

const CyberAuth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const tab = params.get("tab") === "signup" ? "signup" : "login";
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/cyber/dashboard", { replace: true });
    });
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse({
      displayName: fd.get("displayName"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      password: fd.get("password"),
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/cyber/dashboard`,
        data: { display_name: parsed.data.displayName, phone: parsed.data.phone },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! Check your email to confirm.");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse({ email: fd.get("email"), password: fd.get("password") });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate("/cyber/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Monitor className="h-6 w-6" /></div>
            <h1 className="font-display text-3xl font-bold">REALMI Cyber</h1>
            <p className="text-muted-foreground mt-1 text-sm">Order printing, design & online services</p>
          </div>
          <Card className="p-6 shadow-luxe">
            <Tabs defaultValue={tab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" required /></div>
                  <div className="space-y-2"><Label>Password</Label><Input name="password" type="password" required /></div>
                  <Button type="submit" variant="hero" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4 pt-4">
                  <div className="space-y-2"><Label>Full name</Label><Input name="displayName" required /></div>
                  <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" required /></div>
                  <div className="space-y-2"><Label>Phone (M-Pesa)</Label><Input name="phone" type="tel" placeholder="07xx xxx xxx" required /></div>
                  <div className="space-y-2"><Label>Password</Label><Input name="password" type="password" minLength={6} required /></div>
                  <Button type="submit" variant="luxe" className="w-full" disabled={busy}>{busy ? "Creating…" : "Create account"}</Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          <p className="text-muted-foreground mt-6 text-center text-xs">
            Looking for salons & barbers? <Link to="/explore" className="text-accent hover:underline">Browse vendors</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CyberAuth;