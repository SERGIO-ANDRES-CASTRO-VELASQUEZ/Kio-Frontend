import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import type { UserCreateRequest } from '../types/apiRequests';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    street: '',
    streetNumber: '',
    distric: ''
  });
  const [error, setError] = useState<string>('');
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirige si el usuario ya está logueado
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/cuenta');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Basado en UserCreateRequest.java
    const requestData: UserCreateRequest = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      account: {
        isActive: true,
        pointsPerPurchase: 0,
      },
      address: {
        street: formData.street,
        streetNumber: formData.streetNumber,
        distric: formData.distric,
      }
    };

    try {
      await register(requestData);
      // 'register' en AuthContext maneja el login automático
      navigate('/cuenta'); // Redirige al perfil
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al crear la cuenta. El email o teléfono ya podría estar en uso.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-primary-dark font-heading">
          Crea tu Cuenta
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-sm text-center bg-red-100 p-3 rounded">{error}</p>}

          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <legend className="text-xl font-semibold font-heading mb-4">Información Personal</legend>
            <div>
              <label htmlFor="name" className="label-style">Nombre Completo</label>
              <input type="text" name="name" id="name" onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label htmlFor="email" className="label-style">Email</label>
              <input type="email" name="email" id="email" onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label htmlFor="password" className="label-style">Contraseña</label>
              <input type="password" name="password" id="password" onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="label-style">Confirmar Contraseña</label>
              <input type="password" name="confirmPassword" id="confirmPassword" onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="label-style">Teléfono</label>
              <input type="tel" name="phoneNumber" id="phoneNumber" onChange={handleChange} className="input-field" placeholder="+573001234567"/>
            </div>
          </fieldset>

          <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
            <legend className="text-xl font-semibold font-heading mb-4">Dirección</legend>
            <div>
              <label htmlFor="street" className="label-style">Calle</label>
              <input type="text" name="street" id="street" onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label htmlFor="streetNumber" className="label-style">Número</label>
              <input type="text" name="streetNumber" id="streetNumber" onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label htmlFor="distric" className="label-style">Barrio/Distrito</label>
              <input type="text" name="distric" id="distric" onChange={handleChange} required className="input-field" />
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full py-3 px-4 font-semibold text-white bg-primary rounded-lg shadow-lg hover:bg-primary-dark transition-colors"
          >
            Crear Cuenta
          </button>

          <p className="text-center text-sm">
            ¿Ya tienes una cuenta? <Link to="/login" className="font-medium text-primary hover:underline">Inicia sesión</Link>
          </p>
        </form>
      </div>
      
      {/* Estilos Reutilizables */}
      <style>{`
        .label-style { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500; color: #374151; }
        .input-field {
          width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB;
          border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .input-field:focus { outline: none; border-color: #610361; box-shadow: 0 0 0 1px #610361; }
      `}</style>
    </div>
  );
};

export default RegisterPage;