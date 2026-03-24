import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SectionHeader } from "@/components/SectionHeader";
import { motion } from "framer-motion";
import { reservationApi, roomApi, guestApi } from "@/api/services";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const steps = ["Dates", "Guest Info", "Review"];

interface Room {
  roomId: number;
  type: string;
  price: number;
}

export default function BookRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [step, setStep] = useState(0);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [guest, setGuest] = useState({ guestFirstName: "", guestLastName: "", guestEmail: "", guestPhoneNo: "" });

  useEffect(() => {
    if (id) roomApi.getById(id).then(res => setRoom(res.data)).catch(console.error);
  }, [id]);

  const nights = dates.checkIn && dates.checkOut
    ? Math.max(0, Math.ceil((new Date(dates.checkOut).getTime() - new Date(dates.checkIn).getTime()) / 86400000))
    : 0;

  const total = room ? nights * room.price : 0;

  const handleConfirm = async () => {
    if (!user) {
      setError("Session expired. Please login again.");
      return;
    }
    if (!room) return;
    setLoading(true);
    setError("");
    try {
      // create reservation
      const resRes = await reservationApi.create({
        userId: Number(user.id),
        roomId: room.roomId,
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        userEmail: user.email,
        userName: user.fullName ?? user.username,
      });
      const reservationId = resRes.data.reservationId;

      // create guest linked to reservation
      await guestApi.create({ ...guest, reservationId });

      navigate("/customer/reservations");
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <SectionHeader title="Book Room" subtitle={room ? `${room.type} — ₹${room.price}/night` : `Room #${id}`} />

      {/* Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-medium transition-all ${
              i <= step ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
            }`}>{i + 1}</div>
            <span className={`text-sm font-body hidden sm:inline ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`w-8 md:w-16 h-0.5 mx-2 ${i < step ? "bg-accent" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {error && <div className="px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm font-body">{error}</div>}

      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-2xl p-8 shadow-soft">
        {step === 0 && (
          <div className="space-y-5">
            <h3 className="text-lg font-display font-semibold text-foreground">Select Dates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-body font-medium text-foreground block mb-1.5">Check-in</label>
                <input type="date" value={dates.checkIn} onChange={e => setDates({ ...dates, checkIn: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div>
                <label className="text-sm font-body font-medium text-foreground block mb-1.5">Check-out</label>
                <input type="date" value={dates.checkOut} onChange={e => setDates({ ...dates, checkOut: e.target.value })}
                  min={dates.checkIn || new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
            </div>
            {nights > 0 && <p className="text-sm font-body text-muted-foreground">{nights} night(s) · Total: <span className="text-accent font-semibold">₹{total}</span></p>}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-lg font-display font-semibold text-foreground">Guest Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="First Name" value={guest.guestFirstName} onChange={e => setGuest({ ...guest, guestFirstName: e.target.value })}
                className="px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              <input placeholder="Last Name" value={guest.guestLastName} onChange={e => setGuest({ ...guest, guestLastName: e.target.value })}
                className="px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
            </div>
            <input placeholder="Email" type="email" value={guest.guestEmail} onChange={e => setGuest({ ...guest, guestEmail: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
            <input placeholder="Phone" value={guest.guestPhoneNo} onChange={e => setGuest({ ...guest, guestPhoneNo: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold text-foreground">Review Booking</h3>
            <div className="space-y-3 text-sm font-body">
              <div className="flex justify-between py-2 border-b border-border/50"><span className="text-muted-foreground">Room</span><span className="text-foreground font-medium">{room?.type} #{id}</span></div>
              <div className="flex justify-between py-2 border-b border-border/50"><span className="text-muted-foreground">Guest</span><span className="text-foreground">{guest.guestFirstName} {guest.guestLastName}</span></div>
              <div className="flex justify-between py-2 border-b border-border/50"><span className="text-muted-foreground">Check-in</span><span className="text-foreground">{dates.checkIn}</span></div>
              <div className="flex justify-between py-2 border-b border-border/50"><span className="text-muted-foreground">Check-out</span><span className="text-foreground">{dates.checkOut}</span></div>
              <div className="flex justify-between py-2 border-b border-border/50"><span className="text-muted-foreground">Nights</span><span className="text-foreground">{nights}</span></div>
              <div className="flex justify-between py-2"><span className="text-foreground font-semibold">Total</span><span className="text-accent font-display font-bold text-lg">₹{total}</span></div>
            </div>
          </div>
        )}
      </motion.div>

      <div className="flex justify-between">
        <button onClick={() => step > 0 && setStep(step - 1)} disabled={step === 0}
          className="px-6 py-2.5 rounded-lg border border-border text-foreground font-body text-sm disabled:opacity-30 hover:bg-muted transition-colors">
          Back
        </button>
        <button
          disabled={
            loading ||
            (step === 0 && (!dates.checkIn || !dates.checkOut || nights <= 0)) ||
            (step === 1 && (!guest.guestFirstName || !guest.guestLastName || !guest.guestEmail))
          }
          onClick={() => step < 2 ? setStep(step + 1) : handleConfirm()}
          className="px-8 py-2.5 bg-accent text-accent-foreground font-body font-medium rounded-lg shadow-gold hover:shadow-elevated transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Confirming..." : step < 2 ? "Continue" : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
