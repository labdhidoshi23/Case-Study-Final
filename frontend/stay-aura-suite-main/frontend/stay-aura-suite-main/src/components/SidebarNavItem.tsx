import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

export function SidebarNavItem({ to, icon: Icon, label, end }: SidebarNavItemProps) {
  const location = useLocation();
  const isActive = end ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <RouterNavLink
      to={to}
      end={end}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-body transition-all duration-200 ${
        isActive
          ? "bg-sidebar-accent text-sidebar-primary font-medium"
          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
      }`}
    >
      <Icon size={18} className={isActive ? "text-sidebar-primary" : ""} />
      <span>{label}</span>
      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />}
    </RouterNavLink>
  );
}
