import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  config => {
    console.log('Fazendo requisição para:', config.url);
    return config;
  },
  error => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  response => {
    console.log('Resposta de:', response.config.url, response.status);
    return response;
  },
  error => {
    console.error('Erro na resposta:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Cliente endpoints - sem prefixo /api
export const clienteService = {
  getAll: () => api.get('/clientes'),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post('/clientes', data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
  delete: (id) => api.delete(`/clientes/${id}`),
};

// Ambiente endpoints - com prefixo /api
export const ambienteService = {
  getAll: () => api.get('/api/ambientes'),
  getById: (id) => api.get(`/api/ambientes/${id}`),
  create: (data) => api.post('/api/ambientes', data),
  update: (id, data) => api.put(`/api/ambientes/${id}`, data),
  delete: (id) => api.delete(`/api/ambientes/${id}`),
};

// Dispositivo endpoints - com prefixo /api
export const dispositivoService = {
  getAll: () => api.get('/api/dispositivos'),
  getById: (id) => api.get(`/api/dispositivos/${id}`),
  create: (data) => api.post('/api/dispositivos', data),
  update: (id, data) => api.put(`/api/dispositivos/${id}`, data),
  delete: (id) => api.delete(`/api/dispositivos/${id}`),
};

export default api; 