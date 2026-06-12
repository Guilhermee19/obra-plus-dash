import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { NotaFiscal, Entidade } from "@/types/financeiro";
import { criarNota, atualizarNota } from "@/services/financeiroService";

const ENTIDADES: Entidade[] = ["ARF", "Manu", "Sem nota"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nota?: NotaFiscal | null;
  onSaved: () => void;
}

const vazio = {
  entidade: "ARF" as Entidade,
  cliente: "",
  obra: "",
  dataEmissao: "",
  competencia: "",
  dataPagamento: "",
  valor: 0,
};

const NotaFiscalDialog = ({ open, onOpenChange, nota, onSaved }: Props) => {
  const { toast } = useToast();
  const [form, setForm] = useState(vazio);
  const editando = !!nota;

  useEffect(() => {
    if (nota) {
      setForm({
        entidade: nota.entidade,
        cliente: nota.cliente,
        obra: nota.obra ?? "",
        dataEmissao: nota.dataEmissao,
        competencia: nota.competencia,
        dataPagamento: nota.dataPagamento ?? "",
        valor: nota.valor,
      });
    } else {
      setForm(vazio);
    }
  }, [nota, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      entidade: form.entidade,
      cliente: form.cliente,
      obra: form.obra || undefined,
      dataEmissao: form.dataEmissao,
      competencia: form.competencia,
      dataPagamento: form.dataPagamento || null,
      valor: Number(form.valor) || 0,
    };
    if (editando && nota) {
      atualizarNota(nota.id, payload);
      toast({ title: "Nota atualizada", description: `Nota de ${form.cliente} atualizada.` });
    } else {
      criarNota(payload);
      toast({ title: "Nota cadastrada", description: `Nota de ${form.cliente} adicionada.` });
    }
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar Nota Fiscal" : "Nova Nota Fiscal"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Entidade *</Label>
              <Select
                value={form.entidade}
                onValueChange={(v: Entidade) => setForm({ ...form, entidade: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENTIDADES.map((e) => (
                    <SelectItem key={e} value={e}>
                      {e}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente *</Label>
              <Input
                id="cliente"
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                required
                placeholder="Nome do cliente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="obra">Obra</Label>
              <Input
                id="obra"
                value={form.obra}
                onChange={(e) => setForm({ ...form, obra: e.target.value })}
                placeholder="Ex: São Conrado 1500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emissao">Data de emissão *</Label>
              <Input
                id="emissao"
                type="date"
                value={form.dataEmissao}
                onChange={(e) => setForm({ ...form, dataEmissao: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comp">Competência *</Label>
              <Input
                id="comp"
                value={form.competencia}
                onChange={(e) => setForm({ ...form, competencia: e.target.value })}
                placeholder="MM/AAAA"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pgto">Data de pagamento (deixe vazio se a receber)</Label>
              <Input
                id="pgto"
                type="date"
                value={form.dataPagamento}
                onChange={(e) => setForm({ ...form, dataPagamento: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{editando ? "Salvar Alterações" : "Cadastrar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NotaFiscalDialog;
