import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { reservationApi } from "@/api/services";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Reservation {
  reservationId: string;
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

export default function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchReservations = () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    reservationApi.getByUser(user.id)
      .then(res => setReservations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReservations(); }, [user]);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this reservation?")) return;
    await reservationApi.cancel(id);
    fetchReservations();
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="My Reservations" subtitle="Track and manage your bookings" />
      <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="px-6 py-8 text-muted-foreground text-sm">Loading...</p>
          ) : reservations.length === 0 ? (
            <p className="px-6 py-8 text-muted-foreground text-sm">No reservations found.</p>
          ) : (
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">ID</th>
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
                    <td className="px-6 py-4 text-foreground font-medium font-mono text-xs">{r.reservationId.slice(-8)}</td>
                    <td className="px-6 py-4 text-foreground">Room #{r.roomId}</td>
                    <td className="px-6 py-4 text-muted-foreground">{r.checkIn}</td>
                    <td className="px-6 py-4 text-muted-foreground">{r.checkOut}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {r.status === "CONFIRMED" && (
                        <button onClick={() => handleCancel(r.reservationId)}
                          className="text-destructive hover:text-destructive/80 text-xs font-medium transition-colors">
                          Cancel
                        </button>
                      )}
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
