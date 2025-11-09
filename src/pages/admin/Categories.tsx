import React, { useState, useEffect } from 'react';
import { Tag } from '../../types/models';
import * as adminService from '../../services/adminService';

interface FormData {
  name: string;
  imageURL: string;
}

const Categories: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', imageURL: '' });

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllTags();
      setTags(data);
    } catch (err) {
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleSelectTag = (tag: Tag) => {
    setSelectedTag(tag);
    setFormData({ name: tag.name, imageURL: tag.imageURL || '' });
  };

  const clearForm = () => {
    setSelectedTag(null);
    setFormData({ name: '', imageURL: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    try {
      if (selectedTag) {
        // Actualizar
        await adminService.updateTag(selectedTag.id, formData);
      } else {
        // Crear
        await adminService.createTag(formData);
      }
      clearForm();
      loadTags(); // Recargar
    } catch (err) {
      setError('Error al guardar la categoría');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar esta categoría?')) {
      try {
        await adminService.deleteTag(id);
        clearForm();
        loadTags(); // Recargar
      } catch (err) {
        setError('Error al eliminar la categoría');
      }
    }
  };

  return (
    <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white font-heading mb-6">
          Categorías (Tags)
        </h1>
        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <ul className="divide-y divide-gray-200">
            {tags.map(tag => (
              <li key={tag.id} className="py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <img src={tag.imageURL || 'https://via.placeholder.com/40'} alt={tag.name} className="w-10 h-10 rounded-full object-cover" />
                  <span className="font-medium">{tag.name}</span>
                </div>
                <div className="space-x-2">
                  <button 
                    onClick={() => handleSelectTag(tag)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(tag.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Formulario de Creación/Edición */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <h2 className="text-xl font-semibold mb-4 font-heading">
            {selectedTag ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="imageURL" className="block text-sm font-medium text-gray-700">URL de Imagen</label>
              <input
                type="text"
                name="imageURL"
                id="imageURL"
                value={formData.imageURL}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 py-2 px-4 font-semibold text-white bg-primary rounded-md shadow-lg hover:bg-primary-dark transition-colors"
              >
                {selectedTag ? 'Actualizar' : 'Crear'}
              </button>
              {selectedTag && (
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

export default Categories;