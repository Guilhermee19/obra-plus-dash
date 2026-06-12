import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DespesaMensal } from "@/types/financeiro";
import { criarDespesa, atualizarDespesa, CATEGORIAS_DESPESA } from "@/services/financeiroService";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  despesa?: DespesaMensal | null;
  onSaved: () => void;
}

const vazio = {
  mes: "",
  data: "",
  categoria: "Administrativo",
  conta: "ARF",
  descricao: "",
  valor: 0,
};

const DespesaDialog = ({ open, onOpenChange, despesa, onSaved }: Props) => {
  const { toast } = useToast();
  const [form, setForm] = useState(vazio);
  const editando = !!despesa;

  useEffect(() => {
    if (despesa) {
      setForm({
        mes: despesa.mes,
        data: despesa.data,
        categoria: despesa.categoria,
        conta: despesa.conta,
        descricao: despesa.descricao,
        valor: despesa.valor,
      });
    } else {
      setForm(vazio);
    }
  }, [despesa, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, valor: Number(form.valor) || 0 };
    if (editando && despesa) {
      atualizarDespesa(despesa.id, payload);
      toast({ title: "Despesa atualizada" });
    } else {
      criarDespesa(payload);
      toast({ title: "Despesa cadastrada" });
    }
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar Despesa" : "Nova Despesa"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="desc">Descrição *</Label>
              <Input id="desc" value={form.descricao} required
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Ex: Seguro do carro" />
            </div>
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIAS_DESPESA.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Conta *</Label>
              <Select value={form.conta} onValueChange={(v) => setForm({ ...form, conta: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARF">ARF</SelectItem>
                  <SelectItem value="Manu">Manu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data">Data *</Label>
              <Input id="data" type="date" value={form.data} required
                onChange={(e) => setForm({ ...form, data: e.target.value, mes: e.target.value ? `${e.target.value.slice(5,7)}/${e.target.value.slice(0,4)}` : form.mes })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input id="valor" type="number" step="0.01" value={form.valor} required
                onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">{editando ? "Salvar" : "Cadastrar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DespesaDialog;
