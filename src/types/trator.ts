export interface Trator {
  id: number;
  status: "Disponível" | "Reservado" | "Vendido" | "Em trânsito";
  cotacao: string;
  chassi: string;
  filial: string;
  valor: number;
  dataEntrada: string;
  pdfPath: string;
}
