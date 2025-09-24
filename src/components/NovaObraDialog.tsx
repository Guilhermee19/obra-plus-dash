import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
});

type ObraFormData = z.infer<typeof obraSchema>;

interface NovaObraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ObraFormData & { configuracaoTabelas: ConfiguracaoTabelas }) => void;
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
    onSubmit({ ...data, configuracaoTabelas });
    form.reset();
    setConfiguracaoTabelas({
      entradas: [{ id: "1", nome: "Entradas Principais", tipo: "entrada" }],
      saidas: [{ id: "1", nome: "Saídas Principais", tipo: "saida" }]
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Obra</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Obra</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Residencial Vila Nova" {...field} />
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
                        <Input placeholder="Nome do cliente" {...field} />
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
                        <Input placeholder="Ex: Zona Sul, SP" {...field} />
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
                        <Input placeholder="Nome do responsável" {...field} />
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
              </CardContent>
            </Card>

            {/* Configuração das Tabelas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Table className="h-5 w-5" />
                  Configuração das Tabelas Financeiras
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tabelas de Entrada */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium text-income">Tabelas de Entrada</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => adicionarTabela("entrada")}
                      className="text-income border-income/20 hover:bg-income/10"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  
                  <div className="grid gap-3">
                    {configuracaoTabelas.entradas.map((tabela, index) => (
                      <div key={tabela.id} className="flex items-center gap-3 p-3 border rounded-lg bg-income/5">
                        <Badge variant="secondary" className="bg-income/20 text-income">
                          E{index + 1}
                        </Badge>
                        <Input
                          value={tabela.nome}
                          onChange={(e) => atualizarNomeTabela("entrada", tabela.id, e.target.value)}
                          placeholder="Nome da tabela de entrada"
                          className="flex-1"
                        />
                        {configuracaoTabelas.entradas.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removerTabela("entrada", tabela.id)}
                            className="text-expense border-expense/20 hover:bg-expense/10"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tabelas de Saída */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium text-expense">Tabelas de Saída</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => adicionarTabela("saida")}
                      className="text-expense border-expense/20 hover:bg-expense/10"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  
                  <div className="grid gap-3">
                    {configuracaoTabelas.saidas.map((tabela, index) => (
                      <div key={tabela.id} className="flex items-center gap-3 p-3 border rounded-lg bg-expense/5">
                        <Badge variant="secondary" className="bg-expense/20 text-expense">
                          S{index + 1}
                        </Badge>
                        <Input
                          value={tabela.nome}
                          onChange={(e) => atualizarNomeTabela("saida", tabela.id, e.target.value)}
                          placeholder="Nome da tabela de saída"
                          className="flex-1"
                        />
                        {configuracaoTabelas.saidas.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removerTabela("saida", tabela.id)}
                            className="text-expense border-expense/20 hover:bg-expense/10"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Preview da configuração:</p>
                  <div className="flex flex-wrap gap-2">
                    {configuracaoTabelas.entradas.map((tabela, index) => (
                      <Badge key={tabela.id} variant="secondary" className="bg-income/20 text-income">
                        {tabela.nome}
                      </Badge>
                    ))}
                    {configuracaoTabelas.saidas.map((tabela, index) => (
                      <Badge key={tabela.id} variant="secondary" className="bg-expense/20 text-expense">
                        {tabela.nome}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-primary to-construction text-white">
                Criar Obra
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}