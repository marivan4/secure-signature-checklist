
// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://app8.narrota.com.br/api',
  TIMEOUT: 30000, // 30 seconds
};

interface AsaasApiConfig {
  apiKey: string;
  sandbox: boolean;
}

let asaasConfig: AsaasApiConfig = {
  apiKey: '',
  sandbox: true
};

// Function to initialize Asaas API configuration
export const initAsaasApiConfig = (config: AsaasApiConfig) => {
  asaasConfig = { ...config };
};

// Function to get Asaas base URL based on environment
export const getAsaasBaseUrl = (): string => {
  const baseUrl = asaasConfig.sandbox 
    ? 'https://sandbox.asaas.com' 
    : 'https://www.asaas.com';
  return baseUrl;
};

// Function to get Asaas API headers with authentication
export const getAsaasHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'access_token': asaasConfig.apiKey
  };
};

export default API_CONFIG;
