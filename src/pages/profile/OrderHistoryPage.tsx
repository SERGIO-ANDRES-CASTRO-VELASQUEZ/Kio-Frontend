import React, { useState, useEffect } from 'react';
import type { OrderDetailResponse } from '../../types/apiResponses';
import * as orderService from '../../services/orderService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/shop/Pagination';
import { useSearchParams } from 'react-router-dom';

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '0', 10);
  const statusParam = searchParams.get('status') || '';

  useEffect(() => {
    setLoading(true);
    const apiPage = pageParam > 0 ? pageParam - 1 : 0;
    
    orderService.getUserOrders(apiPage, 8, statusParam)
      .then(data => {
        setOrders(data.content);
        setCurrentPage(data.number);
        setTotalPages(data.totalPages);
      })
      .catch(() => setError('No se pudieron cargar tus pedidos.'))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setSearchParams({ status: statusParam, page: (page + 1).toString() });
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({ status: e.target.value, page: '1' });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 animate-fade-in">
      <h1 className="text-3xl font-bold font-heading text-gray-800 mb-6">Historial de Pedidos</h1>

      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2 font-medium">Filtrar por estado:</label>
        <select 
          id="statusFilter" 
          value={statusParam} 
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Todos</option>
          <option value="En Preparacion">En Preparación</option>
          <option value="Enviado">Enviado</option>
          <option value="Entregado">Entregado</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No tienes pedidos que coincidan con este filtro.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Pedido realizado</p>
                  <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-medium">${order.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  ID: #{order.id}
                  <button className="ml-4 text-primary font-medium">Descargar Factura</button>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {order.shopping.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    {/* <img src={item.image || 'https://via.placeholder.com/64'} alt={item.title} className="w-16 h-16 rounded-md" /> */}
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="text-gray-700">${item.priceXquantity.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;