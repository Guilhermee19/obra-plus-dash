export type Cargo =
  | "Pedreiro"
  | "Servente"
  | "Eletricista"
  | "Ajudante"
  | "Pintor"
  | "Ladrilheiro"
  | "Encanador"
  | "Mestre de Obras";

export interface Funcionario {
  id: number;
  nome: string;
  cargo: Cargo;
  diaria: number;
  encargos: number;
  quentinha: number;
  chavePix?: string;
  banco?: string;
  ativo: boolean;
}

export interface NovoFuncionarioData {
  nome: string;
  cargo: Cargo;
  diaria: number;
  encargos: number;
  quentinha: number;
  chavePix?: string;
  banco?: string;
}
