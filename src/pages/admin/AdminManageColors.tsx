import React, { useState, useEffect } from 'react';
import type { Color } from '../../types/models';
import * as adminService from '../../services/adminService';

const AdminManageColors: React.FC = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [name, setName] = useState('');

  const loadColors = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllColors();
      setColors(data);
    } catch (err) {
      setError('Error al cargar colores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColors();
  }, []);

  const handleSelect = (color: Color) => {
    setSelectedColor(color);
    setName(color.name);
  };

  const clearForm = () => {
    setSelectedColor(null);
    setName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    try {
      if (selectedColor) {
        await adminService.updateColor(selectedColor.id, { name });
      } else {
        await adminService.createColor({ name });
      }
      clearForm();
      loadColors(); // Recargar
    } catch (err) {
      setError('Error al guardar el color');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar este color? (Puede afectar a productos existentes)')) {
      try {
        await adminService.deleteColor(id);
        clearForm();
        loadColors(); // Recargar
      } catch (err) {
        setError('Error al eliminar el color');
      }
    }
  };

  return (
    <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white font-heading mb-6">
          Gestionar Colores
        </h1>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <ul className="divide-y divide-gray-200">
            {colors.map(color => (
              <li key={color.id} className="py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: color.name.toLowerCase() }}></span>
                  <span className="font-medium">{color.name}</span>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleSelect(color)} className="text-sm text-blue-600 hover:text-blue-800">Editar</button>
                  <button onClick={() => handleDelete(color.id)} className="text-sm text-red-600 hover:text-red-800">Eliminar</button>
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
            {selectedColor ? 'Editar Color' : 'Nuevo Color'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Color (ej: "Red", "Blue", "#FF0000")</label>
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
                {selectedColor ? 'Actualizar' : 'Crear'}
              </button>
              {selectedColor && (
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

export default AdminManageColors;