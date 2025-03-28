
// Configurações da API para diferentes serviços

// Configuração específica para Asaas API
export const asaasApiConfig = {
  headers: {
    'accept': 'application/json',
    'content-type': 'application/json',
    'access_token': ''
  },
  baseURL: '',
  sandbox: true
};

// Função para atualizar o token de acesso do Asaas
export const updateAsaasToken = (token: string): void => {
  asaasApiConfig.headers['access_token'] = token;
};

// Função para atualizar a URL base do Asaas
export const updateAsaasBaseURL = (url: string): void => {
  asaasApiConfig.baseURL = url;
};

// Função para atualizar o modo sandbox do Asaas
export const updateAsaasSandbox = (isSandbox: boolean): void => {
  asaasApiConfig.sandbox = isSandbox;
};

// Função para obter a URL base da API Asaas baseada no modo sandbox
export const getAsaasBaseUrl = (): string => {
  if (!asaasApiConfig.baseURL) {
    return asaasApiConfig.sandbox
      ? 'https://api-sandbox.asaas.com/v3'
      : 'https://api.asaas.com/v3';
  }
  return asaasApiConfig.baseURL;
};

// Função para obter os cabeçalhos da API Asaas
export const getAsaasHeaders = (): Record<string, string> => {
  return asaasApiConfig.headers;
};

// Função para inicializar a configuração da API Asaas
export const initAsaasApiConfig = (config: {
  apiKey: string;
  baseURL?: string;
  sandbox?: boolean;
}): void => {
  updateAsaasToken(config.apiKey);
  if (config.baseURL) {
    updateAsaasBaseURL(config.baseURL);
  }
  if (config.sandbox !== undefined) {
    updateAsaasSandbox(config.sandbox);
  }
};
