
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'client' | 'manager';
  createdAt: string;
}

export interface Checklist {
  id: number;
  userId: number;
  cpfCnpj: string;
  name: string;
  address?: string;
  addressNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email: string;
  vehicleModel?: string;
  licensePlate?: string;
  trackerModel?: string;
  trackerImei?: string;
  registrationDate: string;
  installationLocation?: string;
  status: 'pending' | 'signed' | 'completed';
  ipAddress?: string;
  signatureLink?: string;
  signedAt?: string;
  createdAt: string;
}

export interface Invoice {
  id: number;
  userId: number;
  checklistId?: number;
  invoiceNumber: string;
  description: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface WhatsAppConfig {
  id: number;
  apiKey: string;
  instance: string;
  baseUrl: string;
  userId: number;
  createdAt: string;
}
