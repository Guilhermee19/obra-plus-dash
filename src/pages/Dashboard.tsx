import { useState } from "react";
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

// Dados mockados para demonstração
const mockObras = [
  {
    id: 1,
    nome: "Residencial Vila Nova",
    cliente: "João Silva",
    status: "Em Andamento",
    progresso: 65,
    entrada: 45000,
    saida: 28000,
    saldo: 17000,
    localizacao: "Zona Sul",
    dataInicio: "15/01/2024"
  },
  {
    id: 2,
    nome: "Comercial Center Point",
    cliente: "Maria Santos",
    status: "Planejamento",
    progresso: 15,
    entrada: 125000,
    saida: 18000,
    saldo: 107000,
    localizacao: "Centro",
    dataInicio: "22/02/2024"
  },
  {
    id: 3,
    nome: "Casa Moderna Premium",
    cliente: "Pedro Costa",
    status: "Finalizada",
    progresso: 100,
    entrada: 78000,
    saida: 65000,
    saldo: 13000,
    localizacao: "Zona Norte",
    dataInicio: "08/11/2023"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isNovaObraOpen, setIsNovaObraOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todas");

  // Filtrar obras baseado na aba ativa
  const filteredObras = mockObras.filter(obra => {
    switch (activeTab) {
      case "andamento":
        return obra.status === "Em Andamento" || obra.status === "Planejamento";
      case "finalizadas":
        return obra.status === "Finalizada";
      default:
        return true;
    }
  });

  const totalObras = filteredObras.length;
  const obrasAtivas = filteredObras.filter(obra => obra.status !== "Finalizada").length;
  const totalEntradas = filteredObras.reduce((acc, obra) => acc + obra.entrada, 0);
  const totalSaidas = filteredObras.reduce((acc, obra) => acc + obra.saida, 0);
  const saldoTotal = totalEntradas - totalSaidas;

  const handleNovaObra = (data: any) => {
    console.log("Nova obra criada:", data);
    // Aqui você implementaria a lógica para salvar a obra
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
            <div className="text-2xl font-bold text-foreground">{totalObras}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {obrasAtivas} em andamento
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
              R$ {totalEntradas.toLocaleString('pt-BR')}
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
              R$ {totalSaidas.toLocaleString('pt-BR')}
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
            <div className={`text-2xl font-bold ${saldoTotal >= 0 ? 'text-income' : 'text-expense'}`}>
              R$ {Math.abs(saldoTotal).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {saldoTotal >= 0 ? 'Lucro' : 'Prejuízo'} acumulado
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
            <TabsTrigger value="todas">Todas ({mockObras.length})</TabsTrigger>
            <TabsTrigger value="andamento">Em Andamento ({mockObras.filter(o => o.status === "Em Andamento" || o.status === "Planejamento").length})</TabsTrigger>
            <TabsTrigger value="finalizadas">Finalizadas ({mockObras.filter(o => o.status === "Finalizada").length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-4">
              {filteredObras.length === 0 ? (
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
                filteredObras.map((obra) => (
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
                              <span className="text-muted-foreground">Início: {obra.dataInicio}</span>
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
                                R$ {(obra.entrada / 1000).toFixed(0)}k
                              </p>
                            </div>
                            <div className="p-3 bg-expense/10 rounded-lg">
                              <p className="text-xs text-muted-foreground">Saídas</p>
                              <p className="font-semibold text-expense text-sm">
                                R$ {(obra.saida / 1000).toFixed(0)}k
                              </p>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <p className="text-xs text-muted-foreground">Saldo</p>
                              <p className={`font-semibold text-sm ${obra.saldo >= 0 ? 'text-income' : 'text-expense'}`}>
                                R$ {(Math.abs(obra.saldo) / 1000).toFixed(0)}k
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
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