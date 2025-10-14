import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Save,
  User,
  Building,
  Calendar,
  MapPin,
  Settings,
  TrendingUp,
  TrendingDown,
  Pencil,
  Check,
  X
} from "lucide-react";
import { Obra, ConfiguracaoTabelas, TabelaConfig } from "@/types/obra";
import { atualizarObra, limparTransacoesTabelas } from "@/services/obraService";
import { toast } from "@/hooks/use-toast";

// Schema para validação do formulário
const editarObraSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cliente: z.string().min(1, "Cliente é obrigatório"),
  localizacao: z.string().min(1, "Localização é obrigatória"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  dataPrevista: z.string().min(1, "Data prevista é obrigatória"),
  status: z.string().min(1, "Status é obrigatório"),
  progresso: z.string().min(0, "Progresso deve ser positivo"),
});

type EditarObraFormData = z.infer<typeof editarObraSchema>;

interface EditarObraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obra: Obra | null;
  onSuccess?: () => void;
}

export const EditarObraDialog = ({ open, onOpenChange, obra, onSuccess }: EditarObraDialogProps) => {
  const [configuracaoTabelas, setConfiguracaoTabelas] = useState<ConfiguracaoTabelas>({
    entradas: [],
    saidas: []
  });
  const [novaTabela, setNovaTabela] = useState({ nome: "", tipo: "entrada" as "entrada" | "saida" });
  const [isLoading, setIsLoading] = useState(false);
  const [editandoTabela, setEditandoTabela] = useState<{ id: string; nome: string } | null>(null);

  const form = useForm<EditarObraFormData>({
    resolver: zodResolver(editarObraSchema),
    defaultValues: {
      nome: "",
      cliente: "",
      localizacao: "",
      responsavel: "",
      dataInicio: "",
      dataPrevista: "",
      status: "Planejamento",
      progresso: "0",
    },
  });

  // Atualizar form quando obra muda
  useEffect(() => {
    if (obra) {
      form.reset({
        nome: obra.nome,
        cliente: obra.cliente,
        localizacao: obra.localizacao,
        responsavel: obra.responsavel,
        dataInicio: obra.dataInicio,
        dataPrevista: obra.dataPrevista,
        status: obra.status,
        progresso: obra.progresso.toString(),
      });
      setConfiguracaoTabelas(obra.configuracaoTabelas);
    }
  }, [obra, form]);

  const adicionarTabela = () => {
    if (!novaTabela.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome da tabela é obrigatório",
        variant: "destructive"
      });
      return;
    }

    const id = `${novaTabela.tipo}-${Date.now()}`;
    const novaConfig: TabelaConfig = {
      id,
      nome: novaTabela.nome.trim(),
      tipo: novaTabela.tipo
    };

    setConfiguracaoTabelas(prev => ({
      ...prev,
      [novaTabela.tipo === "entrada" ? "entradas" : "saidas"]: [
        ...prev[novaTabela.tipo === "entrada" ? "entradas" : "saidas"],
        novaConfig
      ]
    }));

    setNovaTabela({ nome: "", tipo: "entrada" });
    
    toast({
      title: "Sucesso",
      description: `Tabela de ${novaTabela.tipo} adicionada`
    });
  };

  const removerTabela = (id: string, tipo: "entrada" | "saida") => {
    setConfiguracaoTabelas(prev => ({
      ...prev,
      [tipo === "entrada" ? "entradas" : "saidas"]: 
        prev[tipo === "entrada" ? "entradas" : "saidas"].filter(t => t.id !== id)
    }));
    
    toast({
      title: "Sucesso",
      description: `Tabela de ${tipo} removida`
    });
  };

  const iniciarEdicaoTabela = (tabela: TabelaConfig) => {
    setEditandoTabela({ id: tabela.id, nome: tabela.nome });
  };

  const cancelarEdicaoTabela = () => {
    setEditandoTabela(null);
  };

  const salvarEdicaoTabela = (tipo: "entrada" | "saida") => {
    if (!editandoTabela || !editandoTabela.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome da tabela não pode estar vazio",
        variant: "destructive"
      });
      return;
    }

    setConfiguracaoTabelas(prev => ({
      ...prev,
      [tipo === "entrada" ? "entradas" : "saidas"]: 
        prev[tipo === "entrada" ? "entradas" : "saidas"].map(t => 
          t.id === editandoTabela.id ? { ...t, nome: editandoTabela.nome.trim() } : t
        )
    }));

    toast({
      title: "Sucesso",
      description: "Tabela renomeada com sucesso"
    });

    setEditandoTabela(null);
  };

  const onSubmit = async (data: EditarObraFormData) => {
    if (!obra) return;

    // Validar se tem pelo menos uma tabela de cada tipo
    if (configuracaoTabelas.entradas.length === 0) {
      toast({
        title: "Erro",
        description: "Deve ter pelo menos uma tabela de entrada",
        variant: "destructive"
      });
      return;
    }

    if (configuracaoTabelas.saidas.length === 0) {
      toast({
        title: "Erro",
        description: "Deve ter pelo menos uma tabela de saída",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Obter IDs das tabelas que permanecerão
      const tabelasRestantes = [
        ...configuracaoTabelas.entradas.map(t => t.id),
        ...configuracaoTabelas.saidas.map(t => t.id)
      ];

      // Primeiro, limpar transações de tabelas removidas
      await limparTransacoesTabelas(obra.id, tabelasRestantes);

      // Depois, atualizar a obra
      await atualizarObra(obra.id, {
        nome: data.nome,
        cliente: data.cliente,
        localizacao: data.localizacao,
        responsavel: data.responsavel,
        dataInicio: data.dataInicio,
        dataPrevista: data.dataPrevista,
        status: data.status,
        progresso: parseInt(data.progresso),
        configuracaoTabelas
      });

      toast({
        title: "Sucesso",
        description: "Obra atualizada com sucesso!"
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao atualizar obra:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar obra",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = ["Planejamento", "Em Andamento", "Pausada", "Finalizada"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Editar Obra
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="dados" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dados" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Dados da Obra
            </TabsTrigger>
            <TabsTrigger value="tabelas" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Configurar Tabelas
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[calc(90vh-160px)]">
            <TabsContent value="dados" className="space-y-4 m-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Obra</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cliente"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cliente</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="localizacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localização</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="responsavel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsável</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dataInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data de Início</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dataPrevista"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data Prevista</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statusOptions.map(status => (
                                <SelectItem key={status} value={status}>
                                  {status}
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
                      name="progresso"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Progresso (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => onOpenChange(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="tabelas" className="space-y-4 m-0">
              {/* Adicionar Nova Tabela */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Adicionar Nova Tabela</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="nome-tabela">Nome da Tabela</Label>
                      <Input
                        id="nome-tabela"
                        value={novaTabela.nome}
                        onChange={(e) => setNovaTabela(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Ex: Materiais, Mão de obra, etc."
                      />
                    </div>
                    <div className="w-40">
                      <Label>Tipo</Label>
                      <Select 
                        value={novaTabela.tipo} 
                        onValueChange={(value) => setNovaTabela(prev => ({ ...prev, tipo: value as "entrada" | "saida" }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entrada">Entrada</SelectItem>
                          <SelectItem value="saida">Saída</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={adicionarTabela}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabelas de Entrada */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-income">
                    <TrendingUp className="h-5 w-5" />
                    Tabelas de Entrada ({configuracaoTabelas.entradas.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {configuracaoTabelas.entradas.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhuma tabela de entrada configurada
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {configuracaoTabelas.entradas.map((tabela) => (
                        <div key={tabela.id} className="flex items-center justify-between p-3 border rounded-lg bg-income/5">
                          {editandoTabela?.id === tabela.id ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                value={editandoTabela.nome}
                                onChange={(e) => setEditandoTabela({ ...editandoTabela, nome: e.target.value })}
                                className="h-8"
                                autoFocus
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => salvarEdicaoTabela("entrada")}
                                className="text-income hover:text-income"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelarEdicaoTabela}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Badge variant="outline" className="text-income border-income/20">
                                {tabela.nome}
                              </Badge>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => iniciarEdicaoTabela(tabela)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removerTabela(tabela.id, "entrada")}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tabelas de Saída */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-expense">
                    <TrendingDown className="h-5 w-5" />
                    Tabelas de Saída ({configuracaoTabelas.saidas.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {configuracaoTabelas.saidas.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhuma tabela de saída configurada
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {configuracaoTabelas.saidas.map((tabela) => (
                        <div key={tabela.id} className="flex items-center justify-between p-3 border rounded-lg bg-expense/5">
                          {editandoTabela?.id === tabela.id ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                value={editandoTabela.nome}
                                onChange={(e) => setEditandoTabela({ ...editandoTabela, nome: e.target.value })}
                                className="h-8"
                                autoFocus
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => salvarEdicaoTabela("saida")}
                                className="text-expense hover:text-expense"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelarEdicaoTabela}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Badge variant="outline" className="text-expense border-expense/20">
                                {tabela.nome}
                              </Badge>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => iniciarEdicaoTabela(tabela)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removerTabela(tabela.id, "saida")}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};