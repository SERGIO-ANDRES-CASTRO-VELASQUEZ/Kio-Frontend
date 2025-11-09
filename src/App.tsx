import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes/AppRoutes'; // <-- 1. Importa el nuevo archivo de rutas

const App: React.FC = () => {
  return (
    // 1. Envolver todo en el Router
    <BrowserRouter>
      {/* 2. Envolver en los Proveedores de Contexto */}
      <AuthProvider>
        <CartProvider>
          {/* 3. Renderizar el manejador de rutas */}
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;