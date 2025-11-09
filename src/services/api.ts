import axios from 'axios';

// 1. Obtenemos la URL base de tu archivo .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/API/V1.0';

// 2. Creamos la instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// 3. El Interceptor: La parte más importante
// Esto se ejecuta ANTES de CADA petición.
api.interceptors.request.use(
  (config) => {
    // Obtenemos el token de localStorage
    const token = localStorage.getItem('accessToken');
    
    // Si el token existe, lo añadimos a la cabecera 'Authorization'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Manejo de errores en la petición
    return Promise.reject(error);
  }
);

// Aquí también se podría manejar la lógica de 'refresh token'
// si una petición falla con 401 (token expirado).

export default api;