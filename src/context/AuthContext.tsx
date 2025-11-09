import { createContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api'; // Lo necesitamos para el interceptor
import * as authService from '../services/authService'; // 1. Importa el nuevo servicio
import { getUserDetail } from '../services/userService'; // 2. Importa el servicio de usuario
import type { AuthUser, DecodedJwt } from '../types/models';
import type { LoginRequest, UserCreateRequest } from '../types/apiRequests';
import type { IAuthContext } from '../types/contexts'; // Importa la Interfaz
 // Importa la Interfaz

// Crear el Contexto (con valor inicial null)
export const AuthContext = createContext<IAuthContext | null>(null);

// Definir el Proveedor
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  /**
   * Obtiene los detalles de la cuenta de usuario desde /user/{pk}
   * y los fusiona con el estado del usuario.
   */
  const fetchUserAccount = async (userId: number, baseUser: AuthUser) => {
    try {
      // 3. Llama al servicio de usuario
      const data = await getUserDetail(userId);
      const { account, name } = data;
      
      setUser({
        ...baseUser,
        name: name,
        accountId: account.id, // ¡Crucial para el checkout!
      });

    } catch (error) {
      console.error("Error fetching user account details:", error);
      setUser(baseUser); // Dejar al menos la info básica del token
    }
  };

  /**
   * Efecto que se ejecuta al cargar la app y cada vez que el token cambia.
   */
  useEffect(() => {
    const initializeAuth = async () => {
      if (accessToken) {
        try {
          const decodedToken = jwtDecode<DecodedJwt>(accessToken);
          
          const baseUser: AuthUser = {
            id: decodedToken.user_id,
            email: decodedToken.sub,
            roles: decodedToken.roles || [],
          };
          
          // Configura el header de Axios para futuras peticiones
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          // Busca los detalles completos de la cuenta (incl. accountId)
          await fetchUserAccount(decodedToken.user_id, baseUser);

        } catch (e) {
          console.error("Token inválido o expirado");
          logout(); // Limpia si el token es malo
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [accessToken]); // Se dispara cuando setAccessToken es llamado

  /**
   * Inicia sesión llamando al authService.
   */
  const login = async (email: string, password: string) => {
    const loginData: LoginRequest = { email, password };
    
    // 4. Llama al servicio de login
    const { access, refresh } = await authService.login(loginData);

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    setAccessToken(access); // Esto disparará el useEffect de arriba
  };
  
  /**
   * Registra un nuevo usuario llamando al authService.
   */
  const register = async (userData: UserCreateRequest) => {
     // 5. Llama al servicio de registro
     const { access, refresh } = await authService.register(userData);
     
     localStorage.setItem('accessToken', access);
     localStorage.setItem('refreshToken', refresh);
     setAccessToken(access); // Esto disparará el useEffect de arriba
  };

  /**
   * Cierra la sesión
   */
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
  };

  /**
   * Verifica si el usuario tiene un rol (ej. "ROLE_ADMIN")
   */
  const hasRole = (roleName: string): boolean => {
    return user?.roles.includes(roleName) || false;
  };

  // 6. Pasa el valor actualizado al proveedor
  const value: IAuthContext = {
    user,
    login,
    register,
    logout,
    hasRole,
    isAdmin: hasRole("ROLE_ADMIN"), // Basado en UserProfile.java
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};