import { SectionHeader } from "@/components/SectionHeader";
import { TrendingUp, BarChart3, PieChart } from "lucide-react";

export default function AdminReports() {
  return (
    <div className="space-y-8">
      <SectionHeader title="Reports & Analytics" subtitle="Detailed insights and data analysis" />
      <div className="grid lg:grid-cols-2 gap-6">
        {[
          { title: "Revenue Report", icon: TrendingUp, desc: "Monthly revenue breakdown" },
          { title: "Occupancy Rate", icon: BarChart3, desc: "Room occupancy analytics" },
          { title: "Customer Insights", icon: PieChart, desc: "Guest demographics and preferences" },
          { title: "Booking Trends", icon: TrendingUp, desc: "Reservation patterns over time" },
        ].map((r) => (
          <div key={r.title} className="bg-card rounded-2xl shadow-soft p-6 hover:shadow-card transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <r.icon size={18} className="text-accent" />
              </div>
              <div>
                <h3 className="text-base font-display font-semibold text-foreground">{r.title}</h3>
                <p className="text-xs font-body text-muted-foreground">{r.desc}</p>
              </div>
            </div>
            <div className="h-48 flex items-center justify-center bg-muted/50 rounded-xl">
              <p className="text-sm font-body text-muted-foreground">Chart placeholder</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
