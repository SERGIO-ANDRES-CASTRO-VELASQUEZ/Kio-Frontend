import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { ProductDetailDTO } from '../types/apiResponses';
import type { CartItem } from '../types/models';
import { getProductBySlug } from '../services/productService';
import * as favoriteService from '../services/favoriteService';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Iconos
const HeartIcon: React.FC = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>;

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addItem } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!slug) {
      setError("Producto no encontrado.");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    getProductBySlug(slug)
      .then(data => {
        setProduct(data);
      })
      .catch(() => {
        setError("No se pudo cargar el producto.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    const itemToAdd: CartItem = {
      id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      image: product.images[0] || '',
      quantity: quantity,
      slug: product.slug,
    };
    addItem(itemToAdd);
    // (Opcional: Notificación)
  };

  const handleAddToFavorites = async () => {
    if (!product || !isAuthenticated || !user?.accountId) {
      // Opcional: redirigir a login
      alert("Debes iniciar sesión para añadir a favoritos.");
      return;
    }
    try {
      // Llama al servicio de favoritos
      await favoriteService.addFavorite(user.accountId, product.id);
      alert("¡Añadido a favoritos!");
    } catch (err) {
      console.error(err);
      alert("Error al añadir a favoritos (quizás ya lo esté).");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-[70vh]"><LoadingSpinner /></div>;
  }
  if (error) {
    return <p className="text-center text-red-500 py-20">{error}</p>;
  }
  if (!product) {
    return <p className="text-center text-gray-500 py-20">Producto no encontrado.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Columna de Imágenes */}
        <div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
            <img 
              src={product.images[selectedImage] || 'https://via.placeholder.com/600'} 
              alt={product.title}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="flex space-x-2">
            {product.images.map((img, index) => (
              <button key={index} onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Columna de Información */}
        <div>
          <h1 className="text-4xl font-bold font-heading text-text-light dark:text-white mb-4">{product.title}</h1>
          <span className="text-4xl font-bold text-primary mb-6 block">${parseFloat(product.price).toFixed(2)}</span>
          
          <p className="text-text-light/80 dark:text-text-dark/80 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="flex space-x-4 mb-6">
            {product.sizes.length > 0 && (
              <div>
                <span className="font-semibold">Tallas:</span>
                {product.sizes.map(size => (
                  <span key={size} className="ml-2 px-3 py-1 bg-gray-100 rounded-full text-sm">{size}</span>
                ))}
              </div>
            )}
            {product.colors.length > 0 && (
              <div>
                <span className="font-semibold">Colores:</span>
                {product.colors.map(color => (
                  <span key={color} className="ml-2 px-3 py-1 bg-gray-100 rounded-full text-sm">{color}</span>
                ))}
              </div>
            )}
          </div>
          
          {product.stock > 0 ? (
            <span className="text-green-600 font-semibold">En Stock ({product.stock} disponibles)</span>
          ) : (
            <span className="text-stock-out font-semibold">Agotado</span>
          )}

          {/* Acciones */}
          {product.stock > 0 && (
            <div className="flex items-center space-x-4 mt-8">
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                min="1"
                max={product.stock}
                className="w-20 px-3 py-3 border border-gray-300 rounded-lg text-center"
              />
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-primary text-white font-semibold rounded-lg shadow-kiogloss hover:bg-primary-dark transition-colors"
              >
                Añadir al Carrito
              </button>
              <button
                onClick={handleAddToFavorites}
                className="p-3 border border-gray-300 rounded-lg text-primary hover:bg-gray-100"
                title="Añadir a favoritos"
              >
                <HeartIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;