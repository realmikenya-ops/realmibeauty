import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Bell, Upload, Package, Loader2, CheckCircle2, XCircle, Clock, FileText } from "lucide-react";

type Service = { id: string; name: string; unit_price: number; unit_label: string; category: string };
type Order = {
  id: string; service_name: string; quantity: number; unit_price: number; total_price: number;
  status: string; payment_status: string; notes: string | null; contact_phone: string | null; created_at: string;
};
type Notif = { id: string; title: string; body: string | null; read: boolean; created_at: string };

const STATUS_META: Record<string, { label: string; cls: string; Icon: any }> = {
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-900 border-amber-200", Icon: Clock },
  processing: { label: "Processing", cls: "bg-blue-100 text-blue-900 border-blue-200", Icon: Loader2 },
  completed: { label: "Completed", cls: "bg-emerald-100 text-emerald-900 border-emerald-200", Icon: CheckCircle2 },
  cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-900 border-red-200", Icon: XCircle },
};

const CyberDashboard = () => {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [busy, setBusy] = useState(false);

  // form state
  const [serviceId, setServiceId] = useState("");
  const [qty, setQty] = useState(1);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/cyber/auth");
  }, [loading, user, navigate]);

  useEffect(() => {
    supabase.from("cyber_services").select("id,name,unit_price,unit_label,category").eq("is_active", true)
      .then(({ data }) => setServices((data as Service[]) ?? []));
  }, []);

  const loadOrders = async () => {
    if (!user) return;
    const { data } = await supabase.from("cyber_orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
  };
  const loadNotifs = async () => {
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
    setNotifs((data as Notif[]) ?? []);
  };

  useEffect(() => {
    if (!user) return;
    loadOrders();
    loadNotifs();
    const ch = supabase.channel(`user-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "cyber_orders", filter: `user_id=eq.${user.id}` }, loadOrders)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, loadNotifs)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const selected = services.find((s) => s.id === serviceId);
  const total = selected ? selected.unit_price * qty : 0;

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selected) return toast.error("Pick a service");
    if (qty < 1) return toast.error("Quantity must be at least 1");
    setBusy(true);
    const { data: order, error } = await supabase.from("cyber_orders").insert({
      user_id: user.id, service_id: selected.id, service_name: selected.name,
      quantity: qty, unit_price: selected.unit_price, total_price: total,
      contact_phone: phone || null, notes: notes || null,
    }).select().single();
    if (error || !order) { setBusy(false); return toast.error(error?.message ?? "Failed to create order"); }

    // Upload files
    for (const f of files) {
      const path = `${user.id}/${order.id}/${Date.now()}-${f.name}`;
      const { error: upErr } = await supabase.storage.from("cyber-uploads").upload(path, f);
      if (upErr) { toast.error(`Upload failed: ${f.name}`); continue; }
      await supabase.from("cyber_order_files").insert({
        order_id: order.id, user_id: user.id, storage_path: path, original_name: f.name, size_bytes: f.size,
      });
    }
    setBusy(false);
    toast.success("Order placed! We'll update you shortly.");
    setServiceId(""); setQty(1); setPhone(""); setNotes(""); setFiles([]);
  };

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  };

  const unread = notifs.filter((n) => !n.read).length;

  if (loading || !user) return <div className="bg-background min-h-screen" />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">My Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm">Place orders, upload files, and track progress</p>
          </div>
          {role === "admin" && <Button asChild variant="luxe"><a href="/cyber/admin">Admin panel</a></Button>}
        </div>

        <Tabs defaultValue="new">
          <TabsList>
            <TabsTrigger value="new">New order</TabsTrigger>
            <TabsTrigger value="orders"><Package className="mr-1 h-4 w-4" /> Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="notifs"><Bell className="mr-1 h-4 w-4" /> Notifications {unread > 0 && <Badge variant="secondary" className="ml-1">{unread}</Badge>}</TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <Card className="mt-6 p-6 shadow-card">
              <form onSubmit={submitOrder} className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>Service</Label>
                  <Select value={serviceId} onValueChange={setServiceId}>
                    <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name} — KES {s.unit_price}/{s.unit_label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity ({selected?.unit_label ?? "unit"})</Label>
                  <Input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Contact phone</Label>
                  <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07xx xxx xxx" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Notes / instructions</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="e.g. Print double-sided, color cover" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Upload files (PDF, images, docs)</Label>
                  <label className="hover:bg-secondary/60 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/30 p-6 text-sm">
                    <Upload className="text-accent h-5 w-5" />
                    <span>{files.length > 0 ? `${files.length} file(s) selected` : "Click to upload"}</span>
                    <input type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp" className="hidden"
                      onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
                  </label>
                  {files.length > 0 && (
                    <ul className="text-muted-foreground space-y-1 text-xs">
                      {files.map((f, i) => <li key={i} className="flex items-center gap-2"><FileText className="h-3 w-3" /> {f.name}</li>)}
                    </ul>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4 md:col-span-2">
                  <div>
                    <p className="text-muted-foreground text-xs">Total</p>
                    <p className="font-display text-2xl font-bold">KES {total.toLocaleString()}</p>
                  </div>
                  <Button type="submit" variant="hero" size="lg" disabled={busy || !serviceId}>
                    {busy ? "Placing…" : "Place order"}
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <div className="mt-6 space-y-3">
              {orders.length === 0 && <Card className="p-8 text-center text-muted-foreground">No orders yet.</Card>}
              {orders.map((o) => {
                const m = STATUS_META[o.status] ?? STATUS_META.pending;
                return (
                  <Card key={o.id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">{o.service_name}</p>
                      <p className="text-muted-foreground text-xs">{new Date(o.created_at).toLocaleString()}  •  Qty {o.quantity}</p>
                      {o.notes && <p className="text-muted-foreground mt-1 text-xs italic">"{o.notes}"</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={m.cls}><m.Icon className="mr-1 h-3 w-3" />{m.label}</Badge>
                      <Badge variant={o.payment_status === "paid" ? "default" : "secondary"}>
                        {o.payment_status === "paid" ? "Paid" : "Unpaid"}
                      </Badge>
                      <span className="font-display text-lg font-bold">KES {o.total_price.toLocaleString()}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="notifs">
            <div className="mt-6 space-y-2">
              {notifs.length === 0 && <Card className="p-8 text-center text-muted-foreground">No notifications.</Card>}
              {notifs.map((n) => (
                <Card key={n.id} className={`p-4 ${!n.read ? "border-accent/50 bg-accent/5" : ""}`} onClick={() => !n.read && markRead(n.id)}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{n.title}</p>
                      {n.body && <p className="text-muted-foreground text-sm">{n.body}</p>}
                      <p className="text-muted-foreground mt-1 text-xs">{new Date(n.created_at).toLocaleString()}</p>
                    </div>
                    {!n.read && <Badge className="bg-accent text-accent-foreground">New</Badge>}
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

export default CyberDashboard;