import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { userApi } from "@/api/services";

interface User { id: number; name: string; email: string; phone?: string; role: string; }

export default function StaffCustomers() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.getAll()
      .then(r => setCustomers((r.data as User[]).filter(u => u.role === "CUSTOMER")))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader title="Customer Records" subtitle="View registered guest information" />
      {loading ? (
        <p className="text-muted-foreground font-body text-sm">Loading...</p>
      ) : (
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Name</th>
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Email</th>
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Phone</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No customers found.</td></tr>
              ) : customers.map(c => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-foreground font-medium">{c.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{c.phone || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
