export type DiaSemana = "seg" | "ter" | "qua" | "qui" | "sex" | "sab";

export const DIAS_SEMANA: { key: DiaSemana; label: string }[] = [
  { key: "seg", label: "S" },
  { key: "ter", label: "T" },
  { key: "qua", label: "Q" },
  { key: "qui", label: "Q" },
  { key: "sex", label: "S" },
  { key: "sab", label: "S" },
];

export interface RegistroSemana {
  funcionarioId: number;
  obraId: number;
  presenca: Record<DiaSemana, boolean>;
}

export interface DespesaSemanaObra {
  id: string;
  obraId: number;
  descricao: string;
  valor: number;
}

export interface FolhaSemana {
  id: number;
  label: string; // ex.: "06/06 a 12/06"
  inicio: string;
  fim: string;
  registros: RegistroSemana[];
  despesas: DespesaSemanaObra[];
}
