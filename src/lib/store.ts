// ============================================
// STORE.TS — Adaptador Supabase (con fallback localStorage)
// Urbano Reformas ERP v3.0
// ============================================

import { supabase } from './supabaseClient';

// --- Tipos ---

export interface Cliente {
    id?: string;
    nombre: string;
    nif: string;
    direccion: string;
    cp: string;
    poblacion: string;
    provincia: string;
    telefono: string;
    email: string;
}

export interface Articulo {
    id?: string;
    descripcion: string;
    unidad: string;
    precio: number;
}

export interface LineaPresupuesto {
    id?: string;
    presupuesto_id?: string;
    descripcion: string;
    cantidad: number;
    unidad: string;
    precio: number;
    orden?: number;
}

export interface Presupuesto {
    id?: string;
    numero?: string;
    fecha: string;
    cliente_id: string;
    lineas?: LineaPresupuesto[];
    subtotal: number;
    iva: number;
    total: number;
    estado: 'borrador' | 'enviado' | 'aceptado' | 'facturado';
    firma_url?: string;
    notas?: string;
}

export interface Factura {
    id?: string;
    numero?: string;
    fecha: string;
    presupuesto_id: string;
    cliente_id: string;
    lineas?: LineaPresupuesto[];
    subtotal: number;
    iva: number;
    total: number;
    estado: 'pendiente' | 'cobrada' | 'parcial';
}

export interface Recibo {
    id?: string;
    numero?: string;
    fecha: string;
    factura_id?: string;
    presupuesto_id?: string;
    cliente_id: string;
    concepto: string;
    importe: number;
    firma_url?: string;
}

// --- API Clientes ---

export const clientesStore = {
    getAll: async (): Promise<Cliente[]> => {
        const { data, error } = await supabase.from('clientes').select('*').order('nombre');
        if (error) { console.error('Error clientes:', error); return []; }
        return data || [];
    },
    getById: async (id: string): Promise<Cliente | null> => {
        const { data } = await supabase.from('clientes').select('*').eq('id', id).single();
        return data;
    },
    create: async (c: Omit<Cliente, 'id'>): Promise<Cliente | null> => {
        const { data, error } = await supabase.from('clientes').insert(c).select().single();
        if (error) console.error('Error crear cliente:', error);
        return data;
    },
    update: async (id: string, c: Partial<Cliente>): Promise<void> => {
        const { error } = await supabase.from('clientes').update(c).eq('id', id);
        if (error) console.error('Error actualizar cliente:', error);
    },
    remove: async (id: string): Promise<void> => {
        const { error } = await supabase.from('clientes').delete().eq('id', id);
        if (error) console.error('Error eliminar cliente:', error);
    },
};

// --- API Artículos ---

export const articulosStore = {
    getAll: async (): Promise<Articulo[]> => {
        const { data, error } = await supabase.from('articulos').select('*').order('descripcion');
        if (error) { console.error('Error articulos:', error); return []; }
        return data || [];
    },
    create: async (a: Omit<Articulo, 'id'>): Promise<Articulo | null> => {
        const { data, error } = await supabase.from('articulos').insert(a).select().single();
        if (error) console.error('Error crear articulo:', error);
        return data;
    },
    update: async (id: string, a: Partial<Articulo>): Promise<void> => {
        const { error } = await supabase.from('articulos').update(a).eq('id', id);
        if (error) console.error('Error actualizar articulo:', error);
    },
    remove: async (id: string): Promise<void> => {
        const { error } = await supabase.from('articulos').delete().eq('id', id);
        if (error) console.error('Error eliminar articulo:', error);
    },
};

// --- API Presupuestos ---

