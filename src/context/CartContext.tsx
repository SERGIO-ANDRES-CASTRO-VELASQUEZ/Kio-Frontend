import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem } from '../types/models';
import type { ICartContext } from '../types/contexts'; // <-- 1. Importa la interfaz
 // <-- 1. Importa la interfaz

// 2. EXPORTA el contexto
export const CartContext = createContext<ICartContext | null>(null);

// 3. Exporta el proveedor
export const CartProvider = ({ children }: { children: ReactNode }) => {
  
  // ... (todo tu código interno es correcto) ...
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Error al leer el carrito de localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addItem = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        return [...prevItems, item];
      }
    });
  };

  const removeItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

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

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalAmount = (): number => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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