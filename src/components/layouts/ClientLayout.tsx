import React from 'react';
import { Outlet } from 'react-router-dom';

// Componentes de ejemplo - Deberás crearlos
const Navbar: React.FC = () => (
  <nav className="bg-white shadow-md p-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold text-primary">Kiogloss</h1>
      <div>
        <a href="/" className="mr-4">Inicio</a>
        <a href="/tienda" className="mr-4">Tienda</a>
        <a href="/carrito" className="mr-4">Carrito</a>
        <a href="/cuenta" className="mr-4">Mi Cuenta</a>
        <a href="/login">Login</a>
      </div>
    </div>
  </nav>
);

const Footer: React.FC = () => (
  <footer className="bg-gray-100 p-8 mt-12">
    <div className="container mx-auto text-center text-gray-600">
      © 2025 Kiogloss. Todos los derechos reservados.
    </div>
  </footer>
);

const ClientLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        {/* Outlet es donde se renderizarán tus rutas anidadas (Home, Shop, etc.) */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ClientLayout;