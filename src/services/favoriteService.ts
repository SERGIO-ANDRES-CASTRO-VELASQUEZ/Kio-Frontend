import api from './api';
import type { AccountFavoritesResponse } from '../types/apiResponses';

/**
 * Obtiene la lista de favoritos de una cuenta.
 * Corresponde a GET /user/account/account_favorites/{id} en FavoriteController.java
 *
 */
export const getAccountFavorites = (accountId: number): Promise<AccountFavoritesResponse> => {
  return api.get(`/user/account/account_favorites/${accountId}`)
    .then(res => res.data);
};

/**
 * Elimina un favorito por su ID (el ID de DetailFavoritos, no del producto).
 * Corresponde a DELETE /user/delete/{pk} en FavoriteController.java
 *
 */
export const removeFavorite = (favoriteId: number): Promise<void> => {
  return api.delete(`/user/delete/${favoriteId}`);
};

/**
 * Añade un producto a favoritos.
 * Corresponde a POST /user/favorite en FavoriteController.java
 *
 */
export const addFavorite = (accountId: number, productId: number): Promise<void> => {
  return api.post('/user/favorite', { account: accountId, product: productId });
};