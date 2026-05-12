import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  variant?: "primary" | "accent" | "info" | "warning" | "filled" | "destructive";
}

export const StatCard = ({ label, value, hint, icon: Icon }: StatCardProps) => {
  return (
    <div className="card-elevated p-4 flex items-center gap-3 min-w-0">
      <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 bg-primary/10 text-primary">
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground leading-tight">
          {label}
        </p>
        <p className="text-base font-bold leading-snug mt-1 text-foreground break-words">
          {value}
        </p>
        {hint && <p className="text-[11px] mt-0.5 text-muted-foreground leading-tight">{hint}</p>}
      </div>
    </div>
  );
};
