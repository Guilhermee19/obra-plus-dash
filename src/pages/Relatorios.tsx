import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  HardHat,
  Users,
  Calendar,
  BarChart3,
  Download,
  Filter
} from "lucide-react";

const Relatorios = () => {
  // Dados mockados para relatórios
  const resumoMensal = {
    totalObras: 12,
    obrasFinalizadas: 3,
    totalEntradas: 480000,
    totalSaidas: 320000,
    lucroMensal: 160000,
    crescimentoMensal: 12.5
  };

  const obrasPorStatus = [
    { status: "Em Andamento", quantidade: 5, valor: 245000 },
    { status: "Planejamento", quantidade: 4, valor: 180000 },
    { status: "Finalizada", quantidade: 3, valor: 55000 }
  ];

  const topClientes = [
    { nome: "Construtora Renovar", valor: 340000, obras: 2 },
    { nome: "Indústrias ABC", valor: 95000, obras: 1 },
    { nome: "João Silva", valor: 78000, obras: 1 },
    { nome: "Maria Santos", valor: 125000, obras: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios e Análises</h1>
          <p className="text-muted-foreground">Insights e métricas do seu negócio</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button className="bg-gradient-to-r from-primary to-construction text-white">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Resumo Executivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Obras Ativas
            </CardTitle>
            <HardHat className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{resumoMensal.totalObras}</div>
            <p className="text-xs text-income mt-1">
              +{resumoMensal.crescimentoMensal}% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-income" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">
              R$ {resumoMensal.totalEntradas.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Entradas do período
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Custos Totais
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-expense" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">
              R$ {resumoMensal.totalSaidas.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Saídas do período
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lucro Líquido
            </CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">
              R$ {resumoMensal.lucroMensal.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Margem de {((resumoMensal.lucroMensal / resumoMensal.totalEntradas) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Obras por Status e Top Clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Obras por Status */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Obras por Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {obrasPorStatus.map((item, index) => {
              const getStatusColor = (status: string) => {
                switch (status) {
                  case "Em Andamento": return "bg-primary text-primary-foreground";
                  case "Planejamento": return "bg-construction text-white";
                  case "Finalizada": return "bg-income text-white";
                  default: return "bg-muted text-muted-foreground";
                }
              };

              return (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <span className="font-medium text-foreground">{item.quantidade} obras</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      R$ {(item.valor / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Top Clientes */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Top Clientes por Valor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topClientes.map((cliente, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-construction rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{cliente.nome}</p>
                    <p className="text-xs text-muted-foreground">{cliente.obras} obra(s)</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-income">
                    R$ {cliente.valor.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Evolução Mensal - Receitas vs Custos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-primary/10 to-construction/10 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Gráfico de evolução mensal</p>
                <p className="text-xs text-muted-foreground mt-1">Implementação futura com biblioteca de gráficos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Distribuição de Custos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gradient-to-br from-income/10 to-expense/10 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Gráfico de distribuição de custos</p>
                <p className="text-xs text-muted-foreground mt-1">Material, Mão de obra, Impostos, etc.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Insights */}
      <Card className="shadow-card border-construction/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-construction">
            <Calendar className="h-5 w-5" />
            Insights e Alertas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-income/10 border border-income/20 rounded-lg">
            <p className="font-medium text-income">📈 Crescimento Positivo</p>
            <p className="text-sm text-muted-foreground">
              Suas receitas cresceram 12.5% comparado ao mês anterior. Continue assim!
            </p>
          </div>
          
          <div className="p-4 bg-construction/10 border border-construction/20 rounded-lg">
            <p className="font-medium text-construction">⚠️ Obras com Atraso</p>
            <p className="text-sm text-muted-foreground">
              2 obras estão com cronograma atrasado. Considere revisar os prazos.
            </p>
          </div>
          
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="font-medium text-primary">💡 Oportunidade</p>
            <p className="text-sm text-muted-foreground">
              Cliente "Construtora Renovar" tem o maior potencial de novas obras.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relatorios;