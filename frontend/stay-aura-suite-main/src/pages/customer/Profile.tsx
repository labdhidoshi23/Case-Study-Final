import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { User, Mail, Phone } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import { userApi } from "@/api/services";

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: user?.fullName ?? user?.username ?? "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const res = await userApi.update(user.id, { name: form.name, phone: form.phone });
      dispatch(setUser({ ...user, username: res.data.name, fullName: res.data.name }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <SectionHeader title="My Profile" subtitle="Manage your account information" />
      <div className="bg-card rounded-2xl shadow-soft p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
            <User size={32} className="text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-display font-semibold text-foreground">{user?.fullName ?? user?.username}</h3>
            <p className="text-sm font-body text-muted-foreground">{user?.role}</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-body font-medium text-foreground block mb-1.5">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-sm font-body font-medium text-foreground block mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={user?.email ?? ""} disabled
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-muted text-muted-foreground font-body text-sm cursor-not-allowed" />
            </div>
          </div>
          <div>
            <label className="text-sm font-body font-medium text-foreground block mb-1.5">Phone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="Enter phone number"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="mt-8 px-8 py-3 bg-accent text-accent-foreground font-body font-medium rounded-lg shadow-gold hover:shadow-elevated transition-all duration-300 disabled:opacity-60">
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
