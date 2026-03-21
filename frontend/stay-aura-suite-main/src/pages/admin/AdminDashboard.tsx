import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";
import { Users, BedDouble, CalendarCheck, CreditCard } from "lucide-react";
import { userApi, roomApi, reservationApi, paymentApi } from "@/api/services";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, rooms: 0, reservations: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userApi.getAll(),
      roomApi.getAll(),
      reservationApi.getAll(),
      paymentApi.getAll(),
    ]).then(([usersRes, roomsRes, resRes, payRes]) => {
      const revenue = payRes.data
        .filter((p: any) => p.status === "SUCCESS")
        .reduce((sum: number, p: any) => sum + Number(p.amount), 0);
      setStats({
        users: usersRes.data.length,
        rooms: roomsRes.data.length,
        reservations: resRes.data.length,
        revenue,
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "bg-ocean/10 text-ocean" },
    { label: "Total Rooms", value: stats.rooms, icon: BedDouble, color: "bg-accent/10 text-accent" },
    { label: "Reservations", value: stats.reservations, icon: CalendarCheck, color: "bg-emerald-50 text-emerald-600" },
    { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: CreditCard, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader title="Admin Dashboard" subtitle="System overview and analytics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-6 bg-card rounded-2xl shadow-soft hover:shadow-card transition-all">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-4`}><s.icon size={18} /></div>
            <p className="text-sm font-body text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">
              {loading ? "—" : s.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <h3 className="text-lg font-display font-semibold text-foreground mb-2">Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center bg-muted/50 rounded-xl">
            <p className="text-sm font-body text-muted-foreground">Chart coming soon</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <h3 className="text-lg font-display font-semibold text-foreground mb-2">Booking Analytics</h3>
          <div className="h-64 flex items-center justify-center bg-muted/50 rounded-xl">
            <p className="text-sm font-body text-muted-foreground">Chart coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
