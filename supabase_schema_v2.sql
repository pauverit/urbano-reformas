-- ============================================
-- URBANO REFORMAS ERP v4.0 — Nuevas tablas
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- ========== MI EMPRESA (singleton) ==========
CREATE TABLE IF NOT EXISTS empresa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_comercial TEXT DEFAULT 'Urbano Reformas',
  razon_social TEXT DEFAULT '',
  nif TEXT DEFAULT '',
  direccion TEXT DEFAULT '',
  cp TEXT DEFAULT '',
  poblacion TEXT DEFAULT '',
  provincia TEXT DEFAULT '',
  telefono TEXT DEFAULT '',
  email TEXT DEFAULT '',
  web TEXT DEFAULT '',
  iban TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  condiciones_presupuesto TEXT DEFAULT 'Este presupuesto es solo mano de obra y no incluye vicios ocultos. Validez 30 días.',
  serie_factura TEXT DEFAULT 'F',
  serie_presupuesto TEXT DEFAULT 'P',
  serie_recibo TEXT DEFAULT 'R',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar registro por defecto
INSERT INTO empresa (nombre_comercial) VALUES ('Urbano Reformas') ON CONFLICT DO NOTHING;

-- ========== GASTOS ==========
CREATE TABLE IF NOT EXISTS gastos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL UNIQUE,
  fecha TEXT NOT NULL,
  proveedor TEXT DEFAULT '',
  concepto TEXT DEFAULT '',
  categoria TEXT DEFAULT 'otros' CHECK (categoria IN ('material','herramienta','transporte','subcontrata','suministros','otros')),
  base_imponible NUMERIC(12,2) DEFAULT 0,
  iva_porcentaje NUMERIC(5,2) DEFAULT 21,
  iva NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  foto_url TEXT DEFAULT '',
  pdf_url TEXT DEFAULT '',
  notas TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Secuencia para gastos
CREATE SEQUENCE IF NOT EXISTS seq_gasto START 1;

CREATE OR REPLACE FUNCTION generar_numero_gasto()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero IS NULL OR NEW.numero = '' THEN
    NEW.numero := 'G-' || LPAD(nextval('seq_gasto')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_numero_gasto ON gastos;
CREATE TRIGGER trg_numero_gasto
  BEFORE INSERT ON gastos
  FOR EACH ROW EXECUTE FUNCTION generar_numero_gasto();

-- updated_at trigger
DROP TRIGGER IF EXISTS trg_updated_empresa ON empresa;
CREATE TRIGGER trg_updated_empresa BEFORE UPDATE ON empresa FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_updated_gastos ON gastos;
CREATE TRIGGER trg_updated_gastos BEFORE UPDATE ON gastos FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE empresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso completo empresa" ON empresa FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso completo gastos" ON gastos FOR ALL USING (true) WITH CHECK (true);

-- Índices
CREATE INDEX IF NOT EXISTS idx_gastos_fecha ON gastos(fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria);

-- ========== STORAGE BUCKET para logos y adjuntos ==========
-- Ejecutar manualmente en Supabase Dashboard > Storage > New Bucket:
-- Nombre: "archivos" | Public: true

-- ============================================
-- ✅ v4.0 LISTO — Ejecutar en SQL Editor
-- ============================================
