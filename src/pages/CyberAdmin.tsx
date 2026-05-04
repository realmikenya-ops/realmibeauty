import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { TrendingUp, Package, DollarSign, Users, Download, ShieldAlert, Trash2 } from "lucide-react";

type Order = {
  id: string; user_id: string; service_name: string; quantity: number; total_price: number;
  status: string; payment_status: string; contact_phone: string | null; notes: string | null; created_at: string;
};
type Service = { id: string; name: string; description: string | null; category: string; unit_price: number; unit_label: string; is_active: boolean };
type FileRow = { id: string; order_id: string; storage_path: string; original_name: string };

const STATUSES = ["pending", "processing", "completed", "cancelled"];

const CyberAdmin = () => {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [files, setFiles] = useState<Record<string, FileRow[]>>({});

  useEffect(() => {
    if (!loading) {
      if (!user) navigate("/cyber/auth");
      else if (role && role !== "admin") navigate("/cyber/dashboard");
    }
  }, [user, role, loading, navigate]);

  const loadAll = async () => {
    const { data: o } = await supabase.from("cyber_orders").select("*").order("created_at", { ascending: false });
    setOrders((o as Order[]) ?? []);
    const { data: s } = await supabase.from("cyber_services").select("*").order("category");
    setServices((s as Service[]) ?? []);
    const { data: f } = await supabase.from("cyber_order_files").select("id,order_id,storage_path,original_name");
    const grouped: Record<string, FileRow[]> = {};
    (f as FileRow[] ?? []).forEach((row) => { (grouped[row.order_id] ||= []).push(row); });
    setFiles(grouped);
  };

  useEffect(() => {
    if (role !== "admin") return;
    loadAll();
    const ch = supabase.channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "cyber_orders" }, loadAll)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [role]);

  const updateOrder = async (id: string, patch: Partial<Order>) => {
    const { error } = await supabase.from("cyber_orders").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
    // Send notification to customer
    const target = orders.find((o) => o.id === id);
    if (target && (patch.status || patch.payment_status)) {
      await supabase.from("notifications").insert({
        user_id: target.user_id,
        title: patch.status ? `Order ${patch.status}` : "Payment updated",
        body: `Your order for ${target.service_name} has been updated.`,
      });
    }
  };

  const downloadFile = async (path: string, name: string) => {
    const { data, error } = await supabase.storage.from("cyber-uploads").createSignedUrl(path, 60);
    if (error || !data) return toast.error("Could not get file");
    const a = document.createElement("a"); a.href = data.signedUrl; a.download = name; a.target = "_blank"; a.click();
  };

  const saveService = async (s: Service) => {
    const { error } = await supabase.from("cyber_services").update({
      name: s.name, description: s.description, category: s.category,
      unit_price: s.unit_price, unit_label: s.unit_label, is_active: s.is_active,
    }).eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("Service updated");
  };

  const addService = async () => {
    const { data, error } = await supabase.from("cyber_services").insert({
      name: "New service", category: "general", unit_price: 0, unit_label: "unit",
    }).select().single();
    if (error || !data) return toast.error(error?.message);
    setServices((s) => [...s, data as Service]);
  };

  const removeService = async (id: string) => {
    const { error } = await supabase.from("cyber_services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setServices((s) => s.filter((x) => x.id !== id));
  };

  // Analytics
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter((o) => new Date(o.created_at) >= today);
  const revenue = orders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.total_price, 0);
  const todayRevenue = todayOrders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.total_price, 0);
  const customers = new Set(orders.map((o) => o.user_id)).size;

  if (loading || role !== "admin") {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <main className="container py-20 text-center">
          {role && role !== "admin" ? (
            <Card className="mx-auto max-w-md p-8">
              <ShieldAlert className="text-accent mx-auto mb-3 h-10 w-10" />
              <h2 className="font-display text-xl font-bold">Admin access required</h2>
              <p className="text-muted-foreground mt-2 text-sm">Your account does not have admin privileges.</p>
            </Card>
          ) : null}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <h1 className="font-display text-3xl font-bold md:text-4xl">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8 mt-1 text-sm">Manage orders, services, and view analytics</p>

        {/* Analytics */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {[
            { Icon: Package, label: "Today's orders", v: todayOrders.length },
            { Icon: DollarSign, label: "Today's revenue", v: `KES ${todayRevenue.toLocaleString()}` },
            { Icon: TrendingUp, label: "Total revenue", v: `KES ${revenue.toLocaleString()}` },
            { Icon: Users, label: "Customers", v: customers },
          ].map((s) => (
            <Card key={s.label} className="p-5">
              <div className="bg-primary text-primary-foreground mb-3 flex h-10 w-10 items-center justify-center rounded-lg"><s.Icon className="h-5 w-5" /></div>
              <p className="text-muted-foreground text-xs">{s.label}</p>
              <p className="font-display text-2xl font-bold">{s.v}</p>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="services">Services ({services.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="mt-6 space-y-3">
              {orders.map((o) => (
                <Card key={o.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-[200px]">
                      <p className="font-semibold">{o.service_name} <span className="text-muted-foreground font-normal">× {o.quantity}</span></p>
                      <p className="text-muted-foreground text-xs">{new Date(o.created_at).toLocaleString()}</p>
                      {o.contact_phone && <p className="text-xs">📞 {o.contact_phone}</p>}
                      {o.notes && <p className="text-muted-foreground mt-1 text-xs italic">"{o.notes}"</p>}
                      {files[o.id]?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {files[o.id].map((f) => (
                            <Button key={f.id} size="sm" variant="outline" onClick={() => downloadFile(f.storage_path, f.original_name)}>
                              <Download className="mr-1 h-3 w-3" /> {f.original_name}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select value={o.status} onValueChange={(v) => updateOrder(o.id, { status: v })}>
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                      <Select value={o.payment_status} onValueChange={(v) => updateOrder(o.id, { payment_status: v })}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge variant="outline" className="font-display text-base">KES {o.total_price.toLocaleString()}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
              {orders.length === 0 && <Card className="text-muted-foreground p-8 text-center">No orders yet.</Card>}
            </div>
          </TabsContent>

          <TabsContent value="services">
            <div className="mb-4 mt-6 flex justify-end">
              <Button onClick={addService} variant="luxe">+ Add service</Button>
            </div>
            <div className="space-y-3">
              {services.map((s, i) => (
                <Card key={s.id} className="grid gap-3 p-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center">
                  <Input value={s.name} onChange={(e) => { const v = [...services]; v[i] = { ...s, name: e.target.value }; setServices(v); }} placeholder="Name" />
                  <Input value={s.category} onChange={(e) => { const v = [...services]; v[i] = { ...s, category: e.target.value }; setServices(v); }} placeholder="Category" />
                  <Input type="number" value={s.unit_price} onChange={(e) => { const v = [...services]; v[i] = { ...s, unit_price: +e.target.value }; setServices(v); }} placeholder="Price" />
                  <Input value={s.unit_label} onChange={(e) => { const v = [...services]; v[i] = { ...s, unit_label: e.target.value }; setServices(v); }} placeholder="Unit" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveService(s)}>Save</Button>
                    <Button size="icon" variant="outline" onClick={() => removeService(s.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default CyberAdmin;