import React, { useState } from 'react';
import type { Product, Tag, Size, Color } from '../../types/models';
import * as adminService from '../../services/adminService';
import type { ProductCreateRequest, ProductUpdateRequest } from '../../types/apiRequests';

// Función para convertir un archivo a Base64
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

interface ProductFormProps {
  product: Product | null; // null para 'Crear', Product para 'Editar'
  tags: Tag[];
  sizes: Size[];
  colors: Color[];
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  tags,
  sizes,
  colors,
  onSuccess,
  onCancel
}) => {
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    title: product?.title || '',
    price: parseFloat(product?.price || '0'),
    description: product?.description || '',
    slug: product?.slug || '',
    stock: product?.stock || 0,
    status: product?.status || 'draft',
    sizeIds: product?.sizes.map(s => s.id) || [],
    colorIds: product?.colors.map(c => c.id) || [],
    tagIds: product?.tags.map(t => t.id) || [],
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'price' || name === 'stock') ? parseFloat(value) : value,
    }));
  };

  // Manejador para selects múltiples
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const value: number[] = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(Number(options[i].value));
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let savedProduct: Product;
      
      if (product) {
        // --- Actualizar Producto ---
        const updateData: ProductUpdateRequest = {
          ...formData,
          price: formData.price, // Asegurarse de que el precio sea número
        };
        savedProduct = await adminService.updateProduct(product.id, updateData);
      } else {
        // --- Crear Producto ---
        const createData: ProductCreateRequest = {
          ...formData,
          price: formData.price,
        };
        savedProduct = await adminService.createProduct(createData);
      }
      
      // --- Subir Imágenes (si hay) ---
      // (Basado en AdminController.java POST /admin/products/images)
      if (images.length > 0) {
        for (const file of images) {
          const imageBase64 = await toBase64(file);
          await adminService.uploadProductImage({
            productId: savedProduct.id,
            imageBase64: imageBase64,
          });
        }
      }

      setLoading(false);
      onSuccess(); // Cierra el modal y recarga
      
    } catch (err) {
      console.error(err);
      setError('Error al guardar el producto. Verifique los campos.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna Izquierda */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug (URL)</label>
            <input type="text" name="slug" id="slug" value={formData.slug} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={5} className="input-field" />
          </div>
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700">Imágenes</label>
            <input type="file" name="images" id="images" onChange={handleImageChange} multiple accept="image/*" className="input-field" />
            <p className="text-xs text-gray-500 mt-1">
              {product ? 'Añadir nuevas imágenes. Las existentes no se borrarán.' : 'Puedes subir múltiples imágenes.'}
            </p>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="input-field" />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
              <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required min="0" className="input-field" />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} className="input-field">
              <option value="draft">Borrador (Draft)</option>
              <option value="published">Publicado (Published)</option>
            </select>
          </div>
          <div>
            <label htmlFor="tagIds" className="block text-sm font-medium text-gray-700">Categorías (Tags)</label>
            <select name="tagIds" id="tagIds" value={formData.tagIds.map(String)} onChange={handleMultiSelectChange} multiple className="input-field h-32">
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sizeIds" className="block text-sm font-medium text-gray-700">Tallas</label>
            <select name="sizeIds" id="sizeIds" value={formData.sizeIds.map(String)} onChange={handleMultiSelectChange} multiple className="input-field h-24">
              {sizes.map(size => (
                <option key={size.id} value={size.id}>{size.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="colorIds" className="block text-sm font-medium text-gray-700">Colores</label>
            <select name="colorIds" id="colorIds" value={formData.colorIds.map(String)} onChange={handleMultiSelectChange} multiple className="input-field h-24">
              {colors.map(color => (
                <option key={color.id} value={color.id}>{color.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Botones del formulario */}
      <div className="pt-6 border-t dark:border-gray-700 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="py-2 px-4 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 font-semibold text-white bg-primary rounded-md shadow-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:bg-primary-light"
        >
          {loading ? 'Guardando...' : (product ? 'Actualizar Producto' : 'Crear Producto')}
        </button>
      </div>
      
      {/* Definición simple de 'input-field' para Tailwind */}
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.5rem 0.75rem;
          margin-top: 0.25rem;
          border: 1px solid #D1D5DB; /* gray-300 */
          border-radius: 0.375rem; /* rounded-md */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
        }
        .input-field:focus {
          outline: none;
          border-color: #610361; /* primary */
          box-shadow: 0 0 0 1px #610361; /* ring-primary */
        }
      `}</style>
    </form>
  );
};

export default ProductForm;