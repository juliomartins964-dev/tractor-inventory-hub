import { useMemo } from "react";
import { CalendarRange } from "lucide-react";

interface Item { mes: number; ano: number; qtd: number; }
interface Props { title?: string; items?: Item[]; }

const MESES = [
  { label: "Nov", m: 10 }, { label: "Dez", m: 11 },
  { label: "Jan", m: 0 }, { label: "Fev", m: 1 }, { label: "Mar", m: 2 },
  { label: "Abr", m: 3 }, { label: "Mai", m: 4 }, { label: "Jun", m: 5 },
  { label: "Jul", m: 6 }, { label: "Ago", m: 7 }, { label: "Set", m: 8 }, { label: "Out", m: 9 },
];

export const FiscalBars = ({ title = "Ano Fiscal", items = [] }: Props) => {
  const { anoInicio, anoFim } = useMemo(() => {
    const h = new Date(); const mes = h.getMonth(); const ano = h.getFullYear();
    return mes >= 10 ? { anoInicio: ano, anoFim: ano + 1 } : { anoInicio: ano - 1, anoFim: ano };
  }, []);

  const dados = MESES.map((mes, idx) => {
    const yearOfMonth = idx < 2 ? anoInicio : anoFim;
    const qtd = items
      .filter((i) => i.mes === mes.m && i.ano === yearOfMonth)
      .reduce((a, b) => a + b.qtd, 0);
    return { ...mes, year: yearOfMonth, qtd };
  });
  const max = Math.max(1, ...dados.map((d) => d.qtd));
  const total = dados.reduce((a, d) => a + d.qtd, 0);

  return (
    <section className="card-elevated p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold tabular-nums">
            {anoInicio} → {anoFim}
          </span>
          <span className="text-muted-foreground">{total} no ciclo</span>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
        <div className="col-span-2 text-center py-1 rounded bg-secondary">{anoInicio}</div>
        <div className="col-span-10 text-center py-1 rounded bg-accent/20 text-foreground">{anoFim}</div>
      </div>
      <div className="grid grid-cols-12 gap-2">
        {dados.map((d) => (
          <div key={`${d.label}-${d.year}`} className="flex flex-col items-center gap-1">
            <div className="relative w-full h-16 bg-muted/60 rounded-md overflow-hidden flex items-end justify-center">
              <div
                className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary to-primary-light transition-all duration-500"
                style={{ height: `${(d.qtd / max) * 100}%` }}
              />
              <span className="relative text-center text-xs font-bold text-foreground tabular-nums mb-1">{d.qtd}</span>
            </div>
            <span className="text-xs font-semibold text-foreground">{d.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
