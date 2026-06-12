export type CategoriaFornecedor =
  | "Material"
  | "Quentinha"
  | "Equipamento"
  | "Serviço"
  | "Entulho"
  | "Outros";

export type TipoPix = "Telefone" | "CPF" | "CNPJ" | "E-mail" | "Aleatória";

export interface Fornecedor {
  id: number;
  nome: string;
  categoria: CategoriaFornecedor;
  contato?: string;
  chavePix?: string;
  tipoPix?: TipoPix;
  banco?: string;
  observacoes?: string;
}

export interface NovoFornecedorData {
  nome: string;
  categoria: CategoriaFornecedor;
  contato?: string;
  chavePix?: string;
  tipoPix?: TipoPix;
  banco?: string;
  observacoes?: string;
}
