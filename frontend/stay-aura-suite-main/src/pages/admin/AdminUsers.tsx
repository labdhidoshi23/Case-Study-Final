import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { userApi } from "@/api/services";

const ROLES = ["ADMIN", "MANAGER", "RECEPTIONIST", "CUSTOMER"];

interface User { id: number; name: string; email: string; role: string; phone?: string; }

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", role: "" });

  const load = () => {
    setLoading(true);
    userApi.getAll()
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openEdit = (u: User) => { setEditing(u); setForm({ name: u.name, role: u.role }); };

  const saveEdit = async () => {
    if (!editing) return;
    await userApi.update(editing.id, form);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return;
    await userApi.delete(id);
    load();
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Users Management" subtitle="Manage all system users" />

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
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Role</th>
                <th className="text-left px-6 py-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-foreground font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{u.phone || "—"}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-ocean/10 text-ocean">{u.role}</span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(u)} className="text-ocean hover:text-accent text-xs font-medium transition-colors">Edit</button>
                    <button onClick={() => handleDelete(u.id)} className="text-destructive hover:text-destructive/80 text-xs font-medium transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl shadow-elevated p-8 w-full max-w-md space-y-4">
            <h2 className="text-lg font-display font-semibold text-foreground">Edit User</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-body text-muted-foreground mb-1 block">Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
              <div>
                <label className="text-xs font-body text-muted-foreground mb-1 block">Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/50">
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={saveEdit} className="flex-1 py-2.5 bg-accent text-accent-foreground font-body text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">Save</button>
              <button onClick={() => setEditing(null)} className="flex-1 py-2.5 border border-border text-foreground font-body text-sm font-medium rounded-lg hover:bg-muted transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
