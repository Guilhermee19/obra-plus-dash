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
  Edit,
  Trash2,
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

  const filteredTransacoes = transacoes.filter(transacao => {
    const matchesSearch = transacao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transacao.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === "Todos" || transacao.tipo === tipoFilter;
    return matchesSearch && matchesTipo;
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

  const getTipoColor = (tipo: string) => {
    return tipo === "Entrada" ? "text-income" : "text-expense";
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === "Entrada" 
      ? "bg-income/10 text-income border-income/20" 
      : "bg-expense/10 text-expense border-expense/20";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entradas</p>
                <p className="text-2xl font-bold text-income">{formatCurrency(totalEntradas)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-income" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Saídas</p>
                <p className="text-2xl font-bold text-expense">{formatCurrency(totalSaidas)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-expense" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Atual</p>
                <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-income' : 'text-expense'}`}>
                  {formatCurrency(saldo)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
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
        <div className="flex gap-2">
          {["Todos", "Entrada", "Saída"].map((tipo) => (
            <Button
              key={tipo}
              variant={tipoFilter === tipo ? "default" : "outline"}
              size="sm"
              onClick={() => setTipoFilter(tipo)}
              className="whitespace-nowrap"
            >
              {tipo}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabela de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Controle de Entradas e Saídas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="hidden sm:table-cell">Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransacoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">Nenhuma transação encontrada</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransacoes.map((transacao) => (
                    <TableRow key={transacao.id}>
                      <TableCell className="font-medium">{transacao.data}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getTipoBadge(transacao.tipo)}>
                          {transacao.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>{transacao.categoria}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {transacao.descricao}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${getTipoColor(transacao.tipo)}`}>
                        {formatCurrency(transacao.valor)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Footer com Total */}
      {filteredTransacoes.length > 0 && (
        <div className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            Mostrando {filteredTransacoes.length} transações
          </p>
        </div>
      )}
    </div>
  );
};

export default ObraDetalhes;