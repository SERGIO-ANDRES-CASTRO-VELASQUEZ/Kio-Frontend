import React from 'react';
import { useCart } from '../hooks/useCart';
import { Link } from 'react-router-dom';

// Icono de Papelera
const TrashIcon: React.FC = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CartPage: React.FC = () => {
  const { cartItems, removeItem, updateQuantity, getTotalAmount, clearCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-4xl font-bold font-heading text-text-light dark:text-white mb-8">
        Tu Carrito
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-500 mb-6">Tu carrito está vacío.</p>
          <Link 
            to="/tienda" 
            className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-kiogloss hover:bg-primary-dark transition-all"
          >
            Ir a la Tienda
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Lista de Artículos */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center bg-white shadow-md rounded-lg p-4">
                <img src={item.image} alt={item.title} className="w-24 h-24 rounded-md object-cover mr-6" />
                <div className="flex-grow">
                  <Link to={`/producto/${item.slug}`} className="font-semibold text-lg text-gray-900 hover:text-primary">
                    {item.title}
                  </Link>
                  <p className="text-sm text-gray-500">Precio: ${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    min="1"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                  />
                  <p className="font-semibold w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              Vaciar Carrito
            </button>
          </div>

          {/* Resumen del Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-lg p-6 sticky top-28">
              <h2 className="text-2xl font-semibold font-heading mb-6 border-b pb-4">
                Resumen de Compra
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${getTotalAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="font-medium">Gratis</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-4 mt-4">
                  <span>Total</span>
                  <span>${getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full text-center mt-8 py-3 px-6 bg-primary text-white font-semibold rounded-lg shadow-kiogloss hover:bg-primary-dark transition-colors"
              >
                Continuar al Pago
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;