// src/services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

// URL base del backend - cambiar según tu entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Crear instancia de Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para agregar token JWT a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Si el error es 401 (no autorizado) y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // No hay refresh token, redirigir al login
          localStorage.clear();
          window.location.href = '/admin/login';
          return Promise.reject(error);
        }

        // Intentar refrescar el token
        const response = await axios.post(`${API_BASE_URL}/refresh`, {
          refresh: refreshToken,
        });

        const { access, refresh } = response.data;
        
        // Guardar nuevos tokens
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);

        // Reintentar la petición original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, limpiar tokens y redirigir al login
        localStorage.clear();
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Tipos para respuestas paginadas
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Helper para manejar errores de API
export const handleApiError = (error: any): string => {
  if (error.response) {
    // El servidor respondió con un código de error
    return error.response.data?.message || 'Error en el servidor';
  } else if (error.request) {
    // La petición se hizo pero no hubo respuesta
    return 'No se pudo conectar con el servidor';
  } else {
    // Algo pasó al configurar la petición
    return error.message || 'Error desconocido';
  }
};

export default api;