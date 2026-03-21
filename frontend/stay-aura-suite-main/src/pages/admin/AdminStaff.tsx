import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { staffApi } from "@/api/services";

const STATUSES = ["ACTIVE", "INACTIVE", "ON_LEAVE"];
const EMPTY = { staffName: "", staffDept: "", staffStatus: "ACTIVE", salary: "" };

interface Staff { staffId: number; staffName: string; staffDept: string; staffStatus: string; salary: number; }

export default function AdminStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [form, setForm] = useState(EMPTY);

  const load = () => {
    setLoading(true);
    staffApi.getAll().then(r => setStaff(r.data)).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal("add"); };
  const openEdit = (s: Staff) => {
    setEditing(s);
    setForm({ staffName: s.staffName, staffDept: s.staffDept, staffStatus: s.staffStatus, salary: String(s.salary ?? "") });
    setModal("edit");
  };

  const handleSave = async () => {
    const payload = { ...form, salary: form.salary ? Number(form.salary) : undefined };
    if (modal === "add") await staffApi.create(payload);
    else if (editing) await staffApi.update(editing.staffId, payload);
    setModal(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this staff member?")) return;
    await staffApi.delete(id);
    load();
  };

  const statusColor = (s: string) =>
    s === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : s === "ON_LEAVE" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader title="Staff Management" subtitle="Manage hotel staff members" />
        <button onClick={openAdd} className="px-5 py-2.5 bg-accent text-accent-foreground font-body text-sm font-medium rounded-lg shadow-gold hover:shadow-elevated transition-all">
          Add Staff
        </button>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body text-sm">Loading...</p>
      ) : (
        <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Name</th>
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Department</th>
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Status</th>
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Salary</th>
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No staff found.</td></tr>
              ) : staff.map(s => (
                <tr key={s.staffId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-foreground font-medium">{s.staffName}</td>
                  <td className="px-6 py-4 text-muted-foreground">{s.staffDept}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(s.staffStatus)}`}>{s.staffStatus}</span>
                  </td>
                  <td className="px-6 py-4 text-foreground">{s.salary != null ? `₹${Number(s.salary).toLocaleString()}` : "—"}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(s)} className="text-ocean hover:text-accent text-xs font-medium transition-colors">Edit</button>
                    <button onClick={() => handleDelete(s.staffId)} className="text-destructive hover:text-destructive/80 text-xs font-medium transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl shadow-elevated p-8 w-full max-w-md space-y-4">
            <h2 className="text-lg font-display font-semibold text-foreground">{modal === "add" ? "Add Staff" : "Edit Staff"}</h2>
            <div className="space-y-3">
              {(["staffName", "staffDept"] as const).map(field => (
                <div key={field}>
                  <label className="text-xs font-body text-muted-foreground mb-1 block capitalize">{field === "staffName" ? "Name" : "Department"}</label>
                  <input value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
              ))}
              <div>
                <label className="text-xs font-body text-muted-foreground mb-1 block">Status</label>
                <select value={form.staffStatus} onChange={e => setForm(f => ({ ...f, staffStatus: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/50">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-body text-muted-foreground mb-1 block">Salary</label>
                <input type="number" value={form.salary} onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="flex-1 py-2.5 bg-accent text-accent-foreground font-body text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">Save</button>
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border text-foreground font-body text-sm font-medium rounded-lg hover:bg-muted transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
