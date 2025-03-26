import axios from 'axios';
import { Checklist } from '@/lib/types';

// Determina o baseURL com base no ambiente
const getBaseUrl = () => {
  // Em produção no servidor, usamos a API PHP
  if (import.meta.env.PROD) {
    return '/api';
  }
  // Em desenvolvimento local, usamos o mock
  return '';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação (opcional)
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      config.headers['Authorization'] = `Bearer ${userData.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tipos de resposta
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Função para obter todos os checklists
export const getChecklists = async (userId?: number): Promise<ApiResponse<Checklist[]>> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock de dados para desenvolvimento
      const mockChecklists: Checklist[] = [
        {
          id: 1,
          userId: 1,
          cpfCnpj: '123.456.789-00',
          name: 'João Silva',
          address: 'Av. Paulista',
          addressNumber: '1000',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100',
          phone: '(11) 98765-4321',
          email: 'joao@example.com',
          vehicleModel: 'Toyota Corolla',
          licensePlate: 'ABC-1234',
          trackerModel: 'GT06N',
          trackerImei: '123456789012345',
          registrationDate: '2023-06-15',
          installationLocation: 'São Paulo',
          status: 'pending',
          createdAt: '2023-06-15T10:00:00Z'
        },
        {
          id: 2,
          userId: 2,
          cpfCnpj: '98.765.432/0001-10',
          name: 'Empresa XYZ',
          address: 'Rua Augusta',
          addressNumber: '500',
          neighborhood: 'Consolação',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01304-000',
          phone: '(11) 3456-7890',
          email: 'contato@xyz.com',
          vehicleModel: 'Ford Ranger',
          licensePlate: 'DEF-5678',
          trackerModel: 'TK103',
          trackerImei: '987654321098765',
          registrationDate: '2023-07-20',
          installationLocation: 'São Paulo',
          status: 'signed',
          signedAt: '2023-07-25T14:30:00Z',
          createdAt: '2023-07-20T09:15:00Z'
        }
      ];

      // Se tiver userId, filtra pelo userId
      const filteredChecklists = userId 
        ? mockChecklists.filter(checklist => checklist.userId === userId)
        : mockChecklists;

      return {
        success: true,
        data: filteredChecklists
      };
    }

    // Em produção, usa a API PHP
    const response = await api.get(`/checklists/get_all.php${userId ? `?userId=${userId}` : ''}`);
    
    // Verifica se a resposta é um array, caso contrário retorna um array vazio
    const data = Array.isArray(response.data) ? response.data : [];
    
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Erro ao buscar checklists:', error);
    return {
      success: false,
      error: 'Falha ao buscar checklists',
      // Retorna um array vazio em caso de erro
      data: []
    };
  }
};

// Função para obter um checklist específico pelo ID
export const getChecklistById = async (id: number): Promise<ApiResponse<Checklist>> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock de dados para desenvolvimento
      const mockChecklist: Checklist = {
        id: id,
        userId: 1,
        cpfCnpj: '123.456.789-00',
        name: 'João Silva',
        address: 'Av. Paulista',
        addressNumber: '1000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        phone: '(11) 98765-4321',
        email: 'joao@example.com',
        vehicleModel: 'Toyota Corolla',
        licensePlate: 'ABC-1234',
        trackerModel: 'GT06N',
        trackerImei: '123456789012345',
        registrationDate: '2023-06-15',
        installationLocation: 'São Paulo',
        status: 'pending',
        createdAt: '2023-06-15T10:00:00Z'
      };

      return {
        success: true,
        data: mockChecklist
      };
    }

    // Em produção, usa a API PHP
    const response = await api.get(`/checklists/get_one.php?id=${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(`Erro ao buscar checklist ${id}:`, error);
    return {
      success: false,
      error: `Falha ao buscar checklist com ID ${id}`
    };
  }
};

// Função para criar um novo checklist
export const createChecklist = async (checklist: Omit<Checklist, 'id' | 'createdAt'>): Promise<ApiResponse<Checklist>> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento
      const newChecklist: Checklist = {
        ...checklist,
        id: Math.floor(Math.random() * 1000) + 3, // ID aleatório para mock
        createdAt: new Date().toISOString()
      };

      return {
        success: true,
        data: newChecklist
      };
    }

    // Em produção, usa a API PHP
    const response = await api.post('/checklists/create.php', checklist);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Erro ao criar checklist:', error);
    return {
      success: false,
      error: 'Falha ao criar checklist'
    };
  }
};

// Função para atualizar o status de um checklist
export const updateChecklistStatus = async (id: number, status: Checklist['status']): Promise<ApiResponse<Checklist>> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento
      const updatedChecklist: Checklist = {
        id: id,
        userId: 1,
        cpfCnpj: '123.456.789-00',
        name: 'João Silva',
        email: 'joao@example.com',
        registrationDate: '2023-06-15',
        status: status,
        createdAt: '2023-06-15T10:00:00Z',
        // Adiciona signedAt se o status for 'signed' ou 'completed'
        ...(status !== 'pending' ? { signedAt: new Date().toISOString() } : {})
      };

      return {
        success: true,
        data: updatedChecklist
      };
    }

    // Em produção, usa a API PHP
    const response = await api.post('/checklists/update_status.php', { id, status });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(`Erro ao atualizar status do checklist ${id}:`, error);
    return {
      success: false,
      error: `Falha ao atualizar status do checklist`
    };
  }
};

