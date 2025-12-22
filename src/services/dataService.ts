import { Obra, Transacao } from "@/types/obra";
import { Cliente } from "@/types/cliente";

export interface DadosExportacao {
  versao: string;
  dataExportacao: string;
  obras: {
    obras: Obra[];
    transacoes: Transacao[];
    proximoIdObra: number;
    proximoIdTransacao: number;
  };
  clientes: {
    clientes: Cliente[];
  };
}

export interface DadosObrasExportacao {
  versao: string;
  dataExportacao: string;
  obras: Obra[];
  transacoes: Transacao[];
  proximoIdObra: number;
  proximoIdTransacao: number;
}

export interface DadosClientesExportacao {
  versao: string;
  dataExportacao: string;
  clientes: Cliente[];
}

// Exportar todos os dados
export const exportarTodosDados = (): DadosExportacao => {
  const dadosObras = localStorage.getItem('dados-obras');
  const dadosClientes = localStorage.getItem('clientes_data');

  const obrasData = dadosObras ? JSON.parse(dadosObras) : {
    obras: [],
    transacoes: [],
    proximoIdObra: 1,
    proximoIdTransacao: 1
  };

  const clientesData = dadosClientes ? JSON.parse(dadosClientes) : {
    clientes: []
  };

  return {
    versao: "1.0.0",
    dataExportacao: new Date().toISOString(),
    obras: obrasData,
    clientes: clientesData
  };
};

// Exportar apenas obras
export const exportarObras = (): DadosObrasExportacao => {
  const dadosObras = localStorage.getItem('dados-obras');

  const obrasData = dadosObras ? JSON.parse(dadosObras) : {
    obras: [],
    transacoes: [],
    proximoIdObra: 1,
    proximoIdTransacao: 1
  };

  return {
    versao: "1.0.0",
    dataExportacao: new Date().toISOString(),
    ...obrasData
  };
};

// Exportar apenas clientes
export const exportarClientes = (): DadosClientesExportacao => {
  const dadosClientes = localStorage.getItem('clientes_data');

  const clientesData = dadosClientes ? JSON.parse(dadosClientes) : {
    clientes: []
  };

  return {
    versao: "1.0.0",
    dataExportacao: new Date().toISOString(),
    clientes: clientesData.clientes
  };
};

// Importar todos os dados
export const importarTodosDados = (dados: DadosExportacao): boolean => {
  try {
    localStorage.setItem('dados-obras', JSON.stringify(dados.obras));
    localStorage.setItem('clientes_data', JSON.stringify(dados.clientes));
    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
};

// Importar apenas obras
export const importarObras = (dados: DadosObrasExportacao): boolean => {
  try {
    const obrasData = {
      obras: dados.obras,
      transacoes: dados.transacoes,
      proximoIdObra: dados.proximoIdObra,
      proximoIdTransacao: dados.proximoIdTransacao
    };
    localStorage.setItem('dados-obras', JSON.stringify(obrasData));
    return true;
  } catch (error) {
    console.error('Erro ao importar obras:', error);
    return false;
  }
};

// Importar apenas clientes
export const importarClientes = (dados: DadosClientesExportacao): boolean => {
  try {
    const clientesData = {
      clientes: dados.clientes
    };
    localStorage.setItem('clientes_data', JSON.stringify(clientesData));
    return true;
  } catch (error) {
    console.error('Erro ao importar clientes:', error);
    return false;
  }
};

// Função auxiliar para download de arquivo JSON
export const downloadJSON = (data: object, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Função auxiliar para ler arquivo JSON
export const lerArquivoJSON = <T>(file: File): Promise<T> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Arquivo JSON inválido'));
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
};

// Limpar todos os dados
export const limparTodosDados = (): void => {
  localStorage.removeItem('dados-obras');
  localStorage.removeItem('clientes_data');
};
