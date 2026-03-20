-- ============================================
-- URBANO REFORMAS ERP — Backend Supabase
-- Ejecutar en el SQL Editor de Supabase
-- ============================================

-- ========== CLIENTES ==========
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  nif TEXT DEFAULT '',
  direccion TEXT DEFAULT '',
  cp TEXT DEFAULT '',
  poblacion TEXT DEFAULT '',
  provincia TEXT DEFAULT '',
  telefono TEXT DEFAULT '',
  email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== ARTÍCULOS / CATÁLOGO ==========
CREATE TABLE IF NOT EXISTS articulos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  descripcion TEXT NOT NULL,
  unidad TEXT DEFAULT 'ut' CHECK (unidad IN ('ut','m2','ml','m3','kg','h','pa')),
  precio NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== PRESUPUESTOS ==========
CREATE TABLE IF NOT EXISTS presupuestos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL UNIQUE,
  fecha TEXT NOT NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  subtotal NUMERIC(12,2) DEFAULT 0,
  iva NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  estado TEXT DEFAULT 'borrador' CHECK (estado IN ('borrador','enviado','aceptado','facturado')),
  firma_url TEXT DEFAULT '',
  notas TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== LÍNEAS DE PRESUPUESTO ==========
CREATE TABLE IF NOT EXISTS lineas_presupuesto (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  presupuesto_id UUID REFERENCES presupuestos(id) ON DELETE CASCADE NOT NULL,
  descripcion TEXT NOT NULL,
  cantidad NUMERIC(12,2) DEFAULT 1,
  unidad TEXT DEFAULT 'ut',
  precio NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) GENERATED ALWAYS AS (cantidad * precio) STORED,
  orden INT DEFAULT 0
);

-- ========== FACTURAS ==========
CREATE TABLE IF NOT EXISTS facturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL UNIQUE,
  fecha TEXT NOT NULL,
  presupuesto_id UUID REFERENCES presupuestos(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  subtotal NUMERIC(12,2) DEFAULT 0,
  iva NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente','parcial','cobrada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== LÍNEAS DE FACTURA ==========
CREATE TABLE IF NOT EXISTS lineas_factura (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  factura_id UUID REFERENCES facturas(id) ON DELETE CASCADE NOT NULL,
  descripcion TEXT NOT NULL,
  cantidad NUMERIC(12,2) DEFAULT 1,
  unidad TEXT DEFAULT 'ut',
  precio NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) GENERATED ALWAYS AS (cantidad * precio) STORED,
  orden INT DEFAULT 0
);

