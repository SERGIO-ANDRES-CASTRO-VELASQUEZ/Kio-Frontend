import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import { AuthUser, DecodedJwt } from '../types/models';
import { LoginRequest, UserCreateRequest } from '../types/apiRequests';
import { TokenResponse } from '../types/apiResponses';

// 1. Definir la forma del Contexto
export interface IAuthContext {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: UserCreateRequest) => Promise<void>;
  logout: () => void;
  hasRole: (roleName: string) => boolean;
  isAuthenticated: boolean;
  loading: boolean;
}

// 2. Crear el Contexto (con valor inicial null)
const AuthContext = createContext<IAuthContext | null>(null);

// 3. Definir el Proveedor
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      try {
        const decodedToken = jwtDecode<DecodedJwt>(accessToken); // Tipar el decode
        setUser({
          id: decodedToken.user_id,
          email: decodedToken.sub,
          roles: decodedToken.roles || [],
          // NOTA: accountId se debe buscar con una llamada a /user/{pk}
          // y luego hacer setUser(...) de nuevo.
        });
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      } catch (e) {
        console.error("Token inválido o expirado");
        logout(); // Limpiar si el token es malo
      }
    }
    setLoading(false);
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    const loginData: LoginRequest = { email, password };
    // Tipar la respuesta de la API
    const response = await api.post<TokenResponse>('/login', loginData);
    const { access, refresh } = response.data;

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    setAccessToken(access);
  };
  
  const register = async (userData: UserCreateRequest) => {
     // Tu backend devuelve tokens al registrar (visto en UserController.java)
     const response = await api.post<TokenResponse>('/user/', userData);
     const { access, refresh } = response.data;
     
     localStorage.setItem('accessToken', access);
     localStorage.setItem('refreshToken', refresh);
     setAccessToken(access);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
  };

  const hasRole = (roleName: string): boolean => {
    return user?.roles.includes(roleName) || false;
  };

  // 4. Pasar el valor tipado al proveedor
  const value: IAuthContext = {
    user,
    login,
    register,
    logout,
    hasRole,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// 5. Crear el hook tipado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};