import React from 'react';
import { Link } from 'react-router-dom';

// Puedes reemplazar esto con una imagen real de tu mockup
const HeroImage: React.FC = () => (
  <div className="bg-gradient-secondary rounded-lg p-8 h-full flex items-center justify-center">
    <span className="text-primary text-2xl">
      [Imagen de Producto Hero - 400x400]
    </span>
  </div>
);

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      {/* Sección Hero (basada en el mockup image_47a93a.jpg) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Columna de Texto */}
        <div>
          <span className="text-primary font-semibold text-lg">
            ✨ Belleza que Transforma
          </span>
          <h1 className="text-5xl md:text-6xl font-bold font-heading text-text-light dark:text-white my-6 leading-tight">
            Descubre tu Belleza Natural
          </h1>
          <p className="text-lg text-text-light/80 dark:text-text-dark/80 mb-10">
            Explora nuestra colección exclusiva de cosméticos premium. 
            Productos innovadores que realzan tu belleza única con la calidad que mereces.
          </p>
          <div className="flex space-x-4">
            <Link 
              to="/tienda" 
              className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-kiogloss hover:bg-primary-dark transition-all duration-300"
            >
              Explorar Catálogo
            </Link>
            <Link 
              to="/ofertas" // (Asegúrate de tener esta ruta si la usas)
              className="px-8 py-3 bg-white text-primary font-semibold border border-primary rounded-lg hover:bg-gray-50 transition-all duration-300"
            >
              Ver Ofertas
            </Link>
          </div>
          {/* Métricas (del mockup) */}
          <div className="flex space-x-8 mt-12 text-text-light dark:text-white">
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-text-light/70">Productos</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4.9 ★</div>
              <div className="text-sm text-text-light/70">Calificación</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50k+</div>
              <div className="text-sm text-text-light/70">Clientes</div>
            </div>
          </div>
        </div>
        
        {/* Columna de Imagen */}
        <div className="h-96 md:h-auto">
          <HeroImage />
        </div>
      </div>
    </div>
  );
};

export default HomePage;