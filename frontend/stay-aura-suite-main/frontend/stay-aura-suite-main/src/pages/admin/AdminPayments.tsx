import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { paymentApi } from "@/api/services";

interface Payment {
  billId: number;
  reservationId: string;
  amount: number;
  status: string;
  paymentMethod: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: string;
}

const statusColor = (s: string) => {
  if (s === "SUCCESS") return "bg-emerald-50 text-emerald-700";
  if (s === "PENDING") return "bg-amber-50 text-amber-700";
  if (s === "FAILED") return "bg-red-50 text-red-700";
  return "bg-muted text-muted-foreground";
};

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentApi.getAll()
      .then(res => setPayments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader title="Payments Management" subtitle="Monitor all payment transactions" />
      <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="px-6 py-8 text-muted-foreground text-sm">Loading...</p>
          ) : payments.length === 0 ? (
            <p className="px-6 py-8 text-muted-foreground text-sm">No payments found.</p>
          ) : (
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Bill ID</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Reservation</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Method</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Razorpay Order</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left px-6 py-4 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.billId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium">#{p.billId}</td>
                    <td className="px-6 py-4 text-foreground font-mono text-xs">{p.reservationId.slice(-8)}</td>
                    <td className="px-6 py-4 text-foreground font-medium">₹{p.amount}</td>
                    <td className="px-6 py-4 text-muted-foreground">{p.paymentMethod ?? "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{p.razorpayOrderId ?? "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(p.status)}`}>
                        {p.status}
                      </span>
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
