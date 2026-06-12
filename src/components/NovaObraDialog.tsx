import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Minus, Table } from "lucide-react";

const obraSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cliente: z.string().min(1, "Cliente é obrigatório"),
  localizacao: z.string().min(1, "Localização é obrigatória"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  dataPrevista: z.string().min(1, "Data prevista é obrigatória"),
  entidade: z.enum(["ARF", "Manu", "Sem nota"]),
  valorOrcado: z.string().optional(),
});

type ObraFormData = z.infer<typeof obraSchema>;

interface NovaObraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    nome: string;
    cliente: string;
    localizacao: string;
    responsavel: string;
    dataInicio: string;
    dataPrevista: string;
    entidade: "ARF" | "Manu" | "Sem nota";
    valorOrcado: number;
    configuracaoTabelas: ConfiguracaoTabelas;
  }) => void;
}

interface TabelaConfig {
  id: string;
  nome: string;
  tipo: "entrada" | "saida";
}

interface ConfiguracaoTabelas {
  entradas: TabelaConfig[];
  saidas: TabelaConfig[];
}

export function NovaObraDialog({ open, onOpenChange, onSubmit }: NovaObraDialogProps) {
  const [configuracaoTabelas, setConfiguracaoTabelas] = useState<ConfiguracaoTabelas>({
    entradas: [{ id: "1", nome: "Entradas Principais", tipo: "entrada" }],
    saidas: [{ id: "1", nome: "Saídas Principais", tipo: "saida" }]
  });

  const form = useForm<ObraFormData>({
    resolver: zodResolver(obraSchema),
    defaultValues: {
      nome: "",
      cliente: "",
      localizacao: "",
      responsavel: "",
      dataInicio: "",
      dataPrevista: "",
      entidade: "ARF",
      valorOrcado: "",
    },
  });

  const adicionarTabela = (tipo: "entrada" | "saida") => {
    const novaTabela: TabelaConfig = {
      id: Date.now().toString(),
      nome: tipo === "entrada" ? `Entradas ${configuracaoTabelas.entradas.length + 1}` : `Saídas ${configuracaoTabelas.saidas.length + 1}`,
      tipo
    };

    setConfiguracaoTabelas(prev => ({
      ...prev,
      [tipo === "entrada" ? "entradas" : "saidas"]: [...prev[tipo === "entrada" ? "entradas" : "saidas"], novaTabela]
    }));
  };

  const removerTabela = (tipo: "entrada" | "saida", id: string) => {
    const tabelas = configuracaoTabelas[tipo === "entrada" ? "entradas" : "saidas"];
    if (tabelas.length > 1) {
      setConfiguracaoTabelas(prev => ({
        ...prev,
        [tipo === "entrada" ? "entradas" : "saidas"]: tabelas.filter(t => t.id !== id)
      }));
    }
  };

  const atualizarNomeTabela = (tipo: "entrada" | "saida", id: string, nome: string) => {
    setConfiguracaoTabelas(prev => ({
      ...prev,
      [tipo === "entrada" ? "entradas" : "saidas"]: prev[tipo === "entrada" ? "entradas" : "saidas"].map(t => 
        t.id === id ? { ...t, nome } : t
      )
    }));
  };

  const handleSubmit = (data: ObraFormData) => {
    onSubmit({
      nome: data.nome ?? "",
      cliente: data.cliente ?? "",
      localizacao: data.localizacao ?? "",
      responsavel: data.responsavel ?? "",
      dataInicio: data.dataInicio ?? "",
      dataPrevista: data.dataPrevista ?? "",
      entidade: data.entidade ?? "ARF",
      valorOrcado: data.valorOrcado ? Number(data.valorOrcado) : 0,
      configuracaoTabelas,
    });
    form.reset();
    setConfiguracaoTabelas({
      entradas: [{ id: "1", nome: "Entradas Principais", tipo: "entrada" }],
      saidas: [{ id: "1", nome: "Saídas Principais", tipo: "saida" }]
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] sm:h-[90vh] overflow-hidden flex flex-col p-3 sm:p-6">
        <DialogHeader className="flex-shrink-0 pb-2 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl">Nova Obra</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-1 sm:pr-2">
              {/* Informações Básicas */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Nome da Obra</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Residencial Vila Nova" {...field} className="text-sm" />
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
                        <FormLabel className="text-sm">Cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do cliente" {...field} className="text-sm" />
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
                        <FormLabel className="text-sm">Localização</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Zona Sul, SP" {...field} className="text-sm" />
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
                        <FormLabel className="text-sm">Responsável</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do responsável" {...field} className="text-sm" />
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
                        <FormLabel className="text-sm">Data de Início</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="text-sm" />
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
                        <FormLabel className="text-sm">Data Prevista</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="entidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Entidade (faturamento)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ARF">ARF</SelectItem>
                            <SelectItem value="Manu">Manu</SelectItem>
                            <SelectItem value="Sem nota">Sem nota</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valorOrcado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Valor Orçado (R$)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0,00" {...field} className="text-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Configuração das Tabelas */}
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Table className="h-4 w-4 sm:h-5 sm:w-5" />
                    Configuração das Tabelas Financeiras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Tabelas de Entrada */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm sm:text-base font-medium text-income">Tabelas de Entrada</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => adicionarTabela("entrada")}
                        className="text-income border-income/20 hover:bg-income/10 text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Adicionar</span>
                        <span className="sm:hidden">+</span>
                      </Button>
                    </div>
                    
                    <div className="grid gap-2 sm:gap-3">
                      {configuracaoTabelas.entradas.map((tabela, index) => (
                        <div key={tabela.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg bg-income/5">
                          <Badge variant="secondary" className="bg-income/20 text-income text-xs flex-shrink-0">
                            E{index + 1}
                          </Badge>
                          <Input
                            value={tabela.nome}
                            onChange={(e) => atualizarNomeTabela("entrada", tabela.id, e.target.value)}
                            placeholder="Nome da tabela de entrada"
                            className="flex-1 text-sm"
                          />
                          {configuracaoTabelas.entradas.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removerTabela("entrada", tabela.id)}
                              className="text-expense border-expense/20 hover:bg-expense/10 p-1 sm:p-2 flex-shrink-0"
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tabelas de Saída */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm sm:text-base font-medium text-expense">Tabelas de Saída</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => adicionarTabela("saida")}
                        className="text-expense border-expense/20 hover:bg-expense/10 text-xs sm:text-sm px-2 sm:px-3"
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        <span className="hidden sm:inline">Adicionar</span>
                        <span className="sm:hidden">+</span>
                      </Button>
                    </div>
                    
                    <div className="grid gap-2 sm:gap-3">
                      {configuracaoTabelas.saidas.map((tabela, index) => (
                        <div key={tabela.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg bg-expense/5">
                          <Badge variant="secondary" className="bg-expense/20 text-expense text-xs flex-shrink-0">
                            S{index + 1}
                          </Badge>
                          <Input
                            value={tabela.nome}
                            onChange={(e) => atualizarNomeTabela("saida", tabela.id, e.target.value)}
                            placeholder="Nome da tabela de saída"
                            className="flex-1 text-sm"
                          />
                          {configuracaoTabelas.saidas.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removerTabela("saida", tabela.id)}
                              className="text-expense border-expense/20 hover:bg-expense/10 p-1 sm:p-2 flex-shrink-0"
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="p-3 sm:p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">Preview da configuração:</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {configuracaoTabelas.entradas.map((tabela, index) => (
                        <Badge key={tabela.id} variant="secondary" className="bg-income/20 text-income text-xs">
                          {tabela.nome}
                        </Badge>
                      ))}
                      {configuracaoTabelas.saidas.map((tabela, index) => (
                        <Badge key={tabela.id} variant="secondary" className="bg-expense/20 text-expense text-xs">
                          {tabela.nome}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-2 pt-3 sm:pt-4 border-t flex-shrink-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="text-sm px-3 sm:px-4"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-primary to-construction text-white text-sm px-3 sm:px-4"
              >
                Criar Obra
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}