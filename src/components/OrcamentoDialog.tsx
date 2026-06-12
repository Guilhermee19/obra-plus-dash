import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Orcamento, ItemOrcamento, StatusOrcamento, totalItem } from "@/types/orcamento";
import { Entidade } from "@/types/financeiro";
import { criarOrcamento, atualizarOrcamento } from "@/services/orcamentoService";
import { formatBRL } from "@/lib/format";

const STATUS: StatusOrcamento[] = ["Rascunho", "Enviado", "Aprovado", "Recusado"];
const ENTIDADES: Entidade[] = ["ARF", "Manu", "Sem nota"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orcamento?: Orcamento | null;
  onSaved: () => void;
}

const itemVazio = (): ItemOrcamento => ({
  id: Math.random().toString(36).slice(2, 8),
  descricao: "",
  unidade: "vb",
  quantidade: 1,
  valorUnitario: 0,
});

const base = () => ({
  cliente: "",
  obra: "",
  bairro: "",
  entidade: "ARF" as Entidade,
  dataEmissao: "",
  validade: "",
  status: "Rascunho" as StatusOrcamento,
  observacoes: "",
});

const OrcamentoDialog = ({ open, onOpenChange, orcamento, onSaved }: Props) => {
  const { toast } = useToast();
  const [form, setForm] = useState(base());
  const [itens, setItens] = useState<ItemOrcamento[]>([itemVazio()]);
  const editando = !!orcamento;

  useEffect(() => {
    if (orcamento) {
      setForm({
        cliente: orcamento.cliente,
        obra: orcamento.obra ?? "",
        bairro: orcamento.bairro ?? "",
        entidade: orcamento.entidade,
        dataEmissao: orcamento.dataEmissao,
        validade: orcamento.validade,
        status: orcamento.status,
        observacoes: orcamento.observacoes ?? "",
      });
      setItens(orcamento.itens.length ? orcamento.itens : [itemVazio()]);
    } else {
      setForm(base());
      setItens([itemVazio()]);
    }
  }, [orcamento, open]);

  const setItem = (id: string, campo: keyof ItemOrcamento, valor: string | number) =>
    setItens((prev) => prev.map((i) => (i.id === id ? { ...i, [campo]: valor } : i)));
  const addItem = () => setItens((prev) => [...prev, itemVazio()]);
  const removeItem = (id: string) =>
    setItens((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));

  const total = itens.reduce((s, i) => s + totalItem(i), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      cliente: form.cliente,
      obra: form.obra || undefined,
      bairro: form.bairro || undefined,
      entidade: form.entidade,
      dataEmissao: form.dataEmissao,
      validade: form.validade,
      status: form.status,
      observacoes: form.observacoes || undefined,
      itens: itens.map((i) => ({ ...i, quantidade: Number(i.quantidade) || 0, valorUnitario: Number(i.valorUnitario) || 0 })),
    };
    if (editando && orcamento) {
      atualizarOrcamento(orcamento.id, payload);
      toast({ title: "Orçamento atualizado", description: orcamento.numero });
    } else {
      criarOrcamento(payload);
      toast({ title: "Orçamento criado", description: form.cliente });
    }
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editando ? `Editar ${orcamento?.numero}` : "Novo Orçamento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dados gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente *</Label>
              <Input id="cliente" value={form.cliente} required
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                placeholder="Nome do cliente" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="obra">Obra</Label>
              <Input id="obra" value={form.obra}
                onChange={(e) => setForm({ ...form, obra: e.target.value })}
                placeholder="Ex: São Conrado 1500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input id="bairro" value={form.bairro}
                onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                placeholder="Ex: Leblon" />
            </div>
            <div className="space-y-2">
              <Label>Entidade</Label>
              <Select value={form.entidade} onValueChange={(v: Entidade) => setForm({ ...form, entidade: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ENTIDADES.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emissao">Data de emissão *</Label>
              <Input id="emissao" type="date" value={form.dataEmissao} required
                onChange={(e) => setForm({ ...form, dataEmissao: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validade">Validade</Label>
              <Input id="validade" type="date" value={form.validade}
                onChange={(e) => setForm({ ...form, validade: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: StatusOrcamento) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Itens */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Itens do orçamento</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" /> Adicionar item
              </Button>
            </div>

            <div className="space-y-2">
              {itens.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end border rounded-lg p-2 bg-muted/30">
                  <div className="col-span-12 sm:col-span-5 space-y-1">
                    <Label className="text-xs text-muted-foreground">Descrição</Label>
                    <Input value={item.descricao} className="text-sm"
                      onChange={(e) => setItem(item.id, "descricao", e.target.value)}
                      placeholder="Ex: Alvenaria" />
                  </div>
                  <div className="col-span-3 sm:col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Unid.</Label>
                    <Input value={item.unidade} className="text-sm"
                      onChange={(e) => setItem(item.id, "unidade", e.target.value)}
                      placeholder="m²" />
                  </div>
                  <div className="col-span-4 sm:col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Qtd.</Label>
                    <Input type="number" step="0.01" value={item.quantidade} className="text-sm"
                      onChange={(e) => setItem(item.id, "quantidade", Number(e.target.value))} />
                  </div>
                  <div className="col-span-5 sm:col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Valor unit.</Label>
                    <Input type="number" step="0.01" value={item.valorUnitario} className="text-sm"
                      onChange={(e) => setItem(item.id, "valorUnitario", Number(e.target.value))} />
                  </div>
                  <div className="col-span-12 sm:col-span-1 flex justify-between sm:justify-end items-center">
                    <span className="text-xs font-medium sm:hidden">{formatBRL(totalItem(item))}</span>
                    <Button type="button" variant="ghost" size="icon" className="text-expense"
                      onClick={() => removeItem(item.id)} disabled={itens.length === 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end items-center gap-2 pt-1">
              <span className="text-sm text-muted-foreground">Total do orçamento:</span>
              <span className="text-lg font-bold text-primary">{formatBRL(total)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="obs">Observações</Label>
            <Textarea id="obs" value={form.observacoes} rows={2}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              placeholder="Condições, prazos, escopo..." />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">{editando ? "Salvar Alterações" : "Criar Orçamento"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrcamentoDialog;
