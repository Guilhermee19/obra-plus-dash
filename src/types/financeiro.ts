export type Entidade = "ARF" | "Manu" | "Sem nota";

export interface NotaFiscal {
  id: number;
  entidade: Entidade;
  cliente: string;
  obra?: string;
  dataEmissao: string;
  competencia: string; // MM/AAAA
  dataPagamento?: string | null; // null = a receber
  valor: number;
}

export interface DespesaMensal {
  id: number;
  mes: string; // MM/AAAA
  categoria: string;
  conta: string;
  data: string;
  descricao: string;
  valor: number;
}

export interface Parcela {
  numero: number;
  vencimento: string;
  valor: number;
  pago: boolean;
}

export interface Emprestimo {
  id: number;
  banco: string;
  tipo: string;
  taxa: string;
  parcelas: Parcela[];
}

export interface MovimentoCaixa {
  id: number;
  conta: Entidade;
  data: string;
  descricao: string;
  tipo: "Crédito" | "Débito";
  valor: number;
  obra?: string;
}
