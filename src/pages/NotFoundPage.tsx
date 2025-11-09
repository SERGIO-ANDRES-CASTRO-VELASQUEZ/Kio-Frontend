import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-9xl font-bold text-primary opacity-50 font-heading">404</h1>
      <h2 className="text-4xl font-semibold text-text-light dark:text-white mt-4">
        Página No Encontrada
      </h2>
      <p className="text-lg text-gray-500 mt-4">
        Lo sentimos, la página que buscas no existe o fue movida.
      </p>
      <Link 
        to="/" 
        className="mt-10 px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-kiogloss hover:bg-primary-dark transition-all"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;