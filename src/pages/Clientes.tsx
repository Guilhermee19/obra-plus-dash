import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Phone,
  Mail,
  MapPin,
  Building,
  Eye,
  Edit,
  HardHat
} from "lucide-react";

// Dados mockados de clientes
const mockClientes = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "(11) 99999-1111",
    endereco: "Rua das Flores, 123 - Zona Sul, SP",
    tipo: "Pessoa Física",
    obras: [
      { id: 1, nome: "Residencial Vila Nova", status: "Em Andamento" }
    ],
    valorTotal: 45000,
    dataUltimaObra: "15/01/2024"
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria.santos@empresa.com",
    telefone: "(11) 99999-2222",
    endereco: "Av. Paulista, 1000 - Centro, SP",
    tipo: "Pessoa Física",
    obras: [
      { id: 2, nome: "Comercial Center Point", status: "Planejamento" }
    ],
    valorTotal: 125000,
    dataUltimaObra: "22/02/2024"
  },
  {
    id: 3,
    nome: "Pedro Costa",
    email: "pedro.costa@gmail.com",
    telefone: "(11) 99999-3333",
    endereco: "Rua dos Pinheiros, 456 - Zona Norte, SP",
    tipo: "Pessoa Física",
    obras: [
      { id: 3, nome: "Casa Moderna Premium", status: "Finalizada" }
    ],
    valorTotal: 78000,
    dataUltimaObra: "08/11/2023"
  },
  {
    id: 4,
    nome: "Indústrias ABC Ltda",
    email: "contato@industriasabc.com.br",
    telefone: "(11) 3333-4444",
    endereco: "Rod. Industrial, Km 15 - Zona Industrial, SP",
    tipo: "Pessoa Jurídica",
    obras: [
      { id: 4, nome: "Reforma Industrial Matriz", status: "Em Andamento" }
    ],
    valorTotal: 95000,
    dataUltimaObra: "10/03/2024"
  },
  {
    id: 5,
    nome: "Construtora Renovar",
    email: "obras@renovar.com.br",
    telefone: "(11) 4444-5555",
    endereco: "Av. Marginal, 2500 - Vila Madalena, SP",
    tipo: "Pessoa Jurídica",
    obras: [
      { id: 5, nome: "Condomínio Solar", status: "Planejamento" },
      { id: 6, nome: "Prédio Comercial Beta", status: "Em Andamento" }
    ],
    valorTotal: 340000,
    dataUltimaObra: "01/04/2024"
  }
];

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");

  const filteredClientes = mockClientes.filter(cliente => {
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
        <Button className="bg-gradient-to-r from-primary to-construction text-white shadow-lg hover:shadow-xl transition-all">
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
            <div className="text-2xl font-bold text-foreground">{mockClientes.length}</div>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="text-primary">
                PF: {mockClientes.filter(c => c.tipo === "Pessoa Física").length}
              </span>
              <span className="text-construction">
                PJ: {mockClientes.filter(c => c.tipo === "Pessoa Jurídica").length}
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
            <div className="text-2xl font-bold text-foreground">
              {mockClientes.reduce((acc, cliente) => 
                acc + cliente.obras.filter(obra => obra.status !== "Finalizada").length, 0
              )}
            </div>
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
              R$ {mockClientes.reduce((acc, cliente) => acc + cliente.valorTotal, 0).toLocaleString('pt-BR')}
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

                    {/* Obras do Cliente */}
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <HardHat className="h-4 w-4" />
                        Obras ({cliente.obras.length})
                      </h4>
                      <div className="space-y-2">
                        {cliente.obras.map((obra) => (
                          <div key={obra.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="font-medium text-foreground">{obra.nome}</span>
                            <Badge className={getStatusColor(obra.status)} variant="outline">
                              {obra.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Ações e Info Adicional */}
                  <div className="lg:w-64 space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Última obra</p>
                      <p className="font-semibold text-foreground">{cliente.dataUltimaObra}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Cliente
                      </Button>
                      <Button size="sm" className="w-full bg-gradient-to-r from-primary to-construction text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Obra
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Clientes;