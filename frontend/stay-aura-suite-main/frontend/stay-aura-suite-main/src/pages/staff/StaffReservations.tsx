import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { reservationApi } from "@/api/services";

interface Reservation {
  reservationId: string;
  userId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  status: string;
}

const statusColor = (s: string) => {
  if (s === "CONFIRMED") return "bg-emerald-50 text-emerald-700";
  if (s === "CHECKED_IN") return "bg-sky-50 text-sky-700";
  if (s === "CANCELLED") return "bg-red-50 text-red-700";
  if (s === "CHECKED_OUT") return "bg-muted text-muted-foreground";
  return "bg-amber-50 text-amber-700";
};

export default function StaffReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = () => {
    reservationApi.getAll()
      .then(res => setReservations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleCheckIn = async (id: string) => {
    await reservationApi.checkIn(id);
    fetchReservations();
  };

  const handleCheckOut = async (id: string) => {
    await reservationApi.checkOut(id);
    fetchReservations();
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Manage Reservations" subtitle="Check-in, check-out, and manage guest bookings" />
      <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="px-6 py-8 text-muted-foreground text-sm">Loading...</p>
          ) : (
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">ID</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">User</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Room</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Check-in</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Check-out</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.reservationId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-foreground font-mono text-xs">{r.reservationId.slice(-8)}</td>
                    <td className="px-6 py-4 text-foreground">User #{r.userId}</td>
                    <td className="px-6 py-4 text-muted-foreground">Room #{r.roomId}</td>
                    <td className="px-6 py-4 text-muted-foreground">{r.checkIn}</td>
                    <td className="px-6 py-4 text-muted-foreground">{r.checkOut}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {r.status === "CONFIRMED" && (
                          <button onClick={() => handleCheckIn(r.reservationId)}
                            className="px-3 py-1.5 text-xs font-medium bg-ocean/10 text-ocean rounded-lg hover:bg-ocean/20 transition-colors">
                            Check In
                          </button>
                        )}
                        {r.status === "CHECKED_IN" && (
                          <button onClick={() => handleCheckOut(r.reservationId)}
                            className="px-3 py-1.5 text-xs font-medium bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors">
                            Check Out
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