// Função para gerar um link de assinatura
export const generateSignatureLink = async (checklistId: number): Promise<ApiResponse<string>> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento - gera um token aleatório
      const mockToken = `signature-${checklistId}-${Math.random().toString(36).substring(2, 15)}`;
      return {
        success: true,
        data: `https://example.com/signature/${mockToken}`
      };
    }

    // Em produção, usa a API PHP
    const response = await api.post('/checklists/generate_signature_link.php', { checklistId });
    return {
      success: true,
      data: response.data.link
    };
  } catch (error) {
    console.error('Erro ao gerar link de assinatura:', error);
    return {
      success: false,
      error: 'Falha ao gerar link de assinatura'
    };
  }
};

// Função para validar número de telefone brasileiro
const validateBrazilianPhone = (phone: string): string => {
  // Remove todos os caracteres não numéricos
  let cleanPhone = phone.replace(/\D/g, '');
  
  // Verifica se já tem o código do país (55)
  if (!cleanPhone.startsWith('55')) {
    cleanPhone = '55' + cleanPhone;
  }
  
  // Valida se tem o comprimento correto (5510XXXXXXXX ou 55XXXXXXXXX)
  if (cleanPhone.length < 12 || cleanPhone.length > 13) {
    throw new Error('Número de telefone inválido. Deve conter DDD + número');
  }
  
  return cleanPhone;
};

// Função para enviar link de assinatura via WhatsApp
export const sendWhatsAppSignatureLink = async (phone: string, link: string): Promise<ApiResponse<boolean>> => {
  let retryCount = 0;
  const maxRetries = 3;
  
  const attemptSend = async (): Promise<ApiResponse<boolean>> => {
    try {
      let phoneNumber;
      
      try {
        phoneNumber = validateBrazilianPhone(phone);
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Número de telefone inválido'
        };
      }
      
      // Em desenvolvimento, usamos dados mockados
      if (!import.meta.env.PROD) {
        // Mock para desenvolvimento - simula envio bem-sucedido
        console.log(`[MOCK] Enviando WhatsApp para ${phoneNumber}: ${link}`);
        return {
          success: true,
          data: true
        };
      }

      // Mensagem formatada em português
      const message = `🚗 *Sistema de Rastreamento Veicular* 🚗\n\n` + 
                      `Olá! Seu contrato está pronto para assinatura.\n\n` +
                      `Por favor, clique no link abaixo para assinar:\n${link}\n\n` +
                      `Este link expira em 24 horas.\n` +
                      `Obrigado!`;

      // Em produção, usa a API de WhatsApp
      const response = await api.post('/checklists/send_whatsapp.php', { 
        phone: phoneNumber, 
        link,
        message
      });
      
      // Verifica se a API retornou sucesso
      if (response.data && response.data.success) {
        return {
          success: true,
          data: true
        };
      } else {
        throw new Error(response.data.error || 'Erro no envio de WhatsApp');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem de WhatsApp:', error);
      
      // Se ainda não excedeu o número máximo de tentativas, tenta novamente
      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Tentativa ${retryCount} de ${maxRetries} para enviar WhatsApp`);
        
        // Espera 2 segundos antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 2000));
        return attemptSend();
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Falha ao enviar mensagem de WhatsApp após várias tentativas'
      };
    }
  };
  
  return attemptSend();
};

// Função para assinar um checklist
export const signChecklist = async (token: string, signatureData: string): Promise<ApiResponse<Checklist>> => {
  try {
    // Obtém o IP e geolocalização aproximada
    let ipAddress = '127.0.0.1';
    let geolocation = null;
    
    // Em produção, tenta obter o IP real e geolocalização
    if (import.meta.env.PROD) {
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        ipAddress = ipResponse.data.ip;
        
        // Opcional: obter geolocalização aproximada
        const geoResponse = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
        geolocation = {
          city: geoResponse.data.city,
          region: geoResponse.data.region,
          country: geoResponse.data.country_name,
          latitude: geoResponse.data.latitude,
          longitude: geoResponse.data.longitude
        };
      } catch (error) {
        console.error('Erro ao obter informações de IP/geolocalização:', error);
        // Continua mesmo se falhar - não é crítico
      }
    }
    
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento
      const mockChecklist: Checklist = {
        id: 1,
        userId: 1,
        cpfCnpj: '123.456.789-00',
        name: 'João Silva',
        email: 'joao@example.com',
        registrationDate: '2023-06-15',
        status: 'signed',
        signedAt: new Date().toISOString(),
        ipAddress: ipAddress,
        createdAt: '2023-06-15T10:00:00Z'
      };

      return {
        success: true,
        data: mockChecklist
      };
    }

    // Em produção, usa a API PHP
    const response = await api.post('/checklists/sign.php', { 
      token, 
      signatureData,
      ipAddress,
      geolocation,
      // Inclui timezone do Brasil
      timezone: 'America/Sao_Paulo'
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Erro ao assinar checklist:', error);
    return {
      success: false,
      error: 'Falha ao assinar checklist'
    };
  }
};

export default api;
