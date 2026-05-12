import { ReactNode } from "react";
import { Building2 } from "lucide-react";
import { EmptyState } from "./EmptyState";

interface Props {
  title: string;
  columns: string[];
  rows?: ReactNode[][];
  count?: string;
}

export const DataTable = ({ title, columns, rows = [], count }: Props) => {
  return (
    <section className="card-elevated overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        {count && <span className="text-xs text-muted-foreground">{count}</span>}
      </div>
      <div className="overflow-auto max-h-[520px]">
        <table className="w-full text-sm">
          <thead className="bg-secondary sticky top-0 z-10">
            <tr className="text-left text-xs uppercase tracking-wide text-secondary-foreground">
              {columns.map((c) => (
                <th key={c} className="px-4 py-3 font-semibold whitespace-nowrap">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border hover:bg-secondary/50 transition-colors">
                {r.map((c, j) => (
                  <td key={j} className="px-4 py-3 whitespace-nowrap text-foreground">{c}</td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
