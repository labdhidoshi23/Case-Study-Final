import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isHome ? "bg-transparent" : "bg-primary/95 backdrop-blur-sm"}`}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-accent">StaySphere</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-body text-primary-foreground/80 hover:text-accent transition-colors">Home</Link>
          <Link to="/rooms" className="text-sm font-body text-primary-foreground/80 hover:text-accent transition-colors">Rooms</Link>
          <Link to="/about" className="text-sm font-body text-primary-foreground/80 hover:text-accent transition-colors">About</Link>
          <Link to="/contact" className="text-sm font-body text-primary-foreground/80 hover:text-accent transition-colors">Contact</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-body text-primary-foreground/80 hover:text-accent transition-colors">Sign In</Link>
          <Link to="/register" className="px-5 py-2 text-sm font-body font-medium bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all shadow-gold">
            Register
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-primary-foreground">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass"
          >
            <div className="px-6 py-4 space-y-3">
              <Link to="/" onClick={() => setOpen(false)} className="block text-sm font-body text-primary-foreground/80">Home</Link>
              <Link to="/rooms" onClick={() => setOpen(false)} className="block text-sm font-body text-primary-foreground/80">Rooms</Link>
              <Link to="/login" onClick={() => setOpen(false)} className="block text-sm font-body text-primary-foreground/80">Sign In</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block text-sm font-body text-accent font-medium">Register</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
