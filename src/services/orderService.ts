import api from './api';
import type { OrderDetailResponse, Page } from '../types/apiResponses';

/**
 * Obtiene las órdenes paginadas del usuario autenticado.
 * Corresponde a GET /user/orders en OrderController.java
 *
 */
export const getUserOrders = (page = 0, size = 10, status = ''): Promise<Page<OrderDetailResponse>> => {
  return api.get(`/user/orders?page=${page}&page_size=${size}&statusOrder=${status}`)
    .then(res => res.data);
};