export const presupuestosStore = {
    getAll: async (): Promise<Presupuesto[]> => {
        const { data, error } = await supabase.from('presupuestos').select('*').order('created_at', { ascending: false });
        if (error) { console.error('Error presupuestos:', error); return []; }
        // Cargar líneas para cada presupuesto
        const presupuestos = data || [];
        for (const p of presupuestos) {
            const { data: lineas } = await supabase.from('lineas_presupuesto').select('*').eq('presupuesto_id', p.id).order('orden');
            p.lineas = lineas || [];
        }
        return presupuestos;
    },
    getById: async (id: string): Promise<Presupuesto | null> => {
        const { data } = await supabase.from('presupuestos').select('*').eq('id', id).single();
        if (!data) return null;
        const { data: lineas } = await supabase.from('lineas_presupuesto').select('*').eq('presupuesto_id', id).order('orden');
        data.lineas = lineas || [];
        return data;
    },
    create: async (p: Omit<Presupuesto, 'id' | 'numero'>, lineas: LineaPresupuesto[]): Promise<Presupuesto | null> => {
        const { lineas: _, ...presData } = p as any;
        const { data, error } = await supabase.from('presupuestos').insert({
            fecha: presData.fecha,
            cliente_id: presData.cliente_id,
            subtotal: presData.subtotal,
            iva: presData.iva,
            total: presData.total,
            estado: presData.estado,
            firma_url: presData.firma_url || '',
            notas: presData.notas || '',
        }).select().single();
        if (error) { console.error('Error crear presupuesto:', error); return null; }
        // Insertar líneas
        if (data && lineas.length > 0) {
            const lineasConId = lineas.map((l, i) => ({
                presupuesto_id: data.id,
                descripcion: l.descripcion,
                cantidad: l.cantidad,
                unidad: l.unidad,
                precio: l.precio,
                orden: i,
            }));
            const { error: lineaErr } = await supabase.from('lineas_presupuesto').insert(lineasConId);
            if (lineaErr) console.error('Error líneas presupuesto:', lineaErr);
        }
        return data;
    },
    update: async (id: string, data: Partial<Presupuesto>): Promise<void> => {
        const { lineas, ...rest } = data as any;
        const { error } = await supabase.from('presupuestos').update(rest).eq('id', id);
        if (error) console.error('Error actualizar presupuesto:', error);
    },
    remove: async (id: string): Promise<void> => {
        const { error } = await supabase.from('presupuestos').delete().eq('id', id);
        if (error) console.error('Error eliminar presupuesto:', error);
    },
};

// --- API Facturas ---

export const facturasStore = {
    getAll: async (): Promise<Factura[]> => {
        const { data, error } = await supabase.from('facturas').select('*').order('created_at', { ascending: false });
        if (error) { console.error('Error facturas:', error); return []; }
        const facturas = data || [];
        for (const f of facturas) {
            const { data: lineas } = await supabase.from('lineas_factura').select('*').eq('factura_id', f.id).order('orden');
            f.lineas = lineas || [];
        }
        return facturas;
    },
    create: async (f: Omit<Factura, 'id' | 'numero'>, lineas: LineaPresupuesto[]): Promise<Factura | null> => {
        const { lineas: _, ...factData } = f as any;
        const { data, error } = await supabase.from('facturas').insert({
            fecha: factData.fecha,
            presupuesto_id: factData.presupuesto_id,
            cliente_id: factData.cliente_id,
            subtotal: factData.subtotal,
            iva: factData.iva,
            total: factData.total,
            estado: factData.estado,
        }).select().single();
        if (error) { console.error('Error crear factura:', error); return null; }
        if (data && lineas.length > 0) {
            const lineasConId = lineas.map((l, i) => ({
                factura_id: data.id,
                descripcion: l.descripcion,
                cantidad: l.cantidad,
                unidad: l.unidad,
                precio: l.precio,
                orden: i,
            }));
            const { error: lineaErr } = await supabase.from('lineas_factura').insert(lineasConId);
            if (lineaErr) console.error('Error líneas factura:', lineaErr);
        }
        return data;
    },
    update: async (id: string, data: Partial<Factura>): Promise<void> => {
        const { lineas, ...rest } = data as any;
        const { error } = await supabase.from('facturas').update(rest).eq('id', id);
        if (error) console.error('Error actualizar factura:', error);
    },
};

// --- API Recibos ---

