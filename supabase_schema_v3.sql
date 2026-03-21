-- ============================================
-- URBANO REFORMAS ERP — MIGRACIÓN v3
-- Añadir referencia de presupuestos a los recibos
-- Ejecutar en el SQL Editor de Supabase
-- ============================================

ALTER TABLE recibos ADD COLUMN IF NOT EXISTS presupuesto_id UUID REFERENCES presupuestos(id) ON DELETE SET NULL;

-- Actualizamos los índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_recibos_presupuesto ON recibos(presupuesto_id);

-- Opcional: Actualizar las políticas de seguridad (RLS) si es necesario (ya deberían estar en 'Acceso completo recibos')
