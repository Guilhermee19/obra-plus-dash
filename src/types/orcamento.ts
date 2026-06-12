import { Entidade } from "@/types/financeiro";

export type StatusOrcamento = "Rascunho" | "Enviado" | "Aprovado" | "Recusado";

export interface ItemOrcamento {
  id: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  valorUnitario: number;
}

export interface Orcamento {
  id: number;
  numero: string;
  cliente: string;
  obra?: string;
  bairro?: string;
  entidade: Entidade;
  dataEmissao: string;
  validade: string;
  status: StatusOrcamento;
  itens: ItemOrcamento[];
  observacoes?: string;
}

export const totalItem = (i: ItemOrcamento): number =>
  (Number(i.quantidade) || 0) * (Number(i.valorUnitario) || 0);

export const totalOrcamento = (o: Orcamento): number =>
  o.itens.reduce((s, i) => s + totalItem(i), 0);
