import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, Save, X, DollarSign, Clock } from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';
import { Service } from '../../types';
import toast from 'react-hot-toast';

const ServicesManagement: React.FC = () => {
  const { services, createService, updateService, deleteService } = useAppointments();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: 0,
    duration: 30
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      price: 0,
      duration: 30
    });
    setErrors({});
    setEditingService(null);
    setShowForm(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del servicio es obligatorio';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }
    
    if (formData.duration <= 0) {
      newErrors.duration = 'La duración debe ser mayor a 0';
    }
    
    // Verificar si el ID ya existe (solo para nuevos servicios)
    if (!editingService && formData.id.trim()) {
      const existingService = services.find(s => s.id === formData.id.trim());
      if (existingService) {
        newErrors.id = 'Ya existe un servicio con este ID';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const serviceData = {
        id: editingService ? editingService.id : (formData.id.trim() || Date.now().toString()),
        name: formData.name.trim(),
        price: formData.price,
        duration: formData.duration
      };
      
      if (editingService) {
        await updateService(editingService.id, serviceData);
        toast.success('Servicio actualizado exitosamente');
      } else {
        await createService(serviceData);
        toast.success('Servicio creado exitosamente');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Error al guardar el servicio');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      id: service.id,
      name: service.name,
      price: service.price,
      duration: service.duration
    });
    setShowForm(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio? Esta acción no se puede deshacer.')) {
      try {
        await deleteService(serviceId);
        toast.success('Servicio eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Error al eliminar el servicio');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' ? parseInt(value) || 0 : value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Package className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium">Gestión de Servicios</h3>
        </div>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Servicio
          </button>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium">
              {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h4>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!editingService && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID del Servicio (opcional)
                  </label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className={`block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Se generará automáticamente si se deja vacío"
                  />
                  {errors.id && (
                    <p className="mt-1 text-sm text-red-600">{errors.id}</p>
                  )}
                </div>
              )}
              
              <div className={!editingService ? '' : 'md:col-span-2'}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Servicio *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="ej. Corte Adulto"
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (RD$) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`block w-full pl-10 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1000"
                    min="1"
                    required
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración (minutos) *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`block w-full pl-10 p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                      errors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="45"
                    min="1"
                    required
                  />
                </div>
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingService ? 'Actualizar' : 'Crear'} Servicio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de servicios */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-md font-medium">Servicios Disponibles</h4>
        </div>
        
        {services.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No hay servicios registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {service.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {service.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        RD$ {service.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.duration} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition-colors"
                          title="Editar servicio"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
                          title="Eliminar servicio"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesManagement;