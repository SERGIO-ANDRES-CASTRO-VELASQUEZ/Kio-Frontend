// src/components/admin/Products/ProductTable.tsx
import React, { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct } from '../../../services/productService';
import { Product, getStockStatus } from '../../../types';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

interface ProductTableProps {
  onEdit: (product: Product) => void;
  onCreateNew: () => void;
  refreshTrigger?: number;
}

const ProductTable: React.FC<ProductTableProps> = ({ onEdit, onCreateNew, refreshTrigger }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, [currentPage, refreshTrigger]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts(currentPage, 20);
      setProducts(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (window.confirm(`¿Estás seguro de eliminar "${title}"?`)) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-kiogloss">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-heading font-bold text-primary">
              Inventario de Productos
            </h2>
            <p className="text-gray-600 mt-1">Administra todos los productos de tu catálogo</p>
          </div>
          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 bg-gradient-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            <PlusIcon className="h-5 w-5" />
            Agregar Producto
          </button>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => {
              const stockInfo = getStockStatus(product.stock);
              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{product.title}</div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-sm text-gray-600 line-clamp-2">
                      {product.description || 'Sin descripción'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-primary">€{product.price}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white ${stockInfo.color}`}
                      >
                        {stockInfo.label}
                      </span>
                      <span className="text-sm text-gray-600">{product.stock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        product.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {product.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {product.tags.map((tag) => tag.name).join(', ') || 'Sin categoría'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-primary hover:bg-primary-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.title)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Página {currentPage + 1} de {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;