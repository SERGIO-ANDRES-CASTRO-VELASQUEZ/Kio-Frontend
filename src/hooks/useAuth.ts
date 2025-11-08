import { useContext } from 'react';
// Asegúrate de que la ruta de importación sea correcta
import { AuthContext, IAuthContext } from '../context/AuthContext'; 

/**
 * Hook personalizado para acceder al AuthContext.
 * * Proporciona una forma sencilla de consumir el estado de autenticación
 * y las funciones (login, logout, etc.) en cualquier componente.
 * * Lanza un error si se intenta usar fuera de un <AuthProvider>.
 */
export const useAuth = (): IAuthContext => {
  // 1. Consume el contexto
  const context = useContext(AuthContext);

  // 2. Verifica que el contexto exista
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  // 3. Devuelve el valor del contexto (ya tipado por IAuthContext)
  return context;
};