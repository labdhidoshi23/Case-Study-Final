import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SectionHeader } from "@/components/SectionHeader";
import { roomApi } from "@/api/services";
import { Users, Wifi, Coffee, Car } from "lucide-react";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";

const fallbackImages = [room1, room2, room3];
const amenityIcons: Record<string, any> = { "Wi-Fi": Wifi, "Breakfast": Coffee, "Parking": Car };

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

export default function BrowseRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roomApi.getAll()
      .then(res => setRooms(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground text-sm p-8">Loading rooms...</p>;

  return (
    <div className="space-y-8">
      <SectionHeader title="Browse Rooms" subtitle="Find your perfect stay" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, i) => (
          <motion.div key={room.roomId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-500"
          >
            <div className="relative overflow-hidden aspect-[4/3]">
              <img
                src={room.imageUrl || fallbackImages[i % 3]}
                alt={room.type}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).src = fallbackImages[i % 3]; }}
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2.5 py-1 text-xs font-body font-medium bg-accent text-accent-foreground rounded-full">{room.type}</span>
                <span className={`px-2.5 py-1 text-xs font-body font-medium rounded-full ${
                  room.availability ? "bg-emerald-500/90 text-emerald-50" : "bg-red-500/90 text-red-50"
                }`}>
                  {room.availability ? "Available" : "Occupied"}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-display font-semibold text-foreground">{room.type} Room</h3>
              {room.capacity && (
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <Users size={14} /> <span className="text-xs font-body">{room.capacity} Guests</span>
                </div>
              )}
              {room.description && (
                <p className="text-xs font-body text-muted-foreground mt-2 line-clamp-2">{room.description}</p>
              )}
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <span className="text-xl font-display font-bold text-accent">₹{room.price}</span>
                  <span className="text-xs text-muted-foreground font-body"> / night</span>
                </div>
                <Link to={`/customer/rooms/${room.roomId}`}
                  className="text-sm font-body font-medium text-ocean hover:text-accent transition-colors">
                  Details →
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
