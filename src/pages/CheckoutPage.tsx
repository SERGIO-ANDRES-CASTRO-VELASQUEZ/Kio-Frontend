import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCart } from '../context/CartContext'; // Asumimos que useCart() está tipado
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { OrderCreateRequest, OrderDetailRequest } from '../types/apiRequests';
// Importar tipos específicos de PayPal
// Importar tipos específicos de PayPal
import type { OnApproveData, CreateOrderData, CreateOrderActions, OnApproveActions } from '@paypal/paypal-js';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "TU_FALLBACK_ID";

export const CheckoutPage: React.FC = () => {
  // Asumimos que useCart() devuelve:
  // cartItems: CartItem[]
  // getTotalAmount: () => number
  // clearCart: () => void
  const { cartItems, getTotalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const navigate = useNavigate();

  // 1. Tipar la función createOrder de PayPal
  const createPayPalOrder = (data: CreateOrderData, actions: CreateOrderActions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: getTotalAmount().toFixed(2),
          currency_code: 'USD',
        },
      }],
    });
  };

  // 2. Tipar la función onApprove de PayPal
  const onPayPalApprove = async (data: OnApproveData, actions: OnApproveActions): Promise<void> => {
    setProcessing(true);
    setError(null);
    
    // Es obligatorio llamar a capture()
    const details = await actions.order?.capture();
    if (!details) {
      setError("No se pudo capturar el pago. Por favor intente de nuevo.");
      setProcessing(false);
      return;
    }

    try {
      // 3. Crear el pedido en nuestro backend (OrderController.java)
      // Necesitamos el 'accountId' del usuario.
      // Tu `AuthContext` debería ser modificado para hacer un fetch de /user/{pk}
      // al loguearse y guardar el `account.id` (del UserDetailResponse.java).
      
      if (!user || !user.accountId) { 
        // Suponiendo que modificaste AuthContext para incluir 'accountId'
        throw new Error("Usuario no autenticado o falta ID de la cuenta. Asegúrate de que AuthContext haga fetch de /user/pk.");
      }

      // 4. Mapear el carrito a DetailProductRequest[]
      const shoppingDetails: OrderDetailRequest[] = cartItems.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: parseFloat((item.price * item.quantity).toFixed(2))
      }));

      // 5. Crear el body de la petición (OrderCreateRequest.java)
      const orderRequest: OrderCreateRequest = {
        account: user.accountId,
        shopping: shoppingDetails,
        amount: parseFloat(getTotalAmount().toFixed(2)),
        status: "En Preparacion" // O "Pagado", según tu lógica
      };

      // 6. Enviar a la API
      await api.post('/user/order', orderRequest);

      clearCart();
      setProcessing(false);
      navigate('/profile/orders?status=success');

    } catch (err: any) {
      console.error("Error al crear el pedido:", err);
      setError("Hubo un problema al procesar tu pedido: " + (err?.message || 'Error desconocido'));
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Completa tu Pedido</h2>
      {processing && <p>Procesando...</p> /* <LoadingSpinner /> */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <div className="order-summary">
        <h3>Total: ${getTotalAmount().toFixed(2)}</h3>
      </div>
      
      <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD" }}>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={createPayPalOrder}
          onApprove={onPayPalApprove}
          onError={(err: any) => setError("Error con el pago de PayPal: " + err.message)}
          disabled={processing || cartItems.length === 0}
        />
      </PayPalScriptProvider>
    </div>
  );
};