import api from './api';
import type { ProductDetailDTO, ProductListDTO, TagDTO, Page } from '../types/apiResponses';

/**
 * Obtiene la lista pública de productos, paginada.
 * Corresponde a GET /products en ProductController.java
 *
 */
export const getPublishedProducts = (page = 0, size = 8, search = ''): Promise<Page<ProductListDTO>> => {
  return api.get(`/products?page=${page}&page_size=${size}&search=${search}`)
    .then(res => res.data);
};

/**
 * Obtiene el detalle de un producto por su slug.
 * Corresponde a GET /article/{slug} en ProductController.java
 *
 */
export const getProductBySlug = (slug: string): Promise<ProductDetailDTO> => {
  return api.get(`/article/${slug}`).then(res => res.data);
};

/**
 * Obtiene la lista pública de tags/categorías.
 * Corresponde a GET /tags en ProductController.java
 *
 */
export const getPublicTags = (): Promise<TagDTO[]> => {
  return api.get('/tags').then(res => res.data);
};