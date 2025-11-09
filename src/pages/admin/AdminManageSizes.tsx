import React, { useState, useEffect } from 'react';
import { Size } from '../../types/models';
import * as adminService from '../../services/adminService';

const AdminManageSizes: React.FC = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [name, setName] = useState('');

  const loadSizes = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllSizes();
      setSizes(data);
    } catch (err) {
      setError('Error al cargar tallas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSizes();
  }, []);

  const handleSelect = (size: Size) => {
    setSelectedSize(size);
    setName(size.name);
  };

  const clearForm = () => {
    setSelectedSize(null);
    setName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    try {
      if (selectedSize) {
        await adminService.updateSize(selectedSize.id, { name });
      } else {
        await adminService.createSize({ name });
      }
      clearForm();
      loadSizes(); // Recargar
    } catch (err) {
      setError('Error al guardar la talla');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar esta talla? (Puede afectar a productos existentes)')) {
      try {
        await adminService.deleteSize(id);
        clearForm();
        loadSizes(); // Recargar
      } catch (err) {
        setError('Error al eliminar la talla');
      }
    }
  };

  return (
    <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white font-heading mb-6">
          Gestionar Tallas
        </h1>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <ul className="divide-y divide-gray-200">
            {sizes.map(size => (
              <li key={size.id} className="py-4 flex justify-between items-center">
                <span className="font-medium">{size.name}</span>
                <div className="space-x-2">
                  <button onClick={() => handleSelect(size)} className="text-sm text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => handleDelete(size.id)} className="text-sm text-red-600 hover:text-red-800">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Formulario */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <h2 className="text-xl font-semibold mb-4 font-heading">
            {selectedSize ? 'Editar Talla' : 'Nueva Talla'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre de la Talla (ej: "S", "M", "Única")</label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 py-2 px-4 font-semibold text-white bg-primary rounded-md shadow-lg hover:bg-primary-dark transition-colors"
              >
                {selectedSize ? 'Actualizar' : 'Crear'}
              </button>
              {selectedSize && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="flex-1 py-2 px-4 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminManageSizes;