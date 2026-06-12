import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Search,
  HardHat,
  DollarSign,
  UtensilsCrossed,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Funcionario } from "@/types/funcionario";
import {
  obterFuncionarios,
  totalDiaria,
  removerFuncionario,
} from "@/services/funcionarioService";
import FuncionarioDialog from "@/components/FuncionarioDialog";
import { formatBRL } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

const cargoColor = (cargo: string) => {
  switch (cargo) {
    case "Pedreiro": return "bg-construction text-white";
    case "Eletricista": return "bg-primary text-primary-foreground";
    case "Servente": return "bg-muted text-muted-foreground";
    case "Pintor": return "bg-income text-white";
    case "Mestre de Obras": return "bg-primary-dark text-white";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const Funcionarios = () => {
  const { toast } = useToast();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [busca, setBusca] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Funcionario | null>(null);
  const [excluir, setExcluir] = useState<Funcionario | null>(null);

  const recarregar = () => setFuncionarios(obterFuncionarios());
  useEffect(() => recarregar(), []);

  const filtrados = funcionarios.filter(
    (f) =>
      f.nome.toLowerCase().includes(busca.toLowerCase()) ||
      f.cargo.toLowerCase().includes(busca.toLowerCase())
  );

  const ativos = funcionarios.filter((f) => f.ativo);
  const folhaSemanalEstimada = ativos.reduce(
    (s, f) => s + (f.diaria + f.quentinha) * 5,
    0
  );

  const novo = () => {
    setEditando(null);
    setDialogOpen(true);
  };
  const editar = (f: Funcionario) => {
    setEditando(f);
    setDialogOpen(true);
  };
  const confirmarExclusao = () => {
    if (excluir) {
      removerFuncionario(excluir.id);
      toast({ title: "Funcionário removido", description: `${excluir.nome} foi removido.` });
      setExcluir(null);
      recarregar();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Funcionários
          </h1>
          <p className="text-muted-foreground">
            Cadastro da equipe, diárias e dados de pagamento
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark" onClick={novo}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <HardHat className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Equipe ativa</p>
              <p className="text-xl font-bold">{ativos.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-construction/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-construction" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Folha semanal estimada</p>
              <p className="text-xl font-bold">{formatBRL(folhaSemanalEstimada)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-income/10 flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-income" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quentinha (padrão)</p>
              <p className="text-xl font-bold">{formatBRL(21)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou cargo..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Tabela de diárias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="text-right">Diária</TableHead>
                  <TableHead className="text-right">Encargos</TableHead>
                  <TableHead className="text-right">Quentinha</TableHead>
                  <TableHead className="text-right">Total/dia</TableHead>
                  <TableHead>PIX</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-medium">{f.nome}</TableCell>
                    <TableCell>
                      <Badge className={cargoColor(f.cargo)}>{f.cargo}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatBRL(f.diaria)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatBRL(f.encargos)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatBRL(f.quentinha)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-income">
                      {formatBRL(totalDiaria(f))}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {f.chavePix} · {f.banco}
                    </TableCell>
                    <TableCell>
                      {f.ativo ? (
                        <Badge className="bg-income text-white">Ativo</Badge>
                      ) : (
                        <Badge variant="outline">Inativo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => editar(f)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-expense hover:text-expense"
                          onClick={() => setExcluir(f)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <FuncionarioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        funcionario={editando}
        onSaved={recarregar}
      />

      <AlertDialog open={!!excluir} onOpenChange={(o) => !o && setExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover funcionário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover {excluir?.nome}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmarExclusao}
              className="bg-expense hover:bg-expense/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Funcionarios;
