export interface User {
  id: number;
  username: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  role: 'admin' | 'client' | 'manager' | 'reseller' | 'end_client';
  createdAt: string;
  parentId?: number; // Used to track reseller's parent admin
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
  email?: string;
  phone?: string;
  asaasId?: string;
  blocked?: boolean;
  billingType?: 'BOLETO' | 'PIX' | 'CREDIT_CARD';
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

export interface AsaasConfig {
  id?: number;
  apiKey: string;
  sandbox: boolean;
  userId: number;
  createdAt?: string;
  userRole?: string;
}

export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  cpfCnpj: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  externalReference?: string;
  notificationDisabled?: boolean;
  additionalEmails?: string;
  municipalInscription?: string;
  stateInscription?: string;
  observations?: string;
  city?: string;
  cityName?: string;
  state?: string;
  personType?: 'FISICA' | 'JURIDICA';
  deleted?: boolean;
  foreignCustomer?: boolean;
  dateCreated?: string;
}

export interface AsaasPayment {
  id?: string;
  customer: string;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'TRANSFER' | 'DEPOSIT' | 'UNDEFINED';
  value: number;
  dueDate: string;
  description?: string;
  externalReference?: string;
  installmentCount?: number;
  totalValue?: number;
  installmentValue?: number;
  discount?: AsaasDiscount;
  interest?: AsaasInterest;
  fine?: AsaasFine;
  postalService?: boolean;
  status?: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED_IN_CASH' | 'REFUND_REQUESTED' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_REQUESTED' | 'DUNNING_RECEIVED' | 'AWAITING_RISK_ANALYSIS';
  invoiceUrl?: string;
  bankSlipUrl?: string;
  pixQrCodeId?: string;
  invoiceNumber?: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  confirmedDate?: string;
  pixTransaction?: string;
  creditDate?: string;
  estimatedCreditDate?: string;
  transactionReceiptUrl?: string;
  nossoNumero?: string;
  lastInvoiceViewedDate?: string;
  lastBankSlipViewedDate?: string;
  canBePaidAfterDueDate?: boolean;
  originalDueDate?: string;
  originalValue?: number;
  interestValue?: number;
  netValue?: number;
  deleted?: boolean;
  anticipated?: boolean;
  anticipable?: boolean;
}

export interface AsaasDiscount {
  value: number;
  dueDateLimitDays?: number;
  type: 'FIXED' | 'PERCENTAGE';
}

export interface AsaasInterest {
  value: number;
}

export interface AsaasFine {
  value: number;
}

export interface AsaasWebhookEvent {
  event: string;
  payment: {
    id: string;
    customer: string;
    value: number;
    netValue: number;
    billingType: string;
    status: string;
    dueDate: string;
    paymentDate?: string;
    invoiceUrl: string;
    invoiceNumber: string;
    externalReference?: string;
  };
}

export interface Vehicle {
  id: number;
  userId: number;
  checklistId?: number;
  model: string;
  plate: string;
  year?: string;
  color?: string;
  trackerModel: string;
  trackerImei: string;
  monthlyFee: number;
  installationDate: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  durationMonths: number;
  color: string;
}

export interface Tracker {
  id?: number;
  userId: number;
  vehicleId?: number;
  imei: string;
  model: string;
  installationDate: string;
  status: 'active' | 'inactive' | 'maintenance' | 'blocked';
  lastTransmissionDate?: string;
  batteryLevel?: number;
  simCardNumber?: string;
  notes?: string;
  createdAt?: string;
}

export interface Reseller {
  id: number;
  userId: number;
  name: string;
  logo?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  email?: string;
  phone?: string;
  contactName?: string;
  contactPhone?: string;
  description?: string;
  status: 'active' | 'pending' | 'inactive';
  clientsCount: number;
  monthlyRevenue: number;
  since: string;
  createdAt: string;
  createdBy: number; // Admin ID who created the reseller
  asaasConfigured: boolean;
}

export interface ResellerClient {
  id: number;
  resellerId: number;
  name: string;
  email: string;
  phone?: string;
  cpfCnpj: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}
