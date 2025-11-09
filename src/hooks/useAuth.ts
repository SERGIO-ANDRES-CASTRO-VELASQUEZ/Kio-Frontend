import { useContext } from 'react';
// 1. Importa el OBJETO de contexto desde el archivo de contexto
import { AuthContext } from '../context/AuthContext'; 
// 2. Importa la INTERFAZ de contexto desde el archivo de tipos
import { IAuthContext } from '../types/contexts';

/**
 * Hook personalizado para acceder al AuthContext.
 */
export const useAuth = (): IAuthContext => {
  // 3. Consume el contexto
  const context = useContext(AuthContext);

  // 4. Verifica que el contexto exista
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  // 5. Devuelve el valor del contexto
  return context;
};