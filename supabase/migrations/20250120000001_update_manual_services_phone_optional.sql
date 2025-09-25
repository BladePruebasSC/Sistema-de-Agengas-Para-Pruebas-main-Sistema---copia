-- Actualizar la tabla manual_services para hacer client_phone opcional
ALTER TABLE public.manual_services 
ALTER COLUMN client_phone DROP NOT NULL;

-- Comentario actualizado
COMMENT ON COLUMN public.manual_services.client_phone IS 'Teléfono del cliente (opcional)';
