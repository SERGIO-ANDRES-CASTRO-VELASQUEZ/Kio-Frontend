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