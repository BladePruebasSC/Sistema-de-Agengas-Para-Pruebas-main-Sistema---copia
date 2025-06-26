interface WhatsAppMessageData {
  clientPhone: string;
  clientName: string;
  date: string;
  time: string;
  service: string;
}

const ADMIN_PHONE = '+18092033894';
let isExecuting = false;

// Función optimizada usando wa.me y acción directa del usuario
const openWhatsApp = (phone: string, message: string): void => {
  if (isExecuting) return;
  
  isExecuting = true;
  setTimeout(() => { isExecuting = false; }, 2000);
  
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  
  // Usar wa.me que es más confiable en todos los dispositivos
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  
  // Crear enlace y hacer click directo (Safari lo reconoce como acción de usuario)
  const link = document.createElement('a');
  link.href = whatsappUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  // Agregar al DOM
  document.body.appendChild(link);
  
  // Click inmediato sin setTimeout (clave para Safari)
  link.click();
  
  // Limpiar inmediatamente
  document.body.removeChild(link);
};

// Función para crear mensajes optimizada
const createMessage = (
  type: 'created' | 'cancelled' | 'clientConfirmed' | 'clientCancelled',
  data: WhatsAppMessageData
): string => {
  const { clientName, clientPhone, date, time, service } = data;
  
  const messages = {
    created: `🔔 *NUEVA CITA REGISTRADA* 🔔

✂️ *D' Gastón Stylo Barbería*

👤 *Cliente:* ${clientName}
📱 *Teléfono:* ${clientPhone}
📅 *Fecha:* ${date}
🕒 *Hora:* ${time}
💼 *Servicio:* ${service}

¡Nueva cita confirmada en el sistema!`,

    cancelled: `❌ *CITA CANCELADA* ❌

✂️ *D' Gastón Stylo Barbería*

👤 *Cliente:* ${clientName}
📱 *Teléfono:* ${clientPhone}
📅 *Fecha:* ${date}
🕒 *Hora:* ${time}
💼 *Servicio:* ${service}

⚠️ *El horario está ahora disponible para nuevas citas.*`,

    clientConfirmed: `✅ *CITA CONFIRMADA* ✅

✂️ *D' Gastón Stylo Barbería*

¡Hola ${clientName}! Tu cita ha sido confirmada:

📅 *Fecha:* ${date}
🕒 *Hora:* ${time}
💼 *Servicio:* ${service}

📍 *Dirección:* [Tu dirección aquí]

⏰ Te recomendamos llegar 5 minutos antes.

¡Nos vemos pronto! 💈`,

    clientCancelled: `❌ *CITA CANCELADA* ❌

✂️ *D' Gastón Stylo Barbería*

Hola ${clientName}, 

Tu cita programada para:
📅 *Fecha:* ${date}
🕒 *Hora:* ${time}
💼 *Servicio:* ${service}

Ha sido cancelada.

💬 Si deseas reagendar, no dudes en contactarnos.

¡Gracias por tu comprensión! 🙏`
  };
  
  return messages[type];
};

// Función genérica para enviar notificaciones
const sendNotification = async (phone: string, message: string): Promise<{ success: boolean; error?: string }> => {
  try {
    openWhatsApp(phone, message);
    return { success: true };
  } catch (error) {
    console.error('Error enviando notificación WhatsApp:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};

// Funciones exportadas optimizadas
export const notifyAppointmentCreated = (data: WhatsAppMessageData) => {
  const message = createMessage('created', data);
  return sendNotification(ADMIN_PHONE, message);
};

export const notifyAppointmentCancelled = (data: WhatsAppMessageData) => {
  const message = createMessage('cancelled', data);
  return sendNotification(ADMIN_PHONE, message);
};

export const notifyClientAppointmentConfirmed = (data: WhatsAppMessageData) => {
  const message = createMessage('clientConfirmed', data);
  return sendNotification(data.clientPhone, message);
};

export const notifyClientAppointmentCancelled = (data: WhatsAppMessageData) => {
  const message = createMessage('clientCancelled', data);
  return sendNotification(data.clientPhone, message);
};

// Función adicional para verificar si WhatsApp está disponible
export const isWhatsAppAvailable = (): boolean => {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  return isIOS || isAndroid || typeof window !== 'undefined';
};