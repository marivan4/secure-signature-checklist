
import { Checklist, ApiResponse } from '@/lib/types';

// Mock data for development
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
    ipAddress: '192.168.1.1',
    createdAt: '2023-06-14T10:30:00Z'
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
    ipAddress: '192.168.1.2',
    signatureLink: 'https://example.com/signature/abc123',
    signedAt: '2023-07-22T15:45:00Z',
    createdAt: '2023-07-19T14:20:00Z'
  },
  {
    id: 3,
    userId: 1,
    cpfCnpj: '234.567.890-11',
    name: 'Maria Oliveira',
    address: 'Rua Oscar Freire',
    addressNumber: '123',
    neighborhood: 'Jardins',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01426-000',
    phone: '(11) 91234-5678',
    email: 'maria@example.com',
    vehicleModel: 'Honda Civic',
    licensePlate: 'GHI-9012',
    trackerModel: 'GT06N',
    trackerImei: '555666777888999',
    registrationDate: '2023-08-05',
    installationLocation: 'São Paulo',
    status: 'completed',
    ipAddress: '192.168.1.3',
    signatureLink: 'https://example.com/signature/def456',
    signedAt: '2023-08-07T11:20:00Z',
    createdAt: '2023-08-04T09:15:00Z'
  }
];

// Get all checklists
export const getChecklists = async (userId?: number): Promise<ApiResponse<Checklist[]>> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredChecklists = [...mockChecklists];
      
      if (userId) {
        filteredChecklists = filteredChecklists.filter(c => c.userId === userId);
      }
      
      resolve({ success: true, data: filteredChecklists });
    }, 800);
  });
};

// Get a single checklist by ID
export const getChecklistById = async (id: number): Promise<ApiResponse<Checklist>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const checklist = mockChecklists.find(c => c.id === id);
      if (checklist) {
        resolve({ success: true, data: checklist });
      } else {
        resolve({ success: false, error: 'Checklist not found' });
      }
    }, 500);
  });
};

// Create a new checklist
export const createChecklist = async (checklist: Omit<Checklist, 'id' | 'createdAt'>): Promise<ApiResponse<Checklist>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = Math.max(...mockChecklists.map(c => c.id)) + 1;
      const newChecklist: Checklist = {
        ...checklist,
        id: newId,
        createdAt: new Date().toISOString(),
        status: checklist.status || 'pending',
        ipAddress: '192.168.1.' + newId // Mock IP address
      };
      
      mockChecklists.push(newChecklist);
      resolve({ success: true, data: newChecklist });
    }, 1000);
  });
};

// Generate signature link
export const generateSignatureLink = async (checklistId: number): Promise<ApiResponse<string>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const checklist = mockChecklists.find(c => c.id === checklistId);
      if (checklist) {
        const token = Math.random().toString(36).substring(2, 15);
        const signatureLink = `${window.location.origin}/signature/${token}`;
        
        // Update the checklist
        const updatedChecklist = { ...checklist, signatureLink };
        const index = mockChecklists.findIndex(c => c.id === checklistId);
        if (index !== -1) {
          mockChecklists[index] = updatedChecklist;
        }
        
        resolve({ success: true, data: signatureLink });
      } else {
        resolve({ success: false, error: 'Checklist not found' });
      }
    }, 500);
  });
};

// Sign a checklist
export const signChecklist = async (token: string, signatureData: string): Promise<ApiResponse<Checklist>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, we would validate the token and find the associated checklist
      // For now, we'll just pick the first pending checklist
      const index = mockChecklists.findIndex(c => c.status === 'pending');
      if (index !== -1) {
        const updatedChecklist = {
          ...mockChecklists[index],
          status: 'signed' as const,
          signedAt: new Date().toISOString()
        };
        mockChecklists[index] = updatedChecklist;
        resolve({ success: true, data: updatedChecklist });
      } else {
        resolve({ success: false, error: 'No pending checklist found' });
      }
    }, 800);
  });
};

// Send WhatsApp message with signature link
export const sendWhatsAppSignatureLink = async (phone: string, signatureLink: string): Promise<ApiResponse<boolean>> => {
  // This would be a real API call in production
  console.log(`Sending WhatsApp to ${phone} with link: ${signatureLink}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: true });
    }, 1000);
  });
};

// Update checklist status
export const updateChecklistStatus = async (id: number, status: Checklist['status']): Promise<ApiResponse<Checklist>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockChecklists.findIndex(c => c.id === id);
      if (index !== -1) {
        const updatedChecklist = { ...mockChecklists[index], status };
        mockChecklists[index] = updatedChecklist;
        resolve({ success: true, data: updatedChecklist });
      } else {
        resolve({ success: false, error: 'Checklist not found' });
      }
    }, 500);
  });
};
