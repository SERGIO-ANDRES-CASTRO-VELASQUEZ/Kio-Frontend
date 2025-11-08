// src/components/client/ProductCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductListItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingCartIcon,
  HeartIcon,
  EyeIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface ProductCardProps {
  product: ProductListItem;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  const inCart = isInCart(product.id);

  return (
    <div
      className="group relative bg-white rounded-lg shadow-md hover:shadow-kiogloss transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setShowQuickAdd(true)}
      onMouseLeave={() => setShowQuickAdd(false)}
    >
      {/* Image Container */}
      <Link to={`/producto/${product.slug}`} className="block relative overflow-hidden">
        <div className="aspect-square bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="h-20 w-20 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Stock Badge */}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Agotado
          </div>
        )}

        {/* Favorite Button */}
        {isAuthenticated && onToggleFavorite && (
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white transition-colors z-10"
          >
            {isFavorite ? (
              <HeartSolidIcon className="h-5 w-5 text-primary" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
          </button>
        )}

        {/* Quick View - Appears on hover */}
        {showQuickAdd && product.stock > 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center animate-fade-in">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
              >
                {addedToCart ? (
                  <>
                    <CheckIcon className="h-5 w-5" />
                    Añadido
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="h-5 w-5" />
                    Añadir al Carrito
                  </>
                )}
              </button>
              <Link
                to={`/producto/${product.slug}`}
                className="bg-secondary text-primary p-3 rounded-lg hover:bg-secondary-light transition-colors"
              >
                <EyeIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/producto/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-primary">€{product.price}</span>
        </div>

        {/* Variants */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product.colors.slice(0, 3).map((color, index) => (
            <div
              key={index}
              className="px-2 py-1 bg-secondary-light text-primary text-xs rounded-full"
            >
              {color}
            </div>
          ))}
          {product.colors.length > 3 && (
            <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{product.colors.length - 3}
            </div>
          )}
        </div>

        {/* Add to Cart Button (mobile) */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 md:hidden ${
            product.stock === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : inCart
              ? 'bg-green-500 text-white'
              : 'bg-gradient-primary text-white hover:opacity-90'
          }`}
        >
          {product.stock === 0 ? (
            'Agotado'
          ) : addedToCart ? (
            <>
              <CheckIcon className="h-5 w-5" />
              Añadido
            </>
          ) : inCart ? (
            <>
              <CheckIcon className="h-5 w-5" />
              En el Carrito
            </>
          ) : (
            <>
              <ShoppingCartIcon className="h-5 w-5" />
              Añadir
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;