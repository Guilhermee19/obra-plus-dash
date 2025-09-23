import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  User
} from "lucide-react";

// Dados mockados da obra
const mockObras = [
  {
    id: 1,
    nome: "Residencial Vila Nova",
    cliente: "João Silva",
    status: "Em Andamento",
    progresso: 65,
    localizacao: "Zona Sul, SP",
    dataInicio: "15/01/2024",
    dataPrevista: "30/06/2024",
    responsavel: "Carlos Silva"
  }
];

// Dados mockados das transações
const mockTransacoes = [
  {
    id: 1,
    data: "15/03/2024",
    tipo: "Entrada",
    categoria: "Pagamento Cliente",
    descricao: "Pagamento parcial - 2ª parcela",
    valor: 15000,
    obraId: 1
  },
  {
    id: 2,
    data: "18/03/2024",
    tipo: "Saída",
    categoria: "Material",
    descricao: "Cimento, areia e brita",
    valor: 3500,
    obraId: 1
  },
  {
    id: 3,
    data: "20/03/2024",
    tipo: "Saída",
    categoria: "Funcionários",
    descricao: "Salários quinzenal",
    valor: 8500,
    obraId: 1
  },
  {
    id: 4,
    data: "22/03/2024",
    tipo: "Entrada",
    categoria: "Pagamento Cliente",
    descricao: "Pagamento extra por mudanças",
    valor: 5000,
    obraId: 1
  },
  {
    id: 5,
    data: "25/03/2024",
    tipo: "Saída",
    categoria: "Equipamentos",
    descricao: "Aluguel betoneira",
    valor: 800,
    obraId: 1
  },
  {
    id: 6,
    data: "28/03/2024",
    tipo: "Saída",
    categoria: "Impostos",
    descricao: "ISS sobre serviços",
    valor: 1200,
    obraId: 1
  }
];

const ObraDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("Todos");

  const obra = mockObras.find(o => o.id === Number(id));
  const transacoes = mockTransacoes.filter(t => t.obraId === Number(id));

  const filteredEntradas = transacoes
    .filter(t => t.tipo === "Entrada")
    .filter(transacao => {
      const matchesSearch = transacao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transacao.categoria.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

  const filteredSaidas = transacoes
    .filter(t => t.tipo === "Saída")
    .filter(transacao => {
      const matchesSearch = transacao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transacao.categoria.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

  const totalEntradas = transacoes
    .filter(t => t.tipo === "Entrada")
    .reduce((sum, t) => sum + t.valor, 0);

  const totalSaidas = transacoes
    .filter(t => t.tipo === "Saída")
    .reduce((sum, t) => sum + t.valor, 0);

  const saldo = totalEntradas - totalSaidas;

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

  const renderTransacaoTable = (transacoes: typeof mockTransacoes, tipo: "Entrada" | "Saída", color: string) => (
    <Card className="min-w-[350px] flex-1 shadow-sm border-border">
      <CardHeader className="pb-2 px-3 py-2 bg-muted/30 border-b">
        <CardTitle className={`text-sm flex items-center gap-2 ${color} font-medium`}>
          {tipo === "Entrada" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {tipo}s ({transacoes.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto max-h-[400px]">
          <Table className="text-xs">
            <TableHeader className="bg-muted/50 sticky top-0">
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="h-8 px-2 text-xs font-medium border-r border-border">Data</TableHead>
                <TableHead className="h-8 px-2 text-xs font-medium border-r border-border">Categoria</TableHead>
                <TableHead className="h-8 px-2 text-xs font-medium border-r border-border">Descrição</TableHead>
                <TableHead className="h-8 px-2 text-xs font-medium text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transacoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhuma {tipo.toLowerCase()} encontrada
                  </TableCell>
                </TableRow>
              ) : (
                transacoes.map((transacao, index) => (
                  <TableRow 
                    key={transacao.id} 
                    className={`border-border hover:bg-muted/30 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}
                  >
                    <TableCell className="h-8 px-2 text-xs border-r border-border font-mono">{transacao.data}</TableCell>
                    <TableCell className="h-8 px-2 text-xs border-r border-border">
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
                        {transacao.categoria}
                      </Badge>
                    </TableCell>
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
        {transacoes.length > 0 && (
          <div className={`border-t-2 border-border p-2 ${tipo === "Entrada" ? "bg-income/5" : "bg-expense/5"} sticky bottom-0`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">Total:</span>
              <span className={`text-sm font-bold font-mono ${color}`}>
                {formatCurrency(transacoes.reduce((sum, t) => sum + t.valor, 0))}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
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
        <Button className="bg-gradient-to-r from-primary to-construction text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
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
              <span className="font-medium">{obra.dataInicio}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Previsão:</span>
              <span className="font-medium">{obra.dataPrevista}</span>
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
              <p className="text-sm md:text-xl font-bold text-income">{formatCurrency(totalEntradas)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-center">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Saídas</p>
              <p className="text-sm md:text-xl font-bold text-expense">{formatCurrency(totalSaidas)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="text-center">
              <p className="text-xs md:text-sm text-muted-foreground mb-1">Saldo</p>
              <p className={`text-sm md:text-xl font-bold ${saldo >= 0 ? 'text-income' : 'text-expense'}`}>
                {formatCurrency(saldo)}
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
            placeholder="Buscar por descrição ou categoria..."
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
            <Button variant="outline" size="sm" className="bg-income/10 text-income border-income/20">
              <Plus className="h-4 w-4 mr-1" />
              Nova Entrada
            </Button>
            <Button variant="outline" size="sm" className="bg-expense/10 text-expense border-expense/20">
              <Plus className="h-4 w-4 mr-1" />
              Nova Saída
            </Button>
          </div>
        </div>

        {/* Container com scroll horizontal para as tabelas */}
        <div className="w-full">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            <div className="flex gap-4 min-w-max pb-2">
              {/* Tabela de Entradas */}
              {renderTransacaoTable(filteredEntradas, "Entrada", "text-income")}
              
              {/* Tabela de Saídas */}
              {renderTransacaoTable(filteredSaidas, "Saída", "text-expense")}
            </div>
          </div>
        </div>

        {/* Resumo das Tabelas */}
        <div className="grid grid-cols-2 gap-2 md:gap-4 pt-2 border-t">
          <div className="text-center p-2 md:p-3 bg-income/5 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Entradas Filtradas</p>
            <p className="text-sm font-bold text-income">
              {filteredEntradas.length} itens
            </p>
          </div>
          <div className="text-center p-2 md:p-3 bg-expense/5 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Saídas Filtradas</p>
            <p className="text-sm font-bold text-expense">
              {filteredSaidas.length} itens
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ObraDetalhes;