import type { AuthUser, CartItem } from './models';
import type { UserCreateRequest } from './apiRequests';

// --- Interfaz para AuthContext ---
export interface IAuthContext {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: UserCreateRequest) => Promise<void>;
  logout: () => void;
  hasRole: (roleName: string) => boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
}

// --- Interfaz para CartContext ---
export interface ICartContext {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  itemCount: number;
}