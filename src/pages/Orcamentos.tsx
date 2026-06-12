import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { FileSpreadsheet, Plus, Search, CheckCircle2, Send, FileEdit, Pencil, Trash2 } from "lucide-react";
import { Orcamento, StatusOrcamento, totalOrcamento } from "@/types/orcamento";
import { obterOrcamentos, removerOrcamento } from "@/services/orcamentoService";
import OrcamentoDialog from "@/components/OrcamentoDialog";
import { formatBRL, formatData } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

const statusColor = (s: StatusOrcamento) => {
  switch (s) {
    case "Aprovado": return "bg-income text-white";
    case "Enviado": return "bg-primary text-primary-foreground";
    case "Rascunho": return "bg-muted text-muted-foreground";
    case "Recusado": return "bg-expense text-white";
    default: return "bg-muted text-muted-foreground";
  }
};

const Orcamentos = () => {
  const { toast } = useToast();
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | StatusOrcamento>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Orcamento | null>(null);
  const [excluir, setExcluir] = useState<Orcamento | null>(null);

  const recarregar = () => setOrcamentos(obterOrcamentos());
  useEffect(() => recarregar(), []);

  const filtrados = orcamentos.filter((o) => {
    const matchBusca =
      o.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      o.numero.toLowerCase().includes(busca.toLowerCase()) ||
      (o.obra ?? "").toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtro === "todos" || o.status === filtro;
    return matchBusca && matchStatus;
  });

  const soma = (s: StatusOrcamento) =>
    orcamentos.filter((o) => o.status === s).reduce((acc, o) => acc + totalOrcamento(o), 0);

  const novo = () => { setEditando(null); setDialogOpen(true); };
  const editar = (o: Orcamento) => { setEditando(o); setDialogOpen(true); };
  const confirmarExclusao = () => {
    if (excluir) {
      removerOrcamento(excluir.id);
      toast({ title: "Orçamento removido", description: excluir.numero });
      setExcluir(null);
      recarregar();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-primary" />
            Orçamentos
          </h1>
          <p className="text-muted-foreground">
            Propostas por obra/cliente, itens e status de aprovação
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark" onClick={novo}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-income/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-income" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aprovados</p>
              <p className="text-xl font-bold text-income">{formatBRL(soma("Aprovado"))}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Send className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enviados (pendentes)</p>
              <p className="text-xl font-bold text-primary">{formatBRL(soma("Enviado"))}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <FileEdit className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rascunhos</p>
              <p className="text-xl font-bold">{formatBRL(soma("Rascunho"))}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nº, cliente ou obra..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={filtro} onValueChange={(v) => setFiltro(v as typeof filtro)}>
          <TabsList>
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="Rascunho">Rascunho</TabsTrigger>
            <TabsTrigger value="Enviado">Enviado</TabsTrigger>
            <TabsTrigger value="Aprovado">Aprovado</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Propostas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Obra / Bairro</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Emissão</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.numero}</TableCell>
                    <TableCell>{o.cliente}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {o.obra ?? "—"}
                      {o.bairro ? ` · ${o.bairro}` : ""}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{o.entidade}</Badge>
                    </TableCell>
                    <TableCell>{formatData(o.dataEmissao)}</TableCell>
                    <TableCell>{formatData(o.validade)}</TableCell>
                    <TableCell>
                      <Badge className={statusColor(o.status)}>{o.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatBRL(totalOrcamento(o))}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => editar(o)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-expense" onClick={() => setExcluir(o)}>
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

      <OrcamentoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        orcamento={editando}
        onSaved={recarregar}
      />

      <AlertDialog open={!!excluir} onOpenChange={(o) => !o && setExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover orçamento</AlertDialogTitle>
            <AlertDialogDescription>
              Remover {excluir?.numero} de {excluir?.cliente}?
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

export default Orcamentos;
