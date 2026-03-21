-- ============================================
-- URBANO REFORMAS ERP v4.1 — Rentabilidad y Fotos
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Añadir presupuesto_id a gastos para calcular la rentabilidad de la obra
ALTER TABLE gastos
ADD COLUMN IF NOT EXISTS presupuesto_id UUID REFERENCES presupuestos(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_gastos_presupuesto ON gastos(presupuesto_id);


-- 2. Crear tabla de fotos de obra (Galería)
CREATE TABLE IF NOT EXISTS obra_fotos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  presupuesto_id UUID REFERENCES presupuestos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  titulo TEXT DEFAULT '',
  fase TEXT DEFAULT 'durante' CHECK (fase IN ('antes', 'durante', 'despues')),
  fecha TEXT DEFAULT to_char(CURRENT_DATE, 'DD/MM/YYYY'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para updated_at en obra_fotos
DROP TRIGGER IF EXISTS trg_updated_obra_fotos ON obra_fotos;
CREATE TRIGGER trg_updated_obra_fotos BEFORE UPDATE ON obra_fotos FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE obra_fotos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acceso completo obra_fotos" ON obra_fotos FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_obra_fotos_presupuesto ON obra_fotos(presupuesto_id);

-- ============================================
-- ✅ EJECUTAR ESTO EN EL SQL EDITOR DE SUPABASE
-- ============================================
