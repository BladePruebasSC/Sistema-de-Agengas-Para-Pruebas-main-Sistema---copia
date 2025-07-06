/*
  # Agregar restricción única condicional para citas activas

  1. Cambios
    - Agregar restricción única que solo aplica a citas no canceladas
    - Esto permite múltiples citas en la misma fecha/hora/barbero si están canceladas
    - Solo una cita activa (no cancelada) puede existir por fecha/hora/barbero

  2. Funcionalidad
    - Si una cita está cancelada (cancelled = true), se permite crear otra cita en esa fecha/hora
    - Si una cita está activa (cancelled = false), no se permite otra cita en esa fecha/hora
    - La restricción considera también el barber_id para permitir múltiples barberos
*/

-- Primero, eliminar cualquier restricción única existente que pueda conflictuar
DROP INDEX IF EXISTS appointments_date_time_key;
DROP INDEX IF EXISTS appointments_date_time_barber_key;

-- Crear índice único condicional que solo aplica a citas no canceladas
-- Esto permite múltiples citas canceladas en la misma fecha/hora, pero solo una activa
CREATE UNIQUE INDEX appointments_active_date_time_barber_unique 
ON appointments (date, time, barber_id) 
WHERE cancelled = false OR cancelled IS NULL;

-- Comentario explicativo
COMMENT ON INDEX appointments_active_date_time_barber_unique IS 
'Restricción única condicional que permite solo una cita activa por fecha/hora/barbero. Las citas canceladas no cuentan para esta restricción.';

-- Crear también un índice para citas sin barbero asignado (para compatibilidad)
CREATE UNIQUE INDEX appointments_active_date_time_no_barber_unique 
ON appointments (date, time) 
WHERE (cancelled = false OR cancelled IS NULL) AND barber_id IS NULL;

COMMENT ON INDEX appointments_active_date_time_no_barber_unique IS 
'Restricción única condicional para citas sin barbero asignado. Solo una cita activa por fecha/hora cuando no hay barbero específico.';