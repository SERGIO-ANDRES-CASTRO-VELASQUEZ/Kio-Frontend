import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import type { OnApproveData, CreateOrderData, CreateOrderActions, OnApproveActions } from '@paypal/paypal-js';

// Obtenemos el Client ID de las variables de entorno
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "TU_CLIENT_ID_DE_PAYPAL";

// --- Definición de Props ---
interface PayPalButtonProps {
  /**
   * El monto total a cobrar.
   */
  totalAmount: string; 
  /**
   * Callback que se ejecuta cuando el pago es aprobado y capturado.
   * Devuelve los detalles del pedido de PayPal.
   */
  onApprove: (details: any) => Promise<void>;
  /**
   * Callback para manejar errores de PayPal.
   */
  onError: (err: any) => void;
  /**
   * Estado para deshabilitar el botón (ej. mientras se procesa en el backend).
   */
  disabled?: boolean;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ 
  totalAmount, 
  onApprove, 
  onError, 
  disabled = false 
}) => {
  
  /**
   * Esta función le dice a PayPal cuánto cobrar.
   */
  const createPayPalOrder = (data: CreateOrderData, actions: CreateOrderActions) => {
    return actions.order.create({
        purchase_units: [{
            amount: {
                value: totalAmount, // El total de tu carrito
                currency_code: 'USD', // O la moneda que uses
            },
        }],
        intent: 'CAPTURE'
    });
  };

  /**
   * Esta función se llama cuando el usuario APRUEBA el pago en PayPal.
   * Capturamos el pago y llamamos al callback onApprove del padre.
   */
  const handleApprove = async (data: OnApproveData, actions: OnApproveActions): Promise<void> => {
    try {
      // 1. Capturar el pago
      const details = await actions.order?.capture();
      if (!details) {
        throw new Error("No se pudieron capturar los detalles del pago.");
      }
      
      // 2. Enviar los detalles al componente padre (CheckoutPage)
      // El componente padre se encargará de crear el pedido en nuestro backend.
      await onApprove(details);

    } catch (err: any) {
      // 3. Enviar el error al componente padre
      console.error("Error al capturar el pago de PayPal:", err);
      onError(err.message || "Error al procesar el pago.");
    }
  };

  if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === "TU_CLIENT_ID_DE_PAYPAL") {
    return (
      <div className="text-red-500 font-semibold p-4 bg-red-100 rounded-md">
        Error: `VITE_PAYPAL_CLIENT_ID` no está configurado en tu archivo `.env`.
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD" }}>
      <PayPalButtons
        style={{ layout: "vertical", label: "pay" }}
        createOrder={createPayPalOrder}
        onApprove={handleApprove}
        onError={onError}
        disabled={disabled}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;