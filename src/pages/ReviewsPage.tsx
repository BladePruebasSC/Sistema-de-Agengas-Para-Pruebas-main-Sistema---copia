import React, { useState } from 'react';
import { Star, MessageSquare, Plus } from 'lucide-react';
import ReviewsList from '../components/reviews/ReviewsList';
import ReviewForm from '../components/reviews/ReviewForm';
import { useAppointments } from '../context/AppointmentContext';

const ReviewsPage: React.FC = () => {
  const { adminSettings } = useAppointments();
  const [showForm, setShowForm] = useState(false);

  const handleFormSuccess = () => {
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  // Si las reseñas están deshabilitadas, mostrar mensaje
  if (adminSettings.reviews_enabled === false) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sistema de Reseñas No Disponible</h1>
          <p className="text-gray-600">
            El sistema de reseñas está temporalmente deshabilitado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Star className="h-8 w-8 text-yellow-400 fill-current mr-2" />
          <h1 className="text-3xl font-bold text-gray-900">Reseñas y Calificaciones</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descubre lo que nuestros clientes dicen sobre nuestros servicios de barbería. 
          Tu opinión es importante para nosotros y ayuda a otros clientes a tomar la mejor decisión.
        </p>
      </div>

      {/* Botón para agregar reseña */}
      {!showForm && (
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Escribir una Reseña
          </button>
        </div>
      )}

      {/* Formulario de reseña */}
      {showForm && (
        <div className="mb-8">
          <ReviewForm 
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {/* Lista de reseñas */}
      <ReviewsList showAll={true} />
    </div>
  );
};

export default ReviewsPage;