export const recibosStore = {
    getAll: async (): Promise<Recibo[]> => {
        const { data, error } = await supabase.from('recibos').select('*').order('created_at', { ascending: false });
        if (error) { console.error('Error recibos:', error); return []; }
        return data || [];
    },
    create: async (r: Omit<Recibo, 'id' | 'numero'>): Promise<Recibo | null> => {
        const { data, error } = await supabase.from('recibos').insert(r).select().single();
        if (error) console.error('Error crear recibo:', error);
        return data;
    },
};

// --- Tipos adicionales v4.0 ---

export interface Empresa {
    id?: string;
    nombre_comercial: string;
    razon_social: string;
    nif: string;
    direccion: string;
    cp: string;
    poblacion: string;
    provincia: string;
    telefono: string;
    email: string;
    web: string;
    iban: string;
    logo_url: string;
    condiciones_presupuesto: string;
    serie_factura: string;
    serie_presupuesto: string;
    serie_recibo: string;
}

export interface Gasto {
    id?: string;
    numero?: string;
    fecha: string;
    proveedor: string;
    concepto: string;
    categoria: 'material' | 'herramienta' | 'transporte' | 'subcontrata' | 'suministros' | 'otros';
    base_imponible: number;
    iva_porcentaje: number;
    iva: number;
    total: number;
    foto_url: string;
    pdf_url: string;
    notas: string;
    presupuesto_id?: string;
}

export interface ObraFoto {
    id?: string;
    presupuesto_id: string;
    url: string;
    titulo: string;
    fase: 'antes' | 'durante' | 'despues';
    fecha: string;
    created_at?: string;
}

// --- API Empresa (singleton) ---

export const empresaStore = {
    get: async (): Promise<Empresa | null> => {
        const { data, error } = await supabase.from('empresa').select('*').limit(1).single();
        if (error) { console.error('Error empresa:', error); return null; }
        return data;
    },
    update: async (e: Partial<Empresa>): Promise<void> => {
        const current = await empresaStore.get();
        if (current?.id) {
            const { error } = await supabase.from('empresa').update(e).eq('id', current.id);
            if (error) console.error('Error actualizar empresa:', error);
        }
    },
};

// --- API Gastos ---

export const gastosStore = {
    getAll: async (): Promise<Gasto[]> => {
        const { data, error } = await supabase.from('gastos').select('*').order('created_at', { ascending: false });
        if (error) { console.error('Error gastos:', error); return []; }
        return data || [];
    },
    create: async (g: Omit<Gasto, 'id' | 'numero'>): Promise<Gasto | null> => {
        const { data, error } = await supabase.from('gastos').insert(g).select().single();
        if (error) console.error('Error crear gasto:', error);
        return data;
    },
    update: async (id: string, g: Partial<Gasto>): Promise<void> => {
        const { error } = await supabase.from('gastos').update(g).eq('id', id);
        if (error) console.error('Error actualizar gasto:', error);
    },
    remove: async (id: string): Promise<void> => {
        const { error } = await supabase.from('gastos').delete().eq('id', id);
        if (error) console.error('Error eliminar gasto:', error);
    },
};

// --- API Obra Fotos ---

export const obraFotosStore = {
    getAllByPresupuesto: async (presupuestoId: string): Promise<ObraFoto[]> => {
        const { data, error } = await supabase.from('obra_fotos').select('*').eq('presupuesto_id', presupuestoId).order('created_at', { ascending: false });
        if (error) { console.error('Error obra fotos:', error); return []; }
        return data || [];
    },
    create: async (foto: Omit<ObraFoto, 'id' | 'created_at'>): Promise<ObraFoto | null> => {
        const { data, error } = await supabase.from('obra_fotos').insert(foto).select().single();
        if (error) { console.error('Error crear foto de obra:', error); return null; }
        return data;
    },
    remove: async (id: string): Promise<void> => {
        const { error } = await supabase.from('obra_fotos').delete().eq('id', id);
        if (error) console.error('Error eliminar foto:', error);
    },
};
