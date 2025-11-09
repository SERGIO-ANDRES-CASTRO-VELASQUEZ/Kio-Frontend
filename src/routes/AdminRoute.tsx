import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * Protege rutas que requieren autenticación de administrador (ROLE_ADMIN).
 * Si no es admin, redirige al inicio.
 * Si no está logueado, redirige al login de admin.
 *
 */
const AdminRoute: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Si no está logueado, al login de admin
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    // Si está logueado pero NO es admin, fuera de aquí
    return <Navigate to="/" replace />;
  }

  // Si está logueado Y es admin, muestra el contenido (Outlet)
  return <Outlet />;
};

export default AdminRoute;