import { useMemo, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  FileText, Upload, Search, Wallet, Package, TrendingUp,
  CheckCircle2, CalendarDays, Download, FilterX, Pencil, Trash2,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Trator } from "@/types/trator";
import { StatCard } from "@/components/StatCard";
import { FiscalBars } from "@/components/FiscalBars";
import { EmptyState } from "@/components/EmptyState";

const STATUS_OPTIONS = ["Disponível", "Reservado", "Vendido", "Em trânsito"];

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const formatDate = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    "Disponível": "bg-primary/10 text-primary border-primary/20",
    "Reservado": "bg-accent/30 text-foreground border-accent/40",
    "Vendido": "bg-muted text-muted-foreground border-border",
    "Em trânsito": "bg-info/10 text-info border-info/20",
  };
  return map[s] || "bg-muted text-muted-foreground border-border";
};

const Index = () => {
  const [tratores, setTratores] = useState<Trator[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cotacaoFilter, setCotacaoFilter] = useState<string>("");
  const [chassiFilter, setChassiFilter] = useState<string>("");
  const [filialFilter, setFilialFilter] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filiais = useMemo(
    () => Array.from(new Set(tratores.map((t) => t.filial))).sort(),
    [tratores]
  );

  const filtered = useMemo(() => {
    return tratores.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (filialFilter !== "all" && t.filial !== filialFilter) return false;
      if (cotacaoFilter && !t.cotacao.toLowerCase().includes(cotacaoFilter.toLowerCase())) return false;
      if (chassiFilter && !t.chassi.toLowerCase().includes(chassiFilter.toLowerCase())) return false;
      return true;
    });
  }, [tratores, statusFilter, cotacaoFilter, chassiFilter, filialFilter]);

  const totalValor = filtered.reduce((acc, t) => acc + t.valor, 0);
  const disponiveis = filtered.filter((t) => t.status === "Disponível").length;
  const ticketMedio = filtered.length ? totalValor / filtered.length : 0;
  const diasMedios = filtered.length
    ? Math.round(
        filtered.reduce((acc, t) => {
          const diff = (Date.now() - new Date(t.dataEntrada + "T00:00:00").getTime()) / 86400000;
          return acc + Math.max(0, diff);
        }, 0) / filtered.length
      )
    : 0;

  const handleCadastro = () => fileInputRef.current?.click();
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Arquivo inválido", { description: "Selecione um PDF da Nota Fiscal." });
      return;
    }
    toast.success("PDF recebido", { description: `${file.name} — pronto para integração.` });
    e.target.value = "";
  };

  const limparFiltros = () => {
    setStatusFilter("all"); setCotacaoFilter(""); setChassiFilter(""); setFilialFilter("all");
  };

  const handleExportXLSX = () => {
    const rows = filtered.map((t) => ({
      Status: t.status, Cotação: t.cotacao, Chassi: t.chassi, Filial: t.filial,
      Valor: t.valor, "Data Entrada": formatDate(t.dataEntrada),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tratores");
    XLSX.writeFile(wb, `veneza-estoque-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Planilha exportada!");
  };

  const fiscalItems = filtered.map((t) => {
    const d = new Date(t.dataEntrada + "T00:00:00");
    return { mes: d.getMonth(), ano: d.getFullYear(), qtd: 1 };
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Entrada de Estoque</h2>
          <p className="text-sm text-muted-foreground">Cadastre, filtre e acompanhe os tratores em estoque.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="lg" variant="outline" onClick={handleExportXLSX} disabled={filtered.length === 0}
            className="border-primary/30 text-primary hover:bg-primary/5 font-semibold">
            <Download className="mr-2 h-4 w-4" /> Exportar XLSX
          </Button>
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" onClick={handleCadastro}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-md">
                  <Upload className="mr-2 h-4 w-4" /> Cadastro
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-foreground text-background font-medium">
                <FileText className="inline h-3.5 w-3.5 mr-1.5" /> Selecione o PDF da Nota Fiscal
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <input ref={fileInputRef} type="file" accept="application/pdf" hidden onChange={handleFile} />
        </div>
      </div>

      <section className="card-elevated p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cotação</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Ex: COT-2025-001" value={cotacaoFilter} onChange={(e) => setCotacaoFilter(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Chassi</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar por chassi..." value={chassiFilter} onChange={(e) => setChassiFilter(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Filial</label>
            <Select value={filialFilter} onValueChange={setFilialFilter}>
              <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {filiais.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={limparFiltros} className="text-muted-foreground">
            <FilterX className="mr-2 h-4 w-4" /> Limpar
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total em Estoque" value={String(filtered.length)} hint="unidades filtradas" icon={Package} variant="primary" />
        <StatCard label="Disponíveis" value={String(disponiveis)} hint="prontos para venda" icon={CheckCircle2} variant="accent" />
        <StatCard label="Valor Total" value={formatBRL(totalValor)} hint="estoque filtrado" icon={Wallet} variant="info" />
        <StatCard label="Ticket Médio" value={formatBRL(ticketMedio)} hint="por trator" icon={TrendingUp} variant="warning" />
        <StatCard label="Dias em Estoque" value={`${diasMedios} dias`} hint="média por trator" icon={CalendarDays} variant="primary" />
      </section>

      

      <section className="card-elevated overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Tratores em Estoque</h3>
          <span className="text-xs text-muted-foreground">{filtered.length} de {tratores.length} registros</span>
        </div>
        <div className="overflow-auto max-h-[560px]">
          <table className="w-full text-sm">
            <thead className="bg-secondary sticky top-0 z-10">
              <tr className="text-left text-xs uppercase tracking-wide text-secondary-foreground">
                {[
                  "Status","Modelo","N. Cotação","CHASSI","NF","Data emissão","Venc. NCC",
                  "Data Entrada","Dias em estoque","Preço de Lista","Valor Compra",
                  "Bonus UP FRONT","Bonus campanha","Bonus Total","Loja compra","MV",
                  "Condição / Estoque","Campanhas","Observação","Ações",
                ].map((c) => (
                  <th key={c} className="px-4 py-3 font-semibold whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={20}><EmptyState message="Nenhum trator cadastrado. Use o botão Cadastro para iniciar." /></td></tr>
              )}
              {filtered.map((t) => (
                <tr key={t.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">—</td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{t.cotacao}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">{t.chassi}</td>
                  <td className="px-4 py-3 whitespace-nowrap">—</td>
                  <td className="px-4 py-3 whitespace-nowrap">—</td>
                  <td className="px-4 py-3 whitespace-nowrap">—</td>
                  <td className="px-4 py-3 whitespace-nowrap tabular-nums">{formatDate(t.dataEntrada)}</td>
                  <td className="px-4 py-3 whitespace-nowrap tabular-nums">—</td>
                  <td className="px-4 py-3 whitespace-nowrap tabular-nums">—</td>
                  <td className="px-4 py-3 whitespace-nowrap tabular-nums font-semibold">{formatBRL(t.valor)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">—</td>
                  <td className="px-4 py-3 whitespace-nowrap">—</td>
                  <td className="px-4 py-3 whitespace-nowrap">—</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{t.filial}</td>
                  <td className="px-4 py-3 whitespace-nowrap">—</td>
                  <td className="px-4 py-3 whitespace-nowrap">—</td>
                  <td className="px-4 py-3 whitespace-nowrap">—</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">—</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-info hover:bg-info/10"
                        onClick={() => toast.info("Editar", { description: `Cotação ${t.cotacao}` })}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setTratores((prev) => prev.filter((x) => x.id !== t.id));
                          toast.success("Registro excluído");
                        }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Index;
