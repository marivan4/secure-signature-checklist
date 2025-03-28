
import axios from 'axios';
import { Vehicle } from '@/lib/types';
import api from './api';

// Função para obter todos os veículos
export const getVehicles = async (userId?: number): Promise<Vehicle[]> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock de dados para desenvolvimento
      const mockVehicles: Vehicle[] = [
        {
          id: 1,
          userId: 1,
          checklistId: 1,
          model: 'Toyota Corolla',
          plate: 'ABC-1234',
          year: '2020',
          color: 'Prata',
          trackerModel: 'GT06N',
          trackerImei: '123456789012345',
          monthlyFee: 89.90,
          installationDate: '2023-06-15',
          status: 'active',
          createdAt: '2023-06-15T10:00:00Z'
        },
        {
          id: 2,
          userId: 1,
          checklistId: 2,
          model: 'Ford Ranger',
          plate: 'DEF-5678',
          year: '2021',
          color: 'Preto',
          trackerModel: 'TK103',
          trackerImei: '987654321098765',
          monthlyFee: 99.90,
          installationDate: '2023-07-20',
          status: 'active',
          createdAt: '2023-07-20T09:15:00Z'
        },
        {
          id: 3,
          userId: 2,
          model: 'Fiat Uno',
          plate: 'GHI-9012',
          year: '2019',
          color: 'Branco',
          trackerModel: 'TK103',
          trackerImei: '555555555555555',
          monthlyFee: 79.90,
          installationDate: '2023-08-10',
          status: 'blocked',
          createdAt: '2023-08-10T11:30:00Z'
        }
      ];

      // Se tiver userId, filtra pelo userId
      const filteredVehicles = userId 
        ? mockVehicles.filter(vehicle => vehicle.userId === userId)
        : mockVehicles;

      return filteredVehicles;
    }

    // Em produção, usa a API PHP
    const response = await api.get(`/vehicles/get_all.php${userId ? `?userId=${userId}` : ''}`);
    
    // Verifica se a resposta é um array, caso contrário retorna um array vazio
    return Array.isArray(response.data) ? response.data : [];
    
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    return [];
  }
};

// Função para obter um veículo específico pelo ID
export const getVehicleById = async (id: number): Promise<Vehicle | null> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock de dados para desenvolvimento
      const mockVehicle: Vehicle = {
        id: id,
        userId: 1,
        checklistId: 1,
        model: 'Toyota Corolla',
        plate: 'ABC-1234',
        year: '2020',
        color: 'Prata',
        trackerModel: 'GT06N',
        trackerImei: '123456789012345',
        monthlyFee: 89.90,
        installationDate: '2023-06-15',
        status: 'active',
        createdAt: '2023-06-15T10:00:00Z'
      };

      return mockVehicle;
    }

    // Em produção, usa a API PHP
    const response = await api.get(`/vehicles/get_one.php?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar veículo ${id}:`, error);
    return null;
  }
};

// Função para criar um novo veículo
export const createVehicle = async (vehicle: Omit<Vehicle, 'id' | 'createdAt'>): Promise<Vehicle | null> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento
      const newVehicle: Vehicle = {
        ...vehicle,
        id: Math.floor(Math.random() * 1000) + 4,
        createdAt: new Date().toISOString()
      };

      return newVehicle;
    }

    // Em produção, usa a API PHP
    const response = await api.post('/vehicles/create.php', vehicle);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar veículo:', error);
    return null;
  }
};

// Função para atualizar um veículo
export const updateVehicle = async (id: number, vehicle: Partial<Vehicle>): Promise<Vehicle | null> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento
      const updatedVehicle: Vehicle = {
        id: id,
        userId: vehicle.userId || 1,
        model: vehicle.model || 'Toyota Corolla',
        plate: vehicle.plate || 'ABC-1234',
        year: vehicle.year || '2020',
        color: vehicle.color || 'Prata',
        trackerModel: vehicle.trackerModel || 'GT06N',
        trackerImei: vehicle.trackerImei || '123456789012345',
        monthlyFee: vehicle.monthlyFee || 89.90,
        installationDate: vehicle.installationDate || '2023-06-15',
        status: vehicle.status || 'active',
        createdAt: '2023-06-15T10:00:00Z'
      };

      return updatedVehicle;
    }

    // Em produção, usa a API PHP
    const response = await api.post('/vehicles/update.php', { id, ...vehicle });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar veículo ${id}:`, error);
    return null;
  }
};

// Função para excluir um veículo
export const deleteVehicle = async (id: number): Promise<boolean> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento - simula exclusão bem-sucedida
      return true;
    }

    // Em produção, usa a API PHP
    await api.post('/vehicles/delete.php', { id });
    return true;
  } catch (error) {
    console.error(`Erro ao excluir veículo ${id}:`, error);
    return false;
  }
};

// Função para bloquear/desbloquear um veículo
export const toggleVehicleBlock = async (id: number, blocked: boolean): Promise<Vehicle | null> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento
      const status = blocked ? 'blocked' : 'active';
      console.log(`[MOCK] ${blocked ? 'Bloqueando' : 'Desbloqueando'} veículo ${id}`);
      
      const vehicle: Vehicle = {
        id: id,
        userId: 1,
        model: 'Toyota Corolla',
        plate: 'ABC-1234',
        trackerModel: 'GT06N',
        trackerImei: '123456789012345',
        monthlyFee: 89.90,
        installationDate: '2023-06-15',
        status: status as 'active' | 'inactive' | 'blocked',
        createdAt: '2023-06-15T10:00:00Z'
      };

      return vehicle;
    }

    // Em produção, usa a API PHP
    const status = blocked ? 'blocked' : 'active';
    const response = await api.post('/vehicles/update_status.php', { id, status });
    return response.data;
  } catch (error) {
    console.error(`Erro ao ${blocked ? 'bloquear' : 'desbloquear'} veículo ${id}:`, error);
    return null;
  }
};

// Função para gerar mensalidades para todos os veículos ativos
export const generateMonthlyInvoices = async (): Promise<boolean> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      console.log('[MOCK] Gerando mensalidades para todos os veículos ativos');
      return true;
    }

    // Em produção, usa a API PHP
    const response = await api.post('/vehicles/generate_monthly_invoices.php');
    return response.data.success || false;
  } catch (error) {
    console.error('Erro ao gerar mensalidades:', error);
    return false;
  }
};

export default { 
  getVehicles, 
  getVehicleById, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle,
  toggleVehicleBlock,
  generateMonthlyInvoices
};
