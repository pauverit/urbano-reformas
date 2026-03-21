-- ============================================
-- URBANO REFORMAS ERP v6.0 — Gestión de Usuarios de Acceso
-- Ejecutar en Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nombre TEXT DEFAULT '',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS trg_updated_usuarios ON usuarios;
CREATE TRIGGER trg_updated_usuarios BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acceso completo usuarios" ON usuarios FOR ALL USING (true) WITH CHECK (true);

-- Usuario inicial
INSERT INTO usuarios (usuario, password, nombre) VALUES
  ('carlos', '1234', 'Carlos Urbano')
ON CONFLICT (usuario) DO NOTHING;
