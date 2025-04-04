
import axios from 'axios';
import { AsaasConfig, AsaasCustomer, AsaasPayment, AsaasWebhookEvent } from '@/lib/types';
import { 
  initAsaasApiConfig, 
  getAsaasBaseUrl, 
  getAsaasHeaders 
} from './apiConfig';

let currentUserId: number | null = null;
let currentUserRole: string | null = null;

// Função para inicializar a API Asaas
export const initAsaasApi = (config: AsaasConfig) => {
  initAsaasApiConfig({
    apiKey: config.apiKey,
    sandbox: config.sandbox
  });
  currentUserId = config.userId;
  currentUserRole = config.userRole || null;
};

// Cria instância do Axios para a API Asaas
const asaasApi = axios.create({
  headers: getAsaasHeaders()
});

// Interceptor para adicionar token de autenticação e URL base atualizada
asaasApi.interceptors.request.use(
  (config) => {
    // Corrige o problema com o tipo AxiosRequestHeaders
    // Adicionando cada header individualmente em vez de substituir o objeto inteiro
    const headers = getAsaasHeaders();
    Object.keys(headers).forEach(key => {
      config.headers.set(key, headers[key]);
    });
    
    config.baseURL = getAsaasBaseUrl();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Função para verificar se um cliente existe no Asaas por CPF/CNPJ
export const checkCustomerExists = async (cpfCnpj: string): Promise<boolean> => {
  try {
    const customer = await getCustomerByCpfCnpj(cpfCnpj);
    return !!customer;
  } catch (error) {
    console.error('Erro ao verificar se cliente existe no Asaas:', error);
    return false;
  }
};

// Função para criar um cliente no Asaas
export const createCustomer = async (customer: Omit<AsaasCustomer, 'id'>): Promise<AsaasCustomer | null> => {
  try {
    // Limpar formatação do CPF/CNPJ
    const cleanCpfCnpj = customer.cpfCnpj.replace(/[^\d]/g, '');
    
    // Verificar se o cliente já existe por CPF/CNPJ
    const existingCustomer = await getCustomerByCpfCnpj(cleanCpfCnpj);
    if (existingCustomer) {
      console.log('Cliente já existe no Asaas, retornando dados existentes');
      return existingCustomer;
    }

    // Em desenvolvimento, simulamos a criação
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Criando cliente no Asaas:', {...customer, cpfCnpj: cleanCpfCnpj});
      return {
        ...customer,
        cpfCnpj: cleanCpfCnpj,
        id: `cus_${Math.random().toString(36).substring(2, 15)}`
      };
    }

    // Em produção, utiliza a API Asaas v3
    const response = await asaasApi.post('/v3/customers', {...customer, cpfCnpj: cleanCpfCnpj});
    return response.data;
  } catch (error) {
    console.error('Erro ao criar cliente no Asaas:', error);
    return null;
  }
};

// Função para buscar um cliente por CPF/CNPJ
export const getCustomerByCpfCnpj = async (cpfCnpj: string): Promise<AsaasCustomer | null> => {
  try {
    // Limpar formatação do CPF/CNPJ
    const cleanCpfCnpj = cpfCnpj.replace(/[^\d]/g, '');
    
    // Em desenvolvimento, simulamos a busca
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Buscando cliente no Asaas por CPF/CNPJ:', cleanCpfCnpj);
      // Se o CPF/CNPJ for 12345678909, simula cliente existente para testes
      if (cleanCpfCnpj === '12345678909') {
        return {
          id: `cus_${Math.random().toString(36).substring(2, 15)}`,
          name: 'Cliente Existente Simulado',
          email: 'cliente.existente@exemplo.com',
          cpfCnpj: cleanCpfCnpj,
          personType: 'FISICA'
        };
      }
      return null;
    }

    // Em produção, utiliza a API Asaas v3
    const response = await asaasApi.get(`/v3/customers?cpfCnpj=${cleanCpfCnpj}`);
    
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
        bankSlipUrl: 'https://sandbox.asaas.com/b/pdf/123456789',
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      };
    }

    // Em produção, utiliza a API Asaas v3
    const response = await asaasApi.post('/v3/payments', payment);
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
        bankSlipUrl: 'https://sandbox.asaas.com/b/pdf/123456789',
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      };
    }

    // Em produção, utiliza a API Asaas v3
    const response = await asaasApi.get(`/v3/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pagamento no Asaas:', error);
    return null;
  }
};

// Função para listar todos os pagamentos do Asaas
export const getAllPayments = async (): Promise<AsaasPayment[]> => {
  try {
    // Em desenvolvimento, simulamos a listagem
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Listando todos os pagamentos no Asaas');
      
      // Simula uma lista de pagamentos
      return [
        {
          id: `pay_${Math.random().toString(36).substring(2, 15)}`,
          customer: `cus_000006537472`,
          billingType: 'BOLETO',
          value: 100.00,
          dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0],
          description: 'Mensalidade de rastreamento - Plano Básico',
          status: 'OVERDUE',
          invoiceUrl: 'https://sandbox.asaas.com/i/123456789',
          bankSlipUrl: 'https://sandbox.asaas.com/b/pdf/123456789',
          invoiceNumber: `07764376`
        },
        {
          id: `pay_${Math.random().toString(36).substring(2, 15)}`,
          customer: `cus_000006537472`,
          billingType: 'PIX',
          value: 100.00,
          dueDate: new Date(new Date().setDate(new Date().getDate())).toISOString().split('T')[0],
          description: 'Mensalidade de rastreamento - Plano Premium',
          status: 'RECEIVED',
          invoiceUrl: 'https://sandbox.asaas.com/i/123456789',
          bankSlipUrl: null,
          invoiceNumber: `07764377`,
          paymentDate: new Date().toISOString().split('T')[0]
        },
        {
          id: `pay_${Math.random().toString(36).substring(2, 15)}`,
          customer: `cus_000006537472`,
          billingType: 'PIX',
          value: 100.00,
          dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
          description: 'Mensalidade de rastreamento - Plano Empresarial',
          status: 'PENDING',
          invoiceUrl: 'https://sandbox.asaas.com/i/123456789',
          bankSlipUrl: null,
          invoiceNumber: `07764378`
        }
      ];
    }

    // Em produção, utiliza a API Asaas v3
    const response = await asaasApi.get('/v3/payments');
    return response.data.data || [];
  } catch (error) {
    console.error('Erro ao listar pagamentos no Asaas:', error);
    return [];
  }
};

// Função para gerar um QR code PIX para um pagamento
export const getPixQrCode = async (paymentId: string): Promise<{encodedImage: string, payload: string} | null> => {
  try {
    // Em desenvolvimento, simulamos a geração
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Gerando QR code PIX para o pagamento:', paymentId);
      return {
        encodedImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAABA0lEQVR42uyYwY3DMAxEHyEBF+ECXIBLSCkpxSW4BBfgAgLkcBlkkVUg+WgYsOeUXxs09PDJsighDMMwDMMwDMMwDMMwDMMwTAkTM9NARNkRJZMkdkTBRObMVHYkM8uy69h3AMjR/tElc4BkB1z6fHbcMR0gd8n8NHLYyL6vhYgTZODZcSFdA5O6pFxiogVEmXeBe6D1SXcVoA+p642qAZ1dku5VV/VLUgUY40JMkqaGWfbEpAok8N16psi+N5AqEECWXLtE9PdXJRWAeA6sN+EccxSuBLwlJnlxvUKuQakCjD+HzM7D5XshDwDUJFk64G3iKgGlSFYA+FfAz0rAP2YYhmEYhmEYhmGYO+YLvUww0Hvd45sAAAAASUVORK5CYII=',
        payload: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426655440000520400005303986540510.005802BR5913Teste Sandbox6008Brasilia62070503***63041D2D'
      };
    }

    // Em produção, utiliza a API Asaas v3
    const response = await asaasApi.get(`/v3/payments/${paymentId}/pixQrCode`);
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar QR code PIX para o pagamento:', error);
    return null;
  }
};

// Função para obter a linha digitável do boleto
export const getBoletoIdentificationField = async (paymentId: string): Promise<string | null> => {
  try {
    // Em desenvolvimento, simulamos a linha digitável
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Obtendo linha digitável do boleto para o pagamento:', paymentId);
      return '34191.09008 01234.567890 12345.678901 1 12345678901234';
    }

    // Em produção, utiliza a API Asaas v3
    const response = await asaasApi.get(`/v3/payments/${paymentId}/identificationField`);
    return response.data.identificationField || null;
  } catch (error) {
    console.error('Erro ao obter linha digitável do boleto:', error);
    return null;
  }
};

// Função para cancelar um pagamento
export const cancelPayment = async (paymentId: string): Promise<boolean> => {
  try {
    // Em desenvolvimento, simulamos o cancelamento
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Cancelando pagamento:', paymentId);
      return true;
    }

    // Em produção, utiliza a API Asaas v3
    await asaasApi.delete(`/v3/payments/${paymentId}`);
    return true;
  } catch (error) {
    console.error('Erro ao cancelar pagamento:', error);
    return false;
  }
};

// Função para reembolsar um pagamento
export const refundPayment = async (paymentId: string, value?: number): Promise<boolean> => {
  try {
    // Em desenvolvimento, simulamos o reembolso
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Reembolsando pagamento:', paymentId, value ? `valor: ${value}` : 'valor total');
      return true;
    }

    // Em produção, utiliza a API Asaas v3
    const data = value ? { value } : {};
    await asaasApi.post(`/v3/payments/${paymentId}/refund`, data);
    return true;
  } catch (error) {
    console.error('Erro ao reembolsar pagamento:', error);
    return false;
  }
};

// Função para reenviar uma cobrança por e-mail
export const resendPaymentEmail = async (paymentId: string): Promise<boolean> => {
  try {
    // Em desenvolvimento, simulamos o reenvio
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Reenviando cobrança por e-mail para o pagamento:', paymentId);
      return true;
    }

    // Em produção, utiliza a API Asaas v3
    await asaasApi.post(`/v3/payments/${paymentId}/notifications`);
    return true;
  } catch (error) {
    console.error('Erro ao reenviar cobrança por e-mail:', error);
    return false;
  }
};

// Função para gerar relatório financeiro
export const generateFinancialReport = async (
  startDate: string,
  endDate: string,
  status?: string
): Promise<any> => {
  try {
    // Em desenvolvimento, simulamos a geração de relatório
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Gerando relatório financeiro:', { startDate, endDate, status });
      return {
        totalReceived: 1500.00,
        totalExpected: 2000.00,
        totalOverdue: 500.00,
        payments: [
          {
            id: `pay_${Math.random().toString(36).substring(2, 15)}`,
            value: 500.00,
            status: 'RECEIVED',
            paymentDate: '2023-10-15',
            customer: 'Cliente Exemplo'
          },
          {
            id: `pay_${Math.random().toString(36).substring(2, 15)}`,
            value: 1000.00,
            status: 'RECEIVED',
            paymentDate: '2023-10-10',
            customer: 'Cliente Exemplo 2'
          },
          {
            id: `pay_${Math.random().toString(36).substring(2, 15)}`,
            value: 500.00,
            status: 'OVERDUE',
            dueDate: '2023-09-30',
            customer: 'Cliente Exemplo 3'
          }
        ]
      };
    }

    // Em produção, utiliza a API Asaas v3
    let url = `/v3/finance/payment/statistics?startDate=${startDate}&endDate=${endDate}`;
    if (status) url += `&status=${status}`;
    
    const response = await asaasApi.get(url);
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar relatório financeiro:', error);
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
        apiKey: '$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjUzZWNjMzUzLTVmM2UtNGMyZi04MGRjLTljNmU4NGU3NTlmMjo6JGFhY2hfYmU4ZGU2NjQtYTU4Yy00NjA0LTgzY2EtNzYxNjE0MDM0MGQ4',
        sandbox: true,
        userId: userId,
        userRole: 'admin',
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

// Função para listar todas as configurações do Asaas (apenas para admin)
export const getAllAsaasConfigs = async (): Promise<AsaasConfig[]> => {
  try {
    // Em desenvolvimento, simulamos a listagem
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Listando todas as configurações do Asaas');
      return [
        {
          id: 1,
          apiKey: '$aact_XXX...XX',
          sandbox: true,
          userId: 1,
          userRole: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          apiKey: '$aact_YYY...YY',
          sandbox: true,
          userId: 2,
          userRole: 'manager',
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          apiKey: '$aact_ZZZ...ZZ',
          sandbox: true,
          userId: 3,
          userRole: 'reseller',
          createdAt: new Date().toISOString()
        }
      ];
    }

    // Em produção, busca no banco de dados via API
    const response = await axios.get('/api/settings/asaas/all');
    return response.data || [];
  } catch (error) {
    console.error('Erro ao listar configurações do Asaas:', error);
    return [];
  }
};

export default asaasApi;
