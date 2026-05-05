import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  Target, Hash, DollarSign, Package, RefreshCcw, Undo2,
  CheckCircle2, ListChecks, Scale, Equal, FilterX, Filter,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { DataTable } from "@/components/DataTable";
import { EmptyState } from "@/components/EmptyState";

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

const ProgressRow = ({ label, value, target = 0 }: { label: string; value: number; target?: number }) => {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  const restante = Math.max(0, target - value);
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground tabular-nums">{pct.toFixed(1)}%</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-muted-foreground">% para atingir a meta = <span className="font-semibold text-foreground">{restante}</span></p>
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
        <h2 className="text-2xl font-bold text-foreground">Faturamento Máquinas Novas</h2>
        <p className="text-sm text-muted-foreground">RVD — Resultado de Vendas Diário</p>
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

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="R$ Meta Total" value={formatBRL(0)} icon={Target} variant="primary" />
        <StatCard label="Meta Qtd" value="0" icon={Hash} variant="primary" />
        <StatCard label="Faturado" value={formatBRL(0)} icon={DollarSign} variant="info" />
        <StatCard label="Qtd Faturado" value="0" icon={Package} variant="info" />
        <StatCard label="Refaturamento" value={formatBRL(0)} icon={RefreshCcw} variant="accent" />
        <StatCard label="Qtd Refaturamento" value="0" icon={ListChecks} variant="accent" />
        <StatCard label="Devolução" value={formatBRL(0)} icon={Undo2} variant="warning" />
        <StatCard label="Qtd Devolução" value="0" icon={Hash} variant="warning" />
        <StatCard label="Total Real" value={formatBRL(0)} icon={CheckCircle2} variant="primary" />
        <StatCard label="Qtd Real" value="0" icon={ListChecks} variant="primary" />
        <StatCard label="Diferença" value={formatBRL(0)} icon={Scale} variant="info" />
        <StatCard label="Qtd Diferença" value="0" icon={Equal} variant="info" />
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
        </section>
      </div>

      <DataTable title="Faturamento Detalhado" columns={FAT_COLS} />
    </>
  );
};

export default Faturamento;
