import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { roomApi } from "@/api/services";

interface Room {
  roomId: number;
  type: string;
  price: number;
  availability: boolean;
  status: string;
  capacity: number;
}

export default function StaffRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roomApi.getAll()
      .then(res => setRooms(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader title="Room Management" subtitle="View and manage room availability" />
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading rooms...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rooms.map((r) => (
            <div key={r.roomId} className="bg-card rounded-2xl shadow-soft p-5 hover:shadow-card transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className="text-lg font-display font-bold text-foreground">#{r.roomId}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  r.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-700" :
                  r.status === "OCCUPIED" ? "bg-red-50 text-red-700" :
                  "bg-amber-50 text-amber-700"
                }`}>{r.status}</span>
              </div>
              <p className="text-sm font-body font-medium text-foreground">{r.type}</p>
              <p className="text-xs font-body text-muted-foreground mt-1">
                Capacity: {r.capacity} · ₹{r.price}/night
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
