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
import { useToast } from "@/hooks/use-toast";
import { Fornecedor, CategoriaFornecedor, TipoPix } from "@/types/fornecedor";
import {
  criarFornecedor,
  atualizarFornecedor,
  CATEGORIAS_FORNECEDOR,
} from "@/services/fornecedorService";

const TIPOS_PIX: TipoPix[] = ["Telefone", "CPF", "CNPJ", "E-mail", "Aleatória"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fornecedor?: Fornecedor | null;
  onSaved: () => void;
}

const vazio = {
  nome: "",
  categoria: "Material" as CategoriaFornecedor,
  contato: "",
  chavePix: "",
  tipoPix: "Telefone" as TipoPix,
  banco: "",
  observacoes: "",
};

const FornecedorDialog = ({ open, onOpenChange, fornecedor, onSaved }: Props) => {
  const { toast } = useToast();
  const [form, setForm] = useState(vazio);
  const editando = !!fornecedor;

  useEffect(() => {
    if (fornecedor) {
      setForm({
        nome: fornecedor.nome,
        categoria: fornecedor.categoria,
        contato: fornecedor.contato ?? "",
        chavePix: fornecedor.chavePix ?? "",
        tipoPix: fornecedor.tipoPix ?? "Telefone",
        banco: fornecedor.banco ?? "",
        observacoes: fornecedor.observacoes ?? "",
      });
    } else {
      setForm(vazio);
    }
  }, [fornecedor, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editando && fornecedor) {
      atualizarFornecedor(fornecedor.id, form);
      toast({ title: "Fornecedor atualizado", description: form.nome });
    } else {
      criarFornecedor(form);
      toast({ title: "Fornecedor cadastrado", description: form.nome });
    }
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
                placeholder="Nome do fornecedor"
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Select
                value={form.categoria}
                onValueChange={(v: CategoriaFornecedor) => setForm({ ...form, categoria: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIAS_FORNECEDOR.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contato">Contato</Label>
              <Input
                id="contato"
                value={form.contato}
                onChange={(e) => setForm({ ...form, contato: e.target.value })}
                placeholder="(21) 9 0000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo da chave PIX</Label>
              <Select value={form.tipoPix} onValueChange={(v: TipoPix) => setForm({ ...form, tipoPix: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS_PIX.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pix">Chave PIX</Label>
              <Input
                id="pix"
                value={form.chavePix}
                onChange={(e) => setForm({ ...form, chavePix: e.target.value })}
                placeholder="Chave"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banco">Banco</Label>
              <Input
                id="banco"
                value={form.banco}
                onChange={(e) => setForm({ ...form, banco: e.target.value })}
                placeholder="Ex: Bradesco"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="obs">Observações</Label>
              <Textarea
                id="obs"
                value={form.observacoes}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
                placeholder="Ex: entrega nas obras, prazo de pagamento..."
                rows={2}
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

export default FornecedorDialog;
