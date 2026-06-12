import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { FileText, Plus, TrendingUp, Clock, CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { NotaFiscal, Entidade } from "@/types/financeiro";
import {
  obterNotas,
  totalAReceber,
  totalRecebido,
  removerNota,
} from "@/services/financeiroService";
import NotaFiscalDialog from "@/components/NotaFiscalDialog";
import { formatBRL, formatData } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

const entidadeColor = (e: Entidade) => {
  switch (e) {
    case "ARF": return "bg-primary text-primary-foreground";
    case "Manu": return "bg-construction text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

const NotasFiscais = () => {
  const { toast } = useToast();
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [filtro, setFiltro] = useState<"todas" | Entidade>("todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<NotaFiscal | null>(null);
  const [excluir, setExcluir] = useState<NotaFiscal | null>(null);

  const recarregar = () => setNotas(obterNotas());
  useEffect(() => recarregar(), []);

  const filtradas =
    filtro === "todas" ? notas : notas.filter((n) => n.entidade === filtro);

  const aReceber = totalAReceber();
  const recebido = totalRecebido();
  const qtdAbertas = notas.filter((n) => !n.dataPagamento).length;

  const novo = () => { setEditando(null); setDialogOpen(true); };
  const editar = (n: NotaFiscal) => { setEditando(n); setDialogOpen(true); };
  const confirmarExclusao = () => {
    if (excluir) {
      removerNota(excluir.id);
      toast({ title: "Nota removida" });
      setExcluir(null);
      recarregar();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Notas Fiscais
          </h1>
          <p className="text-muted-foreground">
            Notas emitidas por ARF e Manu, competência e pagamento
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark" onClick={novo}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Nota
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-income/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-income" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recebido</p>
              <p className="text-xl font-bold text-income">{formatBRL(recebido)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-construction/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-construction" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">A receber ({qtdAbertas})</p>
              <p className="text-xl font-bold text-construction">{formatBRL(aReceber)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total emitido</p>
              <p className="text-xl font-bold">{formatBRL(recebido + aReceber)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={filtro} onValueChange={(v) => setFiltro(v as typeof filtro)}>
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="ARF">ARF</TabsTrigger>
          <TabsTrigger value="Manu">Manu</TabsTrigger>
          <TabsTrigger value="Sem nota">Sem nota</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Notas emitidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Obra</TableHead>
                  <TableHead>Emissão</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtradas.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell>
                      <Badge className={entidadeColor(n.entidade)}>{n.entidade}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{n.cliente}</TableCell>
                    <TableCell className="text-muted-foreground">{n.obra ?? "—"}</TableCell>
                    <TableCell>{formatData(n.dataEmissao)}</TableCell>
                    <TableCell>{n.competencia}</TableCell>
                    <TableCell>
                      {n.dataPagamento ? (
                        <span className="text-income">{formatData(n.dataPagamento)}</span>
                      ) : (
                        <Badge variant="outline" className="border-construction text-construction">
                          A receber
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatBRL(n.valor)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => editar(n)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-expense hover:text-expense"
                          onClick={() => setExcluir(n)}
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

      <NotaFiscalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nota={editando}
        onSaved={recarregar}
      />

      <AlertDialog open={!!excluir} onOpenChange={(o) => !o && setExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover nota</AlertDialogTitle>
            <AlertDialogDescription>
              Remover a nota de {excluir?.cliente} ({formatBRL(excluir?.valor ?? 0)})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao} className="bg-expense hover:bg-expense/90">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NotasFiscais;
