import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  variant?: "primary" | "accent" | "info" | "warning";
}

const variantStyles = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/20 text-foreground",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
};

export const StatCard = ({ label, value, hint, icon: Icon, variant = "primary" }: StatCardProps) => {
  return (
    <div className="card-elevated p-5 flex items-center gap-4">
      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", variantStyles[variant])}>
        <Icon className="h-6 w-6" strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-foreground leading-tight mt-0.5 truncate">{value}</p>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
    </div>
  );
};
