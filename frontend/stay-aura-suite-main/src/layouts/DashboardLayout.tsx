import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { SidebarNavItem } from "@/components/SidebarNavItem";
import {
  LayoutDashboard, BedDouble, CalendarCheck, CreditCard,
  Bell, User, LogOut, ChevronLeft, ChevronRight, Users, Package,
} from "lucide-react";
import { useState } from "react";

const customerLinks = [
  { to: "/customer/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/customer/rooms", icon: BedDouble, label: "Browse Rooms" },
  { to: "/customer/reservations", icon: CalendarCheck, label: "My Reservations" },
  { to: "/customer/payments", icon: CreditCard, label: "Payments" },
  { to: "/customer/notifications", icon: Bell, label: "Notifications" },
  { to: "/customer/profile", icon: User, label: "Profile" },
];

export function CustomerLayout() {
  return <DashboardShell links={customerLinks} role="Customer" />;
}

const staffBaseLinks = [
  { to: "/staff/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/staff/reservations", icon: CalendarCheck, label: "Reservations" },
  { to: "/staff/rooms", icon: BedDouble, label: "Room Management" },
  { to: "/staff/customers", icon: User, label: "Customers" },
  { to: "/staff/notifications", icon: Bell, label: "Notifications" },
];

const managerExtraLinks = [
  { to: "/staff/staff", icon: Users, label: "Staff" },
  { to: "/staff/inventory", icon: Package, label: "Inventory" },
];

export function StaffLayout() {
  const role = useSelector((s: any) => s.auth.user?.role);
  const links = role === "MANAGER"
    ? [...staffBaseLinks.slice(0, -1), ...managerExtraLinks, staffBaseLinks[staffBaseLinks.length - 1]]
    : staffBaseLinks;
  return <DashboardShell links={links} role="Staff" />;
}

const adminLinks = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/users", icon: User, label: "Users" },
  { to: "/admin/rooms", icon: BedDouble, label: "Rooms" },
  { to: "/admin/reservations", icon: CalendarCheck, label: "Reservations" },
  { to: "/admin/payments", icon: CreditCard, label: "Payments" },
  { to: "/admin/staff", icon: Users, label: "Staff" },
  { to: "/admin/inventory", icon: Package, label: "Inventory" },
  { to: "/admin/reports", icon: LayoutDashboard, label: "Reports" },
  { to: "/admin/notifications", icon: Bell, label: "Notifications" },
];

export function AdminLayout() {
  return <DashboardShell links={adminLinks} role="Admin" />;
}

interface DashboardShellProps {
  links: { to: string; icon: any; label: string; end?: boolean }[];
  role: string;
}

function DashboardShell({ links, role }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-sidebar z-40 flex flex-col transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          {!collapsed && (
            <Link to="/" className="text-xl font-display font-bold text-sidebar-primary">
              StaySphere
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/70 transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {!collapsed && (
          <div className="px-4 py-3">
            <span className="text-xs font-body font-medium uppercase tracking-wider text-sidebar-foreground/40">
              {role} Panel
            </span>
          </div>
        )}

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {links.map((link) =>
            collapsed ? (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center justify-center p-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                title={link.label}
              >
                <link.icon size={18} />
              </Link>
            ) : (
              <SidebarNavItem key={link.to} {...link} />
            )
          )}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-body text-sidebar-foreground/70 hover:text-red-400 hover:bg-sidebar-accent transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
          <h1 className="text-lg font-display font-semibold text-foreground">{role} Portal</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell size={18} className="text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
            </button>
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <User size={16} className="text-accent" />
            </div>
          </div>
        </header>
        <main className="p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