-- ========== RECIBOS DE COBRO ==========
CREATE TABLE IF NOT EXISTS recibos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL UNIQUE,
  fecha TEXT NOT NULL,
  factura_id UUID REFERENCES facturas(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  concepto TEXT DEFAULT '',
  importe NUMERIC(12,2) DEFAULT 0,
  firma_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== SECUENCIAS PARA NUMERACIÓN ==========
CREATE SEQUENCE IF NOT EXISTS seq_presupuesto START 1;
CREATE SEQUENCE IF NOT EXISTS seq_factura START 1;
CREATE SEQUENCE IF NOT EXISTS seq_recibo START 1;

-- Función helper para generar números automáticos
CREATE OR REPLACE FUNCTION generar_numero_presupuesto()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero IS NULL OR NEW.numero = '' THEN
    NEW.numero := 'P-' || LPAD(nextval('seq_presupuesto')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generar_numero_factura()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero IS NULL OR NEW.numero = '' THEN
    NEW.numero := 'F-' || LPAD(nextval('seq_factura')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generar_numero_recibo()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero IS NULL OR NEW.numero = '' THEN
    NEW.numero := 'R-' || LPAD(nextval('seq_recibo')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de numeración automática
DROP TRIGGER IF EXISTS trg_numero_presupuesto ON presupuestos;
CREATE TRIGGER trg_numero_presupuesto
  BEFORE INSERT ON presupuestos
  FOR EACH ROW EXECUTE FUNCTION generar_numero_presupuesto();

DROP TRIGGER IF EXISTS trg_numero_factura ON facturas;
CREATE TRIGGER trg_numero_factura
  BEFORE INSERT ON facturas
  FOR EACH ROW EXECUTE FUNCTION generar_numero_factura();

DROP TRIGGER IF EXISTS trg_numero_recibo ON recibos;
CREATE TRIGGER trg_numero_recibo
  BEFORE INSERT ON recibos
  FOR EACH ROW EXECUTE FUNCTION generar_numero_recibo();

-- ========== TRIGGER updated_at ==========
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_updated_clientes ON clientes;
CREATE TRIGGER trg_updated_clientes BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_updated_articulos ON articulos;
CREATE TRIGGER trg_updated_articulos BEFORE UPDATE ON articulos FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_updated_presupuestos ON presupuestos;
CREATE TRIGGER trg_updated_presupuestos BEFORE UPDATE ON presupuestos FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_updated_facturas ON facturas;
CREATE TRIGGER trg_updated_facturas BEFORE UPDATE ON facturas FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========== ROW LEVEL SECURITY ==========
-- Habilitar RLS en todas las tablas
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE articulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE presupuestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE lineas_presupuesto ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE lineas_factura ENABLE ROW LEVEL SECURITY;
ALTER TABLE recibos ENABLE ROW LEVEL SECURITY;

-- Políticas: acceso total con la clave anon (para la SPA sin auth por ahora)
-- En producción, se restringirían por user_id
CREATE POLICY "Acceso completo clientes" ON clientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso completo articulos" ON articulos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso completo presupuestos" ON presupuestos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso completo lineas_presupuesto" ON lineas_presupuesto FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso completo facturas" ON facturas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso completo lineas_factura" ON lineas_factura FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso completo recibos" ON recibos FOR ALL USING (true) WITH CHECK (true);

-- ========== ÍNDICES ==========
CREATE INDEX IF NOT EXISTS idx_presupuestos_cliente ON presupuestos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_presupuestos_estado ON presupuestos(estado);
CREATE INDEX IF NOT EXISTS idx_facturas_cliente ON facturas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_facturas_presupuesto ON facturas(presupuesto_id);
CREATE INDEX IF NOT EXISTS idx_recibos_factura ON recibos(factura_id);
CREATE INDEX IF NOT EXISTS idx_lineas_presupuesto_pres ON lineas_presupuesto(presupuesto_id);
CREATE INDEX IF NOT EXISTS idx_lineas_factura_fact ON lineas_factura(factura_id);

-- ========== DATOS DE EJEMPLO ==========
INSERT INTO articulos (descripcion, unidad, precio) VALUES
  ('Desmontado de bañera', 'ut', 120.00),
  ('Desmontado de sanitarios', 'ut', 80.00),
  ('Desmontado de azulejos', 'm2', 15.00),
  ('Desmontar suelo cerámico', 'm2', 18.00),
  ('Subir puntos de agua ducha', 'ut', 85.00),
  ('Cambiar puntos de agua lavabo', 'ut', 75.00),
  ('Preparación paredes y suelo plato ducha', 'pa', 250.00),
  ('Colocación plato de ducha', 'ut', 180.00),
  ('Alicatado de paredes', 'm2', 35.00),
  ('Solado de baño', 'm2', 38.00),
  ('Fabricación estanterías pladur', 'pa', 320.00),
  ('Retirada escombro a contenedor', 'pa', 180.00),
  ('Acopio de materiales en planta', 'pa', 90.00),
  ('Pintura lisa en paredes', 'm2', 8.50),
  ('Pintura lisa en techos', 'm2', 10.00),
  ('Alisado y enlucido de paredes', 'm2', 22.00),
  ('Instalación punto de luz', 'ut', 65.00),
  ('Instalación enchufe', 'ut', 45.00),
  ('Colocación de puerta interior', 'ut', 280.00),
  ('Desmontado de ventana', 'ut', 60.00),
  ('Colocación ventana PVC', 'ut', 350.00),
  ('Tabique de pladur (sencillo)', 'm2', 42.00),
  ('Tabique de pladur (doble)', 'm2', 58.00),
  ('Impermeabilización suelo', 'm2', 28.00),
  ('Mano de obra oficial 1ª', 'h', 25.00),
  ('Mano de obra peón', 'h', 18.00)
ON CONFLICT DO NOTHING;

-- ============================================
-- ✅ BACKEND LISTO
-- Ejecuta este SQL en: Supabase Dashboard > SQL Editor
-- ============================================
