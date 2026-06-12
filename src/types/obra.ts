export interface TabelaConfig {
  id: string;
  nome: string;
  tipo: "entrada" | "saida";
}

export interface ConfiguracaoTabelas {
  entradas: TabelaConfig[];
  saidas: TabelaConfig[];
}

export interface Transacao {
  id: number;
  data: string;
  tipo: "Entrada" | "Saída";
  descricao: string;
  valor: number;
  obraId: number;
  tabelaId: string; // ID da tabela específica
}

export interface Obra {
  id: number;
  nome: string;
  cliente: string;
  status: string;
  progresso: number;
  localizacao: string;
  dataInicio: string;
  dataPrevista: string;
  responsavel: string;
  entidade?: "ARF" | "Manu" | "Sem nota";
  valorOrcado?: number;
  configuracaoTabelas: ConfiguracaoTabelas;
}

export interface NovaObraData {
  nome: string;
  cliente: string;
  localizacao: string;
  responsavel: string;
  dataInicio: string;
  dataPrevista: string;
  entidade?: "ARF" | "Manu" | "Sem nota";
  valorOrcado?: number;
  configuracaoTabelas: ConfiguracaoTabelas;
}