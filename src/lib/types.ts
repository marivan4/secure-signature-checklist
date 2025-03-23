
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'client';
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
