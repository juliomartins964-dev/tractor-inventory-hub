import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  variant?: "primary" | "accent" | "info" | "warning" | "filled" | "destructive";
}

const variantStyles = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/20 text-foreground",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  filled: "bg-white/20 text-primary-foreground",
  destructive: "bg-destructive/10 text-destructive",
};

export const StatCard = ({ label, value, hint, icon: Icon, variant = "primary" }: StatCardProps) => {
  const filled = variant === "filled";
  return (
    <div
      className={cn(
        "card-elevated p-5 flex items-center gap-4",
        filled && "bg-gradient-to-br from-primary to-primary-dark text-primary-foreground border-primary-dark"
      )}
    >
      <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", variantStyles[variant])}>
        <Icon className="h-6 w-6" strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className={cn("text-xs font-semibold uppercase tracking-wide", filled ? "text-primary-foreground/80" : "text-muted-foreground")}>{label}</p>
        <p className={cn("text-lg font-bold leading-tight mt-0.5 truncate", filled ? "text-primary-foreground" : "text-foreground")}>{value}</p>
        {hint && <p className={cn("text-xs mt-0.5", filled ? "text-primary-foreground/70" : "text-muted-foreground")}>{hint}</p>}
      </div>
    </div>
  );
};
