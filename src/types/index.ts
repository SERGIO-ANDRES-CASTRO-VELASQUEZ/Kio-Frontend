// src/types/index.ts

// ==================== USER TYPES ====================
export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  profileImage?: string;
  isActive: boolean;
  isStaff: boolean;
  isSuperuser: boolean;
  account?: Account;
}

export interface Account {
  id: number;
  pointsPerPurchase: number;
  isActive: boolean;
  address?: string;
  favorite?: any;
}

export interface Address {
  street: string;
  streetNumber: string;
  distric: string;
}

// ==================== PRODUCT TYPES ====================
export interface Product {
  id: number;
  title: string;
  price: string;
  description?: string;
  slug: string;
  stock: number;
  status: 'draft' | 'published';
  published: string;
  images: ImageDTO[];
  sizes: SizeDTO[];
  colors: ColorDTO[];
  tags: TagDTO[];
}

export interface ProductListItem {
  id: number;
  title: string;
  price: string;
  slug: string;
  stock: number;
  image: string;
  sizes: string[];
  colors: string[];
}

export interface ImageDTO {
  id: number;
  url: string;
}

export interface TagDTO {
  id: number;
  name: string;
  imageURL?: string;
}

export interface SizeDTO {
  id: number;
  name: string;
}

export interface ColorDTO {
  id: number;
  name: string;
}

// ==================== PRODUCT FORM TYPES ====================
export interface ProductCreateRequest {
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  status: 'draft' | 'published';
  sizeIds: number[];
  colorIds: number[];
  tagIds: number[];
}

export interface ProductUpdateRequest {
  title?: string;
  price?: number;
  description?: string;
  slug?: string;
  stock?: number;
  status?: 'draft' | 'published';
  sizeIds?: number[];
  colorIds?: number[];
  tagIds?: number[];
}

export interface ProductImageUploadRequest {
  productId: number;
  imageBase64: string;
}

// ==================== ORDER TYPES ====================
export interface Order {
  id: number;
  amount: number;
  date: string;
  status: 'Pendiente' | 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado';
  shopping: ShoppingItem[];
  user: OrderUser;
}

export interface ShoppingItem {
  title: string;
  price: string;
  quantity: number;
  size: string;
  color: string;
  priceXquantity: number;
}

export interface OrderUser {
  name: string;
  phoneNumber?: string;
  address: string;
}

export interface OrderCreateRequest {
  account: number;
  amount: number;
  status: string;
  shopping: DetailProductRequest[];
}

export interface DetailProductRequest {
  product: number;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

// ==================== FAVORITE TYPES ====================
export interface Favorite {
  idFa: number;
  id: number;
  name: string;
  price: string;
  slug: string;
  images: string[];
}

export interface FavoriteCreateRequest {
  account: number;
  product: number;
}

// ==================== CART TYPES ====================
export interface CartItem {
  product: ProductListItem;
  quantity: number;
  size?: string;
  color?: string;
}

// ==================== AUTH TYPES ====================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  phoneNumber?: string;
  profileImage?: string;
  address?: Address;
  account?: {
    pointsPerPurchase?: number;
    isActive?: boolean;
  };
}

// ==================== STOCK STATUS ====================
export type StockStatus = 'high' | 'medium' | 'low' | 'out';

export interface StockInfo {
  status: StockStatus;
  label: string;
  color: string;
}

// Helper function to determine stock status
export const getStockStatus = (stock: number): StockInfo => {
  if (stock === 0) {
    return {
      status: 'out',
      label: 'Sin Stock',
      color: 'bg-stock-out',
    };
  } else if (stock < 10) {
    return {
      status: 'low',
      label: 'Stock Bajo',
      color: 'bg-stock-low',
    };
  } else if (stock <= 50) {
    return {
      status: 'medium',
      label: 'Stock Medio',
      color: 'bg-stock-medium',
    };
  } else {
    return {
      status: 'high',
      label: 'En Stock',
      color: 'bg-stock-high',
    };
  }
};

// ==================== DASHBOARD STATS ====================
export interface DashboardStats {
  totalProducts: number;
  totalStockValue: number;
  totalSales: number;
  lowStockProducts: number;
  recentOrders: Order[];
}