import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NovaObraDialog } from "@/components/NovaObraDialog";
import { 
  HardHat, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react";
import { Obra, ConfiguracaoTabelas } from "@/types/obra";
import { criarNovaObra, calcularResumoGeral } from "@/services/obraService";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isNovaObraOpen, setIsNovaObraOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todas");
  const [resumoData, setResumoData] = useState({
    totalObras: 0,
    obrasAtivas: 0,
    totalEntradas: 0,
    totalSaidas: 0,
    saldo: 0,
    obras: [] as Obra[]
  });
  const [loading, setLoading] = useState(true);

  // Carregar dados ao montar o componente e quando a aba muda
  useEffect(() => {
    const carregarResumo = async () => {
      setLoading(true);
      try {
        const dados = await calcularResumoGeral(activeTab);
        setResumoData(dados);
      } catch (error) {
        console.error("Erro ao carregar resumo:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados das obras",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    carregarResumo();
  }, [activeTab]);

  const handleNovaObra = async (data: {
    nome: string;
    cliente: string;
    localizacao: string;
    responsavel: string;
    dataInicio: string;
    dataPrevista: string;
    configuracaoTabelas: ConfiguracaoTabelas;
  }) => {
    try {
      await criarNovaObra(data);
      toast({
        title: "Sucesso",
        description: "Nova obra criada com sucesso!"
      });
      
      // Recarregar dados
      const dados = await calcularResumoGeral(activeTab);
      setResumoData(dados);
      
      setIsNovaObraOpen(false);
    } catch (error) {
      console.error("Erro ao criar obra:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar nova obra",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento": return "bg-primary text-primary-foreground";
      case "Planejamento": return "bg-construction text-white";
      case "Finalizada": return "bg-income text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das suas obras</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-primary to-construction text-white shadow-lg hover:shadow-xl transition-all"
          onClick={() => setIsNovaObraOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Obra
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Obras
            </CardTitle>
            <HardHat className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{resumoData.totalObras}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {resumoData.obrasAtivas} em andamento
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Entradas
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-income" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">
              R$ {resumoData.totalEntradas.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Saídas
            </CardTitle>
            <TrendingDown className="h-5 w-5 text-expense" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">
              R$ {resumoData.totalSaidas.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              -5% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Total
            </CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${resumoData.saldo >= 0 ? 'text-income' : 'text-expense'}`}>
              R$ {Math.abs(resumoData.saldo).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {resumoData.saldo >= 0 ? 'Lucro' : 'Prejuízo'} acumulado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Obras com Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Gestão de Obras</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/obras")}>
            Ver Todas
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todas" disabled={loading}>
              Todas ({resumoData.totalObras})
            </TabsTrigger>
            <TabsTrigger value="andamento" disabled={loading}>
              Em Andamento ({resumoData.obrasAtivas})
            </TabsTrigger>
            <TabsTrigger value="finalizadas" disabled={loading}>
              Finalizadas ({resumoData.totalObras - resumoData.obrasAtivas})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-4">
              {loading ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground">Carregando dados...</p>
                  </CardContent>
                </Card>
              ) : resumoData.obras.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground text-lg mb-2">Nenhuma obra encontrada</p>
                    <p className="text-muted-foreground">
                      {activeTab === "todas" && "Comece criando sua primeira obra"}
                      {activeTab === "andamento" && "Não há obras em andamento no momento"}
                      {activeTab === "finalizadas" && "Não há obras finalizadas ainda"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                resumoData.obras.map((obra) => {
                  // Calcular valores financeiros da obra baseado nas transações
                  const entrada = 0; // Será calculado pelo serviço posteriormente
                  const saida = 0; // Será calculado pelo serviço posteriormente
                  const saldo = entrada - saida;
                  
                  return (
                  <Card 
                    key={obra.id} 
                    className="shadow-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/obras/${obra.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <div>
                              <h3 className="font-semibold text-lg text-foreground">{obra.nome}</h3>
                              <p className="text-muted-foreground">{obra.cliente}</p>
                            </div>
                            <Badge className={getStatusColor(obra.status)}>
                              {obra.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{obra.localizacao}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Início: {new Date(obra.dataInicio).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">Progresso: {obra.progresso}%</span>
                            </div>
                          </div>

                          {/* Barra de Progresso */}
                          <div className="mt-3 bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary to-construction h-2 rounded-full transition-all duration-500"
                              style={{ width: `${obra.progresso}%` }}
                            />
                          </div>
                        </div>

                        <div className="lg:w-64 lg:pl-6">
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3 bg-income/10 rounded-lg">
                              <p className="text-xs text-muted-foreground">Entradas</p>
                              <p className="font-semibold text-income text-sm">
                                R$ {(entrada / 1000).toFixed(0)}k
                              </p>
                            </div>
                            <div className="p-3 bg-expense/10 rounded-lg">
                              <p className="text-xs text-muted-foreground">Saídas</p>
                              <p className="font-semibold text-expense text-sm">
                                R$ {(saida / 1000).toFixed(0)}k
                              </p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <p className="text-xs text-muted-foreground">Saldo</p>
                              <p className={`font-semibold text-sm ${saldo >= 0 ? 'text-income' : 'text-expense'}`}>
                                R$ {(Math.abs(saldo) / 1000).toFixed(0)}k
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Nova Obra */}
      <NovaObraDialog
        open={isNovaObraOpen}
        onOpenChange={setIsNovaObraOpen}
        onSubmit={handleNovaObra}
      />
    </div>
  );
};

export default Dashboard;