
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
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching checklists:', error);
    return {
      success: false,
      error: 'Failed to fetch checklists'
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
    console.error(`Error fetching checklist ${id}:`, error);
    return {
      success: false,
      error: `Failed to fetch checklist with ID ${id}`
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
    console.error('Error creating checklist:', error);
    return {
      success: false,
      error: 'Failed to create checklist'
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
    console.error(`Error updating checklist ${id} status:`, error);
    return {
      success: false,
      error: `Failed to update checklist status`
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
    console.error('Error generating signature link:', error);
    return {
      success: false,
      error: 'Failed to generate signature link'
    };
  }
};

// Função para enviar link de assinatura via WhatsApp
export const sendWhatsAppSignatureLink = async (phone: string, link: string): Promise<ApiResponse<boolean>> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento - simula envio bem-sucedido
      console.log(`[MOCK] Sending WhatsApp to ${phone}: ${link}`);
      return {
        success: true,
        data: true
      };
    }

    // Em produção, usa a API PHP
    const response = await api.post('/checklists/send_whatsapp.php', { phone, link });
    return {
      success: true,
      data: response.data.sent
    };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return {
      success: false,
      error: 'Failed to send WhatsApp message'
    };
  }
};

// Função para assinar um checklist
export const signChecklist = async (token: string, signatureData: string): Promise<ApiResponse<Checklist>> => {
  try {
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
        ipAddress: '127.0.0.1',
        createdAt: '2023-06-15T10:00:00Z'
      };

      return {
        success: true,
        data: mockChecklist
      };
    }

    // Em produção, usa a API PHP
    const response = await api.post('/checklists/sign.php', { token, signatureData });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error signing checklist:', error);
    return {
      success: false,
      error: 'Failed to sign checklist'
    };
  }
};

export default api;
