import { useState, useEffect } from "react";
import { horasStore, presupuestosStore, personalStore, type HoraObra, type Presupuesto, type Personal } from "../lib/store";
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
    const [filtroObra, setFiltroObra] = useState("");
    const [cargando, setCargando] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState(FORM_VACIO);

    const cargar = async () => {
        setCargando(true);
        const [h, p, per] = await Promise.all([horasStore.getAll(), presupuestosStore.getAll(), personalStore.getAll()]);
        setHoras(h); setPresupuestos(p); setPersonal(per);
        setCargando(false);
    };
    useEffect(() => { cargar(); }, []);

    const filtradas = filtroObra ? horas.filter(h => h.presupuesto_id === filtroObra) : horas;
    const totalHoras = filtradas.reduce((s, h) => s + Number(h.horas), 0);
    const totalCoste = filtradas.reduce((s, h) => s + Number(h.total ?? 0), 0);

    // Resumen por peón
    const porPeon: Record<string, { horas: number; coste: number }> = {};
    filtradas.forEach(h => {
        if (!porPeon[h.personal_nombre]) porPeon[h.personal_nombre] = { horas: 0, coste: 0 };
        porPeon[h.personal_nombre].horas += Number(h.horas);
        porPeon[h.personal_nombre].coste += Number(h.total ?? 0);
    });

    const getPto = (id: string) => presupuestos.find(p => p.id === id);

    const guardar = async () => {
        if (!form.personal_nombre || !form.presupuesto_id || form.horas <= 0) return;
        await horasStore.create(form);
        await cargar();
        setModalOpen(false);
        setForm(FORM_VACIO);
    };

    const eliminar = async (id: string) => {
        if (confirm("¿Eliminar este registro?")) { await horasStore.remove(id); await cargar(); }
    };

    return (
        <div className="space-y-10 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Control de Horas</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Peones y Subcontratas — Coste Real por Obra</p>
                </div>
                <button onClick={() => { setForm(FORM_VACIO); setModalOpen(true); }} className="premium-button flex items-center gap-3">
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
                <div className="bg-slate-900 p-8 rounded-[32px] text-white space-y-3">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Por Peón</p>
                    {Object.keys(porPeon).length === 0 ? (
                        <p className="text-slate-500 text-xs font-bold uppercase">Sin registros</p>
                    ) : (
                        Object.entries(porPeon).map(([nombre, d]) => (
                            <div key={nombre} className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-black text-white uppercase truncate max-w-[120px]">{nombre}</p>
                                    <p className="text-[9px] font-bold text-slate-500">{d.horas.toFixed(1)} h</p>
                                </div>
                                <span className="text-sm font-black text-sky-400">{d.coste.toFixed(0)} €</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Filtro por obra */}
            <div className="flex items-center gap-3">
                <select
                    value={filtroObra}
                    onChange={e => setFiltroObra(e.target.value)}
                    className="premium-input w-auto min-w-[220px]"
                >
                    <option value="">Todas las obras</option>
                    {presupuestos.filter(p => p.estado === 'aceptado').map(p => (
                        <option key={p.id} value={p.id}>{p.numero} — {Number(p.total).toFixed(0)} €</option>
                    ))}
                </select>
                {filtroObra && (
                    <button onClick={() => setFiltroObra("")} className="p-3 text-slate-400 hover:text-slate-700 bg-white rounded-xl border border-slate-100">
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
                        return (
                            <div key={h.id} className="premium-card p-5 flex items-center justify-between group border-l-4 border-l-sky-400">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-sm uppercase">
                                        {h.personal_nombre.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full uppercase">{h.personal_nombre}</span>
                                            {pto && <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{pto.numero}</span>}
                                        </div>
                                        <p className="font-black text-sm text-slate-900 uppercase">{h.horas} h × {h.precio_hora} €/h</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h.fecha}{h.concepto ? ` • ${h.concepto}` : ''}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
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
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Añadir Horas</h3>
                            <button onClick={() => setModalOpen(false)} className="p-4 bg-white rounded-2xl text-slate-300 hover:text-red-500 border border-slate-100"><X size={20} /></button>
                        </div>
                        <div className="p-8 space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Obra / Presupuesto *</label>
                                <select value={form.presupuesto_id} onChange={e => setForm(f => ({ ...f, presupuesto_id: e.target.value }))} className="premium-input">
                                    <option value="">Selecciona obra...</option>
                                    {presupuestos.map(p => (
                                        <option key={p.id} value={p.id}>{p.numero} — {Number(p.total).toFixed(0)} €</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Peón / Trabajador *</label>
                                <input
                                    list="personal-list"
                                    value={form.personal_nombre}
                                    onChange={e => setForm(f => ({ ...f, personal_nombre: e.target.value }))}
                                    className="premium-input"
                                    placeholder="Nombre del trabajador"
                                />
                                <datalist id="personal-list">
                                    {personal.map(p => <option key={p.id} value={p.nombre} />)}
                                </datalist>
                            </div>
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
                        <div className="p-8 flex gap-4 bg-white border-t border-slate-50">
                            <button onClick={() => setModalOpen(false)} className="flex-1 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50 border border-slate-50">Cancelar</button>
                            <button onClick={guardar} className="flex-1 bg-sky-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-sky-100 flex items-center justify-center gap-3 hover:bg-sky-700 active:scale-95 border-none">
                                <Save size={16} /> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
