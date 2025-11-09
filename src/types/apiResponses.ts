// Basado en dto/TokenResponse.java
export interface TokenResponse {
  access: string;
  refresh: string;
}

// Basado en dto/AccountInfoDTO.java
export interface AccountInfoDTO {
  id: number;
  favorite: ProductListDTO[]; // Puedes tipar esto mejor si lo necesitas
  pointsPerPurchase: number;
  address: string;
  isActive: boolean;
}

// Basado en dto/UserDetailResponse.java
export interface UserDetailResponse {
  id: number;
  name: string;
  email: string;
  profileImage: string;
  phoneNumber: string;
  account: AccountInfoDTO; // ¡Este objeto es clave!
}

// Interfaz para un objeto Page<T> de Spring Data
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // Página actual
  size: number;
}

// Basado en dto/ProductListDTO.java
export interface ProductListDTO {
  id: number;
  image: string;
  title: string;
  slug: string;
  sizes: string[];
  colors: string[];
  price: string; // BigDecimal se envía como string
  stock: number;
}

// Basado en dto/ProductDetailDTO.java
export interface ProductDetailDTO {
  id: number;
  images: string[];
  title: string;
  description: string;
  sizes: string[];
  tags: string[];
  colors: string[];
  price: string;
  stock: number;
}

// Basado en dto/TagDTO.java
export interface TagDTO {
  id: number;
  name: string;
  imageURL: string;
}

// Basado en dto/ShoppingItemDTO.java
export interface ShoppingItemDTO {
  title: string;
  price: string;
  quantity: number;
  size: string;
  color: string;
  priceXquantity: number;
}

// Basado en dto/OrderUserDTO.java
export interface OrderUserDTO {
  name: string;
  phoneNumber: string;
  address: string;
}

// Basado en dto/OrderDetailResponse.java
export interface OrderDetailResponse {
  id: number;
  shopping: ShoppingItemDTO[];
  user: OrderUserDTO;
  amount: number;
  date: string; // LocalDate se envía como string
  status: string;
}

// Basado en dto/FavoriteProductItemDTO.java
export interface FavoriteProductItemDTO {
  id: number; // ID del Producto
  name: string;
  price: string;
  slug: string;
  image: string;
}

// Basado en dto/FavoriteIdDTO.java
export interface FavoriteIdDTO {
  id: number; // ID del Favorito (DetailFavoritos)
  product: number; // ID del Producto
}

// Basado en dto/AccountFavoritesDTO.java
export interface AccountFavoritesDTO {
  id: number;
  favoriteID: FavoriteIdDTO[];
  // 'favorite' puede ser string o array, basado en FavoriteService.java
  favorite: FavoriteProductItemDTO[] | string;
  address: string;
}

// Basado en dto/AccountFavoritesResponse.java
export interface AccountFavoritesResponse {
  account: AccountFavoritesDTO;
}