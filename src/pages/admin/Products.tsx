import React, { useState, useEffect } from 'react';
import ProductTable from '../../components/admin/ProductTable'; // Usaremos la versión Tailwind
import Modal from '../../components/admin/Modal';
import ProductForm from '../../components/admin/ProductForm';
import { Product, Tag, Size, Color } from '../../types/models';
import * as adminService from '../../services/adminService';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Carga inicial de datos
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Cargar todo en paralelo
      const [productPage, tagData, sizeData, colorData] = await Promise.all([
        adminService.getAdminProducts(0, 50), // Pedir 50 productos
        adminService.getAllTags(),
        adminService.getAllSizes(),
        adminService.getAllColors(),
      ]);
      
      setProducts(productPage.content);
      setTags(tagData);
      setSizes(sizeData);
      setColors(colorData);

    } catch (err) {
      console.error(err);
      setError('Error al cargar los datos. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await adminService.deleteProduct(id);
        // Recargar datos
        loadData(); 
      } catch (err) {
        console.error(err);
        setError('No se pudo eliminar el producto.');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const onFormSubmit = () => {
    handleModalClose();
    loadData(); // Recarga los productos después de crear/editar
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white font-heading">
          Gestión de Productos
        </h1>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors"
        >
          + Crear Producto
        </button>
      </div>

      {loading && <p>Cargando productos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <ProductTable 
          products={products} 
          onEdit={handleOpenEdit} 
          onDelete={handleDelete} 
        />
      )}

      {isModalOpen && (
        <Modal 
          title={selectedProduct ? 'Editar Producto' : 'Crear Producto'}
          onClose={handleModalClose}
        >
          <ProductForm
            product={selectedProduct}
            tags={tags}
            sizes={sizes}
            colors={colors}
            onSuccess={onFormSubmit}
            onCancel={handleModalClose}
          />
        </Modal>
      )}
    </div>
  );
};

export default Products;