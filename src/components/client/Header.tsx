// src/components/client/Header.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  ShoppingCartIcon,
  UserIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tienda?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-primary text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>✨ Envío gratis en pedidos superiores a €50</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/cuenta" className="hover:text-secondary transition-colors">
                  Mi Cuenta
                </Link>
                <button
                  onClick={logout}
                  className="hover:text-secondary transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-secondary transition-colors">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="hover:text-secondary transition-colors">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-2xl font-heading font-bold text-primary">Kiogloss</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/tienda"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Productos
            </Link>
            <Link
              to="/marcas"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Marcas
            </Link>
            <Link
              to="/ofertas"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Ofertas
            </Link>
            <Link
              to="/contacto"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
            >
              Contacto
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Favorites */}
            {isAuthenticated && (
              <Link
                to="/cuenta/favoritos"
                className="p-2 text-gray-700 hover:text-primary transition-colors"
              >
                <HeartIcon className="h-6 w-6" />
              </Link>
            )}

            {/* User */}
            <Link
              to={isAuthenticated ? '/cuenta' : '/login'}
              className="p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <UserIcon className="h-6 w-6" />
            </Link>

            {/* Cart */}
            <Link
              to="/carrito"
              className="relative p-2 text-gray-700 hover:text-primary transition-colors"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (expandible) */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="mt-4 animate-slide-up">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos de belleza..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
              <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </form>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 py-4 px-4 animate-slide-up">
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/tienda"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Productos
            </Link>
            <Link
              to="/marcas"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marcas
            </Link>
            <Link
              to="/ofertas"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ofertas
            </Link>
            <Link
              to="/contacto"
              className="text-gray-700 hover:text-primary font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;