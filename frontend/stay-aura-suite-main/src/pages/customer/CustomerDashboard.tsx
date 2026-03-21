import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";
import { CalendarCheck, BedDouble, CreditCard, Clock } from "lucide-react";
import { reservationApi, paymentApi } from "@/api/services";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Reservation {
  reservationId: string;
  roomId: number;
  checkIn: string;
  checkOut: string;
  status: string;
}

interface Payment {
  reservationId: string;
  amount: number;
  status: string;
}

const statusColor = (s: string) =>
  s === "CONFIRMED" ? "bg-emerald-50 text-emerald-700" :
  s === "CHECKED_IN" ? "bg-ocean/10 text-ocean" :
  s === "CHECKED_OUT" ? "bg-muted text-muted-foreground" :
  s === "CANCELLED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700";

export default function CustomerDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    Promise.all([
      reservationApi.getByUser(user.id),
      paymentApi.getAll(),
    ]).then(([resRes, payRes]) => {
      const allReservations: Reservation[] = resRes.data;
      const allPayments: Payment[] = payRes.data;
      setReservations(allReservations);
      const userResIds = new Set(allReservations.map(r => r.reservationId));
      const spent = allPayments
        .filter(p => userResIds.has(p.reservationId) && p.status === "SUCCESS")
        .reduce((sum, p) => sum + p.amount, 0);
      setTotalSpent(spent);
    }).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  const active = reservations.filter(r => r.status === "CONFIRMED" || r.status === "CHECKED_IN").length;
  const uniqueRooms = new Set(reservations.map(r => r.roomId)).size;
  const recent = reservations.slice(0, 5);

  const stats = [
    { label: "Active Reservations", value: String(active), icon: CalendarCheck, color: "bg-ocean/10 text-ocean" },
    { label: "Rooms Visited", value: String(uniqueRooms), icon: BedDouble, color: "bg-accent/10 text-accent" },
    { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, icon: CreditCard, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Bookings", value: String(reservations.length), icon: Clock, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader title={`Welcome Back${user?.fullName ? `, ${user.fullName}` : ""}`} subtitle="Here's your booking overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-6 bg-card rounded-2xl shadow-soft hover:shadow-card transition-all duration-300">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-4`}><s.icon size={18} /></div>
            <p className="text-sm font-body text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">{loading ? "—" : s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card rounded-2xl shadow-soft p-6">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Recent Reservations</h3>
        {loading ? (
          <p className="text-sm font-body text-muted-foreground">Loading...</p>
        ) : recent.length === 0 ? (
          <p className="text-sm font-body text-muted-foreground">No reservations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-muted-foreground font-medium">ID</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Room</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Check-in</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Check-out</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(r => (
                  <tr key={r.reservationId} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 text-foreground font-mono text-xs">{r.reservationId.slice(-8)}</td>
                    <td className="py-3 text-foreground">Room #{r.roomId}</td>
                    <td className="py-3 text-muted-foreground">{r.checkIn}</td>
                    <td className="py-3 text-muted-foreground">{r.checkOut}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(r.status)}`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
