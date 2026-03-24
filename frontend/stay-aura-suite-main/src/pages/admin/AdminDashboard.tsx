import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";
import { Users, BedDouble, CalendarCheck, CreditCard } from "lucide-react";
import { userApi, roomApi, reservationApi, paymentApi } from "@/api/services";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function buildMonthlyRevenue(payments: any[]) {
  const map: Record<string, number> = {};
  payments.filter(p => p.status === "SUCCESS").forEach(p => {
    const d = new Date(p.createdAt);
    if (isNaN(d.getTime())) return;
    const key = d.toLocaleString("default", { month: "short" });
    map[key] = (map[key] || 0) + Number(p.amount);
  });
  return Object.entries(map).map(([month, revenue]) => ({ month, revenue }));
}

function buildBookingsByStatus(reservations: any[]) {
  const map: Record<string, number> = {};
  reservations.forEach(r => { map[r.status] = (map[r.status] || 0) + 1; });
  return Object.entries(map).map(([status, count]) => ({ status, count }));
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, rooms: 0, reservations: 0, revenue: 0 });
  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
  const [bookingData, setBookingData] = useState<{ status: string; count: number }[]>([]);
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
      setRevenueData(buildMonthlyRevenue(payRes.data));
      setBookingData(buildBookingsByStatus(resRes.data));
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
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">Revenue Trend</h3>
          {revenueData.length === 0 ? (
            <div className="h-64 flex items-center justify-center bg-muted/50 rounded-xl">
              <p className="text-sm font-body text-muted-foreground">No payment data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a853" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d4a853" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v}`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#d4a853" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">Booking Analytics</h3>
          {bookingData.length === 0 ? (
            <div className="h-64 flex items-center justify-center bg-muted/50 rounded-xl">
              <p className="text-sm font-body text-muted-foreground">No reservation data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip formatter={(v: number) => [v, "Bookings"]} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
