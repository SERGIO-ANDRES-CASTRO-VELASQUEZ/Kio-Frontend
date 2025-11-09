import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
// Asumiremos que tienes iconos, por ahora usamos texto
// import { FiGrid, FiPackage, FiTag, FiLogOut } from 'react-icons/fi'; 

const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login'); // Redirige al login de admin
  };

  // Define una clase para NavLink activo
  const activeClassName = "flex items-center p-3 rounded-lg bg-primary text-white shadow-kiogloss";
  const inactiveClassName = "flex items-center p-3 rounded-lg text-gray-300 hover:bg-primary-dark hover:text-white transition-colors";

  return (
    <aside className="w-64 bg-primary-dark dark:bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="p-6 text-center">
        <Link to="/admin" className="text-3xl font-heading font-bold text-white">
          Kiogloss
        </Link>
        <span className="text-sm text-secondary-light">Admin Panel</span>
      </div>
      
      <nav className="flex-grow px-4">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
            >
              {/* <FiGrid className="mr-3" /> */}
              <span className="mr-3">📊</span>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/productos" 
              className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
            >
              {/* <FiPackage className="mr-3" /> */}
              <span className="mr-3">📦</span>
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin/categorias" 
              className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
            >
              {/* <FiTag className="mr-3" /> */}
              <span className="mr-3">🏷️</span>
              Categorías
            </NavLink>
          </li>
          {/* Puedes añadir Tallas y Colores aquí */}
          {/* <li>...</li> */}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-primary-light/20">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full p-3 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors"
        >
          {/* <FiLogOut className="mr-3" /> */}
          <span className="mr-3">🚪</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;