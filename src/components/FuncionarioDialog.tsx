import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Funcionario, Cargo } from "@/types/funcionario";
import { criarFuncionario, atualizarFuncionario } from "@/services/funcionarioService";
import { formatBRL } from "@/lib/format";

const CARGOS: Cargo[] = [
  "Pedreiro",
  "Servente",
  "Eletricista",
  "Ajudante",
  "Pintor",
  "Ladrilheiro",
  "Encanador",
  "Mestre de Obras",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funcionario?: Funcionario | null;
  onSaved: () => void;
}

const vazio = {
  nome: "",
  cargo: "Pedreiro" as Cargo,
  diaria: 0,
  encargos: 30,
  quentinha: 21,
  chavePix: "",
  banco: "",
  ativo: true,
};

const FuncionarioDialog = ({ open, onOpenChange, funcionario, onSaved }: Props) => {
  const { toast } = useToast();
  const [form, setForm] = useState(vazio);
  const editando = !!funcionario;

  useEffect(() => {
    if (funcionario) {
      setForm({
        nome: funcionario.nome,
        cargo: funcionario.cargo,
        diaria: funcionario.diaria,
        encargos: funcionario.encargos,
        quentinha: funcionario.quentinha,
        chavePix: funcionario.chavePix ?? "",
        banco: funcionario.banco ?? "",
        ativo: funcionario.ativo,
      });
    } else {
      setForm(vazio);
    }
  }, [funcionario, open]);

  const total = (Number(form.diaria) || 0) + (Number(form.encargos) || 0) + (Number(form.quentinha) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editando && funcionario) {
      atualizarFuncionario(funcionario.id, form);
      toast({ title: "Funcionário atualizado", description: `${form.nome} foi atualizado.` });
    } else {
      criarFuncionario(form);
      toast({ title: "Funcionário cadastrado", description: `${form.nome} foi adicionado à equipe.` });
    }
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar Funcionário" : "Novo Funcionário"}</DialogTitle>
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
                placeholder="Nome do funcionário"
              />
            </div>

            <div className="space-y-2">
              <Label>Cargo *</Label>
              <Select
                value={form.cargo}
                onValueChange={(v: Cargo) => setForm({ ...form, cargo: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CARGOS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diaria">Diária (R$) *</Label>
              <Input
                id="diaria"
                type="number"
                step="0.01"
                value={form.diaria}
                onChange={(e) => setForm({ ...form, diaria: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="encargos">Encargos (R$)</Label>
              <Input
                id="encargos"
                type="number"
                step="0.01"
                value={form.encargos}
                onChange={(e) => setForm({ ...form, encargos: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quentinha">Quentinha (R$)</Label>
              <Input
                id="quentinha"
                type="number"
                step="0.01"
                value={form.quentinha}
                onChange={(e) => setForm({ ...form, quentinha: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pix">Chave PIX</Label>
              <Input
                id="pix"
                value={form.chavePix}
                onChange={(e) => setForm({ ...form, chavePix: e.target.value })}
                placeholder="Telefone, CPF ou e-mail"
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
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.ativo}
                onCheckedChange={(v) => setForm({ ...form, ativo: v })}
              />
              <Label className="cursor-pointer">Funcionário ativo</Label>
            </div>
            <div className="text-sm">
              Total/dia:{" "}
              <span className="font-semibold text-income">{formatBRL(total)}</span>
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

export default FuncionarioDialog;
