-- ============================================
-- URBANO REFORMAS ERP v7.0 — Control de Horas de Peones
-- Ejecutar en Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS horas_obra (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  presupuesto_id UUID,
  personal_nombre TEXT NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  horas DECIMAL(5,2) NOT NULL DEFAULT 0,
  precio_hora DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  concepto TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE horas_obra ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Acceso completo horas_obra" ON horas_obra;
CREATE POLICY "Acceso completo horas_obra" ON horas_obra FOR ALL USING (true) WITH CHECK (true);
