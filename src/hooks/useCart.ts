import { useContext } from 'react';
// Asegúrate de que la ruta de importación sea correcta
import { CartContext, ICartContext } from '../context/CartContext';

/**
 * Hook personalizado para acceder al CartContext.
 * * Proporciona una forma sencilla de consumir el estado del carrito
 * (items, total) y las funciones (addItem, removeItem, etc.).
 * * Lanza un error si se intenta usar fuera de un <CartProvider>.
 */
export const useCart = (): ICartContext => {
  // 1. Consume el contexto
  const context = useContext(CartContext);

  // 2. Verifica que el contexto exista
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }

  // 3. Devuelve el valor del contexto (ya tipado por ICartContext)
  return context;
};