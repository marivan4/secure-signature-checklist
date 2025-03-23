
import axios from 'axios';

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

export default api;
