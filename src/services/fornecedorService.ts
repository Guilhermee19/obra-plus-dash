import { Fornecedor, NovoFornecedorData } from "@/types/fornecedor";

const KEY = "fornecedores_data";

// Seed baseado nas planilhas "Quentinhas" e "Dados para pix" (PIX fictícios)
const SEED: Fornecedor[] = [
  { id: 1, nome: "Leroy Merlin", categoria: "Material", contato: "(21) 4003-0000", chavePix: "00.000.000/0001-00", tipoPix: "CNPJ", banco: "Itaú", observacoes: "Material de construção em geral" },
  { id: 2, nome: "Pulini Entulho", categoria: "Entulho", contato: "(21) 9 0000-0101", chavePix: "(21) 9 0000-0101", tipoPix: "Telefone", banco: "Bradesco", observacoes: "Caçamba e remoção de entulho" },
  { id: 3, nome: "Quentinhas da Dona Maria", categoria: "Quentinha", contato: "(21) 9 0000-0102", chavePix: "(21) 9 0000-0102", tipoPix: "Telefone", banco: "Nubank", observacoes: "Marmitas R$ 21 - entrega nas obras" },
  { id: 4, nome: "Casa do Construtor", categoria: "Equipamento", contato: "(21) 4004-1111", chavePix: "11.111.111/0001-11", tipoPix: "CNPJ", banco: "Santander", observacoes: "Locação de andaimes e betoneiras" },
  { id: 5, nome: "Telha Norte", categoria: "Material", contato: "(21) 4002-2222", chavePix: "vendas@telhanorte.exemplo", tipoPix: "E-mail", banco: "Itaú" },
  { id: 6, nome: "Elétrica Center", categoria: "Material", contato: "(21) 9 0000-0103", chavePix: "(21) 9 0000-0103", tipoPix: "Telefone", banco: "Caixa", observacoes: "Material elétrico" },
  { id: 7, nome: "Marcenaria Bom Corte", categoria: "Serviço", contato: "(21) 9 0000-0104", chavePix: "000.000.000-00", tipoPix: "CPF", banco: "Bradesco", observacoes: "Móveis planejados (terceirizado)" },
  { id: 8, nome: "Vidraçaria Cristal", categoria: "Serviço", contato: "(21) 9 0000-0105", chavePix: "a1b2c3d4-0000-0000-0000-000000000000", tipoPix: "Aleatória", banco: "Inter" },
];

function load(): Fornecedor[] {
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(KEY, JSON.stringify(SEED));
  return SEED;
}
function save(l: Fornecedor[]) {
  localStorage.setItem(KEY, JSON.stringify(l));
}

export const obterFornecedores = (): Fornecedor[] => load();

export const criarFornecedor = (data: NovoFornecedorData): Fornecedor => {
  const l = load();
  const novo: Fornecedor = { id: l.length ? Math.max(...l.map((f) => f.id)) + 1 : 1, ...data };
  l.push(novo);
  save(l);
  return novo;
};

export const atualizarFornecedor = (id: number, data: Partial<Fornecedor>): void => {
  const l = load();
  const i = l.findIndex((f) => f.id === id);
  if (i >= 0) {
    l[i] = { ...l[i], ...data };
    save(l);
  }
};

export const removerFornecedor = (id: number): void => {
  save(load().filter((f) => f.id !== id));
};

export const CATEGORIAS_FORNECEDOR = [
  "Material",
  "Quentinha",
  "Equipamento",
  "Serviço",
  "Entulho",
  "Outros",
] as const;
