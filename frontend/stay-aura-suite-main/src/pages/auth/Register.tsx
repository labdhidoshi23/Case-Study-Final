import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Lock, Mail, Phone } from "lucide-react";
import { authApi } from "@/api/services";
import authImg from "@/assets/auth-hotel.jpg";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "CUSTOMER" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (key: string, val: string) => setForm({ ...form, [key]: val });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.register(form);
      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.error ??
        (typeof err.response?.data === 'object'
          ? Object.values(err.response.data).join(', ')
          : "Registration failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src={authImg} alt="Luxury suite" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero-overlay flex items-end p-12">
          <div>
            <h2 className="text-3xl font-display font-bold" style={{ color: "hsl(0 0% 98%)" }}>
              Join <span className="text-gradient-gold">StaySphere</span>
            </h2>
            <p className="mt-3 font-body text-sm" style={{ color: "hsl(0 0% 75%)" }}>
              Begin your luxury journey today
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="text-2xl font-display font-bold text-accent mb-2 block">StaySphere</Link>
          <h1 className="text-3xl font-display font-semibold text-foreground mt-8">Create Account</h1>
          <p className="text-sm font-body text-muted-foreground mt-2">Register to start your luxury experience</p>

          {error && (
            <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-body font-medium text-foreground block mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" required />
              </div>
            </div>

            <div>
              <label className="text-sm font-body font-medium text-foreground block mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" required />
              </div>
            </div>

            <div>
              <label className="text-sm font-body font-medium text-foreground block mb-1.5">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" />
              </div>
            </div>

            <div>
              <label className="text-sm font-body font-medium text-foreground block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-body font-medium text-foreground block mb-1.5">Role</label>
              <select value={form.role} onChange={(e) => update("role", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all">
                <option value="CUSTOMER">Customer</option>
                <option value="RECEPTIONIST">Receptionist</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-accent text-accent-foreground font-body font-semibold rounded-lg shadow-gold hover:shadow-elevated transition-all duration-300 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-sm font-body text-muted-foreground text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-accent font-medium hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
