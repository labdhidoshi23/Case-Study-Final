import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { roomApi } from "@/api/services";

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

export default function AdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "", price: "", capacity: "", description: "", status: "AVAILABLE" });
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchRooms = () => {
    roomApi.getAll()
      .then(res => setRooms(res.data))
      .catch(() => setError("Failed to load rooms"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, price: parseFloat(form.price), capacity: parseInt(form.capacity), availability: form.status === "AVAILABLE" };
    try {
      if (editId) {
        await roomApi.update(editId, payload);
      } else {
        await roomApi.create(payload);
      }
      setShowForm(false);
      setEditId(null);
      setForm({ type: "", price: "", capacity: "", description: "", status: "AVAILABLE" });
      fetchRooms();
    } catch {
      setError("Failed to save room");
    }
  };

  const handleEdit = (r: Room) => {
    setForm({ type: r.type, price: String(r.price), capacity: String(r.capacity), description: r.description ?? "", status: r.status });
    setEditId(r.roomId);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this room?")) return;
    await roomApi.delete(id);
    fetchRooms();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader title="Rooms Management" subtitle="Add, edit, and manage rooms" />
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ type: "", price: "", capacity: "", description: "", status: "AVAILABLE" }); }}
          className="px-5 py-2.5 bg-accent text-accent-foreground font-body text-sm font-medium rounded-lg shadow-gold hover:shadow-elevated transition-all">
          Add Room
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {showForm && (
        <div className="bg-card rounded-2xl shadow-soft p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">{editId ? "Edit Room" : "Add New Room"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/50">
              <option value="">Select Type</option>
              <option value="STANDARD">Standard</option>
              <option value="DELUXE">Deluxe</option>
              <option value="SUITE">Suite</option>
              <option value="PENTHOUSE">Penthouse</option>
            </select>
            <input required type="number" placeholder="Price per night" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
              className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/50" />
            <input required type="number" placeholder="Capacity" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })}
              className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/50" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/50">
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
            <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/50 md:col-span-2" />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="px-5 py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-lg">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-muted text-foreground text-sm font-medium rounded-lg">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading rooms...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((r) => (
            <div key={r.roomId} className="bg-card rounded-2xl shadow-soft overflow-hidden hover:shadow-card transition-all">
              <img src={roomImage[r.type] || "/room-images/deluxe.jpg"} alt={r.type}
                className="w-full h-48 object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <h3 className="font-display font-semibold text-foreground">{r.type}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    r.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-700" :
                    r.status === "OCCUPIED" ? "bg-red-50 text-red-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>{r.status}</span>
                </div>
                <p className="text-xs font-body text-muted-foreground mt-1">#{r.roomId} · Capacity: {r.capacity}</p>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-lg font-display font-bold text-accent">₹{r.price}<span className="text-xs text-muted-foreground font-body"> /night</span></span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(r)} className="text-ocean hover:text-accent text-xs font-medium transition-colors">Edit</button>
                    <button onClick={() => handleDelete(r.roomId)} className="text-destructive hover:text-destructive/80 text-xs font-medium transition-colors">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
