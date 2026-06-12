import { NotaFiscal, DespesaMensal, Emprestimo, MovimentoCaixa, Entidade } from "@/types/financeiro";

const K_NOTAS = "notas_fiscais_data";
const K_DESP = "despesas_mensais_data";
const K_EMP = "emprestimos_data";
const K_CAIXA = "caixa_data";

// ---------- NOTAS FISCAIS (ARF / Manu) ----------
const SEED_NOTAS: NotaFiscal[] = [
  { id: 1, entidade: "ARF", cliente: "Octávio A. Neto", obra: "Gávea 19", dataEmissao: "2026-01-18", competencia: "01/2026", dataPagamento: "2026-02-05", valor: 12000 },
  { id: 2, entidade: "ARF", cliente: "Beatriz L.", obra: "Leblon 127", dataEmissao: "2026-02-10", competencia: "02/2026", dataPagamento: "2026-03-02", valor: 12000 },
  { id: 3, entidade: "ARF", cliente: "Patricia G.", obra: "São Conrado 1500", dataEmissao: "2026-03-15", competencia: "03/2026", dataPagamento: null, valor: 18500 },
  { id: 4, entidade: "Manu", cliente: "Flora B.", obra: "Aterro do Flamengo 170", dataEmissao: "2026-03-20", competencia: "03/2026", dataPagamento: "2026-04-10", valor: 9000 },
  { id: 5, entidade: "Manu", cliente: "Antony E.", obra: "Condomínio 900", dataEmissao: "2026-04-05", competencia: "04/2026", dataPagamento: null, valor: 15000 },
  { id: 6, entidade: "ARF", cliente: "Cecília S.", obra: "São Conrado 1200", dataEmissao: "2026-04-22", competencia: "04/2026", dataPagamento: null, valor: 22000 },
  { id: 7, entidade: "Sem nota", cliente: "Renata M.", obra: "Leblon 180", dataEmissao: "2026-05-02", competencia: "05/2026", dataPagamento: "2026-05-02", valor: 8000 },
];

// ---------- DESPESAS MENSAIS (custos fixos) ----------
const SEED_DESP: DespesaMensal[] = [
  { id: 1, mes: "05/2026", categoria: "Encargos/INSS", conta: "ARF", data: "2026-05-06", descricao: "INSS Pedreiro/Servente", valor: 1850 },
  { id: 2, mes: "05/2026", categoria: "Veículo", conta: "ARF", data: "2026-05-07", descricao: "Gasolina / GNV", valor: 920 },
  { id: 3, mes: "05/2026", categoria: "Veículo", conta: "ARF", data: "2026-05-14", descricao: "Seguro do carro", valor: 480 },
  { id: 4, mes: "05/2026", categoria: "Bancário", conta: "ARF", data: "2026-05-02", descricao: "Tarifa bancária", valor: 89 },
  { id: 5, mes: "05/2026", categoria: "Administrativo", conta: "ARF", data: "2026-05-10", descricao: "Aluguel e garagem", valor: 2600 },
  { id: 6, mes: "05/2026", categoria: "Administrativo", conta: "ARF", data: "2026-05-26", descricao: "Contadora", valor: 650 },
  { id: 7, mes: "05/2026", categoria: "Veículo", conta: "ARF", data: "2026-05-14", descricao: "Pedágio", valor: 140 },
  { id: 8, mes: "04/2026", categoria: "Encargos/INSS", conta: "ARF", data: "2026-04-06", descricao: "INSS Pedreiro/Servente", valor: 1790 },
  { id: 9, mes: "04/2026", categoria: "Cartão", conta: "ARF", data: "2026-04-18", descricao: "Cartão empresa", valor: 3200 },
];

// ---------- EMPRÉSTIMOS ----------
const SEED_EMP: Emprestimo[] = [
  {
    id: 1,
    banco: "Banco do Brasil",
    tipo: "GIRO PRONAMPE",
    taxa: "Selic + 0,49% a.m.",
    parcelas: Array.from({ length: 12 }, (_, i) => ({
      numero: i + 1,
      vencimento: `2025-${String(((8 + i) % 12) + 1).padStart(2, "0")}-27`,
      valor: 1347.69,
      pago: i < 9,
    })),
  },
];

// ---------- CAIXA (extratos ARF / Manu) ----------
const SEED_CAIXA: MovimentoCaixa[] = [
  { id: 1, conta: "ARF", data: "2026-06-02", descricao: "Saldo anterior", tipo: "Crédito", valor: 114009.66 },
  { id: 2, conta: "ARF", data: "2026-06-02", descricao: "Pix recebido - cliente Paola", tipo: "Crédito", valor: 88500, obra: "São Conrado 1500" },
  { id: 3, conta: "ARF", data: "2026-06-03", descricao: "Pix enviado - Pulini Entulho", tipo: "Débito", valor: 1920, obra: "Aterro do Flamengo 170" },
  { id: 4, conta: "ARF", data: "2026-06-03", descricao: "Leroy Merlin - material", tipo: "Débito", valor: 4380, obra: "Leblon 180" },
  { id: 5, conta: "ARF", data: "2026-06-05", descricao: "Folha semanal", tipo: "Débito", valor: 18760 },
  { id: 6, conta: "Manu", data: "2026-06-02", descricao: "Saldo anterior", tipo: "Crédito", valor: 42300 },
  { id: 7, conta: "Manu", data: "2026-06-10", descricao: "Pix recebido - Flora", tipo: "Crédito", valor: 9000, obra: "Aterro do Flamengo 170" },
];

function loader<T>(key: string, seed: T[]): T[] {
  const raw = localStorage.getItem(key);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

export const obterNotas = (): NotaFiscal[] => loader(K_NOTAS, SEED_NOTAS);
export const obterDespesas = (): DespesaMensal[] => loader(K_DESP, SEED_DESP);
export const obterEmprestimos = (): Emprestimo[] => loader(K_EMP, SEED_EMP);
export const obterCaixa = (): MovimentoCaixa[] => loader(K_CAIXA, SEED_CAIXA);

// resumos
export const totalAReceber = (): number =>
  obterNotas().filter((n) => !n.dataPagamento).reduce((s, n) => s + n.valor, 0);

export const totalRecebido = (): number =>
  obterNotas().filter((n) => n.dataPagamento).reduce((s, n) => s + n.valor, 0);

export const saldoConta = (conta: Entidade): number =>
  obterCaixa()
    .filter((m) => m.conta === conta)
    .reduce((s, m) => s + (m.tipo === "Crédito" ? m.valor : -m.valor), 0);

export const saldoBancoTotal = (): number =>
  saldoConta("ARF") + saldoConta("Manu");

export const totalAPagarEmprestimos = (): number =>
  obterEmprestimos()
    .flatMap((e) => e.parcelas)
    .filter((p) => !p.pago)
    .reduce((s, p) => s + p.valor, 0);

export const totalDespesasMes = (mes: string): number =>
  obterDespesas().filter((d) => d.mes === mes).reduce((s, d) => s + d.valor, 0);
