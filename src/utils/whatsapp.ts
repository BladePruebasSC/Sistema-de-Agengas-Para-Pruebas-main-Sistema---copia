// Define who initiated the cancellation for message customization
type CancellationInitiator = 'business' | 'client';

interface WhatsAppMessageData {
  clientPhone: string; // Always needed for context
  clientName: string;
  date: string;
  time: string;
  service: string;
  barberName?: string;
  barberPhone?: string; // Phone of the barber for new appointment notifications
  recipientPhone: string; // The actual phone number to send the message to (used by cancellation)
  cancellationInitiator?: CancellationInitiator; // Who cancelled
  businessName?: string; // Optional: Name of the business
}

const ADMIN_PHONE = '+18092033894'; // Default phone for some notifications

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
  type: 'created' | 'cancelledByBusiness' | 'cancelledByClient' | 'clientConfirmed' | 'clientCancelled',
  data: WhatsAppMessageData
): string => {
  const { clientName, clientPhone, date, time, service, barberName, businessName, cancellationInitiator } = data;
  const businessDisplayName = businessName || "029 Barber Shop"; // Default business name

  const messages = {
    created: `🔔 *NUEVA CITA REGISTRADA* 🔔

✂️ *${businessDisplayName}*

👤 *Cliente:* ${clientName}
📱 *Teléfono:* ${clientPhone}
📅 *Fecha:* ${date}
🕒 *Hora:* ${time}
💼 *Servicio:* ${service}
👨‍💼 *Asistente:* ${barberName || 'No especificado'}

¡Nueva cita confirmada en el sistema!`,

    cancelledByBusiness: `😥 *CITA CANCELADA* 😥

Estimado/a ${clientName},

Te informamos que tu cita en *${businessDisplayName}* ha sido cancelada:

📅 *Fecha:* ${date}
🕒 *Hora:* ${time}
💼 *Servicio:* ${service}
👨‍💼 *Con:* ${barberName || businessDisplayName}

Lamentamos cualquier inconveniente. Por favor, contáctanos si deseas reprogramar o tienes alguna consulta.`,

    cancelledByClient: `❌ *CITA CANCELADA POR CLIENTE* ❌

✂️ *${businessDisplayName}*

👤 *Cliente:* ${clientName}
📱 *Teléfono:* ${clientPhone}
📅 *Fecha:* ${date}
🕒 *Hora:* ${time}
💼 *Servicio:* ${service}
👨‍💼 *Asistente Asignado:* ${barberName || 'No especificado'}

⚠️ *El horario está ahora disponible para nuevas citas.*`,

    clientConfirmed: `✅ *CITA CONFIRMADA* ✅

✂️ *${businessDisplayName}*

¡Hola ${clientName}! Tu cita ha sido confirmada:

📅 *Fecha:* ${date}
🕒 *Hora:* ${time}
💼 *Servicio:* ${service}

⏰ Te recomendamos llegar 5 minutos antes.

¡Nos vemos pronto! 💈`,

    clientCancelled: `❌ *CITA CANCELADA* ❌

✂️ *${businessDisplayName}*

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
  setTimeout(() => { isExecuting = false; }, 2000); // Reset after 2 seconds
  
  const url = generateWhatsAppUrl(phone, message);
  
  // CLAVE: Solo window.location.href - funciona en Safari cuando es click directo
  window.location.href = url;
};

// Funciones principales para usar SOLO en event handlers directos
export const notifyAppointmentCreated = (data: WhatsAppMessageData) => {
  const message = createMessage('created', data);
  // Notify the specific barber if phone is provided, otherwise default to ADMIN_PHONE
  const targetPhone = data.barberPhone || ADMIN_PHONE;
  openWhatsApp(targetPhone, message);
  return { success: true };
};

export const notifyAppointmentCancelled = (data: WhatsAppMessageData) => {
  let messageType: 'cancelledByBusiness' | 'cancelledByClient';
  if (data.cancellationInitiator === 'business') {
    messageType = 'cancelledByBusiness';
  } else { // 'client' or undefined (treat as client for this message context)
    messageType = 'cancelledByClient';
  }
  const message = createMessage(messageType, data);
  // data.recipientPhone should be set by the caller (e.g., client's phone if business cancels, admin/barber's phone if client cancels)
  openWhatsApp(data.recipientPhone, message);
  return { success: true };
};

export const notifyClientAppointmentConfirmed = (data: WhatsAppMessageData) => {
  const message = createMessage('clientConfirmed', data);
  openWhatsApp(data.clientPhone, message); // Always to client's phone
  return { success: true };
};

export const notifyClientAppointmentCancelled = (data: WhatsAppMessageData) => {
  const message = createMessage('clientCancelled', data);
  openWhatsApp(data.clientPhone, message); // Always to client's phone
  return { success: true };
};

// Funciones helper para obtener URLs (si necesitas mostrar enlaces)
// These might need adjustment based on who the recipient should be.
// For now, keeping ADMIN_PHONE for admin-facing URL generations.
export const getAppointmentCreatedUrl = (data: WhatsAppMessageData): string => {
  const message = createMessage('created', data);
  const targetPhone = data.barberPhone || ADMIN_PHONE;
  return generateWhatsAppUrl(targetPhone, message);
};

export const getAppointmentCancelledUrl = (data: WhatsAppMessageData): string => {
  // This is tricky as recipient depends on initiator.
  // Assuming for a generic URL, it's for an admin/barber about a client cancellation.
  const message = createMessage('cancelledByClient', data);
  return generateWhatsAppUrl(data.recipientPhone || ADMIN_PHONE, message);
};

export const getClientConfirmationUrl = (data: WhatsAppMessageData): string => {
  const message = createMessage('clientConfirmed', data);
  return generateWhatsAppUrl(data.clientPhone, message);
};

export const getClientCancellationUrl = (data: WhatsAppMessageData): string => {
  const message = createMessage('clientCancelled', data);
  return generateWhatsAppUrl(data.clientPhone, message);
};