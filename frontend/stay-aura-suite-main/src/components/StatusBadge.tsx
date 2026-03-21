import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium font-body",
  {
    variants: {
      variant: {
        confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        pending: "bg-amber-50 text-amber-700 border border-amber-200",
        cancelled: "bg-red-50 text-red-700 border border-red-200",
        checked_in: "bg-sky-50 text-sky-700 border border-sky-200",
        checked_out: "bg-slate-100 text-slate-600 border border-slate-200",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        failed: "bg-red-50 text-red-700 border border-red-200",
        available: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        occupied: "bg-red-50 text-red-700 border border-red-200",
      },
    },
    defaultVariants: { variant: "pending" },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return <span className={cn(statusBadgeVariants({ variant }), className)}>{children}</span>;
}
