import React from 'react';
import { Link } from 'react-router-dom';
import type { ProductListDTO } from '../../types/apiResponses';
import { useCart } from '../../hooks/useCart';
import type { CartItem } from '../../types/models';

interface ProductCardProps {
  product: ProductListDTO;
}

// Icono de Corazón para Favoritos (deberías reemplazarlo por react-icons)
const HeartIcon: React.FC = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682l-7.682-7.682a4.5 4.5 0 010-6.364z" />
  </svg>
);

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    // Convierte ProductListDTO a CartItem
    const itemToAdd: CartItem = {
      id: product.id,
      title: product.title,
      price: parseFloat(product.price), // Convertir string a número
      image: product.image,
      quantity: 1,
      slug: product.slug, // Añadido a CartItem (¡actualiza tu tipo!)
    };
    addItem(itemToAdd);
    // (Opcional: mostrar una notificación de "Añadido al carrito")
  };
  
  // Lógica para el estado del stock
  const getStockStatus = () => {
    if (product.stock === 0) {
      return <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white bg-stock-out rounded-full">Agotado</span>;
    }
    if (product.stock > 0 && product.stock <= 10) {
      return <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white bg-stock-low rounded-full">¡Últimos!</span>;
    }
    return null; // En stock
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-kiogloss transition-all duration-300 overflow-hidden">
      
      {/* Botón de Favoritos */}
      <button 
        className="absolute top-3 right-3 z-10 p-2 bg-white/70 backdrop-blur-sm rounded-full text-gray-500 hover:text-primary hover:bg-white transition-colors"
        title="Añadir a favoritos"
        // onClick={handleAddToFavorites} // (Implementarías esto con un FavoriteContext)
      >
        <HeartIcon />
      </button>

      {/* Indicador de Stock */}
      {getStockStatus()}

      {/* Imagen */}
      <Link to={`/producto/${product.slug}`} className="block overflow-hidden">
        <img
          src={product.image || 'https://via.placeholder.com/300x300'}
          alt={product.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      
      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold font-heading text-text-light dark:text-white mb-2 truncate">
          <Link to={`/producto/${product.slug}`} className="hover:text-primary transition-colors">
            {product.title}
          </Link>
        </h3>
        
        {/* Colores (basado en ProductListDTO) */}
        <div className="flex space-x-2 mb-3">
          {product.colors.slice(0, 5).map((color) => (
            <span key={color} className="block w-5 h-5 rounded-full border border-gray-300" 
                  title={color} 
                  style={{ backgroundColor: color.toLowerCase() }} // Asume colores CSS
            />
          ))}
        </div>
        
        <div className="flex-grow" />
        
        {/* Precio y Botón de Añadir */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-primary dark:text-secondary-light">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-md hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? 'Agotado' : 'Añadir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;