import { Orcamento } from "@/types/orcamento";

const KEY = "orcamentos_data";

const SEED: Orcamento[] = [
  {
    id: 1,
    numero: "ORC-2026-001",
    cliente: "Patricia Geyer",
    obra: "São Conrado 1500",
    bairro: "São Conrado",
    entidade: "ARF",
    dataEmissao: "2025-10-28",
    validade: "2025-11-28",
    status: "Aprovado",
    observacoes: "Reforma completa do apartamento, 3 quartos.",
    itens: [
      { id: "i1", descricao: "Demolição e remoção de entulho", unidade: "vb", quantidade: 1, valorUnitario: 38000 },
      { id: "i2", descricao: "Alvenaria e contrapiso", unidade: "m²", quantidade: 120, valorUnitario: 280 },
      { id: "i3", descricao: "Instalações elétricas", unidade: "vb", quantidade: 1, valorUnitario: 52000 },
      { id: "i4", descricao: "Instalações hidráulicas", unidade: "vb", quantidade: 1, valorUnitario: 41000 },
      { id: "i5", descricao: "Revestimentos e acabamento", unidade: "m²", quantidade: 120, valorUnitario: 520 },
    ],
  },
  {
    id: 2,
    numero: "ORC-2026-002",
    cliente: "Renata Medeiros",
    obra: "Leblon 180",
    bairro: "Leblon",
    entidade: "ARF",
    dataEmissao: "2026-01-12",
    validade: "2026-02-12",
    status: "Aprovado",
    itens: [
      { id: "i1", descricao: "Demolição", unidade: "vb", quantidade: 1, valorUnitario: 22000 },
      { id: "i2", descricao: "Marcenaria planejada", unidade: "vb", quantidade: 1, valorUnitario: 95000 },
      { id: "i3", descricao: "Pintura geral", unidade: "m²", quantidade: 210, valorUnitario: 65 },
    ],
  },
  {
    id: 3,
    numero: "ORC-2026-003",
    cliente: "Antony Edward",
    obra: "Condomínio 900",
    bairro: "São Conrado",
    entidade: "Manu",
    dataEmissao: "2026-04-30",
    validade: "2026-05-30",
    status: "Enviado",
    observacoes: "Aguardando retorno do cliente.",
    itens: [
      { id: "i1", descricao: "Área comum - piso", unidade: "m²", quantidade: 300, valorUnitario: 180 },
      { id: "i2", descricao: "Pintura fachada", unidade: "m²", quantidade: 450, valorUnitario: 95 },
      { id: "i3", descricao: "Impermeabilização laje", unidade: "m²", quantidade: 200, valorUnitario: 140 },
    ],
  },
  {
    id: 4,
    numero: "ORC-2026-004",
    cliente: "Marina Coutinho",
    obra: "Ipanema 88",
    bairro: "Ipanema",
    entidade: "ARF",
    dataEmissao: "2026-05-20",
    validade: "2026-06-20",
    status: "Rascunho",
    itens: [
      { id: "i1", descricao: "Reforma de banheiro", unidade: "un", quantidade: 2, valorUnitario: 18000 },
    ],
  },
];

function load(): Orcamento[] {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(KEY, JSON.stringify(SEED));
  return SEED;
}
function save(l: Orcamento[]) {
  localStorage.setItem(KEY, JSON.stringify(l));
}

export const obterOrcamentos = (): Orcamento[] => load();
export const obterOrcamentoPorId = (id: number): Orcamento | undefined =>
  load().find((o) => o.id === id);

const nextId = (l: Orcamento[]) => (l.length ? Math.max(...l.map((x) => x.id)) + 1 : 1);
const proximoNumero = (l: Orcamento[]) => {
  const ano = new Date().getFullYear();
  const seq = l.filter((o) => o.numero.includes(`-${ano}-`)).length + 1;
  return `ORC-${ano}-${String(seq).padStart(3, "0")}`;
};

export const criarOrcamento = (data: Omit<Orcamento, "id" | "numero">): Orcamento => {
  const l = load();
  const novo: Orcamento = { ...data, id: nextId(l), numero: proximoNumero(l) };
  l.push(novo);
  save(l);
  return novo;
};

export const atualizarOrcamento = (id: number, data: Partial<Orcamento>): void => {
  const l = load();
  const i = l.findIndex((o) => o.id === id);
  if (i >= 0) {
    l[i] = { ...l[i], ...data };
    save(l);
  }
};

export const removerOrcamento = (id: number): void => {
  save(load().filter((o) => o.id !== id));
};
