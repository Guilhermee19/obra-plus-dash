import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  Wallet, Landmark, Receipt, CreditCard, ArrowUpRight, ArrowDownRight,
  Plus, Pencil, Trash2,
} from "lucide-react";
import { MovimentoCaixa, DespesaMensal, Emprestimo } from "@/types/financeiro";
import {
  obterCaixa, obterDespesas, obterEmprestimos,
  saldoConta, saldoBancoTotal, totalAPagarEmprestimos,
  removerDespesa, removerMovimento,
} from "@/services/financeiroService";
import DespesaDialog from "@/components/DespesaDialog";
import MovimentoCaixaDialog from "@/components/MovimentoCaixaDialog";
import { formatBRL, formatData } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

const Financeiro = () => {
  const { toast } = useToast();
  const [caixa, setCaixa] = useState<MovimentoCaixa[]>([]);
  const [despesas, setDespesas] = useState<DespesaMensal[]>([]);
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);

  const [despesaDialog, setDespesaDialog] = useState(false);
  const [despesaEdit, setDespesaEdit] = useState<DespesaMensal | null>(null);
  const [caixaDialog, setCaixaDialog] = useState(false);
  const [excluirDespesa, setExcluirDespesa] = useState<DespesaMensal | null>(null);
  const [excluirMov, setExcluirMov] = useState<MovimentoCaixa | null>(null);

  const recarregar = () => {
    setCaixa(obterCaixa());
    setDespesas(obterDespesas());
    setEmprestimos(obterEmprestimos());
  };
  useEffect(() => recarregar(), []);

  const totalDespesas = despesas.reduce((s, d) => s + d.valor, 0);
  const porCategoria = despesas.reduce<Record<string, number>>((acc, d) => {
    acc[d.categoria] = (acc[d.categoria] || 0) + d.valor;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          Financeiro
        </h1>
        <p className="text-muted-foreground">Caixa, despesas operacionais e empréstimos</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card border-primary/30">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Saldo no banco</p>
            <p className="text-xl font-bold text-primary">{formatBRL(saldoBancoTotal())}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Conta ARF</p>
            <p className="text-xl font-bold">{formatBRL(saldoConta("ARF"))}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Conta Manu</p>
            <p className="text-xl font-bold">{formatBRL(saldoConta("Manu"))}</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">A pagar (empréstimos)</p>
            <p className="text-xl font-bold text-expense">{formatBRL(totalAPagarEmprestimos())}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="caixa">
        <TabsList>
          <TabsTrigger value="caixa"><Landmark className="h-4 w-4 mr-2" /> Caixa / Extratos</TabsTrigger>
          <TabsTrigger value="despesas"><Receipt className="h-4 w-4 mr-2" /> Despesas mensais</TabsTrigger>
          <TabsTrigger value="emprestimos"><CreditCard className="h-4 w-4 mr-2" /> Empréstimos</TabsTrigger>
        </TabsList>

        {/* CAIXA */}
        <TabsContent value="caixa" className="mt-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Movimentações</CardTitle>
              <Button size="sm" onClick={() => setCaixaDialog(true)}>
                <Plus className="h-4 w-4 mr-1" /> Novo lançamento
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Conta</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Obra</TableHead>
                      <TableHead className="text-right">Crédito</TableHead>
                      <TableHead className="text-right">Débito</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {caixa.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>
                          <Badge className={m.conta === "ARF" ? "bg-primary text-primary-foreground" : "bg-construction text-white"}>
                            {m.conta}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatData(m.data)}</TableCell>
                        <TableCell className="font-medium">{m.descricao}</TableCell>
                        <TableCell className="text-muted-foreground">{m.obra ?? "—"}</TableCell>
                        <TableCell className="text-right text-income">
                          {m.tipo === "Crédito" ? (
                            <span className="inline-flex items-center gap-1"><ArrowUpRight className="h-3 w-3" />{formatBRL(m.valor)}</span>
                          ) : "—"}
                        </TableCell>
                        <TableCell className="text-right text-expense">
                          {m.tipo === "Débito" ? (
                            <span className="inline-flex items-center gap-1"><ArrowDownRight className="h-3 w-3" />{formatBRL(m.valor)}</span>
                          ) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-expense" onClick={() => setExcluirMov(m)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DESPESAS */}
        <TabsContent value="despesas" className="mt-4 space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Por categoria — total {formatBRL(totalDespesas)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(porCategoria).map(([cat, val]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat}</span>
                    <span className="font-medium">{formatBRL(val)}</span>
                  </div>
                  <Progress value={totalDespesas ? (val / totalDespesas) * 100 : 0} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Lançamentos</CardTitle>
              <Button size="sm" onClick={() => { setDespesaEdit(null); setDespesaDialog(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Nova despesa
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Conta</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {despesas.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell>{d.mes}</TableCell>
                        <TableCell>{formatData(d.data)}</TableCell>
                        <TableCell><Badge variant="outline">{d.categoria}</Badge></TableCell>
                        <TableCell className="font-medium">{d.descricao}</TableCell>
                        <TableCell className="text-muted-foreground">{d.conta}</TableCell>
                        <TableCell className="text-right font-semibold text-expense">{formatBRL(d.valor)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => { setDespesaEdit(d); setDespesaDialog(true); }}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-expense" onClick={() => setExcluirDespesa(d)}>
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
        </TabsContent>

        {/* EMPRÉSTIMOS */}
        <TabsContent value="emprestimos" className="mt-4 space-y-4">
          {emprestimos.map((e) => {
            const pagas = e.parcelas.filter((p) => p.pago).length;
            const total = e.parcelas.length;
            return (
              <Card key={e.id} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{e.tipo} — {e.banco}</CardTitle>
                    <Badge variant="outline">{e.taxa}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{pagas} de {total} parcelas pagas</span>
                      <span className="font-medium">
                        {formatBRL(e.parcelas.filter((p) => !p.pago).reduce((s, p) => s + p.valor, 0))} em aberto
                      </span>
                    </div>
                    <Progress value={(pagas / total) * 100} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {e.parcelas.map((p) => (
                      <div key={p.numero} className={`rounded-md border p-2 text-center text-xs ${p.pago ? "bg-income/10 border-income/30 text-income" : "bg-muted/40 text-muted-foreground"}`}>
                        <div className="font-semibold">#{p.numero}</div>
                        <div>{formatData(p.vencimento)}</div>
                        <div className="font-medium">{formatBRL(p.valor)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>

      <DespesaDialog open={despesaDialog} onOpenChange={setDespesaDialog} despesa={despesaEdit} onSaved={recarregar} />
      <MovimentoCaixaDialog open={caixaDialog} onOpenChange={setCaixaDialog} onSaved={recarregar} />

      <AlertDialog open={!!excluirDespesa} onOpenChange={(o) => !o && setExcluirDespesa(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover despesa</AlertDialogTitle>
            <AlertDialogDescription>Remover "{excluirDespesa?.descricao}"?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-expense hover:bg-expense/90"
              onClick={() => { if (excluirDespesa) { removerDespesa(excluirDespesa.id); toast({ title: "Despesa removida" }); setExcluirDespesa(null); recarregar(); } }}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!excluirMov} onOpenChange={(o) => !o && setExcluirMov(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover lançamento</AlertDialogTitle>
            <AlertDialogDescription>Remover "{excluirMov?.descricao}"?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-expense hover:bg-expense/90"
              onClick={() => { if (excluirMov) { removerMovimento(excluirMov.id); toast({ title: "Lançamento removido" }); setExcluirMov(null); recarregar(); } }}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Financeiro;
