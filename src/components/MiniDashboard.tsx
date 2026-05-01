import { Trator } from "@/types/trator";
import { useMemo } from "react";

interface Props { tratores: Trator[]; }

export const MiniDashboard = ({ tratores }: Props) => {
  const porFilial = useMemo(() => {
    const map = new Map<string, number>();
    tratores.forEach((t) => map.set(t.filial, (map.get(t.filial) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [tratores]);

  const porStatus = useMemo(() => {
    const map = new Map<string, number>();
    tratores.forEach((t) => map.set(t.status, (map.get(t.status) || 0) + 1));
    return Array.from(map.entries());
  }, [tratores]);

  const maxFilial = Math.max(1, ...porFilial.map(([, n]) => n));
  const total = tratores.length || 1;

  const statusColor: Record<string, string> = {
    "Disponível": "bg-primary",
    "Reservado": "bg-accent",
    "Vendido": "bg-muted-foreground",
    "Em trânsito": "bg-info",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card-elevated p-6">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-semibold text-foreground">Estoque por Filial</h3>
          <span className="text-xs text-muted-foreground">{tratores.length} unidades</span>
        </div>
        <div className="space-y-3">
          {porFilial.map(([filial, count]) => (
            <div key={filial}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-foreground">{filial}</span>
                <span className="text-muted-foreground tabular-nums">{count}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                  style={{ width: `${(count / maxFilial) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {porFilial.length === 0 && <p className="text-sm text-muted-foreground">Sem dados.</p>}
        </div>
      </div>

      <div className="card-elevated p-6">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-semibold text-foreground">Distribuição por Status</h3>
          <span className="text-xs text-muted-foreground">visão geral</span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-muted mb-5">
          {porStatus.map(([s, n]) => (
            <div
              key={s}
              className={`${statusColor[s] || "bg-muted-foreground"} transition-all duration-500`}
              style={{ width: `${(n / total) * 100}%` }}
              title={`${s}: ${n}`}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {porStatus.map(([s, n]) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-sm ${statusColor[s] || "bg-muted-foreground"}`} />
              <span className="text-sm text-foreground flex-1">{s}</span>
              <span className="text-sm font-semibold tabular-nums">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
