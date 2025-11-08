// src/services/productService.ts
import api, { PaginatedResponse } from './api';
import {
  Product,
  ProductListItem,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductImageUploadRequest,
  TagDTO,
  SizeDTO,
  ColorDTO,
} from '../types';

// ==================== PRODUCTOS (Admin & Public) ====================

// Obtener productos publicados (público)
export const getPublishedProducts = async (
  page: number = 0,
  pageSize: number = 8,
  search?: string
): Promise<PaginatedResponse<ProductListItem>> => {
  const params: any = { page, page_size: pageSize };
  if (search) {
    params.search = search;
  }
  
  const response = await api.get('/products', { params });
  return response.data;
};

// Obtener detalle de producto por slug (público)
export const getProductBySlug = async (slug: string): Promise<Product> => {
  const response = await api.get(`/article/${slug}`);
  return response.data;
};

// Obtener todos los productos (admin) - incluye drafts
export const getAllProducts = async (
  page: number = 0,
  pageSize: number = 20
): Promise<PaginatedResponse<Product>> => {
  const response = await api.get('/admin/products', {
    params: { page, page_size: pageSize },
  });
  return response.data;
};

// Obtener producto por ID (admin)
export const getProductById = async (id: number): Promise<Product> => {
  const response = await api.get(`/admin/products/${id}`);
  return response.data;
};

// Crear producto (admin)
export const createProduct = async (data: ProductCreateRequest): Promise<Product> => {
  const response = await api.post('/admin/products', data);
  return response.data;
};

// Actualizar producto (admin)
export const updateProduct = async (
  id: number,
  data: ProductUpdateRequest
): Promise<Product> => {
  const response = await api.put(`/admin/products/${id}`, data);
  return response.data;
};

// Eliminar producto (admin)
export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/admin/products/${id}`);
};

// ==================== IMÁGENES ====================

// Subir imagen de producto (admin)
export const uploadProductImage = async (
  data: ProductImageUploadRequest
): Promise<void> => {
  await api.post('/admin/products/images', data);
};

// Eliminar imagen (admin)
export const deleteProductImage = async (imageId: number): Promise<void> => {
  await api.delete(`/admin/products/images/${imageId}`);
};

// ==================== TAGS/CATEGORÍAS ====================

// Obtener todos los tags (público y admin)
export const getAllTags = async (): Promise<TagDTO[]> => {
  const response = await api.get('/tags');
  return response.data;
};

// Crear tag (admin)
export const createTag = async (data: { name: string; imageURL?: string }): Promise<TagDTO> => {
  const response = await api.post('/admin/tags', data);
  return response.data;
};

// Actualizar tag (admin)
export const updateTag = async (
  id: number,
  data: { name?: string; imageURL?: string }
): Promise<TagDTO> => {
  const response = await api.put(`/admin/tags/${id}`, data);
  return response.data;
};

// Eliminar tag (admin)
export const deleteTag = async (id: number): Promise<void> => {
  await api.delete(`/admin/tags/${id}`);
};

// ==================== TALLAS ====================

// Obtener todas las tallas (admin)
export const getAllSizes = async (): Promise<SizeDTO[]> => {
  const response = await api.get('/admin/sizes');
  return response.data;
};

// Crear talla (admin)
export const createSize = async (data: { name: string }): Promise<SizeDTO> => {
  const response = await api.post('/admin/sizes', data);
  return response.data;
};

// Actualizar talla (admin)
export const updateSize = async (id: number, data: { name: string }): Promise<SizeDTO> => {
  const response = await api.put(`/admin/sizes/${id}`, data);
  return response.data;
};

// Eliminar talla (admin)
export const deleteSize = async (id: number): Promise<void> => {
  await api.delete(`/admin/sizes/${id}`);
};

// ==================== COLORES ====================

// Obtener todos los colores (admin)
export const getAllColors = async (): Promise<ColorDTO[]> => {
  const response = await api.get('/admin/colors');
  return response.data;
};

// Crear color (admin)
export const createColor = async (data: { name: string }): Promise<ColorDTO> => {
  const response = await api.post('/admin/colors', data);
  return response.data;
};

// Actualizar color (admin)
export const updateColor = async (id: number, data: { name: string }): Promise<ColorDTO> => {
  const response = await api.put(`/admin/colors/${id}`, data);
  return response.data;
};

// Eliminar color (admin)
export const deleteColor = async (id: number): Promise<void> => {
  await api.delete(`/admin/colors/${id}`);
};