/*
  # Corregir restricciones de citas para permitir reutilizar horarios cancelados

  1. Cambios
    - Eliminar constraint existente appointments_date_time_key
    - Crear índice único condicional que solo aplica a citas activas
    - Permitir múltiples citas canceladas en el mismo horario

  2. Lógica
    - Solo una cita activa (no cancelada) por fecha/hora/barbero
    - Las citas canceladas no cuentan para la restricción única
    - Mantiene integridad de datos sin bloquear reutilización de horarios
*/

-- Primero, eliminar la restricción constraint existente
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_date_time_key;

-- También eliminar cualquier otro constraint similar que pueda existir
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_date_time_barber_key;
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_pkey_date_time;

-- Eliminar índices relacionados si existen
DROP INDEX IF EXISTS appointments_date_time_key;
DROP INDEX IF EXISTS appointments_date_time_barber_key;
DROP INDEX IF EXISTS idx_appointments_date_time;

-- Crear índice único condicional que solo aplica a citas no canceladas
-- Esto permite múltiples citas canceladas en la misma fecha/hora, pero solo una activa
CREATE UNIQUE INDEX appointments_active_date_time_barber_unique 
ON appointments (date, time, COALESCE(barber_id, '00000000-0000-0000-0000-000000000000'::uuid)) 
WHERE cancelled = false OR cancelled IS NULL;

-- Comentario explicativo
COMMENT ON INDEX appointments_active_date_time_barber_unique IS 
'Restricción única condicional que permite solo una cita activa por fecha/hora/barbero. Las citas canceladas no cuentan para esta restricción. Usa COALESCE para manejar barber_id NULL.';

-- Crear índice adicional para mejorar rendimiento en consultas de disponibilidad
CREATE INDEX IF NOT EXISTS idx_appointments_availability 
ON appointments (date, time, cancelled, barber_id);

COMMENT ON INDEX idx_appointments_availability IS 
'Índice optimizado para consultas de disponibilidad de horarios.';