import { FolhaSemana, DiaSemana } from "@/types/folha";
import { obterFuncionarios, totalDiaria } from "@/services/funcionarioService";

const KEY = "folha_semanal_data";

const vazio = (): Record<DiaSemana, boolean> => ({
  seg: false, ter: false, qua: false, qui: false, sex: false, sab: false,
});
const dias = (...d: DiaSemana[]): Record<DiaSemana, boolean> => {
  const p = vazio();
  d.forEach((x) => (p[x] = true));
  return p;
};

// Seed baseado em "2026 Despesa da Semana": semana com várias obras e equipes
const SEED: FolhaSemana[] = [
  {
    id: 1,
    label: "08/06 a 13/06",
    inicio: "2026-06-08",
    fim: "2026-06-13",
    registros: [
      // Obra 1 - São Conrado 1500
      { funcionarioId: 7, obraId: 1, presenca: dias("seg", "ter", "qua", "qui", "sex") },
      { funcionarioId: 8, obraId: 1, presenca: dias("seg", "ter", "qua", "qui", "sex") },
      { funcionarioId: 2, obraId: 1, presenca: dias("seg", "ter", "qua") },
      { funcionarioId: 9, obraId: 1, presenca: dias("seg", "ter", "qua", "qui", "sex", "sab") },
      // Obra 2 - Aterro do Flamengo
      { funcionarioId: 3, obraId: 2, presenca: dias("seg", "ter", "qua", "qui", "sex") },
      { funcionarioId: 4, obraId: 2, presenca: dias("seg", "ter", "qua", "qui") },
      { funcionarioId: 5, obraId: 2, presenca: dias("seg", "ter", "qua", "qui", "sex") },
      // Obra 3 - Leblon 180
      { funcionarioId: 10, obraId: 3, presenca: dias("seg", "ter", "qua", "qui", "sex") },
      { funcionarioId: 11, obraId: 3, presenca: dias("ter", "qua", "qui", "sex") },
      { funcionarioId: 6, obraId: 3, presenca: dias("seg", "ter", "qua", "qui", "sex") },
    ],
    despesas: [
      { id: "d1", obraId: 1, descricao: "Quentinhas", valor: 630 },
      { id: "d2", obraId: 1, descricao: "Carro / combustível", valor: 280 },
      { id: "d3", obraId: 2, descricao: "Quentinhas", valor: 420 },
      { id: "d4", obraId: 2, descricao: "Pedágio", valor: 90 },
      { id: "d5", obraId: 3, descricao: "Quentinhas", valor: 525 },
      { id: "d6", obraId: 3, descricao: "Aluguel equipamento", valor: 350 },
    ],
  },
  {
    id: 2,
    label: "01/06 a 06/06",
    inicio: "2026-06-01",
    fim: "2026-06-06",
    registros: [
      { funcionarioId: 7, obraId: 1, presenca: dias("seg", "ter", "qua", "qui", "sex") },
      { funcionarioId: 8, obraId: 1, presenca: dias("seg", "ter", "qua", "qui") },
      { funcionarioId: 3, obraId: 2, presenca: dias("seg", "ter", "qua", "qui", "sex") },
      { funcionarioId: 5, obraId: 2, presenca: dias("seg", "ter", "qua", "qui", "sex", "sab") },
      { funcionarioId: 10, obraId: 3, presenca: dias("seg", "ter", "qua", "qui", "sex") },
      { funcionarioId: 6, obraId: 3, presenca: dias("seg", "ter", "qua") },
    ],
    despesas: [
      { id: "d1", obraId: 1, descricao: "Quentinhas", valor: 420 },
      { id: "d2", obraId: 2, descricao: "Quentinhas", valor: 480 },
      { id: "d3", obraId: 3, descricao: "Quentinhas", valor: 336 },
    ],
  },
];

function load(): FolhaSemana[] {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(KEY, JSON.stringify(SEED));
  return SEED;
}
function save(list: FolhaSemana[]): void {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export const obterSemanas = (): FolhaSemana[] => load();
export const obterSemanaPorId = (id: number): FolhaSemana | undefined =>
  load().find((s) => s.id === id);

export const diasTrabalhados = (presenca: Record<DiaSemana, boolean>): number =>
  Object.values(presenca).filter(Boolean).length;

// valor a pagar de um registro = dias * (diaria + quentinha)
export const valorRegistro = (funcionarioId: number, presenca: Record<DiaSemana, boolean>): number => {
  const f = obterFuncionarios().find((x) => x.id === funcionarioId);
  if (!f) return 0;
  return diasTrabalhados(presenca) * (f.diaria + f.quentinha);
};

export const salvarSemana = (semana: FolhaSemana): void => {
  const list = load();
  const i = list.findIndex((s) => s.id === semana.id);
  if (i >= 0) list[i] = semana;
  else list.push(semana);
  save(list);
};

export const togglePresenca = (
  semanaId: number,
  funcionarioId: number,
  obraId: number,
  dia: DiaSemana
): void => {
  const list = load();
  const semana = list.find((s) => s.id === semanaId);
  if (!semana) return;
  const reg = semana.registros.find(
    (r) => r.funcionarioId === funcionarioId && r.obraId === obraId
  );
  if (reg) {
    reg.presenca[dia] = !reg.presenca[dia];
    save(list);
  }
};

// totais por obra dentro de uma semana
export const resumoSemanaPorObra = (semana: FolhaSemana, obraId: number) => {
  const regs = semana.registros.filter((r) => r.obraId === obraId);
  const maoDeObra = regs.reduce((s, r) => s + valorRegistro(r.funcionarioId, r.presenca), 0);
  const despesas = semana.despesas
    .filter((d) => d.obraId === obraId)
    .reduce((s, d) => s + d.valor, 0);
  return { maoDeObra, despesas, total: maoDeObra + despesas, qtd: regs.length };
};

export const totalSemana = (semana: FolhaSemana): number => {
  const obras = [...new Set(semana.registros.map((r) => r.obraId))];
  return obras.reduce((s, o) => s + resumoSemanaPorObra(semana, o).total, 0);
};
