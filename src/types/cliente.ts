export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  bairro?: string;
  tipo: "Pessoa Física" | "Pessoa Jurídica";
  cpfCnpj?: string;
  valorTotal?: number;
  dataUltimaObra?: string;
}

export interface NovoClienteData {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  bairro?: string;
  tipo: "Pessoa Física" | "Pessoa Jurídica";
  cpfCnpj?: string;
}

export interface DadosClientes {
  clientes: Cliente[];
}
