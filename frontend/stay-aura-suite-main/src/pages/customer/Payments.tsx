import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { paymentApi, reservationApi, roomApi } from "@/api/services";
import { useRazorpay } from "@/hooks/useRazorpay";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Payment {
  billId: number;
  reservationId: string;
  amount: number;
  status: string;
  paymentMethod: string;
  razorpayPaymentId: string;
  createdAt: string;
}

interface Reservation {
  reservationId: string;
  roomId: number;
  checkIn: string;
  checkOut: string;
  status: string;
}

const statusColor = (s: string) => {
  if (s === "SUCCESS") return "bg-emerald-50 text-emerald-700";
  if (s === "PENDING") return "bg-amber-50 text-amber-700";
  if (s === "FAILED") return "bg-red-50 text-red-700";
  return "bg-muted text-muted-foreground";
};

const calcNights = (checkIn: string, checkOut: string) =>
  Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [unpaidReservations, setUnpaidReservations] = useState<Reservation[]>([]);
  const [roomPrices, setRoomPrices] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const { initiatePayment } = useRazorpay();
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchData = async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const [paymentsRes, reservationsRes] = await Promise.all([
        paymentApi.getAll(),
        reservationApi.getByUser(user.id),
      ]);
      const allPayments: Payment[] = paymentsRes.data;
      const allReservations: Reservation[] = reservationsRes.data;

      const userReservationIds = new Set(allReservations.map(r => r.reservationId));
      setPayments(allPayments.filter(p => userReservationIds.has(p.reservationId)));

      const paidReservationIds = new Set(
        allPayments.filter(p => p.status === "SUCCESS").map(p => p.reservationId)
      );
      const unpaid = allReservations.filter(r => r.status === "CONFIRMED" && !paidReservationIds.has(r.reservationId));
      setUnpaidReservations(unpaid);

      // fetch room prices for unpaid reservations
      const uniqueRoomIds = [...new Set(unpaid.map(r => r.roomId))];
      const priceEntries = await Promise.all(
        uniqueRoomIds.map(roomId =>
          roomApi.getById(roomId)
            .then(r => [roomId, r.data.price] as [number, number])
            .catch(() => [roomId, 0] as [number, number])
        )
      );
      setRoomPrices(Object.fromEntries(priceEntries));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const handlePay = (reservation: Reservation) => {
    if (!user) return;
    const nights = calcNights(reservation.checkIn, reservation.checkOut);
    const amount = (roomPrices[reservation.roomId] ?? 0) * nights || 1000;
    setPayingId(reservation.reservationId);
    initiatePayment({
      reservationId: reservation.reservationId,
      amount,
      customerName: user.fullName ?? user.username,
      customerEmail: user.email,
      onSuccess: () => { setPayingId(null); fetchData(); },
      onFailure: (err) => { alert(`Payment failed: ${err}`); setPayingId(null); },
    });
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Payments & Invoices" subtitle="Track your payment history" />

      {unpaidReservations.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="text-sm font-body font-semibold text-amber-800 mb-3">Pending Payments</h3>
          <div className="space-y-2">
            {unpaidReservations.map(r => {
              const nights = calcNights(r.checkIn, r.checkOut);
              const total = (roomPrices[r.roomId] ?? 0) * nights;
              return (
                <div key={r.reservationId} className="flex items-center justify-between bg-white rounded-xl px-4 py-3">
                  <div className="text-sm font-body">
                    <span className="text-foreground font-medium">Room #{r.roomId}</span>
                    <span className="text-muted-foreground ml-2">{r.checkIn} → {r.checkOut}</span>
                    {total > 0 && <span className="text-accent font-semibold ml-2">₹{total}</span>}
                  </div>
                  <button
                    onClick={() => handlePay(r)}
                    disabled={payingId === r.reservationId}
                    className="px-4 py-1.5 bg-accent text-accent-foreground text-xs font-medium rounded-lg shadow-gold hover:shadow-elevated transition-all disabled:opacity-50"
                  >
                    {payingId === r.reservationId ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="px-6 py-8 text-muted-foreground text-sm">Loading...</p>
          ) : payments.length === 0 ? (
            <p className="px-6 py-8 text-muted-foreground text-sm">No payment history found.</p>
          ) : (
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Bill ID</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Reservation</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Method</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.billId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium">#{p.billId}</td>
                    <td className="px-6 py-4 text-foreground font-mono text-xs">{p.reservationId.slice(-8)}</td>
                    <td className="px-6 py-4 text-foreground font-medium">₹{p.amount}</td>
                    <td className="px-6 py-4 text-muted-foreground">{p.paymentMethod ?? "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.status === "SUCCESS" && (
                        <button
                          onClick={() => paymentApi.getInvoice(p.billId).then(res => {
                            const data = res.data;
                            alert(`Invoice #${data.billId}\nReservation: ${data.reservationId}\nAmount: ₹${data.amount}\nStatus: ${data.status}`);
                          })}
                          className="text-ocean hover:text-accent text-xs font-medium transition-colors"
                        >
                          View Invoice
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
