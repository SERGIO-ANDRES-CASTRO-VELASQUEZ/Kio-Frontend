import { useContext } from 'react';
// 1. Importa el OBJETO de contexto
import { CartContext } from '../context/CartContext';
// 2. Importa la INTERFAZ de contexto
import { ICartContext } from '../types/contexts';

/**
 * Hook personalizado para acceder al CartContext.
 */
export const useCart = (): ICartContext => {
  // 3. Consume el contexto
  const context = useContext(CartContext);

  // 4. Verifica que el contexto exista
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }

  // 5. Devuelve el valor del contexto
  return context;
};