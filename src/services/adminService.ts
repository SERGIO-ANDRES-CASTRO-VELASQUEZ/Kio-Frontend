import api from './api';
import type { Product, Tag, Size, Color } from '../types/models';
import type {
  ProductCreateRequest,
  ProductUpdateRequest,
  TagCreateRequest,
  TagUpdateRequest,
  SizeCreateRequest,
  SizeUpdateRequest,
  ColorCreateRequest,
  ColorUpdateRequest,
  ProductImageUploadRequest
} from '../types/apiRequests';

// Tipamos la respuesta de la API paginada (Spring Data Page)
interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // Número de página actual
  size: number;
}

// --- Servicios de Productos (Product Endpoints) ---
// Basado en AdminController.java

export const getAdminProducts = (page = 0, size = 10): Promise<Page<Product>> => {
  return api.get(`/admin/products?page=${page}&page_size=${size}`)
    .then(res => res.data);
};

export const getProductById = (id: number): Promise<Product> => {
  return api.get(`/admin/products/${id}`).then(res => res.data);
};

export const createProduct = (data: ProductCreateRequest): Promise<Product> => {
  return api.post('/admin/products', data).then(res => res.data);
};

export const updateProduct = (id: number, data: ProductUpdateRequest): Promise<Product> => {
  return api.put(`/admin/products/${id}`, data).then(res => res.data);
};

export const deleteProduct = (id: number): Promise<void> => {
  return api.delete(`/admin/products/${id}`);
};

// --- Servicios de Imágenes (Image Endpoints) ---

export const uploadProductImage = (data: ProductImageUploadRequest): Promise<void> => {
  return api.post('/admin/products/images', data);
};

export const deleteProductImage = (id: number): Promise<void> => {
  return api.delete(`/admin/products/images/${id}`);
};

// --- Servicios de Tags (Tag Endpoints) ---

export const getAllTags = (): Promise<Tag[]> => {
  return api.get('/admin/tags').then(res => res.data);
};

export const createTag = (data: TagCreateRequest): Promise<Tag> => {
  return api.post('/admin/tags', data).then(res => res.data);
};

export const updateTag = (id: number, data: TagUpdateRequest): Promise<Tag> => {
  return api.put(`/admin/tags/${id}`, data).then(res => res.data);
};

export const deleteTag = (id: number): Promise<void> => {
  return api.delete(`/admin/tags/${id}`);
};

// --- Servicios de Tallas (Size Endpoints) ---

export const getAllSizes = (): Promise<Size[]> => {
  return api.get('/admin/sizes').then(res => res.data);
};

export const createSize = (data: SizeCreateRequest): Promise<Size> => {
  return api.post('/admin/sizes', data).then(res => res.data);
};

export const updateSize = (id: number, data: SizeUpdateRequest): Promise<Size> => {
  return api.put(`/admin/sizes/${id}`, data).then(res => res.data);
};

export const deleteSize = (id: number): Promise<void> => {
  return api.delete(`/admin/sizes/${id}`);
};

// --- Servicios de Colores (Color Endpoints) ---

export const getAllColors = (): Promise<Color[]> => {
  return api.get('/admin/colors').then(res => res.data);
};

export const createColor = (data: ColorCreateRequest): Promise<Color> => {
  return api.post('/admin/colors', data).then(res => res.data);
};

export const updateColor = (id: number, data: ColorUpdateRequest): Promise<Color> => {
  return api.put(`/admin/colors/${id}`, data).then(res => res.data);
};

export const deleteColor = (id: number): Promise<void> => {
  return api.delete(`/admin/colors/${id}`);
};