import axios from "axios";

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Interceptor para añadir token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token inválido o expirado
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          window.location.href = '/';
          break;
        case 403:
          console.warn('Acceso denegado');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
        default:
          console.error('Error en la petición:', error.response.status);
      }
    } else if (error.request) {
      console.error('Error de conexión:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;