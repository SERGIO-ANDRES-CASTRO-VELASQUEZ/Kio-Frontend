import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <AdminSidebar />
      <main className="flex-grow p-6 md:p-10">
        <Outlet /> {/* Aquí se renderizan las páginas (Dashboard, Products, etc.) */}
      </main>
    </div>
  );
};

export default AdminLayout;