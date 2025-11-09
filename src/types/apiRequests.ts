// === INTERFACES DE CLIENTE (Auth, User, Order) ===

// Basado en dto/LoginRequest.java
export interface LoginRequest {
  email: string;
  password: string;
}

// Basado en dto/AccountDTO.java
interface AccountCreateDTO {
  pointsPerPurchase?: number;
  isActive?: boolean;
}

// Basado en dto/AddressDTO.java
interface AddressCreateDTO {
  street: string;
  streetNumber: string;
  distric: string;
}

// Basado en dto/UserCreateRequest.java
export interface UserCreateRequest {
  email: string;
  name: string;
  password: string;
  profileImage?: string; // Base64
  phoneNumber?: string;
  account?: AccountCreateDTO;
  address?: AddressCreateDTO;
}

// Basado en dto/DetailProductRequest.java
export interface OrderDetailRequest {
  product: number; // ID
  quantity: number;
  price: number; // price * quantity
}

// Basado en dto/OrderCreateRequest.java
export interface OrderCreateRequest {
  account: number; // ID de la cuenta
  shopping: OrderDetailRequest[];
  amount: number;
  status: string;
}

// === INTERFACES DE ADMIN (AdminController) ===

// Basado en dto/admin/ProductCreateRequest.java
export interface ProductCreateRequest {
  title: string;
  price: number; // En Java es BigDecimal, en TS/JSON es number
  description: string;
  slug: string;
  stock: number;
  status?: string;
  sizeIds?: number[];
  colorIds?: number[];
  tagIds?: number[];
}

// Basado en dto/admin/ProductUpdateRequest.java
export interface ProductUpdateRequest {
  title?: string;
  price?: number;
  description?: string;
  slug?: string;
  stock?: number;
  status?: string;
  sizeIds?: number[];
  colorIds?: number[];
  tagIds?: number[];
}

// Basado en dto/admin/ProductImageUploadRequest.java
export interface ProductImageUploadRequest {
  productId: number;
  imageBase64: string; // Imagen en Base64
}

// Basado en dto/admin/TagCreateRequest.java
export interface TagCreateRequest {
  name: string;
  imageURL?: string;
}

// Basado en dto/admin/TagUpdateRequest.java
export interface TagUpdateRequest {
  name?: string;
  imageURL?: string;
}

// Basado en dto/admin/SizeCreateRequest.java
export interface SizeCreateRequest {
  name: string;
}

// Basado en dto/admin/SizeUpdateRequest.java
export interface SizeUpdateRequest {
  name?: string;
}

// Basado en dto/admin/ColorCreateRequest.java
export interface ColorCreateRequest {
  name: string;
}

// Basado en dto/admin/ColorUpdateRequest.java
export interface ColorUpdateRequest {
  name?: string;
}
// Basado en dto/AddressDTO.java
interface AddressUpdateDTO {
  street?: string;
  streetNumber?: string;
  distric?: string;
}

// Basado en dto/UserUpdateRequest.java
export interface UserUpdateRequest {
  name?: string;
  password?: string;
  profileImage?: string; // Base64
  phoneNumber?: string;
  address?: AddressUpdateDTO;
}