import { SectionHeader } from "@/components/SectionHeader";
import { Bell } from "lucide-react";

export default function AdminNotifications() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Notifications" subtitle="System alerts and updates" />
      <div className="bg-card rounded-2xl shadow-soft p-12 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
          <Bell size={24} className="text-muted-foreground" />
        </div>
        <p className="text-sm font-body text-muted-foreground">No notifications yet.</p>
      </div>
    </div>
  );
}
