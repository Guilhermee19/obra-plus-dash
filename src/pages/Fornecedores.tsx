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
import { Truck, Plus, Search, Copy, Check, Pencil, Trash2 } from "lucide-react";
import { Fornecedor, CategoriaFornecedor } from "@/types/fornecedor";
import {
  obterFornecedores,
  removerFornecedor,
  CATEGORIAS_FORNECEDOR,
} from "@/services/fornecedorService";
import FornecedorDialog from "@/components/FornecedorDialog";
import { useToast } from "@/hooks/use-toast";

const catColor = (c: CategoriaFornecedor) => {
  switch (c) {
    case "Material": return "bg-primary text-primary-foreground";
    case "Quentinha": return "bg-income text-white";
    case "Equipamento": return "bg-construction text-white";
    case "Entulho": return "bg-muted text-muted-foreground";
    case "Serviço": return "bg-accent text-accent-foreground";
    default: return "bg-secondary text-secondary-foreground";
  }
};

const Fornecedores = () => {
  const { toast } = useToast();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [busca, setBusca] = useState("");
  const [cat, setCat] = useState<"todas" | CategoriaFornecedor>("todas");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Fornecedor | null>(null);
  const [excluir, setExcluir] = useState<Fornecedor | null>(null);
  const [copiado, setCopiado] = useState<number | null>(null);

  const recarregar = () => setFornecedores(obterFornecedores());
  useEffect(() => recarregar(), []);

  const filtrados = fornecedores.filter((f) => {
    const matchBusca =
      f.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (f.chavePix ?? "").toLowerCase().includes(busca.toLowerCase());
    const matchCat = cat === "todas" || f.categoria === cat;
    return matchBusca && matchCat;
  });

  const copiarPix = (f: Fornecedor) => {
    if (!f.chavePix) return;
    navigator.clipboard?.writeText(f.chavePix).catch(() => {});
    setCopiado(f.id);
    toast({ title: "Chave PIX copiada", description: f.chavePix });
    setTimeout(() => setCopiado(null), 1500);
  };

  const novo = () => { setEditando(null); setDialogOpen(true); };
  const editar = (f: Fornecedor) => { setEditando(f); setDialogOpen(true); };
  const confirmarExclusao = () => {
    if (excluir) {
      removerFornecedor(excluir.id);
      toast({ title: "Fornecedor removido", description: excluir.nome });
      setExcluir(null);
      recarregar();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            Fornecedores / PIX
          </h1>
          <p className="text-muted-foreground">
            Fornecedores, quentinhas e chaves PIX para pagamento
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark" onClick={novo}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou chave PIX..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={cat === "todas" ? "default" : "outline"}
            size="sm"
            onClick={() => setCat("todas")}
          >
            Todas
          </Button>
          {CATEGORIAS_FORNECEDOR.map((c) => (
            <Button
              key={c}
              variant={cat === c ? "default" : "outline"}
              size="sm"
              onClick={() => setCat(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">
            Fornecedores ({filtrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Chave PIX</TableHead>
                  <TableHead>Banco</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrados.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>
                      <div className="font-medium">{f.nome}</div>
                      {f.observacoes && (
                        <div className="text-xs text-muted-foreground">{f.observacoes}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={catColor(f.categoria)}>{f.categoria}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{f.contato ?? "—"}</TableCell>
                    <TableCell>
                      {f.chavePix ? (
                        <button
                          onClick={() => copiarPix(f)}
                          className="inline-flex items-center gap-1.5 text-sm hover:text-primary group"
                          title="Copiar chave PIX"
                        >
                          {copiado === f.id ? (
                            <Check className="h-3.5 w-3.5 text-income" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                          )}
                          <span>{f.chavePix}</span>
                          {f.tipoPix && (
                            <span className="text-xs text-muted-foreground">({f.tipoPix})</span>
                          )}
                        </button>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{f.banco ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => editar(f)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-expense" onClick={() => setExcluir(f)}>
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

      <FornecedorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        fornecedor={editando}
        onSaved={recarregar}
      />

      <AlertDialog open={!!excluir} onOpenChange={(o) => !o && setExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover fornecedor</AlertDialogTitle>
            <AlertDialogDescription>Remover {excluir?.nome}?</AlertDialogDescription>
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

export default Fornecedores;
