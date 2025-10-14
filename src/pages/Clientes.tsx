import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import NovoClienteDialog from "@/components/NovoClienteDialog";
import EditarClienteDialog from "@/components/EditarClienteDialog";
import { obterClientes, deletarCliente } from "@/services/clienteService";
import { Cliente } from "@/types/cliente";
import { 
  Plus, 
  Search, 
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  HardHat,
  Trash2
} from "lucide-react";

const Clientes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [novoClienteOpen, setNovoClienteOpen] = useState(false);
  const [editarClienteOpen, setEditarClienteOpen] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteParaDeletar, setClienteParaDeletar] = useState<Cliente | null>(null);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    const clientesCarregados = await obterClientes();
    setClientes(clientesCarregados);
  };

  const handleDeletarCliente = async () => {
    if (!clienteParaDeletar) return;

    try {
      await deletarCliente(clienteParaDeletar.id);
      toast({
        title: "Cliente deletado",
        description: `${clienteParaDeletar.nome} foi removido com sucesso.`,
      });
      await carregarClientes();
      setDeleteDialogOpen(false);
      setClienteParaDeletar(null);
    } catch (error) {
      toast({
        title: "Erro ao deletar cliente",
        description: "Ocorreu um erro ao deletar o cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditarClick = (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    setEditarClienteOpen(true);
  };

  const handleDeleteClick = (cliente: Cliente) => {
    setClienteParaDeletar(cliente);
    setDeleteDialogOpen(true);
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "Todos" || cliente.tipo === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTipoColor = (tipo: string) => {
    return tipo === "Pessoa Física" 
      ? "bg-primary/10 text-primary border-primary/20" 
      : "bg-construction/10 text-construction border-construction/20";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento": return "bg-primary/10 text-primary";
      case "Planejamento": return "bg-construction/10 text-construction";
      case "Finalizada": return "bg-income/10 text-income";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const typeOptions = ["Todos", "Pessoa Física", "Pessoa Jurídica"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Clientes</h1>
          <p className="text-muted-foreground">Controle e gerencie sua carteira de clientes</p>
        </div>
        <Button 
          onClick={() => setNovoClienteOpen(true)}
          className="bg-gradient-to-r from-primary to-construction text-white shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{clientes.length}</div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-primary">
                PF: {clientes.filter(c => c.tipo === "Pessoa Física").length}
              </span>
              <span className="text-construction">
                PJ: {clientes.filter(c => c.tipo === "Pessoa Jurídica").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Obras Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Em andamento + planejamento
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total Contratado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-income">
              R$ {clientes.reduce((acc, cliente) => acc + (cliente.valorTotal || 0), 0).toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Soma de todas as obras
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou email do cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {typeOptions.map((type) => (
            <Button
              key={type}
              variant={typeFilter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter(type)}
              className="whitespace-nowrap"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="grid gap-4">
        {filteredClientes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground text-lg mb-2">Nenhum cliente encontrado</p>
              <p className="text-muted-foreground">Tente ajustar os filtros ou cadastrar um novo cliente</p>
            </CardContent>
          </Card>
        ) : (
          filteredClientes.map((cliente) => (
            <Card key={cliente.id} className="shadow-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Informações do Cliente */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-xl text-foreground mb-1">{cliente.nome}</h3>
                        <Badge className={getTipoColor(cliente.tipo)}>
                          {cliente.tipo}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-income">
                          R$ {cliente.valorTotal.toLocaleString('pt-BR')}
                        </p>
                        <p className="text-xs text-muted-foreground">Valor total</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground truncate">{cliente.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">{cliente.telefone}</span>
                      </div>
                      <div className="flex items-start gap-2 md:col-span-2">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{cliente.endereco}</span>
                      </div>
                    </div>

                  </div>

                  {/* Ações e Info Adicional */}
                  <div className="lg:w-64 space-y-4">
                    {cliente.dataUltimaObra && (
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Última obra</p>
                        <p className="font-semibold text-foreground">{cliente.dataUltimaObra}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleEditarClick(cliente)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Cliente
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleDeleteClick(cliente)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Deletar Cliente
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialogs */}
      <NovoClienteDialog
        open={novoClienteOpen}
        onOpenChange={setNovoClienteOpen}
        onClienteCriado={carregarClientes}
      />

      <EditarClienteDialog
        open={editarClienteOpen}
        onOpenChange={setEditarClienteOpen}
        cliente={clienteSelecionado}
        onClienteAtualizado={carregarClientes}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o cliente <strong>{clienteParaDeletar?.nome}</strong>? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletarCliente} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clientes;