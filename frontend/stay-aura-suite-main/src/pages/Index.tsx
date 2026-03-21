import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-hotel.jpg";
import room1 from "@/assets/room-1.jpg";
import room2 from "@/assets/room-2.jpg";
import room3 from "@/assets/room-3.jpg";
import { MapPlaceholder } from "@/components/MapPlaceholder";

const rooms = [
  { id: 1, name: "Ocean View Suite", price: 450, image: room1, type: "Suite" },
  { id: 2, name: "Penthouse Royal", price: 850, image: room2, type: "Penthouse" },
  { id: 3, name: "Mountain Retreat", price: 350, image: room3, type: "Deluxe" },
];

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Luxury hotel lobby" className="w-full h-full object-cover animate-hero-zoom" />
          <div className="absolute inset-0 bg-gradient-hero-overlay" />
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-accent font-body text-sm uppercase tracking-[0.2em] mb-4"
              >
                Welcome to StaySphere
              </motion.p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight" style={{ color: "hsl(0 0% 98%)" }}>
                Luxury Stays.{" "}
                <span className="text-gradient-gold">Seamless Experience.</span>
              </h1>
              <p className="mt-6 text-lg font-body leading-relaxed" style={{ color: "hsl(0 0% 85%)" }}>
                Book rooms, manage reservations, and experience smart hospitality.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="px-8 py-3.5 bg-accent text-accent-foreground font-body font-medium rounded-lg shadow-gold hover:shadow-elevated transition-all duration-300 hover:scale-[1.02]"
                >
                  Book Now
                </Link>
                <Link
                  to="/rooms"
                  className="px-8 py-3.5 font-body font-medium rounded-lg border transition-all duration-300 hover:scale-[1.02]"
                  style={{ borderColor: "hsl(0 0% 100% / 0.25)", color: "hsl(0 0% 90%)" }}
                >
                  Explore Rooms
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-accent font-body text-sm uppercase tracking-[0.2em] mb-3">Our Collection</p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
              Exceptional Rooms & Suites
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-elevated transition-all duration-500"
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-body font-medium bg-accent text-accent-foreground rounded-full">
                      {room.type}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display font-semibold text-foreground">{room.name}</h3>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-display font-bold text-accent">${room.price}</span>
                      <span className="text-sm text-muted-foreground font-body"> / night</span>
                    </div>
                    <Link
                      to="/login"
                      className="text-sm font-body font-medium text-ocean hover:text-accent transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-accent font-body text-sm uppercase tracking-[0.2em] mb-3">Why StaySphere</p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
              Smart Hospitality, Redefined
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Seamless Booking", desc: "Book your perfect room in seconds with our intuitive reservation system." },
              { title: "Real-Time Updates", desc: "Stay informed with instant notifications about your reservations." },
              { title: "Premium Experience", desc: "From check-in to check-out, enjoy a fully managed luxury experience." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 bg-card rounded-2xl shadow-soft hover:shadow-card transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-3">{f.title}</h3>
                <p className="text-sm font-body text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-accent font-body text-sm uppercase tracking-[0.2em] mb-3">Find Us</p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">Our Location</h2>
          </div>
          <MapPlaceholder className="max-w-4xl mx-auto" />
        </div>
      </section>
    </div>
  );
}
