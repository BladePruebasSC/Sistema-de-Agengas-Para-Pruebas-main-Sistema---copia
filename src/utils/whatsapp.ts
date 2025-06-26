interface WhatsAppMessageData {
  clientPhone: string;
  clientName: string;
  date: string;
  time: string;
  service: string;
}

const ADMIN_PHONE = '+18092033894';

// Variable para evitar ejecuciones múltiples
let isExecuting = false;

// Función para generar URL de WhatsApp
const generateWhatsAppUrl = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

// Función para crear mensajes
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

// Función principal - SOLO para clicks directos del usuario
const openWhatsApp = (phone: string, message: string): void => {
  if (isExecuting) return;
  
  isExecuting = true;
  setTimeout(() => { isExecuting = false; }, 2000);
  
  const url = generateWhatsAppUrl(phone, message);
  
  // CLAVE: Solo window.location.href - funciona en Safari cuando es click directo
  window.location.href = url;
};

// Funciones principales para usar SOLO en event handlers directos
export const notifyAppointmentCreated = (data: WhatsAppMessageData) => {
  const message = createMessage('created', data);
  openWhatsApp(ADMIN_PHONE, message);
  return { success: true };
};

export const notifyAppointmentCancelled = (data: WhatsAppMessageData) => {
  const message = createMessage('cancelled', data);
  openWhatsApp(ADMIN_PHONE, message);
  return { success: true };
};

export const notifyClientAppointmentConfirmed = (data: WhatsAppMessageData) => {
  const message = createMessage('clientConfirmed', data);
  openWhatsApp(data.clientPhone, message);
  return { success: true };
};

export const notifyClientAppointmentCancelled = (data: WhatsAppMessageData) => {
  const message = createMessage('clientCancelled', data);
  openWhatsApp(data.clientPhone, message);
  return { success: true };
};

// Funciones helper para obtener URLs (si necesitas mostrar enlaces)
export const getAppointmentCreatedUrl = (data: WhatsAppMessageData): string => {
  const message = createMessage('created', data);
  return generateWhatsAppUrl(ADMIN_PHONE, message);
};

export const getAppointmentCancelledUrl = (data: WhatsAppMessageData): string => {
  const message = createMessage('cancelled', data);
  return generateWhatsAppUrl(ADMIN_PHONE, message);
};

export const getClientConfirmationUrl = (data: WhatsAppMessageData): string => {
  const message = createMessage('clientConfirmed', data);
  return generateWhatsAppUrl(data.clientPhone, message);
};

export const getClientCancellationUrl = (data: WhatsAppMessageData): string => {
  const message = createMessage('clientCancelled', data);
  return generateWhatsAppUrl(data.clientPhone, message);
};