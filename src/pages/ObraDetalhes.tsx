import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EditarObraDialog } from "@/components/EditarObraDialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  MapPin,
  User,
  Edit
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Obra, Transacao, ConfiguracaoTabelas } from "@/types/obra";
import { 
  obterObraPorId, 
  obterTransacoesPorObra, 
  adicionarTransacao,
  calcularResumoFinanceiro
} from "@/services/obraService";
import { toast } from "@/hooks/use-toast";

// Schema para validação do formulário
const transacaoSchema = z.object({
  data: z.string().min(1, "Data é obrigatória"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.string().min(1, "Valor é obrigatório"),
  tabelaId: z.string().min(1, "Tabela é obrigatória"),
});

type TransacaoFormData = z.infer<typeof transacaoSchema>;

const ObraDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [obra, setObra] = useState<Obra | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [resumoFinanceiro, setResumoFinanceiro] = useState({
    totalEntradas: 0,
    totalSaidas: 0,
    saldo: 0
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditarObraOpen, setIsEditarObraOpen] = useState(false);
  const [tipoTransacao, setTipoTransacao] = useState<"Entrada" | "Saída">("Entrada");
  const [tabelaSelecionada, setTabelaSelecionada] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const form = useForm<TransacaoFormData>({
    resolver: zodResolver(transacaoSchema),
    defaultValues: {
      data: "",
      descricao: "",
      valor: "",
      tabelaId: "",
    },
  });

  // Carregar dados da obra ao montar o componente
  useEffect(() => {
    const carregarDadosObra = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const obraData = await obterObraPorId(Number(id));
        if (!obraData) {
          toast({
            title: "Erro",
            description: "Obra não encontrada",
            variant: "destructive"
          });
          navigate("/obras");
          return;
        }
        
        setObra(obraData);
        
        // Carregar transações
        const transacoesData = await obterTransacoesPorObra(Number(id));
        setTransacoes(transacoesData);
        
        // Calcular resumo financeiro
        const resumo = await calcularResumoFinanceiro(Number(id));
        setResumoFinanceiro(resumo);
        
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados da obra",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    carregarDadosObra();
  }, [id, navigate]);

  const transacoesObra = transacoes;

  // Função para filtrar transações por tabela específica
  const getTransacoesPorTabela = (tabelaId: string) => {
    return transacoesObra
      .filter(t => t.tabelaId === tabelaId)
      .filter(transacao => {
        const matchesSearch = transacao.descricao.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      });
  };

  const onSubmit = async (data: TransacaoFormData) => {
    if (!id) return;
    
    try {
      const dadosTransacao = {
        data: data.data,
        tipo: tipoTransacao,
        descricao: data.descricao,
        valor: parseFloat(data.valor.replace(/[^\d,]/g, '').replace(',', '.')),
        obraId: Number(id),
        tabelaId: data.tabelaId
      };
      
      await adicionarTransacao(dadosTransacao);
      
      toast({
        title: "Sucesso",
        description: "Transação adicionada com sucesso!"
      });
      
      // Recarregar dados
      const transacoesData = await obterTransacoesPorObra(Number(id));
      setTransacoes(transacoesData);
      
      const resumo = await calcularResumoFinanceiro(Number(id));
      setResumoFinanceiro(resumo);
      
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar transação",
        variant: "destructive"
      });
    }
  };

  const handleNovaTransacao = (tipo: "Entrada" | "Saída") => {
    setTipoTransacao(tipo);
    setIsDialogOpen(true);
    form.reset();
    // Resetar tabela selecionada quando muda o tipo
    setTabelaSelecionada("");
    form.setValue("tabelaId", "");
  };

  const handleSuccessEdit = async () => {
    if (!id) return;
    
    try {
      // Recarregar dados da obra
      const obraData = await obterObraPorId(Number(id));
      if (obraData) {
        setObra(obraData);
        
        // Recarregar transações
        const transacoesData = await obterTransacoesPorObra(Number(id));
        setTransacoes(transacoesData);
        
        // Calcular resumo financeiro
        const resumo = await calcularResumoFinanceiro(Number(id));
        setResumoFinanceiro(resumo);
      }
    } catch (error) {
      console.error("Erro ao recarregar dados:", error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Carregando dados da obra...</p>
      </div>
    );
  }

  if (!obra) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Obra não encontrada</p>
        <Button onClick={() => navigate("/obras")} className="mt-4">
          Voltar para Obras
        </Button>
      </div>
    );
  }

  const renderTransacaoTable = (tabela: { id: string; nome: string; tipo: "entrada" | "saida" }) => {
    const transacoesTabela = getTransacoesPorTabela(tabela.id);
    const color = tabela.tipo === "entrada" ? "text-income" : "text-expense";
    
    return (
      <Card key={tabela.id} className="min-w-[350px] flex-1 shadow-sm border-border">
        <CardHeader className="pb-2 px-3 py-2 bg-muted/30 border-b">
          <CardTitle className={`text-sm flex items-center gap-2 ${color} font-medium`}>
            {tabela.tipo === "entrada" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {tabela.nome} ({transacoesTabela.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[400px]">
            <Table className="text-xs">
              <TableHeader className="bg-muted/50 sticky top-0">
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="h-8 px-2 text-xs font-medium border-r border-border">Data</TableHead>
                  <TableHead className="h-8 px-2 text-xs font-medium border-r border-border">Descrição</TableHead>
                  <TableHead className="h-8 px-2 text-xs font-medium text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoesTabela.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  transacoesTabela.map((transacao, index) => (
                    <TableRow 
                      key={transacao.id} 
                      className={`border-border hover:bg-muted/30 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}
                    >
                      <TableCell className="h-8 px-2 text-xs border-r border-border font-mono">{transacao.data}</TableCell>
                      <TableCell className="h-8 px-2 text-xs border-r border-border max-w-[200px] truncate" title={transacao.descricao}>
                        {transacao.descricao}
                      </TableCell>
                      <TableCell className={`h-8 px-2 text-xs text-right font-mono font-medium ${color}`}>
                        {formatCurrency(transacao.valor)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {transacoesTabela.length > 0 && (
            <div className={`border-t-2 border-border p-2 ${tabela.tipo === "entrada" ? "bg-income/5" : "bg-expense/5"} sticky bottom-0`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Total:</span>
                <span className={`text-sm font-bold font-mono ${color}`}>
                  {formatCurrency(transacoesTabela.reduce((sum, t) => sum + t.valor, 0))}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/obras")}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{obra.nome}</h1>
            <p className="text-muted-foreground">Controle Financeiro</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="bg-gradient-to-r from-primary to-construction text-white" onClick={() => handleNovaTransacao("Entrada")}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
          <Button variant="outline" onClick={() => setIsEditarObraOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Obra
          </Button>
        </div>
      </div>

      {/* Informações da Obra */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações da Obra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-medium">{obra.cliente}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Local:</span>
              <span className="font-medium">{obra.localizacao}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Início:</span>
              <span className="font-medium">{new Date(obra.dataInicio).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Previsão:</span>
              <span className="font-medium">{new Date(obra.dataPrevista).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-center">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Entradas</p>
              <p className="text-sm md:text-xl font-bold text-income">{formatCurrency(resumoFinanceiro.totalEntradas)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-center">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Saídas</p>
              <p className="text-sm md:text-xl font-bold text-expense">{formatCurrency(resumoFinanceiro.totalSaidas)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-center">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Saldo</p>
              <p className={`text-sm md:text-xl font-bold ${resumoFinanceiro.saldo >= 0 ? 'text-income' : 'text-expense'}`}>
                {formatCurrency(resumoFinanceiro.saldo)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Controle de Entradas e Saídas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Controle Financeiro</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-income/10 text-income border-income/20" onClick={() => handleNovaTransacao("Entrada")}>
              <Plus className="h-4 w-4 mr-1" />
              Nova Entrada
            </Button>
            <Button variant="outline" size="sm" className="bg-expense/10 text-expense border-expense/20" onClick={() => handleNovaTransacao("Saída")}>
              <Plus className="h-4 w-4 mr-1" />
              Nova Saída
            </Button>
          </div>
        </div>

        {/* Container com scroll horizontal para as tabelas */}
        <div className="w-full rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex gap-4 min-w-max pb-2 max-h-[600px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              {/* Tabelas de Entradas */}
              {obra?.configuracaoTabelas.entradas.map(tabela => 
                renderTransacaoTable(tabela)
              )}
              
              {/* Tabelas de Saídas */}
              {obra?.configuracaoTabelas.saidas.map(tabela => 
                renderTransacaoTable(tabela)
              )}
            </div>
        </div>

        {/* Resumo das Tabelas */}
        <div className="grid grid-cols-2 gap-2 md:gap-4 pt-2 border-t">
          <div className="text-center p-2 md:p-3 bg-income/5 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Tabelas Entrada</p>
            <p className="text-sm font-bold text-income">
              {obra?.configuracaoTabelas.entradas.length} tabelas
            </p>
          </div>
          <div className="text-center p-2 md:p-3 bg-expense/5 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Tabelas Saída</p>
            <p className="text-sm font-bold text-expense">
              {obra?.configuracaoTabelas.saidas.length} tabelas
            </p>
          </div>
        </div>
      </div>

      {/* Modal para adicionar transação */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova {tipoTransacao}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="tabelaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tabela de {tipoTransacao}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a tabela" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {obra && (tipoTransacao === "Entrada" 
                          ? obra.configuracaoTabelas.entradas 
                          : obra.configuracaoTabelas.saidas
                        ).map(tabela => (
                          <SelectItem key={tabela.id} value={tabela.id}>
                            {tabela.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input placeholder="Descreva a transação..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0,00" 
                        {...field}
                        onChange={(e) => {
                          // Formatação básica de valor monetário
                          let value = e.target.value.replace(/\D/g, '');
                          if (value) {
                            value = (parseFloat(value) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                          }
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className={`${tipoTransacao === "Entrada" ? "bg-income hover:bg-income/90" : "bg-expense hover:bg-expense/90"} text-white`}>
                  Adicionar {tipoTransacao}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Obra */}
      <EditarObraDialog
        open={isEditarObraOpen}
        onOpenChange={setIsEditarObraOpen}
        obra={obra}
        onSuccess={handleSuccessEdit}
      />
      </div>
    </div>
  );
};

export default ObraDetalhes;