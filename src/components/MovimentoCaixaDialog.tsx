import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Entidade } from "@/types/financeiro";
import { criarMovimento } from "@/services/financeiroService";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

const vazio = {
  conta: "ARF" as Entidade,
  data: "",
  descricao: "",
  tipo: "Crédito" as "Crédito" | "Débito",
  valor: 0,
  obra: "",
};

const MovimentoCaixaDialog = ({ open, onOpenChange, onSaved }: Props) => {
  const { toast } = useToast();
  const [form, setForm] = useState(vazio);

  useEffect(() => {
    if (open) setForm(vazio);
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    criarMovimento({
      conta: form.conta,
      data: form.data,
      descricao: form.descricao,
      tipo: form.tipo,
      valor: Number(form.valor) || 0,
      obra: form.obra || undefined,
    });
    toast({ title: "Lançamento adicionado" });
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Lançamento no Caixa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Conta *</Label>
              <Select value={form.conta} onValueChange={(v: Entidade) => setForm({ ...form, conta: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARF">ARF</SelectItem>
                  <SelectItem value="Manu">Manu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo *</Label>
              <Select value={form.tipo} onValueChange={(v: "Crédito" | "Débito") => setForm({ ...form, tipo: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Crédito">Crédito (entrada)</SelectItem>
                  <SelectItem value="Débito">Débito (saída)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="desc">Descrição *</Label>
              <Input id="desc" value={form.descricao} required
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Ex: Pix recebido - cliente" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data *</Label>
              <Input id="data" type="date" value={form.data} required
                onChange={(e) => setForm({ ...form, data: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input id="valor" type="number" step="0.01" value={form.valor} required
                onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="obra">Obra (opcional)</Label>
              <Input id="obra" value={form.obra}
                onChange={(e) => setForm({ ...form, obra: e.target.value })}
                placeholder="Ex: Leblon 180" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Adicionar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MovimentoCaixaDialog;
