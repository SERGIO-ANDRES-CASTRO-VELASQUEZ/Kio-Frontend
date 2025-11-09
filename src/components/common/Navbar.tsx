import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

// Iconos (puedes reemplazarlos con react-icons si lo prefieres)
const MenuIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CartIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const UserIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);


const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeClassName = "text-primary dark:text-secondary-light font-semibold";
  const inactiveClassName = "text-text-light/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-secondary-light transition-colors";

  const NavLinks: React.FC<{isMobile?: boolean}> = ({ isMobile = false }) => (
    <ul className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row items-center space-x-6'}`}>
      <li><NavLink to="/" className={({ isActive }) => isActive ? activeClassName : inactiveClassName} end>Inicio</NavLink></li>
      <li><NavLink to="/tienda" className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>Tienda</NavLink></li>
      {/* Puedes añadir más enlaces aquí (Marcas, Ofertas) */}
    </ul>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-3xl font-bold font-heading text-primary dark:text-white">
              Kiogloss
            </Link>
          </div>

          {/* Navegación Principal (Desktop) */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLinks />
          </div>

          {/* Iconos de Acción (Desktop) */}
          <div className="hidden md:flex items-center space-x-5">
            <Link to="/carrito" className={`${inactiveClassName} relative`}>
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cuenta" className={inactiveClassName} title="Mi Cuenta">
                  <UserIcon />
                </Link>
                <button onClick={logout} className="text-sm font-medium text-gray-600 hover:text-primary-dark">
                  Salir
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                Ingresar
              </Link>
            )}
          </div>

          {/* Botón de Menú (Mobile) */}
          <div className="md:hidden flex items-center">
            <Link to="/carrito" className={`${inactiveClassName} relative mr-4`}>
              <CartIcon />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-light dark:text-text-dark focus:outline-none"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable (Mobile) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg absolute top-20 left-0 right-0 z-30 p-6 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
          <NavLinks isMobile />
          <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 space-y-4">
            {isAuthenticated ? (
              <>
                <Link to="/cuenta" className="block text-text-light dark:text-text-dark font-medium hover:text-primary">Mi Cuenta</Link>
                <button onClick={logout} className="block w-full text-left text-text-light dark:text-text-dark font-medium hover:text-primary">
                  Salir
                </button>
              </>
            ) : (
              <Link to="/login" className="block text-text-light dark:text-text-dark font-medium hover:text-primary">
                Ingresar / Registro
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;