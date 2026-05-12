import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  Target, DollarSign, RefreshCcw, Undo2,
  CheckCircle2, Scale, FilterX, Filter, Percent, BarChart3,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend, ResponsiveContainer,
} from "recharts";

const FAT_COLS = [
  "Filial", "Mês", "Cliente", "CNPJ/CPF", "Cidade Cliente", "UF Cliente", "Fone",
  "CEN", "Status", "Família", "Modelo", "Data de Faturamento", "Tipo de Venda",
  "Cotação", "Chassi", "NF de Compra", "R$ NF de Compra", "ICMS Compra",
  "NF de Venda", "R$ NF de Venda", "Chave de Acesso NF", "% Alíquota",
  "Base de Cálculo", "ICMS Venda", "Valor Líquido", "Rebate Financeiro/Taxa Flat",
  "Preço de Lista", "Desconto Concessionário", "Desconto de Condição", "Dealer Price",
  "% Up Front", "% Bonificação", "Bonificação Total", "% Alçada", "% Varejo", "DRM",
  "Bonificação JD", "PIS/COFINS/ISS", "% Margem Venda", "R$ Margem Venda",
  "R$ Margem Contribuição", "% Margem de Contribuição", "Comissão Vendedor (R$)",
  "Comissão (%)", "Condições de Pag.", "IRS", "Baixa DCP",
];

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

// Color thresholds based on % remaining to reach the goal:
// >= 60% remaining = red, >=50% = yellow, otherwise green
const getStatusColor = (restantePct: number) => {
  if (restantePct >= 60) return { bar: "bg-destructive", hex: "hsl(var(--destructive))", label: "Crítico" };
  if (restantePct >= 50) return { bar: "bg-warning", hex: "hsl(var(--warning))", label: "Atenção" };
  return { bar: "bg-success", hex: "hsl(var(--success))", label: "Bom" };
};

const ProgressRow = ({ label, value, target = 0 }: { label: string; value: number; target?: number }) => {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  const restantePct = Math.max(0, 100 - pct);
  const color = getStatusColor(restantePct);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground tabular-nums">{pct.toFixed(1)}%</span>
      </div>
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div className="absolute inset-0 flex opacity-40">
          <div className="flex-1 bg-destructive" />
          <div className="flex-1 bg-warning" />
          <div className="flex-1 bg-success" />
        </div>
        <div className={`relative h-full ${color.bar} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-muted-foreground flex items-center gap-2">
        <span>% para atingir a meta = <span className="font-semibold text-foreground">{restantePct.toFixed(1)}%</span></span>
        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-white" style={{ backgroundColor: color.hex }}>{color.label}</span>
      </p>
    </div>
  );
};

const Faturamento = () => {
  const [filial, setFilial] = useState("all");
  const [mes, setMes] = useState("all");
  const [cliente, setCliente] = useState("");

  const limpar = () => { setFilial("all"); setMes("all"); setCliente(""); };

  return (
    <>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Faturamento Máquinas Novas</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">RVD — Resultado de Vendas Diário</p>
      </div>

      <section className="card-elevated p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Filial</label>
            <Select value={filial} onValueChange={setFilial}>
              <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todas</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mês</label>
            <Select value={mes} onValueChange={setMes}>
              <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cliente</label>
            <Input placeholder="Buscar cliente..." value={cliente} onChange={(e) => setCliente(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={limpar} className="text-muted-foreground">
            <FilterX className="mr-2 h-4 w-4" /> Limpar
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary-dark">
            <Filter className="mr-2 h-4 w-4" /> Filtrar
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard label="R$ Meta Total" value={formatBRL(0)} hint="Meta Qtd: 0" icon={Target} variant="filled" />
        <StatCard label="Faturado" value={formatBRL(0)} hint="Qtd: 0" icon={DollarSign} variant="filled" />
        <StatCard label="Refaturamento" value={formatBRL(0)} hint="Qtd: 0" icon={RefreshCcw} variant="filled" />
        <StatCard label="Devolução" value={formatBRL(0)} hint="Qtd: 0" icon={Undo2} variant="filled" />
        <StatCard label="Total R$" value={formatBRL(0)} hint="Qtde Total: 0" icon={CheckCircle2} variant="filled" />
        <StatCard label="Diferença" value={formatBRL(0)} hint="Qtde Dif.: 0" icon={Scale} variant="filled" />
        <StatCard label="% Margem de Venda" value="0,00%" icon={Percent} variant="filled" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="card-elevated p-6">
          <h3 className="font-semibold text-foreground mb-4">Meta x Quantidade por Filial</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                <th className="py-2 font-semibold">Filial</th>
                <th className="py-2 font-semibold text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr><td colSpan={2}><EmptyState message="Sem dados de meta cadastrados." /></td></tr>
            </tbody>
          </table>
        </section>

        <section className="card-elevated p-6 space-y-6">
          <h3 className="font-semibold text-foreground">Desempenho</h3>
          <ProgressRow label="Quantidade Realizado" value={0} target={0} />
          <ProgressRow label="Quantidade Faturado" value={0} target={0} />
          <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-3 rounded-sm bg-destructive" /> ≥ 60% para meta</span>
            <span className="flex items-center gap-1"><span className="h-2 w-3 rounded-sm bg-warning" /> ≥ 50%</span>
            <span className="flex items-center gap-1"><span className="h-2 w-3 rounded-sm bg-success" /> ≥ 40%</span>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Meta Valor x Valor Faturado — por Mês</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={["Nov","Dez","Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out"].map((m) => ({ mes: m, meta: 0, faturado: 0 }))}
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
                <RTooltip
                  formatter={(v: number) => formatBRL(v)}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="meta" name="Meta" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="faturado" name="Faturado" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground">Meta Valor x Valor Faturado — por Filial</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[]}
                margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="filial" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`} />
                <RTooltip
                  formatter={(v: number) => formatBRL(v)}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="meta" name="Meta" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="faturado" name="Faturado" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">Sem dados de filial cadastrados.</p>
        </section>
      </div>

      <DataTable title="Faturamento Detalhado" columns={FAT_COLS} />
    </>
  );
};

export default Faturamento;
