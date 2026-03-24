import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/authSlice";
import { authApi } from "@/api/services";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import authImg from "@/assets/auth-hotel.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { token, user } = res.data;
      dispatch(loginSuccess({
        user: {
          id: String(user.id),
          username: user.name,
          email: user.email,
          role: user.role,
          fullName: user.name,
        },
        token,
      }));
      const routes: Record<string, string> = {
        CUSTOMER: "/customer/dashboard",
        RECEPTIONIST: "/staff/dashboard",
        MANAGER: "/staff/dashboard",
        ADMIN: "/admin/dashboard",
      };
      navigate(routes[user.role] ?? "/customer/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error ?? "Invalid email or password");
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
              Welcome Back to <span className="text-gradient-gold">StaySphere</span>
            </h2>
            <p className="mt-3 font-body text-sm" style={{ color: "hsl(0 0% 75%)" }}>
              Your luxury experience awaits
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
          <h1 className="text-3xl font-display font-semibold text-foreground mt-8">Sign In</h1>
          <p className="text-sm font-body text-muted-foreground mt-2">Enter your credentials to access your account</p>

          {error && (
            <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-body font-medium text-foreground block mb-1.5">Email</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-body font-medium text-foreground block mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-accent text-accent-foreground font-body font-semibold rounded-lg shadow-gold hover:shadow-elevated transition-all duration-300 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-sm font-body text-muted-foreground text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent font-medium hover:underline">Register</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
