// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { User, LoginRequest, TokenResponse, RegisterRequest } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un usuario autenticado al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');

      if (token && userId) {
        try {
          // Obtener datos del usuario
          const response = await api.get(`/user/${userId}`);
          setUser(response.data);
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          localStorage.clear();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      // 1. Login y obtener tokens
      const loginResponse = await api.post<TokenResponse>('/login', credentials);
      const { access, refresh } = loginResponse.data;

      // Guardar tokens
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // 2. Decodificar el token para obtener el user_id
      const tokenPayload = JSON.parse(atob(access.split('.')[1]));
      const userId = tokenPayload.user_id;
      localStorage.setItem('userId', userId.toString());

      // 3. Obtener datos completos del usuario
      const userResponse = await api.get(`/user/${userId}`);
      setUser(userResponse.data);
    } catch (error: any) {
      console.error('Error en login:', error);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      // Registrar usuario (el backend automáticamente hace login)
      const response = await api.post<TokenResponse>('/user/', data);
      const { access, refresh } = response.data;

      // Guardar tokens
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Decodificar token y obtener user_id
      const tokenPayload = JSON.parse(atob(access.split('.')[1]));
      const userId = tokenPayload.user_id;
      localStorage.setItem('userId', userId.toString());

      // Obtener datos del usuario
      const userResponse = await api.get(`/user/${userId}`);
      setUser(userResponse.data);
    } catch (error: any) {
      console.error('Error en registro:', error);
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/';
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const isAdmin = user?.isSuperuser || false;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};