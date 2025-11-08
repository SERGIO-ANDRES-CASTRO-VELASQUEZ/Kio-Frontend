// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import ClientLayout from './components/layout/ClientLayout';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';

// Client Pages
import Home from './pages/client/Home';
import Shop from './pages/client/Shop';
import ProductPage from './pages/client/ProductPage';
import Cart from './pages/client/Cart';
import Checkout from './pages/client/Checkout';
import Login from './pages/client/Login';
import Register from './pages/client/Register';
import Account from './pages/client/Account';
import Orders from './pages/client/Orders';
import Favorites from './pages/client/Favorites';

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requireAdmin?: boolean;
}> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={requireAdmin ? '/admin/login' : '/login'} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/productos" element={<Products />} />
                      <Route path="/categorias" element={<Categories />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Client Routes */}
            <Route
              path="/*"
              element={
                <ClientLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tienda" element={<Shop />} />
                    <Route path="/producto/:slug" element={<ProductPage />} />
                    <Route path="/carrito" element={<Cart />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Register />} />
                    <Route
                      path="/cuenta"
                      element={
                        <ProtectedRoute>
                          <Account />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/cuenta/pedidos"
                      element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/cuenta/favoritos"
                      element={
                        <ProtectedRoute>
                          <Favorites />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </ClientLayout>
              }
            />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;