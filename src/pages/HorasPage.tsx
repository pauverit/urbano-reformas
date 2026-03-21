import { useState, useEffect } from "react";
import { horasStore, presupuestosStore, personalStore, clientesStore, type HoraObra, type Presupuesto, type Personal, type Cliente } from "../lib/store";
import { Plus, Clock, Trash2, Save, X, Euro } from "lucide-react";

const FORM_VACIO = {
    presupuesto_id: "",
    personal_nombre: "",
    fecha: new Date().toISOString().split('T')[0],
    horas: 8,
    precio_hora: 15,
    concepto: "",
};

export default function HorasPage() {
    const [horas, setHoras] = useState<HoraObra[]>([]);
    const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
    const [personal, setPersonal] = useState<Personal[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [filtroObra, setFiltroObra] = useState("");
    const [filtroPeon, setFiltroPeon] = useState("");
    const [cargando, setCargando] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(FORM_VACIO);
    const [otroNombre, setOtroNombre] = useState(false);

    const cargar = async () => {
        setCargando(true);
        const [h, p, per, cli] = await Promise.all([
            horasStore.getAll(),
            presupuestosStore.getAll(),
            personalStore.getAll(),
            clientesStore.getAll(),
        ]);
        setHoras(h); setPresupuestos(p); setPersonal(per); setClientes(cli);
        setCargando(false);
    };
    useEffect(() => { cargar(); }, []);

    const getCliente = (clienteId: string) => clientes.find(c => c.id === clienteId);
    const getPto = (id: string) => presupuestos.find(p => p.id === id);

    const filtradas = horas.filter(h => {
        if (filtroObra && h.presupuesto_id !== filtroObra) return false;
        if (filtroPeon && h.personal_nombre !== filtroPeon) return false;
        return true;
    });

    const totalHoras = filtradas.reduce((s, h) => s + Number(h.horas), 0);
    const totalCoste = filtradas.reduce((s, h) => s + Number(h.total ?? 0), 0);

    // Resumen por peón (sobre datos filtrados)
    const porPeon: Record<string, { horas: number; coste: number }> = {};
    filtradas.forEach(h => {
        if (!porPeon[h.personal_nombre]) porPeon[h.personal_nombre] = { horas: 0, coste: 0 };
        porPeon[h.personal_nombre].horas += Number(h.horas);
        porPeon[h.personal_nombre].coste += Number(h.total ?? 0);
    });

    // Peones únicos que tienen horas registradas (para filtro)
    const peonesConHoras = [...new Set(horas.map(h => h.personal_nombre))].sort();

    const guardar = async () => {
        if (!form.personal_nombre || !form.presupuesto_id || form.horas <= 0) return;
        await horasStore.create(form);
        await cargar();
        setModalOpen(false);
        setForm(FORM_VACIO);
        setOtroNombre(false);
    };

    const eliminar = async (id: string) => {
        if (confirm("¿Eliminar este registro?")) { await horasStore.remove(id); await cargar(); }
    };

    const abrirModal = () => { setForm(FORM_VACIO); setOtroNombre(false); setModalOpen(true); };

    const handleSelectPersonal = (value: string) => {
        if (value === '__otro__') {
            setOtroNombre(true);
            setForm(f => ({ ...f, personal_nombre: '' }));
        } else {
            setOtroNombre(false);
            setForm(f => ({ ...f, personal_nombre: value }));
        }
    };

    return (
        <div className="space-y-10 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Control de Horas</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Peones y Subcontratas — Coste Real por Obra</p>
                </div>
                <button onClick={abrirModal} className="premium-button flex items-center gap-3">
                    <Plus size={18} /> Añadir Horas
                </button>
            </header>

            {/* Tarjetas resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="premium-card p-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-sky-500 text-white shadow-lg"><Clock size={22} /></div>
                        <span className="text-[10px] font-bold text-sky-500 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-widest">Total</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Horas Trabajadas</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{totalHoras.toFixed(1)} h</p>
                </div>
                <div className="premium-card p-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-amber-500 text-white shadow-lg"><Euro size={22} /></div>
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-widest">Coste</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Coste Total Mano de Obra</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{totalCoste.toFixed(2)} €</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-[32px] text-white space-y-3 overflow-y-auto max-h-52">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Por Peón</p>
                    {Object.keys(porPeon).length === 0 ? (
                        <p className="text-slate-500 text-xs font-bold uppercase">Sin registros</p>
                    ) : (
                        Object.entries(porPeon).map(([nombre, d]) => (
                            <div key={nombre} className="flex justify-between items-center gap-2">
                                <div className="min-w-0">
                                    <p className="text-xs font-black text-white uppercase truncate">{nombre}</p>
                                    <p className="text-[9px] font-bold text-slate-500">{d.horas.toFixed(1)} h</p>
                                </div>
                                <span className="text-sm font-black text-sky-400 flex-shrink-0">{d.coste.toFixed(0)} €</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-3">
                <select value={filtroObra} onChange={e => setFiltroObra(e.target.value)} className="premium-input w-auto min-w-[200px]">
                    <option value="">Todas las obras</option>
                    {presupuestos.map(p => {
                        const cli = getCliente(p.cliente_id);
                        return <option key={p.id} value={p.id}>{p.numero}{cli ? ` — ${cli.nombre}` : ''}</option>;
                    })}
                </select>
                <select value={filtroPeon} onChange={e => setFiltroPeon(e.target.value)} className="premium-input w-auto min-w-[160px]">
                    <option value="">Todos los peones</option>
                    {peonesConHoras.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                {(filtroObra || filtroPeon) && (
                    <button onClick={() => { setFiltroObra(""); setFiltroPeon(""); }} className="p-3 text-slate-400 hover:text-slate-700 bg-white rounded-xl border border-slate-100" title="Limpiar filtros">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Lista de horas */}
            {cargando ? (
                <div className="premium-card p-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full mx-auto" /></div>
            ) : filtradas.length === 0 ? (
                <div className="premium-card p-20 text-center space-y-4">
                    <Clock size={48} className="mx-auto text-slate-200" />
                    <p className="text-xl font-black text-slate-300 uppercase">Sin registros</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Añade las horas de tus peones por obra</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtradas.map(h => {
                        const pto = getPto(h.presupuesto_id);
                        const cli = pto ? getCliente(pto.cliente_id) : null;
                        return (
                            <div key={h.id} className="premium-card p-5 flex items-center justify-between group border-l-4 border-l-sky-400">
                                <div className="flex items-center gap-5 min-w-0">
                                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-sm uppercase flex-shrink-0">
                                        {h.personal_nombre.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full uppercase">{h.personal_nombre}</span>
                                            {pto && (
                                                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full truncate">
                                                    {pto.numero}{cli ? ` · ${cli.nombre}` : ''}
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-black text-sm text-slate-900 uppercase">{h.horas} h × {h.precio_hora} €/h</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h.fecha}{h.concepto ? ` • ${h.concepto}` : ''}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <p className="text-lg font-black text-slate-900">{Number(h.total ?? 0).toFixed(2)} €</p>
                                    <button onClick={() => eliminar(h.id!)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal nuevo registro */}
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[300] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Añadir Horas</h3>
                            <button onClick={() => setModalOpen(false)} className="p-4 bg-white rounded-2xl text-slate-300 hover:text-red-500 border border-slate-100"><X size={20} /></button>
                        </div>
                        <div className="p-8 space-y-5 overflow-y-auto flex-1">
                            {/* Obra */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Obra / Presupuesto *</label>
                                <select value={form.presupuesto_id} onChange={e => setForm(f => ({ ...f, presupuesto_id: e.target.value }))} className="premium-input">
                                    <option value="">Selecciona obra...</option>
                                    {presupuestos.map(p => {
                                        const cli = getCliente(p.cliente_id);
                                        return (
                                            <option key={p.id} value={p.id}>
                                                {p.numero}{cli ? ` — ${cli.nombre}` : ''} ({Number(p.total).toFixed(0)} €)
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* Peón — select con los trabajadores dados de alta */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Peón / Trabajador *</label>
                                {personal.length > 0 ? (
                                    <select
                                        value={otroNombre ? '__otro__' : form.personal_nombre}
                                        onChange={e => handleSelectPersonal(e.target.value)}
                                        className="premium-input"
                                    >
                                        <option value="">Selecciona trabajador...</option>
                                        {personal.map(p => (
                                            <option key={p.id} value={p.nombre}>{p.nombre} — {p.cargo}</option>
                                        ))}
                                        <option value="__otro__">Otro (subcontrata / nombre libre)</option>
                                    </select>
                                ) : (
                                    <input
                                        value={form.personal_nombre}
                                        onChange={e => setForm(f => ({ ...f, personal_nombre: e.target.value }))}
                                        className="premium-input"
                                        placeholder="Nombre del trabajador"
                                    />
                                )}
                                {otroNombre && (
                                    <input
                                        value={form.personal_nombre}
                                        onChange={e => setForm(f => ({ ...f, personal_nombre: e.target.value }))}
                                        className="premium-input mt-2"
                                        placeholder="Nombre del trabajador o empresa subcontratada..."
                                        autoFocus
                                    />
                                )}
                            </div>

                            {/* Fecha y horas */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Fecha</label>
                                    <input type="date" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} className="premium-input" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Horas *</label>
                                    <input type="number" step="0.5" min="0.5" value={form.horas} onChange={e => setForm(f => ({ ...f, horas: parseFloat(e.target.value) || 0 }))} className="premium-input" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">€ / Hora</label>
                                    <input type="number" step="0.5" min="0" value={form.precio_hora} onChange={e => setForm(f => ({ ...f, precio_hora: parseFloat(e.target.value) || 0 }))} className="premium-input" />
                                </div>
                                <div className="flex flex-col justify-end">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Total</label>
                                    <div className="premium-input bg-slate-50 font-black text-slate-900 flex items-center">
                                        {(form.horas * form.precio_hora).toFixed(2)} €
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Concepto / Notas</label>
                                <input value={form.concepto} onChange={e => setForm(f => ({ ...f, concepto: e.target.value }))} className="premium-input" placeholder="Ej: Enfoscado paredes, transporte..." />
                            </div>
                        </div>
                        <div className="p-8 flex gap-4 bg-white border-t border-slate-50 flex-shrink-0">
                            <button onClick={() => setModalOpen(false)} className="flex-1 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50 border border-slate-50">Cancelar</button>
                            <button
                                onClick={guardar}
                                disabled={!form.personal_nombre || !form.presupuesto_id || form.horas <= 0}
                                className="flex-1 bg-sky-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-sky-100 flex items-center justify-center gap-3 hover:bg-sky-700 active:scale-95 border-none disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Save size={16} /> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
