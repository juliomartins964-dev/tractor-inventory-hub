import { Trator } from "@/types/trator";
import { useMemo } from "react";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarRange } from "lucide-react";

interface Props { tratores: Trator[]; }

const MESES = [
  { label: "Nov", m: 10 },
  { label: "Dez", m: 11 },
  { label: "Jan", m: 0 },
  { label: "Fev", m: 1 },
  { label: "Mar", m: 2 },
  { label: "Abr", m: 3 },
  { label: "Mai", m: 4 },
  { label: "Jun", m: 5 },
  { label: "Jul", m: 6 },
  { label: "Ago", m: 7 },
  { label: "Set", m: 8 },
  { label: "Out", m: 9 },
];

// Extrai o "modelo" a partir do prefixo do chassi (ex.: JD9R410X... -> JD9R)
const extrairModelo = (chassi: string) => {
  const match = chassi.match(/^([A-Z]+\d+[A-Z]+)/);
  return match ? match[1] : chassi.slice(0, 4);
};

export const FiscalYearStrip = ({ tratores }: Props) => {
  // Ano fiscal flutuante: começa em Nov do ano anterior, termina em Out do ano atual.
  // Se hoje for Nov ou Dez, o ano fiscal "vigente" é (anoAtual -> anoAtual+1).
  const { anoInicio, anoFim } = useMemo(() => {
    const hoje = new Date();
    const mes = hoje.getMonth();
    const ano = hoje.getFullYear();
    if (mes >= 10) return { anoInicio: ano, anoFim: ano + 1 };
    return { anoInicio: ano - 1, anoFim: ano };
  }, []);

  const dadosPorMes = useMemo(() => {
    return MESES.map((mes, idx) => {
      // Nov/Dez pertencem ao anoInicio; Jan-Out pertencem ao anoFim
      const yearOfMonth = idx < 2 ? anoInicio : anoFim;
      const itens = tratores.filter((t) => {
        const d = new Date(t.dataEntrada + "T00:00:00");
        return d.getFullYear() === yearOfMonth && d.getMonth() === mes.m;
      });
      const modelos = new Map<string, number>();
      itens.forEach((t) => {
        const mod = extrairModelo(t.chassi);
        modelos.set(mod, (modelos.get(mod) || 0) + 1);
      });
      return {
        label: mes.label,
        year: yearOfMonth,
        qtd: itens.length,
        modelos: Array.from(modelos.entries()).sort((a, b) => b[1] - a[1]),
      };
    });
  }, [tratores, anoInicio, anoFim]);

  const maxQtd = Math.max(1, ...dadosPorMes.map((d) => d.qtd));
  const totalAno = dadosPorMes.reduce((acc, d) => acc + d.qtd, 0);

  return (
    <section className="card-elevated p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">Ano Fiscal — Entradas por Mês</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold tabular-nums">
            {anoInicio} → {anoFim}
          </span>
          <span className="text-muted-foreground">{totalAno} entradas no ciclo</span>
        </div>
      </div>

      {/* Cabeçalho dos anos */}
      <div className="grid grid-cols-12 gap-2 mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
        <div className="col-span-2 text-center py-1 rounded bg-secondary">{anoInicio}</div>
        <div className="col-span-10 text-center py-1 rounded bg-accent/20 text-foreground">{anoFim}</div>
      </div>

      <TooltipProvider delayDuration={100}>
        <div className="grid grid-cols-12 gap-2">
          {dadosPorMes.map((d) => {
            const heightPct = (d.qtd / maxQtd) * 100;
            return (
              <Tooltip key={`${d.label}-${d.year}`}>
                <TooltipTrigger asChild>
                  <div className="group flex flex-col items-center gap-1 cursor-default">
                    <div className="relative w-full h-16 bg-muted/60 rounded-md overflow-hidden flex items-end justify-center">
                      <div
                        className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary to-primary-light transition-all duration-500 group-hover:from-accent group-hover:to-accent"
                        style={{ height: `${heightPct}%` }}
                      />
                      <span className="relative text-center text-xs font-bold text-foreground tabular-nums mb-1">
                        {d.qtd}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-foreground">{d.label}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-foreground text-background p-3 max-w-xs">
                  <div className="font-semibold mb-1.5">
                    {d.label}/{d.year} — {d.qtd} {d.qtd === 1 ? "entrada" : "entradas"}
                  </div>
                  {d.modelos.length === 0 ? (
                    <div className="text-xs opacity-75">Sem cadastros neste mês.</div>
                  ) : (
                    <ul className="space-y-0.5 text-xs">
                      {d.modelos.map(([mod, qtd]) => (
                        <li key={mod} className="flex justify-between gap-4">
                          <span className="font-mono">{mod}</span>
                          <span className="font-semibold tabular-nums">{qtd}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </section>
  );
};
