import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NovaObraDialog } from "@/components/NovaObraDialog";
import { EditarObraDialog } from "@/components/EditarObraDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye,
  Edit,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Obra, ConfiguracaoTabelas } from "@/types/obra";
import { obterObras, criarNovaObra, calcularResumoFinanceiro } from "@/services/obraService";
import { toast } from "@/hooks/use-toast";

const Obras = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [isNovaObraOpen, setIsNovaObraOpen] = useState(false);
  const [isEditarObraOpen, setIsEditarObraOpen] = useState(false);
  const [obraSelecionada, setObraSelecionada] = useState<Obra | null>(null);
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar obras ao montar o componente
  useEffect(() => {
    const carregarObras = async () => {
      setLoading(true);
      try {
        const obrasData = await obterObras();
        setObras(obrasData);
      } catch (error) {
        console.error("Erro ao carregar obras:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar obras",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    carregarObras();
  }, []);

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
      
      // Recarregar obras
      const obrasData = await obterObras();
      setObras(obrasData);
      
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

  const handleEditarObra = (obra: Obra) => {
    setObraSelecionada(obra);
    setIsEditarObraOpen(true);
  };

  const handleSuccessEdit = async () => {
    // Recarregar obras após edição
    try {
      const obrasData = await obterObras();
      setObras(obrasData);
    } catch (error) {
      console.error("Erro ao recarregar obras:", error);
    }
  };

  const filteredObras = obras.filter(obra => {
    const matchesSearch = obra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obra.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "Todos" || obra.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento": return "bg-primary text-primary-foreground";
      case "Planejamento": return "bg-construction text-white";
      case "Finalizada": return "bg-income text-white";
      case "Pausada": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const statusOptions = ["Todos", "Em Andamento", "Planejamento", "Finalizada", "Pausada"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Obras</h1>
          <p className="text-muted-foreground">Controle e monitore todas as suas obras</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-primary to-construction text-white shadow-lg hover:shadow-xl transition-all"
          onClick={() => setIsNovaObraOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Obra
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome da obra ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="whitespace-nowrap"
            >
              <Filter className="h-3 w-3 mr-1" />
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Lista de Obras */}
      <div className="grid gap-6">
        {loading ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">Carregando obras...</p>
            </CardContent>
          </Card>
        ) : filteredObras.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground text-lg mb-2">Nenhuma obra encontrada</p>
              <p className="text-muted-foreground">Tente ajustar os filtros ou criar uma nova obra</p>
            </CardContent>
          </Card>
        ) : (
          filteredObras.map((obra) => {
            // Para agora, usar valores padrão - posteriormente será calculado do serviço
            const entrada = 0;
            const saida = 0;
            const saldo = entrada - saida;
            
            return (
            <Card key={obra.id} className="shadow-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                  {/* Informações Principais */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-xl text-foreground mb-1">{obra.nome}</h3>
                        <p className="text-muted-foreground">Cliente: {obra.cliente}</p>
                        <p className="text-muted-foreground text-sm">Responsável: {obra.responsavel}</p>
                      </div>
                      <Badge className={`${getStatusColor(obra.status)} text-sm px-3 py-1`}>
                        {obra.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">{obra.localizacao}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Início: {new Date(obra.dataInicio).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Previsão: {new Date(obra.dataPrevista).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    {/* Progresso */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Progresso da Obra</span>
                        <span className="text-sm font-semibold text-foreground">{obra.progresso}%</span>
                      </div>
                      <div className="bg-muted rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-primary to-construction h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                          style={{ width: `${obra.progresso}%` }}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financeiro e Ações */}
                  <div className="xl:w-80 space-y-4">
                    {/* Resumo Financeiro */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-4 bg-income/10 rounded-lg text-center">
                        <TrendingUp className="h-5 w-5 text-income mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Entradas</p>
                        <p className="font-bold text-income">
                          R$ {(entrada / 1000).toFixed(0)}k
                        </p>
                      </div>
                      <div className="p-4 bg-expense/10 rounded-lg text-center">
                        <TrendingDown className="h-5 w-5 text-expense mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Saídas</p>
                        <p className="font-bold text-expense">
                          R$ {(saida / 1000).toFixed(0)}k
                        </p>
                      </div>
                      <div className="p-4 bg-primary/10 rounded-lg text-center">
                        <DollarSign className="h-5 w-5 text-primary mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground mb-1">Saldo</p>
                        <p className={`font-bold ${saldo >= 0 ? 'text-income' : 'text-expense'}`}>
                          R$ {(Math.abs(saldo) / 1000).toFixed(0)}k
                        </p>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/obras/${obra.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditarObra(obra)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            );
          })
        )}
      </div>

      {/* Paginação seria implementada aqui */}
      {filteredObras.length > 0 && (
        <div className="flex justify-center">
          <p className="text-muted-foreground text-sm">
          Mostrando {filteredObras.length} de {obras.length} obras
          </p>
        </div>
      )}

      {/* Modal Nova Obra */}
      <NovaObraDialog
        open={isNovaObraOpen}
        onOpenChange={setIsNovaObraOpen}
        onSubmit={handleNovaObra}
      />

      {/* Modal Editar Obra */}
      <EditarObraDialog
        open={isEditarObraOpen}
        onOpenChange={setIsEditarObraOpen}
        obra={obraSelecionada}
        onSuccess={handleSuccessEdit}
      />
    </div>
  );
};

export default Obras;