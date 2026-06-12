import { Funcionario, NovoFuncionarioData } from "@/types/funcionario";

const KEY = "funcionarios_data";

// Seed baseado na planilha "DIÁRIA DE FUNCIONÁRIOS" (valores e cargos representativos)
const SEED: Funcionario[] = [
  { id: 1, nome: "Jorge Luiz", cargo: "Encanador", diaria: 322.69, encargos: 45, quentinha: 21, chavePix: "(21) 9 0000-0001", banco: "Bradesco", ativo: true },
  { id: 2, nome: "Marcio Rocha", cargo: "Ladrilheiro", diaria: 356.29, encargos: 45, quentinha: 21, chavePix: "(21) 9 0000-0002", banco: "Itaú", ativo: true },
  { id: 3, nome: "Ronaldo Joaquim", cargo: "Eletricista", diaria: 307.15, encargos: 45, quentinha: 21, chavePix: "(21) 9 0000-0003", banco: "Nubank", ativo: true },
  { id: 4, nome: "Italo Mariano", cargo: "Eletricista", diaria: 247.18, encargos: 45, quentinha: 21, chavePix: "(21) 9 0000-0004", banco: "Caixa", ativo: true },
  { id: 5, nome: "Ronaldo Santos", cargo: "Ajudante", diaria: 174.99, encargos: 45, quentinha: 21, chavePix: "(21) 9 0000-0005", banco: "Mercado Pago", ativo: true },
  { id: 6, nome: "José Rosinaldo", cargo: "Pedreiro", diaria: 247.18, encargos: 45, quentinha: 21, chavePix: "(21) 9 0000-0006", banco: "Bradesco", ativo: true },
  { id: 7, nome: "Bernardo", cargo: "Pedreiro", diaria: 200.0, encargos: 30, quentinha: 21, chavePix: "(21) 9 0000-0007", banco: "Itaú", ativo: true },
  { id: 8, nome: "José Reginaldo", cargo: "Servente", diaria: 178.3, encargos: 30, quentinha: 21, chavePix: "(21) 9 0000-0008", banco: "Caixa", ativo: true },
  { id: 9, nome: "Nilson", cargo: "Servente", diaria: 164.0, encargos: 30, quentinha: 21, chavePix: "(21) 9 0000-0009", banco: "Nubank", ativo: true },
  { id: 10, nome: "Marcos", cargo: "Pintor", diaria: 220.0, encargos: 30, quentinha: 21, chavePix: "(21) 9 0000-0010", banco: "Bradesco", ativo: true },
  { id: 11, nome: "André", cargo: "Pintor", diaria: 200.0, encargos: 30, quentinha: 21, chavePix: "(21) 9 0000-0011", banco: "Itaú", ativo: true },
  { id: 12, nome: "Cezar", cargo: "Mestre de Obras", diaria: 268.0, encargos: 45, quentinha: 21, chavePix: "(21) 9 0000-0012", banco: "Caixa", ativo: false },
];

function load(): Funcionario[] {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(KEY, JSON.stringify(SEED));
  return SEED;
}

function save(list: Funcionario[]): void {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export const obterFuncionarios = (): Funcionario[] => load();

export const obterFuncionarioPorId = (id: number): Funcionario | undefined =>
  load().find((f) => f.id === id);

export const totalDiaria = (f: Funcionario): number =>
  f.diaria + f.encargos + f.quentinha;

export const criarFuncionario = (data: NovoFuncionarioData): Funcionario => {
  const list = load();
  const novo: Funcionario = {
    id: list.length ? Math.max(...list.map((f) => f.id)) + 1 : 1,
    ativo: true,
    ...data,
  };
  list.push(novo);
  save(list);
  return novo;
};

export const atualizarFuncionario = (id: number, data: Partial<Funcionario>): void => {
  const list = load();
  const i = list.findIndex((f) => f.id === id);
  if (i >= 0) {
    list[i] = { ...list[i], ...data };
    save(list);
  }
};

export const removerFuncionario = (id: number): void => {
  save(load().filter((f) => f.id !== id));
};
