
import axios from 'axios';
import { Invoice } from '@/lib/types';
import api from './api';

// Função para obter todas as faturas
export const getInvoices = async (userId?: number): Promise<Invoice[]> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock de dados para desenvolvimento
      const mockInvoices: Invoice[] = [
        {
          id: 1,
          userId: 1,
          checklistId: 1,
          invoiceNumber: 'INV-2023-001',
          description: 'Instalação de rastreador - Toyota Corolla',
          amount: 250.00,
          status: 'paid',
          dueDate: '2023-07-15',
          paidDate: '2023-07-10',
          createdAt: '2023-06-20T10:00:00Z'
        },
        {
          id: 2,
          userId: 1,
          checklistId: 2,
          invoiceNumber: 'INV-2023-002',
          description: 'Mensalidade de serviço - Ford Ranger',
          amount: 89.90,
          status: 'pending',
          dueDate: '2023-08-15',
          createdAt: '2023-07-25T09:15:00Z'
        },
        {
          id: 3,
          userId: 2,
          invoiceNumber: 'INV-2023-003',
          description: 'Mensalidade de serviço - Fiat Uno',
          amount: 79.90,
          status: 'cancelled',
          dueDate: '2023-08-20',
          createdAt: '2023-07-25T11:30:00Z'
        }
      ];

      // Se tiver userId, filtra pelo userId
      const filteredInvoices = userId 
        ? mockInvoices.filter(invoice => invoice.userId === userId)
        : mockInvoices;

      return filteredInvoices;
    }

    // Em produção, usa a API PHP
    const response = await api.get(`/invoices/get_all.php${userId ? `?userId=${userId}` : ''}`);
    
    // Verifica se a resposta é um array, caso contrário retorna um array vazio
    return Array.isArray(response.data) ? response.data : [];
    
  } catch (error) {
    console.error('Erro ao buscar faturas:', error);
    return [];
  }
};

// Função para obter uma fatura específica pelo ID
export const getInvoiceById = async (id: number): Promise<Invoice | null> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock de dados para desenvolvimento
      const mockInvoice: Invoice = {
        id: id,
        userId: 1,
        checklistId: 1,
        invoiceNumber: `INV-2023-00${id}`,
        description: 'Instalação de rastreador - Toyota Corolla',
        amount: 250.00,
        status: 'pending',
        dueDate: '2023-08-15',
        createdAt: '2023-07-15T10:00:00Z'
      };

      return mockInvoice;
    }

    // Em produção, usa a API PHP
    const response = await api.get(`/invoices/get_one.php?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar fatura ${id}:`, error);
    return null;
  }
};

// Função para criar uma nova fatura
export const createInvoice = async (invoice: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice | null> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento
      const newInvoice: Invoice = {
        ...invoice,
        id: Math.floor(Math.random() * 1000) + 4,
        createdAt: new Date().toISOString()
      };

      return newInvoice;
    }

    // Em produção, usa a API PHP
    const response = await api.post('/invoices/create.php', invoice);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar fatura:', error);
    return null;
  }
};

// Função para atualizar uma fatura
export const updateInvoice = async (id: number, invoice: Partial<Invoice>): Promise<Invoice | null> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento
      const updatedInvoice: Invoice = {
        id: id,
        userId: invoice.userId || 1,
        invoiceNumber: invoice.invoiceNumber || `INV-2023-00${id}`,
        description: invoice.description || 'Fatura atualizada',
        amount: invoice.amount || 100.00,
        status: invoice.status || 'pending',
        dueDate: invoice.dueDate || '2023-08-30',
        paidDate: invoice.paidDate,
        createdAt: '2023-07-15T10:00:00Z'
      };

      return updatedInvoice;
    }

    // Em produção, usa a API PHP
    const response = await api.post('/invoices/update.php', { id, ...invoice });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar fatura ${id}:`, error);
    return null;
  }
};

// Função para excluir uma fatura
export const deleteInvoice = async (id: number): Promise<boolean> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento - simula exclusão bem-sucedida
      return true;
    }

    // Em produção, usa a API PHP
    await api.post('/invoices/delete.php', { id });
    return true;
  } catch (error) {
    console.error(`Erro ao excluir fatura ${id}:`, error);
    return false;
  }
};

// Função para enviar uma fatura por e-mail
export const sendInvoiceByEmail = async (id: number, email: string): Promise<boolean> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento - simula envio bem-sucedido
      console.log(`[MOCK] Enviando fatura ${id} para ${email}`);
      return true;
    }

    // Em produção, usa a API PHP
    await api.post('/invoices/send_email.php', { id, email });
    return true;
  } catch (error) {
    console.error(`Erro ao enviar fatura ${id} por e-mail:`, error);
    return false;
  }
};

// Função para enviar uma fatura por WhatsApp
export const sendInvoiceByWhatsApp = async (id: number, phone: string): Promise<boolean> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento - simula envio bem-sucedido
      console.log(`[MOCK] Enviando fatura ${id} para WhatsApp ${phone}`);
      return true;
    }

    // Em produção, usa a API PHP
    await api.post('/invoices/send_whatsapp.php', { id, phone });
    return true;
  } catch (error) {
    console.error(`Erro ao enviar fatura ${id} por WhatsApp:`, error);
    return false;
  }
};

// Função para exportar uma fatura como PDF
export const exportInvoiceAsPdf = async (id: number): Promise<string | null> => {
  try {
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento - simula URL de download
      return `https://example.com/downloads/invoice_${id}.pdf`;
    }

    // Em produção, usa a API PHP
    const response = await api.get(`/invoices/export_pdf.php?id=${id}`, {
      responseType: 'blob'
    });
    
    // Cria URL para download do blob
    const blob = new Blob([response.data], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error(`Erro ao exportar fatura ${id} como PDF:`, error);
    return null;
  }
};
