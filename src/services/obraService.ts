import { Obra, Transacao, ConfiguracaoTabelas } from "@/types/obra";

interface DadosObras {
  obras: Obra[];
  transacoes: Transacao[];
  proximoIdObra: number;
  proximoIdTransacao: number;
}

// Função para carregar dados do JSON
export const carregarDados = async (): Promise<DadosObras> => {
  try {
    const response = await fetch('/dados-obras.json');
    if (!response.ok) {
      throw new Error('Falha ao carregar dados');
    }
    const dados = await response.json();
    return dados;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    // Retornar dados padrão em caso de erro
    return {
      obras: [],
      transacoes: [],
      proximoIdObra: 1,
      proximoIdTransacao: 1
    };
  }
};

// Função para salvar dados no localStorage (simulando persistência)
export const salvarDados = (dados: DadosObras): void => {
  try {
    localStorage.setItem('dados-obras', JSON.stringify(dados));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
};

// Função para carregar dados do localStorage ou do JSON
export const carregarDadosCompletos = async (): Promise<DadosObras> => {
  try {
    // Primeiro tenta carregar do localStorage
    const dadosLocal = localStorage.getItem('dados-obras');
    if (dadosLocal) {
      return JSON.parse(dadosLocal);
    }
    
    // Se não existe no localStorage, carrega do JSON e salva localmente
    const dados = await carregarDados();
    salvarDados(dados);
    return dados;
  } catch (error) {
    console.error('Erro ao carregar dados completos:', error);
    return {
      obras: [],
      transacoes: [],
      proximoIdObra: 1,
      proximoIdTransacao: 1
    };
  }
};

// Função para criar uma nova obra
export const criarNovaObra = async (
  dadosObra: {
    nome: string;
    cliente: string;
    localizacao: string;
    responsavel: string;
    dataInicio: string;
    dataPrevista: string;
    configuracaoTabelas: ConfiguracaoTabelas;
  }
): Promise<Obra> => {
  const dados = await carregarDadosCompletos();
  
  const novaObra: Obra = {
    id: dados.proximoIdObra,
    nome: dadosObra.nome,
    cliente: dadosObra.cliente,
    status: "Planejamento",
    progresso: 0,
    localizacao: dadosObra.localizacao,
    dataInicio: dadosObra.dataInicio,
    dataPrevista: dadosObra.dataPrevista,
    responsavel: dadosObra.responsavel,
    configuracaoTabelas: dadosObra.configuracaoTabelas
  };

  // Atualizar dados
  dados.obras.push(novaObra);
  dados.proximoIdObra += 1;
  
  // Salvar
  salvarDados(dados);
  
  return novaObra;
};

// Função para obter todas as obras
export const obterObras = async (): Promise<Obra[]> => {
  const dados = await carregarDadosCompletos();
  return dados.obras;
};

// Função para obter uma obra por ID
export const obterObraPorId = async (id: number): Promise<Obra | undefined> => {
  const dados = await carregarDadosCompletos();
  return dados.obras.find(obra => obra.id === id);
};

// Função para obter transações de uma obra
export const obterTransacoesPorObra = async (obraId: number): Promise<Transacao[]> => {
  const dados = await carregarDadosCompletos();
  return dados.transacoes.filter(transacao => transacao.obraId === obraId);
};

// Função para adicionar uma nova transação
export const adicionarTransacao = async (
  dadosTransacao: {
    data: string;
    tipo: "Entrada" | "Saída";
    descricao: string;
    valor: number;
    obraId: number;
    tabelaId: string;
  }
): Promise<Transacao> => {
  const dados = await carregarDadosCompletos();
  
  const novaTransacao: Transacao = {
    id: dados.proximoIdTransacao,
    data: dadosTransacao.data,
    tipo: dadosTransacao.tipo,
    descricao: dadosTransacao.descricao,
    valor: dadosTransacao.valor,
    obraId: dadosTransacao.obraId,
    tabelaId: dadosTransacao.tabelaId
  };

  // Atualizar dados
  dados.transacoes.push(novaTransacao);
  dados.proximoIdTransacao += 1;
  
  // Salvar
  salvarDados(dados);
  
  return novaTransacao;
};

// Função para calcular resumo financeiro de uma obra
export const calcularResumoFinanceiro = async (obraId: number) => {
  const transacoes = await obterTransacoesPorObra(obraId);
  
  const totalEntradas = transacoes
    .filter(t => t.tipo === "Entrada")
    .reduce((sum, t) => sum + t.valor, 0);

  const totalSaidas = transacoes
    .filter(t => t.tipo === "Saída")
    .reduce((sum, t) => sum + t.valor, 0);

  const saldo = totalEntradas - totalSaidas;

  return {
    totalEntradas,
    totalSaidas,
    saldo
  };
};

// Função para calcular resumo geral de todas as obras
export const calcularResumoGeral = async (filtroStatus?: string) => {
  const obras = await obterObras();
  const dados = await carregarDadosCompletos();
  
  let obrasFiltradas = obras;
  if (filtroStatus && filtroStatus !== "todas") {
    if (filtroStatus === "andamento") {
      obrasFiltradas = obras.filter(obra => 
        obra.status === "Em Andamento" || obra.status === "Planejamento"
      );
    } else if (filtroStatus === "finalizadas") {
      obrasFiltradas = obras.filter(obra => obra.status === "Finalizada");
    }
  }

  let totalEntradas = 0;
  let totalSaidas = 0;

  for (const obra of obrasFiltradas) {
    const transacoes = dados.transacoes.filter(t => t.obraId === obra.id);
    totalEntradas += transacoes.filter(t => t.tipo === "Entrada").reduce((sum, t) => sum + t.valor, 0);
    totalSaidas += transacoes.filter(t => t.tipo === "Saída").reduce((sum, t) => sum + t.valor, 0);
  }

  return {
    totalObras: obrasFiltradas.length,
    obrasAtivas: obrasFiltradas.filter(obra => obra.status !== "Finalizada").length,
    totalEntradas,
    totalSaidas,
    saldo: totalEntradas - totalSaidas,
    obras: obrasFiltradas
  };
};

// Função para atualizar dados de uma obra
export const atualizarObra = async (
  obraId: number,
  dadosAtualizados: {
    nome?: string;
    cliente?: string;
    localizacao?: string;
    responsavel?: string;
    dataInicio?: string;
    dataPrevista?: string;
    status?: string;
    progresso?: number;
    configuracaoTabelas?: ConfiguracaoTabelas;
  }
): Promise<Obra> => {
  const dados = await carregarDadosCompletos();
  
  const obraIndex = dados.obras.findIndex(obra => obra.id === obraId);
  if (obraIndex === -1) {
    throw new Error("Obra não encontrada");
  }

  // Atualizar obra
  dados.obras[obraIndex] = {
    ...dados.obras[obraIndex],
    ...dadosAtualizados
  };

  // Salvar
  salvarDados(dados);
  
  return dados.obras[obraIndex];
};

// Função para remover transações de tabelas que foram removidas
export const limparTransacoesTabelas = async (obraId: number, tabelasRestantes: string[]) => {
  const dados = await carregarDadosCompletos();
  
  // Filtrar transações, mantendo apenas as de tabelas que ainda existem
  dados.transacoes = dados.transacoes.filter(transacao => 
    transacao.obraId !== obraId || tabelasRestantes.includes(transacao.tabelaId)
  );
  
  // Salvar
  salvarDados(dados);
};