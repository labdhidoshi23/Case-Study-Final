import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/SectionHeader";
import { CalendarCheck, BedDouble, Users, Clock } from "lucide-react";
import { reservationApi, roomApi } from "@/api/services";

interface Reservation {
  reservationId: string;
  roomId: number;
  checkIn: string;
  checkOut: string;
  status: string;
  userId: number;
}

export default function StaffDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reservationApi.getAll(),
      roomApi.getAvailable(),
    ]).then(([resRes, roomRes]) => {
      setReservations(resRes.data);
      setAvailableRooms(roomRes.data.length);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayCheckIns = reservations.filter(r => r.checkIn === today && r.status === "CONFIRMED");
  const todayCheckOuts = reservations.filter(r => r.checkOut === today && r.status === "CHECKED_IN");
  const inHouse = reservations.filter(r => r.status === "CHECKED_IN").length;

  const stats = [
    { label: "Today's Check-ins", value: String(todayCheckIns.length), icon: CalendarCheck, color: "bg-ocean/10 text-ocean" },
    { label: "Available Rooms", value: String(availableRooms), icon: BedDouble, color: "bg-emerald-50 text-emerald-600" },
    { label: "Guests In-House", value: String(inHouse), icon: Users, color: "bg-accent/10 text-accent" },
    { label: "Pending Check-outs", value: String(todayCheckOuts.length), icon: Clock, color: "bg-amber-50 text-amber-600" },
  ];

  const todayActivity = [
    ...todayCheckIns.map(r => ({ reservationId: r.reservationId, roomId: r.roomId, action: "Check-in", date: r.checkIn })),
    ...todayCheckOuts.map(r => ({ reservationId: r.reservationId, roomId: r.roomId, action: "Check-out", date: r.checkOut })),
  ];

  return (
    <div className="space-y-8">
      <SectionHeader title="Staff Dashboard" subtitle="Today's operations overview" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-6 bg-card rounded-2xl shadow-soft">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-4`}><s.icon size={18} /></div>
            <p className="text-sm font-body text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-display font-bold text-foreground mt-1">{loading ? "—" : s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card rounded-2xl shadow-soft p-6">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Today's Activity</h3>
        {loading ? (
          <p className="text-sm font-body text-muted-foreground">Loading...</p>
        ) : todayActivity.length === 0 ? (
          <p className="text-sm font-body text-muted-foreground">No check-ins or check-outs scheduled for today.</p>
        ) : (
          <div className="space-y-3">
            {todayActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div>
                  <p className="text-sm font-body font-medium text-foreground">Reservation #{a.reservationId.slice(-8)}</p>
                  <p className="text-xs font-body text-muted-foreground">Room #{a.roomId}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  a.action === "Check-in" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}>{a.action}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
