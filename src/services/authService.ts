import api from './api';
import type { LoginRequest, UserCreateRequest } from '../types/apiRequests';
import type { TokenResponse } from '../types/apiResponses';

/**
 * Inicia sesión de un usuario y obtiene tokens.
 * Corresponde a POST /login en AuthController.java
 *
 */
export const login = (credentials: LoginRequest): Promise<TokenResponse> => {
  return api.post('/login', credentials).then(res => res.data);
};

/**
 * Registra un nuevo usuario y obtiene tokens.
 * Corresponde a POST /user/ en UserController.java
 *
 */
export const register = (userData: UserCreateRequest): Promise<TokenResponse> => {
  return api.post('/user/', userData).then(res => res.data);
};

/**
 * Refresca el token de acceso usando un refresh token.
 * Corresponde a POST /refresh en AuthController.java
 *
 */
export const refreshToken = (refreshToken: string): Promise<TokenResponse> => {
  return api.post('/refresh', { refresh: refreshToken }).then(res => res.data);
};