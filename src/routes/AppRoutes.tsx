import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '../components/layout/AdminLayout';
import ClientLayout from '../components/layout/ClientLayout';

// Componentes de Rutas Protegidas
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// --- Páginas de Admin ---
import AdminLoginPage from '../pages/admin/Login';
import DashboardPage from '../pages/admin/Dashboard';
import AdminProductsPage from '../pages/admin/Products';
import AdminCategoriesPage from '../pages/admin/Categories';
import AdminManageColorsPage from '../pages/admin/AdminManageColors';
import AdminManageSizesPage from '../pages/admin/AdminManageSizes';

// --- Páginas de Cliente ---
import HomePage from '../pages/HomePage';
import ShopPage from '../pages/client/Shop'; // (Asumo que la creaste en /client/Shop.tsx)
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import ClientLoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

// --- Páginas de Perfil (requieren login) ---
import ProfilePage from '../pages/profile/ProfilePage';
import OrderHistoryPage from '../pages/profile/OrderHistoryPage';
import FavoritesPage from '../pages/profile/FavoritesPage';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      
      {/* --- RUTAS DE ADMINISTRADOR --- */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<AdminRoute />}>
        {/* Todas las rutas dentro de AdminRoute están protegidas */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/productos" element={<AdminProductsPage />} />
          <Route path="/admin/categorias" element={<AdminCategoriesPage />} />
          <Route path="/admin/colores" element={<AdminManageColorsPage />} />
          <Route path="/admin/tallas" element={<AdminManageSizesPage />} />
        </Route>
      </Route>

      {/* --- RUTAS DE CLIENTE --- */}
      <Route element={<ClientLayout />}>
        {/* Rutas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/tienda" element={<ShopPage />} />
        <Route path="/producto/:slug" element={<ProductDetailPage />} />
        <Route path="/carrito" element={<CartPage />} />
        <Route path="/login" element={<ClientLoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        
        {/* Rutas Privadas (Perfil de Usuario) */}
        <Route element={<PrivateRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/cuenta" element={<ProfilePage />} />
          <Route path="/cuenta/pedidos" element={<OrderHistoryPage />} />
          <Route path="/cuenta/favoritos" element={<FavoritesPage />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;