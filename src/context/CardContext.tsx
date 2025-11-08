import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import type { CartItem } from '../types/models'; // Importamos la interfaz del carrito
 // Importamos la interfaz del carrito

// --- Interfaces para el Contexto ---

interface ICartContext {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  itemCount: number;
}

// --- Creación del Contexto ---

const CartContext = createContext<ICartContext | null>(null);

// --- Proveedor del Contexto ---

export const CartProvider = ({ children }: { children: ReactNode }) => {
  
  // Inicializa el estado perezosamente desde localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error al leer el carrito de localStorage", error);
      return [];
    }
  });

  // Persiste en localStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Añade un artículo al carrito. Si ya existe, actualiza la cantidad.
   * El 'item' que se pasa debe tener 'quantity' (ej. 1).
   */
  const addItem = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      
      if (existingItem) {
        // Si existe, actualiza la cantidad
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        // Si no existe, añádelo al array
        return [...prevItems, item];
      }
    });
  };

  /**
   * Elimina un artículo del carrito por su ID.
   */
  const removeItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  /**
   * Actualiza la cantidad de un artículo específico.
   * Si la cantidad es 0 o menos, elimina el artículo.
   */
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  /**
   * Vacía el carrito por completo.
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Calcula el monto total del carrito (Precio * Cantidad).
   */
  const getTotalAmount = (): number => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  /**
   * Calcula el número total de artículos en el carrito (suma de cantidades).
   */
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // --- Valor del Contexto ---

  const value: ICartContext = {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalAmount,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
