import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Clock, 
  User, 
  Phone,
  Calendar,
  FileText,
  CheckCircle
} from 'lucide-react';
import { useAppointments } from '../../context/AppointmentContext';
import { ManualService, CreateManualServiceData } from '../../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ManualServicesManagement: React.FC = () => {
  const { 
    manualServices, 
    services, 
    barbers, 
    adminSettings,
    createManualService, 
    updateManualService, 
    deleteManualService 
  } = useAppointments();
  
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<ManualService | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    service_id: '',
    barber_id: '',
    date: new Date(),
    time: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      client_name: '',
      client_phone: '',
      service_id: '',
      barber_id: '',
      date: new Date(),
      time: '',
      notes: ''
    });
    setErrors({});
    setEditingService(null);
    setShowForm(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.client_name.trim()) {
      newErrors.client_name = 'El nombre del cliente es obligatorio';
    }
    
    // Teléfono no es obligatorio
    
    if (!formData.service_id) {
      newErrors.service_id = 'Debe seleccionar un servicio';
    }
    
    if (!formData.time) {
      newErrors.time = 'Debe seleccionar una hora';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const serviceData: CreateManualServiceData = {
        client_name: formData.client_name.trim(),
        client_phone: formData.client_phone.trim(),
        service_id: formData.service_id,
        barber_id: formData.barber_id ? parseInt(formData.barber_id, 10) : undefined,
        date: formData.date,
        time: formData.time,
        notes: formData.notes.trim() || undefined
      };
      
      if (editingService) {
        await updateManualService(editingService.id, serviceData);
        toast.success('Servicio manual actualizado exitosamente');
      } else {
        await createManualService(serviceData);
        toast.success('Servicio manual registrado exitosamente');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving manual service:', error);
      toast.error('Error al guardar el servicio manual');
    }
  };

  const handleEdit = (service: ManualService) => {
    setEditingService(service);
    setFormData({
      client_name: service.client_name,
      client_phone: service.client_phone,
      service_id: service.service_id,
      barber_id: service.barber_id ? service.barber_id.toString() : '',
      date: service.date,
      time: service.time,
      notes: service.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio manual? Esta acción no se puede deshacer.')) {
      try {
        await deleteManualService(serviceId);
        toast.success('Servicio manual eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting manual service:', error);
        toast.error('Error al eliminar el servicio manual');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      date: new Date(e.target.value)
    }));
  };

  const getSelectedService = () => {
    return services.find(s => s.id === formData.service_id);
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = format(new Date(`2000-01-01T${timeString}`), 'h:mm a', { locale: es });
        times.push({ value: timeString, label: displayTime });
      }
    }
    return times;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-lg font-medium">Servicios Manuales</h3>
          <span className="ml-2 text-sm text-gray-500">
            (Servicios sin cita previa)
          </span>
        </div>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Registrar Servicio
          </button>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium">
              {editingService ? 'Editar Servicio Manual' : 'Registrar Servicio Manual'}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Cliente *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                    className={`block w-full pl-10 p-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                      errors.client_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nombre completo"
                    required
                  />
                </div>
                {errors.client_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.client_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono del Cliente
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="client_phone"
                    value={formData.client_phone}
                    onChange={handleChange}
                    className={`block w-full pl-10 p-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                      errors.client_phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="809-123-4567 (opcional)"
                  />
                </div>
                {errors.client_phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.client_phone}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servicio *
                </label>
                <select
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleChange}
                  className={`block w-full p-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                    errors.service_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Seleccionar servicio</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} - RD$ {service.price.toLocaleString()}
                    </option>
                  ))}
                </select>
                {errors.service_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.service_id}</p>
                )}
              </div>
              
              {adminSettings.multiple_barbers_enabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asistente (Opcional)
                  </label>
                  <select
                    name="barber_id"
                    value={formData.barber_id}
                    onChange={handleChange}
                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Sin asistente específico</option>
                    {barbers.map(barber => (
                      <option key={barber.id} value={barber.id}>
                        {barber.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="date"
                    value={format(formData.date, 'yyyy-MM-dd')}
                    onChange={handleDateChange}
                    className="block w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`block w-full pl-10 p-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                      errors.time ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Seleccionar hora</option>
                    {generateTimeOptions().map(time => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas Adicionales
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="block w-full pl-10 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  rows={3}
                  placeholder="Observaciones sobre el servicio..."
                />
              </div>
            </div>
            
            {getSelectedService() && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Servicio seleccionado:</strong> {getSelectedService()?.name} - 
                  <strong> Precio:</strong> RD$ {getSelectedService()?.price.toLocaleString()}
                </p>
              </div>
            )}
            
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
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingService ? 'Actualizar' : 'Registrar'} Servicio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de servicios manuales */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-md font-medium">Servicios Manuales Registrados</h4>
        </div>
        
        {manualServices.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No hay servicios manuales registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asistente
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {manualServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {service.client_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {service.client_phone || 'Sin teléfono'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.service_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(service.date, 'dd/MM/yyyy', { locale: es })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {service.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        RD$ {service.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.barber?.name || 'Sin asignar'}
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

export default ManualServicesManagement;
