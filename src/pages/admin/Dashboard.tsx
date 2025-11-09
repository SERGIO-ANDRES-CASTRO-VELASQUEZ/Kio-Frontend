import React, { useEffect, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import { getAdminProducts } from '../../services/adminService';
import { Product } from '../../types/models';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';
// ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [stockValue, setStockValue] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // NOTA: Para un dashboard real, el backend debería proveer estos endpoints.
        // Aquí estamos simulando al traer TODOS los productos. ¡No es óptimo para producción!
        // Tu API trae 'Page<Product>', usaremos la primera página.
        const productPage = await getAdminProducts(0, 100); // Pedimos hasta 100 productos
        
        const products = productPage.content;
        
        const totalStockValue = products.reduce((acc, p) => {
          return acc + (parseFloat(p.price) * p.stock);
        }, 0);

        const outOfStockCount = products.filter(p => p.stock === 0).length;

        setTotalProducts(productPage.totalElements); // Usamos el total real de la paginación
        setStockValue(totalStockValue); // Valor solo de la página actual
        setOutOfStock(outOfStockCount); // Conteo solo de la página actual

      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white font-heading mb-6">
        Dashboard
      </h1>
      
      {loading ? (
        <p>Cargando estadísticas...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Productos Totales"
            value={totalProducts.toString()}
            icon="📦"
            color="bg-blue-500"
          />
          <StatCard
            title="Valor de Stock (Pág. 1)"
            value={`$${stockValue.toFixed(2)}`}
            icon="💰"
            color="bg-green-500"
          />
          <StatCard
            title="Sin Stock (Pág. 1)"
            value={outOfStock.toString()}
            icon="🚫"
            color="bg-red-500"
          />
          <StatCard
            title="Ventas Totales"
            value="$0.00"
            icon="📈"
            color="bg-yellow-500"
            note="(Endpoint de pedidos no implementado)"
          />
        </div>
      )}

      {/* Aquí puedes añadir los gráficos de Chart.js */}
      {/* <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Stock por Categoría</h2>
        <div style={{maxHeight: '400px'}}>
          <Pie data={...} />
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;