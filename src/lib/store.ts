// ============================================
// STORE.TS — Almacén de datos local (localStorage)
// Urbano Reformas ERP v2.0
// ============================================

// --- Tipos ---

export interface Cliente {
    id: string;
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
    id: string;
    descripcion: string;
    unidad: string;
    precio: number;
}

export interface LineaPresupuesto {
    descripcion: string;
    cantidad: number;
    unidad: string;
    precio: number;
}

export interface Presupuesto {
    id: string;
    numero: string;
    fecha: string;
    clienteId: string;
    lineas: LineaPresupuesto[];
    subtotal: number;
    iva: number;
    total: number;
    estado: 'borrador' | 'enviado' | 'aceptado' | 'facturado';
    firmaUrl?: string;
    notas?: string;
}

export interface Factura {
    id: string;
    numero: string;
    fecha: string;
    presupuestoId: string;
    clienteId: string;
    lineas: LineaPresupuesto[];
    subtotal: number;
    iva: number;
    total: number;
    estado: 'pendiente' | 'cobrada' | 'parcial';
}

export interface Recibo {
    id: string;
    numero: string;
    fecha: string;
    facturaId: string;
    clienteId: string;
    concepto: string;
    importe: number;
    firmaUrl?: string;
}

// --- Utilidades ---

function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function getNextNumber(prefix: string, key: string): string {
    const items = getAll<{ numero: string }>(key);
    const nums = items.map(i => {
        const match = i.numero.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    });
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `${prefix}-${next.toString().padStart(3, '0')}`;
}

// --- CRUD Genérico ---

function getAll<T>(key: string): T[] {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function save<T>(key: string, items: T[]): void {
    localStorage.setItem(key, JSON.stringify(items));
}

// --- API Clientes ---

export const clientesStore = {
    getAll: (): Cliente[] => getAll<Cliente>('ur_clientes'),
    getById: (id: string): Cliente | undefined => getAll<Cliente>('ur_clientes').find(c => c.id === id),
    create: (data: Omit<Cliente, 'id'>): Cliente => {
        const items = getAll<Cliente>('ur_clientes');
        const item: Cliente = { ...data, id: generateId() };
        items.push(item);
        save('ur_clientes', items);
        return item;
    },
    update: (id: string, data: Partial<Cliente>): void => {
        const items = getAll<Cliente>('ur_clientes').map(c => c.id === id ? { ...c, ...data } : c);
        save('ur_clientes', items);
    },
    remove: (id: string): void => {
        save('ur_clientes', getAll<Cliente>('ur_clientes').filter(c => c.id !== id));
    },
};

// --- API Artículos ---

export const articulosStore = {
    getAll: (): Articulo[] => getAll<Articulo>('ur_articulos'),
    getById: (id: string): Articulo | undefined => getAll<Articulo>('ur_articulos').find(a => a.id === id),
    create: (data: Omit<Articulo, 'id'>): Articulo => {
        const items = getAll<Articulo>('ur_articulos');
        const item: Articulo = { ...data, id: generateId() };
        items.push(item);
        save('ur_articulos', items);
        return item;
    },
    update: (id: string, data: Partial<Articulo>): void => {
        const items = getAll<Articulo>('ur_articulos').map(a => a.id === id ? { ...a, ...data } : a);
        save('ur_articulos', items);
    },
    remove: (id: string): void => {
        save('ur_articulos', getAll<Articulo>('ur_articulos').filter(a => a.id !== id));
    },
};

// --- API Presupuestos ---

export const presupuestosStore = {
    getAll: (): Presupuesto[] => getAll<Presupuesto>('ur_presupuestos'),
    getById: (id: string): Presupuesto | undefined => getAll<Presupuesto>('ur_presupuestos').find(p => p.id === id),
    create: (data: Omit<Presupuesto, 'id' | 'numero'>): Presupuesto => {
        const items = getAll<Presupuesto>('ur_presupuestos');
        const item: Presupuesto = { ...data, id: generateId(), numero: getNextNumber('P', 'ur_presupuestos') };
        items.push(item);
        save('ur_presupuestos', items);
        return item;
    },
    update: (id: string, data: Partial<Presupuesto>): void => {
        const items = getAll<Presupuesto>('ur_presupuestos').map(p => p.id === id ? { ...p, ...data } : p);
        save('ur_presupuestos', items);
    },
    remove: (id: string): void => {
        save('ur_presupuestos', getAll<Presupuesto>('ur_presupuestos').filter(p => p.id !== id));
    },
};

// --- API Facturas ---

export const facturasStore = {
    getAll: (): Factura[] => getAll<Factura>('ur_facturas'),
    getById: (id: string): Factura | undefined => getAll<Factura>('ur_facturas').find(f => f.id === id),
    create: (data: Omit<Factura, 'id' | 'numero'>): Factura => {
        const items = getAll<Factura>('ur_facturas');
        const item: Factura = { ...data, id: generateId(), numero: getNextNumber('F', 'ur_facturas') };
        items.push(item);
        save('ur_facturas', items);
        return item;
    },
    update: (id: string, data: Partial<Factura>): void => {
        const items = getAll<Factura>('ur_facturas').map(f => f.id === id ? { ...f, ...data } : f);
        save('ur_facturas', items);
    },
};

// --- API Recibos ---

export const recibosStore = {
    getAll: (): Recibo[] => getAll<Recibo>('ur_recibos'),
    create: (data: Omit<Recibo, 'id' | 'numero'>): Recibo => {
        const items = getAll<Recibo>('ur_recibos');
        const item: Recibo = { ...data, id: generateId(), numero: getNextNumber('R', 'ur_recibos') };
        items.push(item);
        save('ur_recibos', items);
        return item;
    },
};
