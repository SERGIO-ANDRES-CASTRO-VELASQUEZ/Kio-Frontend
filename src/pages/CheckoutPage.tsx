import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { OrderCreateRequest, OrderDetailRequest } from '../types/apiRequests';
import LoadingSpinner from '../components/common/LoadingSpinner';

// 1. Importa el componente que acabamos de crear
import PayPalButton from '../components/checkout/PayPalButton';

export const CheckoutPage: React.FC = () => {
  const { cartItems, getTotalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const navigate = useNavigate();

  const totalAmount = getTotalAmount().toFixed(2);

  /**
   * Esta función se ejecuta DESPUÉS de que PayPal confirma el pago.
   * Recibe los detalles de PayPal y crea el pedido en NUESTRO backend.
   */
  const handlePaymentSuccess = async (payPalDetails: any) => {
    setProcessing(true);
    setError(null);
    
    console.log("Pago de PayPal exitoso:", payPalDetails);

    try {
      // 1. Validar que tengamos la información del usuario
      if (!user || !user.accountId) { 
        throw new Error("Usuario no autenticado o falta ID de la cuenta. Asegúrate de que AuthContext haga fetch de /user/pk.");
      }

      // 2. Mapear el carrito a DetailProductRequest[]
      const shoppingDetails: OrderDetailRequest[] = cartItems.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: parseFloat((item.price * item.quantity).toFixed(2))
      }));

      // 3. Crear el body de la petición (OrderCreateRequest.java)
      //
      const orderRequest: OrderCreateRequest = {
        account: user.accountId,
        shopping: shoppingDetails,
        amount: parseFloat(totalAmount),
        status: "En Preparacion" // O "Pagado", según tu lógica
      };

      // 4. Enviar a nuestra API (OrderController.java)
      //
      await api.post('/user/order', orderRequest);

      // 5. Limpiar carrito y redirigir
      clearCart();
      navigate('/cuenta/pedidos?status=success'); // Redirige a la página de pedidos

    } catch (err: any) {
      console.error("Error al crear el pedido en el backend:", err);
      setError("Pago recibido, pero hubo un problema al registrar tu pedido: " + (err?.message || 'Error desconocido'));
      // NOTA: En un caso real, aquí deberías tener lógica para
      // reembolsar el pago de PayPal si la creación del pedido falla.
    } finally {
      setProcessing(false);
    }
  };

  /**
   * Maneja errores que vienen del componente PayPalButton
   */
  const handlePaymentError = (err: any) => {
    console.error("Error de PayPal:", err);
    setError("Hubo un error con el pago de PayPal. Por favor, inténtalo de nuevo.");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 py-12 animate-fade-in">
      <h1 className="text-3xl font-bold font-heading text-gray-800 mb-8 text-center">
        Finalizar Compra
      </h1>
      
      {processing && <LoadingSpinner fullScreen />}
      
      <div className="bg-white shadow-lg rounded-lg p-8">
        {error && (
          <div className="text-red-500 p-4 bg-red-100 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {/* Resumen del Pedido */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2 text-gray-600">
              <span>{item.title} (x{item.quantity})</span>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4 pt-4 border-t font-bold text-xl">
            <span>Total</span>
            <span>${totalAmount}</span>
          </div>
        </div>

        {/* 2. Usamos el componente del botón */}
        <PayPalButton
          totalAmount={totalAmount}
          onApprove={handlePaymentSuccess}
          onError={handlePaymentError}
          disabled={processing || cartItems.length === 0}
        />
        
        {cartItems.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            Tu carrito está vacío.
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;