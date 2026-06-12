export const formatBRL = (valor: number): string =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatData = (iso?: string | null): string => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
};
