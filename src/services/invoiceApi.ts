
import axios from 'axios';
import { Invoice } from '@/lib/types';
import api from './api';
import { createCustomer, createPayment, getCustomerByCpfCnpj } from './asaasApi';
import { getVehicles } from './vehicleApi';

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
          createdAt: '2023-06-20T10:00:00Z',
          asaasId: 'pay_123456789'
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
          createdAt: '2023-07-25T09:15:00Z',
          asaasId: 'pay_987654321'
        },
        {
          id: 3,
          userId: 2,
          invoiceNumber: 'INV-2023-003',
          description: 'Mensalidade de serviço - Fiat Uno',
          amount: 79.90,
          status: 'cancelled',
          dueDate: '2023-08-20',
          createdAt: '2023-07-25T11:30:00Z',
          asaasId: 'pay_555555555'
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
        createdAt: '2023-07-15T10:00:00Z',
        asaasId: `pay_${id}123456789`
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
    // Obter cliente ou criar novo no Asaas
    let customerId = '';
    if (invoice.userId) {
      // Obter informações do cliente
      const clientResponse = await api.get(`/users/get_one.php?id=${invoice.userId}`);
      if (clientResponse.data && clientResponse.data.cpfCnpj) {
        // Buscar cliente no Asaas por CPF/CNPJ
        const asaasCustomer = await getCustomerByCpfCnpj(clientResponse.data.cpfCnpj);
        
        if (asaasCustomer) {
          customerId = asaasCustomer.id;
        } else {
          // Criar novo cliente no Asaas
          const newCustomer = await createCustomer({
            name: clientResponse.data.name,
            email: clientResponse.data.email,
            cpfCnpj: clientResponse.data.cpfCnpj,
            phone: clientResponse.data.phone
          });
          
          if (newCustomer) {
            customerId = newCustomer.id;
          }
        }
      }
    }

    // Criar pagamento no Asaas se tiver customer ID
    let asaasPaymentId = '';
    if (customerId) {
      const payment = await createPayment({
        customer: customerId,
        billingType: 'BOLETO', // Pode ser configurável
        value: invoice.amount,
        dueDate: invoice.dueDate,
        description: invoice.description,
        externalReference: invoice.invoiceNumber
      });
      
      if (payment && payment.id) {
        asaasPaymentId = payment.id;
      }
    }

    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // Mock para desenvolvimento
      const newInvoice: Invoice = {
        ...invoice,
        id: Math.floor(Math.random() * 1000) + 4,
        createdAt: new Date().toISOString(),
        asaasId: asaasPaymentId || `pay_mock${Math.random().toString(36).substring(2, 15)}`
      };

      return newInvoice;
    }

    // Em produção, usa a API PHP
    const invoiceData = {
      ...invoice,
      asaasId: asaasPaymentId
    };
    const response = await api.post('/invoices/create.php', invoiceData);
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
        createdAt: '2023-07-15T10:00:00Z',
        asaasId: invoice.asaasId || `pay_${id}updated`
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

// Função para gerar automaticamente as mensalidades dos clientes
export const generateMonthlyInvoices = async (): Promise<boolean> => {
  try {
    console.log('Gerando mensalidades automáticas');
    
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // No desenvolvimento, simulamos o processo
      
      // 1. Busca todos os usuários
      const usersResponse = await api.get('/users/get_all.php?role=client');
      const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
      
      // 2. Para cada usuário, busca seus veículos ativos
      for (const user of users) {
        const vehicles = await getVehicles(user.id);
        const activeVehicles = vehicles.filter(v => v.status === 'active');
        
        if (activeVehicles.length > 0) {
          // 3. Calcula o valor total das mensalidades
          const totalAmount = activeVehicles.reduce((sum, vehicle) => sum + vehicle.monthlyFee, 0);
          
          // 4. Cria uma descrição com os veículos incluídos
          const vehicleDescriptions = activeVehicles.map(v => `${v.model} (${v.plate})`).join(', ');
          const description = activeVehicles.length > 1 
            ? `Mensalidade de rastreamento - ${activeVehicles.length} veículos: ${vehicleDescriptions}`
            : `Mensalidade de rastreamento - ${vehicleDescriptions}`;
          
          // 5. Define a data de vencimento para o próximo mês
          const today = new Date();
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 10); // Dia 10 do próximo mês
          const dueDate = nextMonth.toISOString().split('T')[0];
          
          // 6. Gera um número de fatura único
          const invoiceNumber = `INV-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}-${user.id.toString().padStart(4, '0')}`;
          
          // 7. Cria a fatura
          console.log(`[MOCK] Criando fatura mensal para usuário ${user.id} no valor de ${totalAmount}`);
          
          // Em um sistema real, aqui chamaria a função createInvoice()
        }
      }
      
      return true;
    }

    // Em produção, usa a API PHP para o processo em massa
    const response = await api.post('/invoices/generate_monthly.php');
    return response.data.success || false;
  } catch (error) {
    console.error('Erro ao gerar mensalidades automáticas:', error);
    return false;
  }
};

// Função para verificar faturas vencidas e bloquear veículos
export const checkOverdueInvoicesAndBlock = async (): Promise<boolean> => {
  try {
    console.log('Verificando faturas vencidas para bloquear veículos');
    
    // Em desenvolvimento, usamos dados mockados
    if (!import.meta.env.PROD) {
      // No desenvolvimento, simulamos o processo
      
      // 1. Busca todas as faturas pendentes
      const invoices = await getInvoices();
      const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
      
      // 2. Filtra as faturas vencidas
      const today = new Date();
      const overdueInvoices = pendingInvoices.filter(inv => {
        const dueDate = new Date(inv.dueDate);
        // Considera vencida se passou 5 dias da data de vencimento
        const gracePeriod = new Date(dueDate);
        gracePeriod.setDate(gracePeriod.getDate() + 5);
        return today > gracePeriod;
      });
      
      // 3. Para cada fatura vencida, bloqueia os veículos do cliente
      for (const invoice of overdueInvoices) {
        console.log(`[MOCK] Fatura ${invoice.id} vencida, bloqueando veículos do cliente ${invoice.userId}`);
        
        // Busca veículos do cliente
        const vehicles = await getVehicles(invoice.userId);
        
        // Bloqueia cada veículo
        for (const vehicle of vehicles) {
          if (vehicle.status === 'active') {
            console.log(`[MOCK] Bloqueando veículo ${vehicle.id} (${vehicle.plate}) por falta de pagamento`);
            // Em um sistema real, aqui chamaria a função toggleVehicleBlock()
          }
        }
        
        // Atualiza a fatura para indicar que os veículos foram bloqueados
        console.log(`[MOCK] Marcando fatura ${invoice.id} como bloqueada`);
        // Em um sistema real, aqui chamaria a função updateInvoice()
      }
      
      return true;
    }

    // Em produção, usa a API PHP para o processo em massa
    const response = await api.post('/invoices/check_overdue_and_block.php');
    return response.data.success || false;
  } catch (error) {
    console.error('Erro ao verificar faturas vencidas:', error);
    return false;
  }
};
