import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ShieldAlert, LogOut, Users, CalendarCheck } from "lucide-react";

type Booking = {
  id: string; vendor_id: string; customer_name: string; customer_phone: string;
  service_name: string; price: number; booking_date: string; booking_time: string;
  status: string; created_at: string;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, role, loading, signOut } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    else if (role && role !== "admin") navigate("/");
  }, [user, role, loading, navigate]);

  useEffect(() => {
    if (role !== "admin") return;
    const load = async () => {
      const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
      setBookings((data as Booking[]) ?? []);
    };
    load();
    const ch = supabase.channel("admin-bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [role]);

  if (loading || role !== "admin") {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <main className="container py-20 text-center">
          {role && role !== "admin" && (
            <Card className="mx-auto max-w-md p-8">
              <ShieldAlert className="text-accent mx-auto mb-3 h-10 w-10" />
              <h2 className="font-display text-xl font-bold">Admin access required</h2>
              <p className="text-muted-foreground mt-2 text-sm">Your account is not an admin.</p>
            </Card>
          )}
        </main>
      </div>
    );
  }

  const customers = new Set(bookings.map((b) => b.customer_phone)).size;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm">All bookings across Realmi vendors</p>
          </div>
          <Button variant="outline" onClick={signOut}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="bg-primary text-primary-foreground mb-3 flex h-10 w-10 items-center justify-center rounded-lg"><CalendarCheck className="h-5 w-5" /></div>
            <p className="text-muted-foreground text-xs">Total bookings</p>
            <p className="font-display text-2xl font-bold">{bookings.length}</p>
          </Card>
          <Card className="p-5">
            <div className="bg-primary text-primary-foreground mb-3 flex h-10 w-10 items-center justify-center rounded-lg"><Users className="h-5 w-5" /></div>
            <p className="text-muted-foreground text-xs">Unique customers</p>
            <p className="font-display text-2xl font-bold">{customers}</p>
          </Card>
        </div>

        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id} className="flex flex-wrap items-start justify-between gap-3 p-5">
              <div>
                <p className="font-semibold">{b.service_name} <span className="text-muted-foreground font-normal">— {b.customer_name}</span></p>
                <p className="text-muted-foreground text-xs">{b.booking_date} at {b.booking_time} · 📞 {b.customer_phone}</p>
                <p className="text-muted-foreground mt-1 text-xs">Vendor: {b.vendor_id}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{b.status}</Badge>
                <Badge variant="outline" className="font-display">KES {b.price.toLocaleString()}</Badge>
              </div>
            </Card>
          ))}
          {bookings.length === 0 && <Card className="text-muted-foreground p-8 text-center">No bookings yet.</Card>}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;