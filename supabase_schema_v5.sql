-- ============================================
-- URBANO REFORMAS ERP v5.0 — Gestión de Personal
-- Ejecutar en Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS personal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  cargo TEXT NOT NULL,
  email TEXT DEFAULT '',
  telefono TEXT DEFAULT '',
  status TEXT DEFAULT 'Disponible' CHECK (status IN ('Disponible', 'En Obra', 'Baja')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS trg_updated_personal ON personal;
CREATE TRIGGER trg_updated_personal BEFORE UPDATE ON personal FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE personal ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acceso completo personal" ON personal FOR ALL USING (true) WITH CHECK (true);

-- Datos iniciales (opcional)
INSERT INTO personal (nombre, cargo, email, status) VALUES
  ('Carlos Urbano', 'Arquitecto / Capatáz', 'carlos@urbano.es', 'Disponible'),
  ('Miguel Ángel', 'Oficial de Primera', 'miguel@urbano.es', 'En Obra'),
  ('José Luis', 'Peón Especialista', 'joseluis@urbano.es', 'En Obra'),
  ('Dani Gómez', 'Fontanero / Electricista', 'dani@urbano.es', 'Disponible')
ON CONFLICT DO NOTHING;
