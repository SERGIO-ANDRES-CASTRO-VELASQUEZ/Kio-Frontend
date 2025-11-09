import api from './api';
import type { UserDetailResponse } from '../types/apiResponses';
import type { UserUpdateRequest } from '../types/apiRequests';

/**
 * Obtiene los detalles públicos/de cuenta de un usuario.
 * Corresponde a GET /user/{pk} en UserController.java
 *
 */
export const getUserDetail = (id: number): Promise<UserDetailResponse> => {
  return api.get(`/user/${id}`).then(res => res.data);
};

/**
 * Actualiza parcialmente la información de un usuario.
 * Corresponde a PATCH /user/update/{pk} en UserController.java
 *
 */
export const updateUser = (id: number, data: UserUpdateRequest): Promise<void> => {
  return api.patch(`/user/update/${id}`, data);
};