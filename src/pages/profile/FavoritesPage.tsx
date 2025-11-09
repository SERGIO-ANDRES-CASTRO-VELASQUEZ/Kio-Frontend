import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as favoriteService from '../../services/favoriteService';
import type { FavoriteProductItemDTO, FavoriteIdDTO } from '../../types/apiResponses';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

// Icono de Papelera
const TrashIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const FavoritesPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteProductItemDTO[]>([]);
  const [favIdMap, setFavIdMap] = useState<Map<number, number>>(new Map()); // Mapa de ProductID -> FavoriteID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = async () => {
    if (!user || !user.accountId) return;
    
    setLoading(true);
    try {
      const response = await favoriteService.getAccountFavorites(user.accountId);
      const data = response.account;
      
      if (typeof data.favorite === 'string') {
        // "No tienes favoritos"
        setFavorites([]);
      } else {
        setFavorites(data.favorite as FavoriteProductItemDTO[]);
      }

      // Crea un mapa para encontrar el ID del favorito (DetailFavoritos)
      // usando el ID del producto
      const idMap = new Map<number, number>();
      data.favoriteID.forEach((fav: FavoriteIdDTO) => {
        idMap.set(fav.product, fav.id);
      });
      setFavIdMap(idMap);

    } catch (err) {
      setError('No se pudieron cargar tus favoritos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadFavorites();
    }
  }, [user, authLoading]);

  const handleRemoveFavorite = async (productId: number) => {
    const favoriteId = favIdMap.get(productId); // Obtiene el ID de DetailFavoritos
    if (!favoriteId) return;

    try {
      await favoriteService.removeFavorite(favoriteId);
      // Recarga los favoritos después de eliminar
      loadFavorites(); 
    } catch (err) {
      setError('Error al eliminar el favorito.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 animate-fade-in">
      <h1 className="text-3xl font-bold font-heading text-gray-800 mb-6">Mis Favoritos</h1>
      
      {error && <p className="text-red-500">{error}</p>}
      
      {!error && favorites.length === 0 && (
        <p className="text-gray-500">Aún no tienes productos favoritos.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {favorites.map(product => (
          <div key={product.id} className="relative bg-white shadow-lg rounded-lg overflow-hidden group">
            <Link to={`/producto/${product.slug}`} className="block">
              <img 
                src={product.image || 'https://via.placeholder.com/300'} 
                alt={product.name}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform"
              />
            </Link>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
              <p className="text-lg font-bold text-primary mt-2">${product.price}</p>
            </div>
            <button
              onClick={() => handleRemoveFavorite(product.id)}
              className="absolute top-3 right-3 z-10 p-2 bg-white/70 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              title="Eliminar de favoritos"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;