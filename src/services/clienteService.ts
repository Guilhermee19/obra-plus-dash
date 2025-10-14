import { Cliente, NovoClienteData, DadosClientes } from "@/types/cliente";

const STORAGE_KEY = "clientes_data";

const carregarDadosIniciais = (): DadosClientes => {
  return {
    clientes: [
      {
        id: 1,
        nome: "João Silva",
        email: "joao@email.com",
        telefone: "(11) 99999-1111",
        endereco: "Rua das Flores, 123 - Zona Sul, SP",
        tipo: "Pessoa Física",
        cpfCnpj: "123.456.789-00",
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
        cpfCnpj: "987.654.321-00",
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
        cpfCnpj: "456.789.123-00",
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
        cpfCnpj: "12.345.678/0001-90",
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
        cpfCnpj: "98.765.432/0001-11",
        valorTotal: 340000,
        dataUltimaObra: "01/04/2024"
      }
    ]
  };
};

const salvarDados = (dados: DadosClientes): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
};

const carregarDados = (): DadosClientes => {
  const dadosSalvos = localStorage.getItem(STORAGE_KEY);
  if (dadosSalvos) {
    return JSON.parse(dadosSalvos);
  }
  const dadosIniciais = carregarDadosIniciais();
  salvarDados(dadosIniciais);
  return dadosIniciais;
};

export const obterClientes = async (): Promise<Cliente[]> => {
  const dados = carregarDados();
  return dados.clientes;
};

export const obterClientePorId = async (id: number): Promise<Cliente | undefined> => {
  const dados = carregarDados();
  return dados.clientes.find(c => c.id === id);
};

export const criarNovoCliente = async (dadosCliente: NovoClienteData): Promise<Cliente> => {
  const dados = carregarDados();
  
  const novoId = dados.clientes.length > 0 
    ? Math.max(...dados.clientes.map(c => c.id)) + 1 
    : 1;

  const novoCliente: Cliente = {
    ...dadosCliente,
    id: novoId,
    valorTotal: 0,
    dataUltimaObra: undefined
  };

  dados.clientes.push(novoCliente);
  salvarDados(dados);

  return novoCliente;
};

export const atualizarCliente = async (
  id: number, 
  dadosAtualizados: Partial<NovoClienteData>
): Promise<Cliente> => {
  const dados = carregarDados();
  const index = dados.clientes.findIndex(c => c.id === id);
  
  if (index === -1) {
    throw new Error("Cliente não encontrado");
  }

  dados.clientes[index] = {
    ...dados.clientes[index],
    ...dadosAtualizados
  };

  salvarDados(dados);
  return dados.clientes[index];
};

export const deletarCliente = async (id: number): Promise<void> => {
  const dados = carregarDados();
  dados.clientes = dados.clientes.filter(c => c.id !== id);
  salvarDados(dados);
};
