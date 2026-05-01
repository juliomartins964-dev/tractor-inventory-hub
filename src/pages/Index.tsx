import { useMemo, useRef, useState } from "react";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  FileText, Upload, Search, Wallet, Package, TrendingUp,
  CheckCircle2, Building2, CalendarDays, Download,
} from "lucide-react";
import * as XLSX from "xlsx";
import seedData from "@/data/tratores.json";
import { Trator } from "@/types/trator";
import { StatCard } from "@/components/StatCard";
import { MiniDashboard } from "@/components/MiniDashboard";
import logo from "@/assets/veneza-logo.png";

const STATUS_OPTIONS = ["Disponível", "Reservado", "Vendido", "Em trânsito"];

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");

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
  const [tratores, setTratores] = useState<Trator[]>(seedData as Trator[]);
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
      toast.error("Arquivo inválido", { description: "Selecione um arquivo PDF da Nota Fiscal." });
      return;
    }
    toast.loading("Lendo Nota Fiscal...", { id: "nf" });
    setTimeout(() => {
      const novo: Trator = {
        id: Date.now(),
        status: "Disponível",
        cotacao: `COT-2025-${String(Math.floor(Math.random() * 900) + 100)}`,
        chassi: `JD${Math.floor(Math.random() * 9) + 1}R${Math.floor(Math.random() * 900)}X${Math.floor(Math.random() * 99999)}`,
        filial: filiais[Math.floor(Math.random() * filiais.length)] || "Ribeirão Preto",
        valor: Math.floor(Math.random() * 1200000) + 350000,
        dataEntrada: new Date().toISOString().slice(0, 10),
        pdfPath: `/notas/${file.name}`,
      };
      setTratores((prev) => [novo, ...prev]);
      toast.success("Trator cadastrado!", {
        id: "nf",
        description: `Chassi ${novo.chassi} • ${novo.filial}`,
      });
    }, 1000);
    e.target.value = "";
  };

  const handleExportXLSX = () => {
    const rows = filtered.map((t) => ({
      Status: t.status,
      Cotação: t.cotacao,
      Chassi: t.chassi,
      Filial: t.filial,
      Valor: t.valor,
      "Data Entrada": formatDate(t.dataEntrada),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 14 }, { wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tratores");
    const filename = `veneza-estoque-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
    toast.success("Planilha exportada!", { description: `${rows.length} registro(s) em ${filename}` });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground border-b-4 border-accent">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-lg bg-white flex items-center justify-center shadow-md p-1">
              <img src={logo} alt="Veneza Máquinas — John Deere" className="h-full w-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight">Veneza Máquinas</h1>
              <p className="text-xs text-primary-foreground/80">Controle de Estoque de Tratores</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur">
            <CalendarDays className="h-4 w-4" />
            <span className="font-medium">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Entrada de Estoque</h2>
            <p className="text-sm text-muted-foreground">Cadastre, filtre e acompanhe os tratores em estoque.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="lg"
              variant="outline"
              onClick={handleExportXLSX}
              disabled={filtered.length === 0}
              className="border-primary/30 text-primary hover:bg-primary/5 font-semibold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar XLSX
            </Button>
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="lg"
                    onClick={handleCadastro}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Cadastro
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-foreground text-background font-medium">
                  <FileText className="inline h-3.5 w-3.5 mr-1.5" />
                  Selecione o PDF da Nota Fiscal
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <input ref={fileInputRef} type="file" accept="application/pdf" hidden onChange={handleFile} />
          </div>
        </div>

        {/* Filtros */}
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
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {filiais.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total em Estoque" value={String(filtered.length)} hint="unidades filtradas" icon={Package} variant="primary" />
          <StatCard label="Disponíveis" value={String(disponiveis)} hint="prontos para venda" icon={CheckCircle2} variant="accent" />
          <StatCard label="Valor Total" value={formatBRL(totalValor)} hint="estoque filtrado" icon={Wallet} variant="info" />
          <StatCard label="Ticket Médio" value={formatBRL(ticketMedio)} hint="por trator" icon={TrendingUp} variant="warning" />
        </section>

        {/* Mini Dashboard */}
        <MiniDashboard tratores={filtered} />

        {/* Tabela */}
        <section className="card-elevated overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Tratores em Estoque</h3>
            </div>
            <span className="text-xs text-muted-foreground">{filtered.length} de {tratores.length} registros</span>
          </div>
          <div className="overflow-auto max-h-[520px]">
            <table className="w-full text-sm">
              <thead className="bg-secondary sticky top-0 z-10">
                <tr className="text-left text-xs uppercase tracking-wide text-secondary-foreground">
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Cotação</th>
                  <th className="px-6 py-3 font-semibold">Chassi</th>
                  <th className="px-6 py-3 font-semibold">Filial</th>
                  <th className="px-6 py-3 font-semibold text-right">Valor</th>
                  <th className="px-6 py-3 font-semibold">Data Entrada</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-foreground">{t.cotacao}</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-foreground">{t.chassi}</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{t.filial}</td>
                    <td className="px-6 py-3.5 text-right font-semibold tabular-nums text-foreground">{formatBRL(t.valor)}</td>
                    <td className="px-6 py-3.5 text-muted-foreground tabular-nums">{formatDate(t.dataEntrada)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      Nenhum trator encontrado com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="text-center text-xs text-muted-foreground pt-4 pb-2">
          Veneza Máquinas © 2026 — Sistema de gestão de estoque agrícola
        </footer>
      </main>
    </div>
  );
};

export default Index;
