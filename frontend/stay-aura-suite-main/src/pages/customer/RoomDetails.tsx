import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SectionHeader } from "@/components/SectionHeader";
import { roomApi } from "@/api/services";
import { Users } from "lucide-react";

const roomImage: Record<string, string> = {
  STANDARD: "/room-images/standard.jpg",
  DELUXE: "/room-images/deluxe.jpg",
  SUITE: "/room-images/suite.jpg",
  PENTHOUSE: "/room-images/penthouse.jpg",
};

interface Room {
  roomId: number;
  type: string;
  price: number;
  availability: boolean;
  status: string;
  description: string;
  capacity: number;
  imageUrl: string;
}

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    roomApi.getById(id)
      .then(res => setRoom(res.data))
      .catch(() => setError("Room not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-muted-foreground text-sm p-8">Loading...</p>;
  if (error || !room) return <p className="text-red-600 text-sm p-8">{error || "Room not found"}</p>;

  return (
    <div className="space-y-8">
      <SectionHeader title={`${room.type} Room`} subtitle="Room details and booking" />
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden shadow-card">
          <img
            src={room.imageUrl || roomImage[room.type]}
            alt={room.type}
            className="w-full h-80 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = roomImage[room.type]; }}
          />
        </div>
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-foreground">{room.type} Room</h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                room.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-700" :
                room.status === "OCCUPIED" ? "bg-red-50 text-red-700" :
                "bg-amber-50 text-amber-700"
              }`}>{room.status}</span>
            </div>
            {room.description && (
              <p className="text-sm font-body text-muted-foreground mt-2">{room.description}</p>
            )}
            {room.capacity && (
              <div className="flex items-center gap-2 mt-3 text-muted-foreground">
                <Users size={14} />
                <span className="text-sm font-body">Up to {room.capacity} guests</span>
              </div>
            )}
            <div className="mt-4 flex items-end gap-2">
              <span className="text-3xl font-display font-bold text-accent">₹{room.price}</span>
              <span className="text-sm text-muted-foreground font-body">/ night</span>
            </div>
          </div>

          {room.availability ? (
            <Link
              to={`/customer/book/${room.roomId}`}
              className="block w-full py-3.5 text-center bg-accent text-accent-foreground font-body font-semibold rounded-lg shadow-gold hover:shadow-elevated transition-all duration-300"
            >
              Book This Room
            </Link>
          ) : (
            <button disabled
              className="block w-full py-3.5 text-center bg-muted text-muted-foreground font-body font-semibold rounded-lg cursor-not-allowed">
              Not Available
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
