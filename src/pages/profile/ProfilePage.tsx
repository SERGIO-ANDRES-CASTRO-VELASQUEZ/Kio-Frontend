import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as userService from '../../services/userService';
import type { UserUpdateRequest } from '../../types/apiRequests';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Usamos 'any' temporalmente para el formulario, puedes crear un tipo específico si lo deseas
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    phoneNumber: '',
    street: '',
    streetNumber: '',
    distric: '',
  });

  useEffect(() => {
    if (user) {
      setLoading(true);
      userService.getUserDetail(user.id)
        .then(data => {
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            // Asumimos que la dirección está en el formato "calle numero distrito"
            // Deberías ajustar esto si `data.account.address` es un objeto
            street: data.account.address.split(' ')[0] || '',
            streetNumber: data.account.address.split(' ')[1] || '',
            distric: data.account.address.split(' ')[2] || '',
          });
        })
        .catch(() => setError('No se pudo cargar tu información.'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const updateData: UserUpdateRequest = {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      address: {
        street: formData.street,
        streetNumber: formData.streetNumber,
        distric: formData.distric,
      },
      // (Añadir campos para password y profileImage si los incluyes en el form)
    };

    try {
      await userService.updateUser(user.id, updateData);
      setSuccess('¡Perfil actualizado con éxito!');
    } catch (err) {
      setError('Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };
  
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      <h1 className="text-3xl font-bold font-heading text-gray-800 mb-6">Mi Perfil</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 space-y-6">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información Personal */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (no se puede cambiar)</label>
            <input type="email" name="email" id="email" value={formData.email} readOnly disabled className="input-field bg-gray-100" />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="input-field" />
          </div>
        </div>

        {/* Dirección */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900">Dirección de Envío</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">Calle</label>
              <input type="text" name="street" id="street" value={formData.street} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="streetNumber" className="block text-sm font-medium text-gray-700">Número</label>
              <input type="text" name="streetNumber" id="streetNumber" value={formData.streetNumber} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="distric" className="block text-sm font-medium text-gray-700">Distrito/Barrio</label>
              <input type="text" name="distric" id="distric" value={formData.distric} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
      
      {/* Estilo simple para los inputs */}
      <style>{`
        .input-field {
          width: 100%; padding: 0.5rem 0.75rem; margin-top: 0.25rem; border: 1px solid #D1D5DB;
          border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .input-field:focus { outline: none; border-color: #610361; box-shadow: 0 0 0 1px #610361; }
      `}</style>
    </div>
  );
};

export default ProfilePage;