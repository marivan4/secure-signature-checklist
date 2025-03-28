
import axios from 'axios';
import { AsaasConfig, AsaasCustomer, AsaasPayment, AsaasWebhookEvent } from '@/lib/types';

let apiKey = '';
let isSandbox = true;

// Função para inicializar a API Asaas
export const initAsaasApi = (config: AsaasConfig) => {
  apiKey = config.apiKey;
  isSandbox = config.sandbox;
};

// Função para obter URL base da API Asaas
const getBaseUrl = () => {
  return isSandbox
    ? 'https://api-sandbox.asaas.com/v3'
    : 'https://api.asaas.com/v3';
};

// Cria instância do Axios para a API Asaas
const asaasApi = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
asaasApi.interceptors.request.use(
  (config) => {
    config.headers['access_token'] = apiKey;
    config.baseURL = getBaseUrl();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Função para criar um cliente no Asaas
export const createCustomer = async (customer: Omit<AsaasCustomer, 'id'>): Promise<AsaasCustomer | null> => {
  try {
    // Em desenvolvimento, simulamos a criação
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Criando cliente no Asaas:', customer);
      return {
        ...customer,
        id: `cus_${Math.random().toString(36).substring(2, 15)}`
      };
    }

    // Em produção, utiliza a API Asaas
    const response = await asaasApi.post('/customers', customer);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar cliente no Asaas:', error);
    return null;
  }
};

// Função para buscar um cliente por CPF/CNPJ
export const getCustomerByCpfCnpj = async (cpfCnpj: string): Promise<AsaasCustomer | null> => {
  try {
    // Em desenvolvimento, simulamos a busca
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Buscando cliente no Asaas por CPF/CNPJ:', cpfCnpj);
      return {
        id: `cus_${Math.random().toString(36).substring(2, 15)}`,
        name: 'Cliente Simulado',
        email: 'cliente@exemplo.com',
        cpfCnpj: cpfCnpj
      };
    }

    // Em produção, utiliza a API Asaas
    const response = await asaasApi.get(`/customers?cpfCnpj=${cpfCnpj}`);
    
    // Verifica se encontrou algum cliente
    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar cliente no Asaas:', error);
    return null;
  }
};

// Função para criar um pagamento no Asaas
export const createPayment = async (payment: Omit<AsaasPayment, 'id'>): Promise<AsaasPayment | null> => {
  try {
    // Em desenvolvimento, simulamos a criação
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Criando pagamento no Asaas:', payment);
      return {
        ...payment,
        id: `pay_${Math.random().toString(36).substring(2, 15)}`,
        status: 'PENDING',
        invoiceUrl: 'https://sandbox.asaas.com/i/123456789',
        bankSlipUrl: 'https://sandbox.asaas.com/b/123456789',
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      };
    }

    // Em produção, utiliza a API Asaas
    const response = await asaasApi.post('/payments', payment);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pagamento no Asaas:', error);
    return null;
  }
};

// Função para obter um pagamento pelo ID
export const getPaymentById = async (id: string): Promise<AsaasPayment | null> => {
  try {
    // Em desenvolvimento, simulamos a busca
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Buscando pagamento no Asaas por ID:', id);
      return {
        id: id,
        customer: `cus_${Math.random().toString(36).substring(2, 15)}`,
        billingType: 'BOLETO',
        value: 99.90,
        dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
        description: 'Mensalidade de rastreamento',
        status: 'PENDING',
        invoiceUrl: 'https://sandbox.asaas.com/i/123456789',
        bankSlipUrl: 'https://sandbox.asaas.com/b/123456789',
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      };
    }

    // Em produção, utiliza a API Asaas
    const response = await asaasApi.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pagamento no Asaas:', error);
    return null;
  }
};

// Função para processar webhook do Asaas
export const processWebhook = async (event: AsaasWebhookEvent): Promise<boolean> => {
  try {
    console.log('Processando webhook do Asaas:', event);
    
    // Exemplo de processamento do webhook
    // Dependendo do evento, podemos atualizar o status da fatura no nosso sistema
    
    return true;
  } catch (error) {
    console.error('Erro ao processar webhook do Asaas:', error);
    return false;
  }
};

// Função para salvar configuração do Asaas
export const saveAsaasConfig = async (config: AsaasConfig): Promise<AsaasConfig | null> => {
  try {
    // Em desenvolvimento, simulamos o salvamento
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Salvando configuração do Asaas:', config);
      return {
        ...config,
        id: 1,
        createdAt: new Date().toISOString()
      };
    }

    // Em produção, salva no banco de dados via API
    const response = await axios.post('/api/settings/asaas', config);
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar configuração do Asaas:', error);
    return null;
  }
};

// Função para obter configuração do Asaas
export const getAsaasConfig = async (userId: number): Promise<AsaasConfig | null> => {
  try {
    // Em desenvolvimento, simulamos a busca
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Buscando configuração do Asaas para o usuário:', userId);
      return {
        id: 1,
        apiKey: 'seu_token_sandbox',
        sandbox: true,
        userId: userId,
        createdAt: new Date().toISOString()
      };
    }

    // Em produção, busca no banco de dados via API
    const response = await axios.get(`/api/settings/asaas?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar configuração do Asaas:', error);
    return null;
  }
};

export default asaasApi;
