import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/70">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold text-accent">StaySphere</h3>
            <p className="text-sm font-body leading-relaxed">
              Experience luxury hospitality with smart hotel management. Your comfort, our priority.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-body font-semibold text-primary-foreground uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm font-body hover:text-accent transition-colors">Home</Link>
              <Link to="/rooms" className="block text-sm font-body hover:text-accent transition-colors">Browse Rooms</Link>
              <Link to="/login" className="block text-sm font-body hover:text-accent transition-colors">Sign In</Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-body font-semibold text-primary-foreground uppercase tracking-wider">Services</h4>
            <div className="space-y-2">
              <p className="text-sm font-body">Room Booking</p>
              <p className="text-sm font-body">Event Hosting</p>
              <p className="text-sm font-body">Concierge</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-body font-semibold text-primary-foreground uppercase tracking-wider">Contact</h4>
            <div className="space-y-2 text-sm font-body">
              <p>123 Luxury Avenue</p>
              <p>contact@staysphere.com</p>
              <p>+1 (555) 000-0000</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-xs font-body text-primary-foreground/50">
            © 2026 StaySphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
