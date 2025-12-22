import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Upload, 
  FileJson, 
  Database,
  Users,
  Building2,
  AlertTriangle,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import {
  exportarTodosDados,
  exportarObras,
  exportarClientes,
  importarTodosDados,
  importarObras,
  importarClientes,
  downloadJSON,
  lerArquivoJSON,
  limparTodosDados,
  DadosExportacao,
  DadosObrasExportacao,
  DadosClientesExportacao
} from "@/services/dataService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Configuracoes = () => {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importType, setImportType] = useState<"todos" | "obras" | "clientes">("todos");

  const handleExportarTodos = () => {
    try {
      const dados = exportarTodosDados();
      const dataAtual = new Date().toISOString().split('T')[0];
      downloadJSON(dados, `backup-completo-${dataAtual}.json`);
      toast.success("Dados exportados com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar dados");
    }
  };

  const handleExportarObras = () => {
    try {
      const dados = exportarObras();
      const dataAtual = new Date().toISOString().split('T')[0];
      downloadJSON(dados, `obras-${dataAtual}.json`);
      toast.success("Obras exportadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar obras");
    }
  };

  const handleExportarClientes = () => {
    try {
      const dados = exportarClientes();
      const dataAtual = new Date().toISOString().split('T')[0];
      downloadJSON(dados, `clientes-${dataAtual}.json`);
      toast.success("Clientes exportados com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar clientes");
    }
  };

  const triggerFileInput = (type: "todos" | "obras" | "clientes") => {
    setImportType(type);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      if (importType === "todos") {
        const dados = await lerArquivoJSON<DadosExportacao>(file);
        if (!dados.obras || !dados.clientes) {
          throw new Error("Formato de arquivo inválido para backup completo");
        }
        importarTodosDados(dados);
        toast.success("Todos os dados importados com sucesso! Recarregue a página para ver as alterações.");
      } else if (importType === "obras") {
        const dados = await lerArquivoJSON<DadosObrasExportacao>(file);
        if (!dados.obras || !dados.transacoes) {
          throw new Error("Formato de arquivo inválido para obras");
        }
        importarObras(dados);
        toast.success("Obras importadas com sucesso! Recarregue a página para ver as alterações.");
      } else if (importType === "clientes") {
        const dados = await lerArquivoJSON<DadosClientesExportacao>(file);
        if (!dados.clientes) {
          throw new Error("Formato de arquivo inválido para clientes");
        }
        importarClientes(dados);
        toast.success("Clientes importados com sucesso! Recarregue a página para ver as alterações.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao importar arquivo");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleLimparDados = () => {
    limparTodosDados();
    toast.success("Todos os dados foram removidos. Recarregue a página.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie backups e importe/exporte seus dados
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Backup Completo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup Completo
          </CardTitle>
          <CardDescription>
            Exporte ou importe todos os dados do sistema (obras, transações e clientes)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleExportarTodos} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar Tudo
          </Button>
          <Button 
            variant="outline" 
            onClick={() => triggerFileInput("todos")}
            disabled={isImporting}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importar Backup
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Exportação Individual */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Obras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Obras e Transações
            </CardTitle>
            <CardDescription>
              Gerencie apenas os dados de obras e transações financeiras
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button 
              variant="secondary" 
              onClick={handleExportarObras}
              className="flex items-center gap-2 w-full"
            >
              <FileJson className="h-4 w-4" />
              Exportar Obras
            </Button>
            <Button 
              variant="outline" 
              onClick={() => triggerFileInput("obras")}
              disabled={isImporting}
              className="flex items-center gap-2 w-full"
            >
              <Upload className="h-4 w-4" />
              Importar Obras
            </Button>
          </CardContent>
        </Card>

        {/* Clientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clientes
            </CardTitle>
            <CardDescription>
              Gerencie apenas os dados de clientes
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button 
              variant="secondary" 
              onClick={handleExportarClientes}
              className="flex items-center gap-2 w-full"
            >
              <FileJson className="h-4 w-4" />
              Exportar Clientes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => triggerFileInput("clientes")}
              disabled={isImporting}
              className="flex items-center gap-2 w-full"
            >
              <Upload className="h-4 w-4" />
              Importar Clientes
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Zona de Perigo */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>
            Ações irreversíveis. Tenha certeza antes de prosseguir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Limpar Todos os Dados
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso irá remover permanentemente todos 
                  os dados de obras, transações e clientes do sistema.
                  <br /><br />
                  <strong>Recomendamos fazer um backup antes de continuar.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleLimparDados} className="bg-destructive hover:bg-destructive/90">
                  Sim, limpar tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* Informações */}
      <Card>
        <CardHeader>
          <CardTitle>Informações sobre os arquivos</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Formato:</strong> Todos os arquivos são salvos em formato JSON, 
            compatível para futura migração a servidores.
          </p>
          <p>
            <strong>Backup Completo:</strong> Inclui obras, transações e clientes em um único arquivo.
          </p>
          <p>
            <strong>Exportação Individual:</strong> Permite exportar obras ou clientes separadamente.
          </p>
          <p>
            <strong>Importação:</strong> Ao importar, os dados existentes serão substituídos pelos dados do arquivo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes;
