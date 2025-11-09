import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-light dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Logo y Redes */}
          <div>
            <h2 className="text-2xl font-bold font-heading text-primary dark:text-white mb-4">
              Kiogloss
            </h2>
            <p className="text-text-light/80 dark:text-text-dark/80 mb-4">
              Descubre tu belleza natural.
            </p>
            {/* Aquí puedes añadir iconos de redes sociales */}
            <div className="flex space-x-4">
              {/* <a href="#" className="text-text-light/70 hover:text-primary">FB</a> */}
              {/* <a href="#" className="text-text-light/70 hover:text-primary">IG</a> */}
            </div>
          </div>

          {/* Columna 2: Tienda */}
          <div>
            <h3 className="text-lg font-semibold font-heading text-text-light dark:text-white mb-4">Tienda</h3>
            <ul className="space-y-2">
              <li><Link to="/tienda" className="text-text-light/80 hover:text-primary">Todos los Productos</Link></li>
              <li><Link to="/tienda?categoria=maquillaje" className="text-text-light/80 hover:text-primary">Maquillaje</Link></li>
              <li><Link to="/tienda?categoria=cuidado-piel" className="text-text-light/80 hover:text-primary">Cuidado de la Piel</Link></li>
            </ul>
          </div>

          {/* Columna 3: Ayuda */}
          <div>
            <h3 className="text-lg font-semibold font-heading text-text-light dark:text-white mb-4">Ayuda</h3>
            <ul className="space-y-2">
              <li><Link to="/contacto" className="text-text-light/80 hover:text-primary">Contacto</Link></li>
              <li><Link to="/faq" className="text-text-light/80 hover:text-primary">Preguntas Frecuentes</Link></li>
              <li><Link to="/envios" className="text-text-light/80 hover:text-primary">Envíos y Devoluciones</Link></li>
            </ul>
          </div>

          {/* Columna 4: Cuenta */}
          <div>
            <h3 className="text-lg font-semibold font-heading text-text-light dark:text-white mb-4">Mi Cuenta</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-text-light/80 hover:text-primary">Ingresar</Link></li>
              <li><Link to="/registro" className="text-text-light/80 hover:text-primary">Registrarse</Link></li>
              <li><Link to="/cuenta/pedidos" className="text-text-light/80 hover:text-primary">Mis Pedidos</Link></li>
            </ul>
          </div>

        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-text-light/60 dark:text-text-dark/60">
            &copy; {new Date().getFullYear()} Kiogloss. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;