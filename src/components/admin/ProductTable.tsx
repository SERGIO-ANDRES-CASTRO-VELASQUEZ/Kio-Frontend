import React from 'react';
import styles from './ProductTable.module.css';
import type { Product } from '../../types/models'; // Importamos la interfaz Product
 // Importamos la interfaz Product

// 1. Definir las props que recibe el componente
interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

// 2. Usar React.FC y tipar las props
const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {

  // La lógica interna no cambia, pero se beneficia del tipado
  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { text: 'Sin stock', className: styles.statusRed };
    }
    if (stock > 0 && stock <= 10) {
      return { text: 'Stock bajo', className: styles.statusYellow };
    }
    return { text: 'En stock', className: styles.statusGreen };
  };

  return (
    <table className={styles.productTable}>
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Producto</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Estado (API)</th>
          <th>Estado Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => { // 'product' ahora es de tipo 'Product'
          const stockStatus = getStockStatus(product.stock);
          return (
            <tr key={product.id}>
              <td>
                <img 
                  src={product.images.length > 0 ? product.images[0].url : '/placeholder.png'} 
                  alt={product.title} 
                  className={styles.productImage}
                />
              </td>
              <td>
                <strong>{product.title}</strong>
                {/* TS nos ayuda a evitar errores en nulos/undefined */}
                <p>{product.description?.substring(0, 50) ?? 'Sin descripción'}...</p>
              </td>
              {/* TS también nos ayuda a asegurar que 'tags' existe */}
              <td>{product.tags?.map(tag => tag.name).join(', ') || 'N/A'}</td>
              <td>${product.price}</td>
              <td>{product.stock}</td>
              <td>
                <span className={`${styles.statusPill} ${product.status === 'published' ? styles.published : styles.draft}`}>
                  {product.status}
                </span>
              </td>
              <td>
                <span className={`${styles.statusPill} ${stockStatus.className}`}>
                  {stockStatus.text}
                </span>
              </td>
              <td className={styles.actions}>
                <button onClick={() => onEdit(product)} className={styles.actionBtn}>Editar</button>
                <button onClick={() => onDelete(product.id)} className={`${styles.actionBtn} ${styles.deleteBtn}`}>Borrar</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProductTable;