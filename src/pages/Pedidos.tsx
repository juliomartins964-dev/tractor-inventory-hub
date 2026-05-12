import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FilterX, Filter, Wallet, CheckCircle2, BookmarkCheck } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { FiscalBars } from "@/components/FiscalBars";
import { DataTable } from "@/components/DataTable";

const PEDIDOS_COLS = [
  "Cotação", "Código Base", "Modelo", "Cliente", "Obs", "Status", "MV",
  "Ordem Comar", "Preço Total da Ordem", "Dealer Price", "Bonus Up Front",
  "Bonus Total", "Data FDD", "Mês", "Loja de Compra", "Configuração", "Ações",
];

const Pedidos = () => {
  const [cotacao, setCotacao] = useState("");
  const [modelo, setModelo] = useState("all");
  const [filial, setFilial] = useState("all");
  const [obs, setObs] = useState("");

  const limpar = () => { setCotacao(""); setModelo("all"); setFilial("all"); setObs(""); };

  const formatBRL = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Pedidos em Carteira</h2>
        <p className="text-sm text-muted-foreground">Alocação Fábrica</p>
      </div>

      <section className="card-elevated p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cotação</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar cotação..." value={cotacao} onChange={(e) => setCotacao(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Modelo</label>
            <Select value={modelo} onValueChange={setModelo}>
              <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todos</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Filial</label>
            <Select value={filial} onValueChange={setFilial}>
              <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
              <SelectContent><SelectItem value="all">Todas</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Obs</label>
            <Input placeholder="Buscar observação..." value={obs} onChange={(e) => setObs(e.target.value)} />
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

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Preço Total" value={formatBRL(0)} icon={Wallet} variant="info" />
        <StatCard label="Disponível" value="0" icon={CheckCircle2} variant="primary" />
        <StatCard label="Reservado" value="0" icon={BookmarkCheck} variant="accent" />
      </section>

      <FiscalBars title="Pedidos por Ano Fiscal" items={[]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DataTable title="Por Modelo" columns={["Modelo", "Disponível", "Reservado"]} />
        <DataTable title="Por Filial" columns={["Filial", "Disponível", "Reservado"]} />
      </div>

      <DataTable title="Carteira de Pedidos" columns={PEDIDOS_COLS} />
    </>
  );
};

export default Pedidos;
