// src/pages/admin/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../../services/productService';
import { Product, getStockStatus } from '../../types';
import {
  ShoppingBagIcon,
  CurrencyEuroIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import Chart from 'react-apexcharts';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStockValue: 0,
    lowStockProducts: 0,
    outOfStock: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Obtener todos los productos
      const response = await getAllProducts(0, 1000);
      const allProducts = response.content;
      setProducts(allProducts);

      // Calcular estadísticas
      const totalProducts = allProducts.length;
      const totalStockValue = allProducts.reduce(
        (sum, p) => sum + parseFloat(p.price) * p.stock,
        0
      );
      const lowStockProducts = allProducts.filter((p) => p.stock > 0 && p.stock < 10).length;
      const outOfStock = allProducts.filter((p) => p.stock === 0).length;

      setStats({
        totalProducts,
        totalStockValue,
        lowStockProducts,
        outOfStock,
      });
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Configuración del gráfico de stock
  const stockChartOptions = {
    chart: {
      type: 'donut' as const,
      fontFamily: 'Inter, sans-serif',
    },
    labels: ['En Stock', 'Stock Medio', 'Stock Bajo', 'Sin Stock'],
    colors: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
    legend: {
      position: 'bottom' as const,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom' as const,
          },
        },
      },
    ],
  };

  const stockChartSeries = [
    products.filter((p) => p.stock > 50).length,
    products.filter((p) => p.stock >= 10 && p.stock <= 50).length,
    products.filter((p) => p.stock > 0 && p.stock < 10).length,
    products.filter((p) => p.stock === 0).length,
  ];

  // Gráfico de valor por categoría
  const categoryData = products.reduce((acc, product) => {
    product.tags.forEach((tag) => {
      const value = parseFloat(product.price) * product.stock;
      if (acc[tag.name]) {
        acc[tag.name] += value;
      } else {
        acc[tag.name] = value;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const categoryChartOptions = {
    chart: {
      type: 'bar' as const,
      fontFamily: 'Inter, sans-serif',
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: true,
        distributed: true,
      },
    },
    colors: ['#610361', '#8a0e8a', '#e6affc', '#a855f7', '#c084fc'],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: Object.keys(categoryData),
      labels: {
        formatter: (val: number) => `€${val.toFixed(0)}`,
      },
    },
    legend: {
      show: false,
    },
  };

  const categoryChartSeries = [
    {
      name: 'Valor en Stock',
      data: Object.values(categoryData),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen general de tu tienda Kiogloss</p>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Productos */}
        <div className="bg-white rounded-lg shadow-kiogloss p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Productos</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats.totalProducts}</p>
            </div>
            <div className="h-14 w-14 bg-gradient-secondary rounded-lg flex items-center justify-center">
              <ShoppingBagIcon className="h-7 w-7 text-primary" />
            </div>
          </div>
        </div>

        {/* Valor Total del Stock */}
        <div className="bg-white rounded-lg shadow-kiogloss p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Valor Total Stock</p>
              <p className="text-3xl font-bold text-primary mt-2">
                €{stats.totalStockValue.toFixed(2)}
              </p>
            </div>
            <div className="h-14 w-14 bg-gradient-secondary rounded-lg flex items-center justify-center">
              <CurrencyEuroIcon className="h-7 w-7 text-primary" />
            </div>
          </div>
        </div>

        {/* Productos con Stock Bajo */}
        <div className="bg-white rounded-lg shadow-kiogloss p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Stock Bajo</p>
              <p className="text-3xl font-bold text-orange-500 mt-2">{stats.lowStockProducts}</p>
            </div>
            <div className="h-14 w-14 bg-orange-100 rounded-lg flex items-center justify-center">
              <ExclamationTriangleIcon className="h-7 w-7 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Productos Sin Stock */}
        <div className="bg-white rounded-lg shadow-kiogloss p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Sin Stock</p>
              <p className="text-3xl font-bold text-red-500 mt-2">{stats.outOfStock}</p>
            </div>
            <div className="h-14 w-14 bg-red-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-7 w-7 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Stock */}
        <div className="bg-white rounded-lg shadow-kiogloss p-6">
          <h3 className="text-xl font-heading font-bold text-primary mb-4">
            Distribución de Stock
          </h3>
          <Chart
            options={stockChartOptions}
            series={stockChartSeries}
            type="donut"
            height={300}
          />
        </div>

        {/* Valor por Categoría */}
        <div className="bg-white rounded-lg shadow-kiogloss p-6">
          <h3 className="text-xl font-heading font-bold text-primary mb-4">
            Valor en Stock por Categoría
          </h3>
          {Object.keys(categoryData).length > 0 ? (
            <Chart
              options={categoryChartOptions}
              series={categoryChartSeries}
              type="bar"
              height={300}
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No hay datos de categorías
            </div>
          )}
        </div>
      </div>

      {/* Productos con Stock Bajo - Tabla de Alertas */}
      <div className="bg-white rounded-lg shadow-kiogloss p-6">
        <h3 className="text-xl font-heading font-bold text-primary mb-4">
          Alertas de Stock Bajo
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Stock Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Precio
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products
                .filter((p) => p.stock < 10)
                .slice(0, 10)
                .map((product) => {
                  const stockInfo = getStockStatus(product.stock);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{product.title}</td>
                      <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full text-white ${stockInfo.color}`}
                        >
                          {stockInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary">€{product.price}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;