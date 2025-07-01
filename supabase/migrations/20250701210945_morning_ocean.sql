/*
  # Corregir restricciones de clave foránea para barberos

  1. Cambios
    - Actualizar foreign key de holidays.barber_id para usar ON DELETE CASCADE
    - Actualizar foreign key de blocked_times.barber_id para usar ON DELETE CASCADE
    - Mantener reviews.barber_id con ON DELETE SET NULL (para preservar reseñas)

  2. Seguridad
    - Eliminar automáticamente feriados y horarios bloqueados cuando se elimina un barbero
    - Preservar reseñas pero sin referencia al barbero eliminado
*/

-- Fix foreign key constraint for holidays.barber_id to ensure ON DELETE CASCADE
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find the current foreign key constraint name on holidays.barber_id
    SELECT conname
    INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.holidays'::regclass
      AND confrelid = 'public.barbers'::regclass
      AND conkey = (SELECT array_agg(attnum) FROM pg_attribute WHERE attrelid = 'public.holidays'::regclass AND attname = 'barber_id')
      AND contype = 'f';

    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.holidays DROP CONSTRAINT ' || quote_ident(constraint_name);
    END IF;
END $$;

-- Add the foreign key constraint with ON DELETE CASCADE and a consistent name
ALTER TABLE public.holidays
ADD CONSTRAINT fk_holidays_barber_id_cascade
FOREIGN KEY (barber_id)
REFERENCES public.barbers(id)
ON DELETE CASCADE;

COMMENT ON CONSTRAINT fk_holidays_barber_id_cascade ON public.holidays IS 'Foreign key to barbers table, cascades deletion of holidays if barber is deleted.';

-- Fix foreign key constraint for blocked_times.barber_id to ensure ON DELETE CASCADE
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find the current foreign key constraint name on blocked_times.barber_id
    SELECT conname
    INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.blocked_times'::regclass
      AND confrelid = 'public.barbers'::regclass
      AND conkey = (SELECT array_agg(attnum) FROM pg_attribute WHERE attrelid = 'public.blocked_times'::regclass AND attname = 'barber_id')
      AND contype = 'f';

    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.blocked_times DROP CONSTRAINT ' || quote_ident(constraint_name);
    END IF;
END $$;

-- Add the foreign key constraint with ON DELETE CASCADE and a consistent name
ALTER TABLE public.blocked_times
ADD CONSTRAINT fk_blocked_times_barber_id_cascade
FOREIGN KEY (barber_id)
REFERENCES public.barbers(id)
ON DELETE CASCADE;

COMMENT ON CONSTRAINT fk_blocked_times_barber_id_cascade ON public.blocked_times IS 'Foreign key to barbers table, cascades deletion of blocked times if barber is deleted.';

-- Ensure reviews.barber_id has ON DELETE SET NULL (should already be correct from previous migration)
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find the current foreign key constraint name on reviews.barber_id
    SELECT conname
    INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.reviews'::regclass
      AND confrelid = 'public.barbers'::regclass
      AND conkey = (SELECT array_agg(attnum) FROM pg_attribute WHERE attrelid = 'public.reviews'::regclass AND attname = 'barber_id')
      AND contype = 'f';

    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.reviews DROP CONSTRAINT ' || quote_ident(constraint_name);
    END IF;
END $$;

-- Add the foreign key constraint with ON DELETE SET NULL for reviews
ALTER TABLE public.reviews
ADD CONSTRAINT fk_reviews_barber_id_set_null
FOREIGN KEY (barber_id)
REFERENCES public.barbers(id)
ON DELETE SET NULL;

COMMENT ON CONSTRAINT fk_reviews_barber_id_set_null ON public.reviews IS 'Foreign key to barbers table, sets barber_id to NULL if barber is deleted to preserve reviews.';