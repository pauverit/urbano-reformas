import { useState, useEffect } from "react";
import { gastosStore, type Gasto } from "../lib/store";
import { Plus, Search, Edit3, Trash2, X, Save, Receipt, Camera, FileUp, Tag, Loader2, Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const CATEGORIAS: Record<string, { label: string; color: string }> = {
    material: { label: "Material", color: "bg-amber-50 text-amber-600" },
    herramienta: { label: "Herramienta", color: "bg-blue-50 text-blue-600" },
    transporte: { label: "Transporte", color: "bg-purple-50 text-purple-600" },
    subcontrata: { label: "Subcontrata", color: "bg-pink-50 text-pink-600" },
    suministros: { label: "Suministros", color: "bg-cyan-50 text-cyan-600" },
    otros: { label: "Otros", color: "bg-slate-100 text-slate-500" },
};

const FORM_VACIO = { proveedor: "", concepto: "", categoria: "otros" as Gasto['categoria'], base_imponible: 0, iva_porcentaje: 21, iva: 0, total: 0, foto_url: "", pdf_url: "", notas: "" };

export default function GastosPage() {
    const [gastos, setGastos] = useState<Gasto[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editando, setEditando] = useState<Gasto | null>(null);
    const [form, setForm] = useState(FORM_VACIO);
    const [cargando, setCargando] = useState(true);
    const [analizando, setAnalizando] = useState(false);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const [mesFiltro, setMesFiltro] = useState("");

    const cargar = async () => { setCargando(true); setGastos(await gastosStore.getAll()); setCargando(false); };
    useEffect(() => { cargar(); }, []);

    const totalMes = gastos.reduce((s, g) => s + Number(g.total), 0);

    const filtrados = gastos.filter(g => {
        const matchBusqueda = g.proveedor.toLowerCase().includes(busqueda.toLowerCase()) || g.concepto.toLowerCase().includes(busqueda.toLowerCase());
        const matchMes = !mesFiltro || g.fecha.includes(mesFiltro);
        return matchBusqueda && matchMes;
    });

    const updateForm = (field: string, value: any) => {
        const newForm = { ...form, [field]: value };
        if (field === 'base_imponible' || field === 'iva_porcentaje') {
            const base = field === 'base_imponible' ? Number(value) : Number(newForm.base_imponible);
            const ivaPct = field === 'iva_porcentaje' ? Number(value) : Number(newForm.iva_porcentaje);
            newForm.iva = base * (ivaPct / 100);
            newForm.total = base + newForm.iva;
        }
        setForm(newForm);
    };

    const analizarTicket = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setFotoPreview(reader.result as string);
        reader.readAsDataURL(file);
        setAnalizando(true);

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            await new Promise(r => setTimeout(r, 1500));
            updateForm('proveedor', 'Leroy Merlin');
            updateForm('concepto', 'Azulejos baño reforma');
            updateForm('base_imponible', 124.79);
            updateForm('iva', 26.21);
            updateForm('total', 151.00);
            updateForm('categoria', 'material');
            setAnalizando(false);
            return;
        }
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const base64 = await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.readAsDataURL(file); r.onload = () => resolve((r.result as string).split(',')[1]); r.onerror = reject; });
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent([
                `Analiza este ticket/factura y extrae: { "proveedor": "", "concepto": "", "categoria": "material|herramienta|transporte|subcontrata|suministros|otros", "base_imponible": 0, "iva": 0, "total": 0 }. Responde SOLO con JSON.`,
                { inlineData: { data: base64, mimeType: file.type } }
            ]);
            const data = JSON.parse((await result.response).text().replace(/```json|```/g, "").trim());
            Object.entries(data).forEach(([k, v]) => updateForm(k, v));
        } catch { updateForm('concepto', 'Error al analizar — rellena manualmente'); }
        setAnalizando(false);
    };

    const guardar = async () => {
        if (!form.concepto && !form.proveedor) return;
        const data = { ...form, fecha: new Date().toLocaleDateString('es-ES'), foto_url: fotoPreview || '', pdf_url: form.pdf_url };
        if (editando) { await gastosStore.update(editando.id!, data); }
        else { await gastosStore.create(data); }
        await cargar(); setModalOpen(false); setForm(FORM_VACIO); setFotoPreview(null); setEditando(null);
    };

    const eliminar = async (id: string) => { if (confirm("¿Eliminar?")) { await gastosStore.remove(id); await cargar(); } };

    return (
        <div className="space-y-10 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Gastos</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">OCR de Tickets, Facturas de Proveedor y Control de Costes</p>
                </div>
                <button onClick={() => { setEditando(null); setForm(FORM_VACIO); setFotoPreview(null); setModalOpen(true); }} className="premium-button flex items-center gap-3"><Plus size={18} /> Nuevo Gasto</button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="relative flex-1"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" /><input value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-100" placeholder="Buscar gasto..." /></div>
                        <select value={mesFiltro} onChange={e => setMesFiltro(e.target.value)} className="premium-input w-auto"><option value="">Todo</option><option value="/01/">Enero</option><option value="/02/">Febrero</option><option value="/03/">Marzo</option><option value="/04/">Abril</option><option value="/05/">Mayo</option><option value="/06/">Junio</option><option value="/07/">Julio</option><option value="/08/">Agosto</option><option value="/09/">Sept</option><option value="/10/">Octubre</option><option value="/11/">Nov</option><option value="/12/">Dic</option></select>
                    </div>
                    {cargando ? <div className="premium-card p-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div></div>
                        : filtrados.length === 0 ? <div className="premium-card p-20 text-center space-y-4"><Receipt size={48} className="mx-auto text-slate-200" /><p className="text-xl font-black text-slate-300 uppercase">Sin gastos</p><p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Foto a un ticket o sube una factura PDF</p></div>
                            : <div className="space-y-3">{filtrados.map(g => {
                                const cat = CATEGORIAS[g.categoria] || CATEGORIAS.otros;
                                return (
                                    <div key={g.id} className="premium-card p-5 flex items-center justify-between group border-l-4 border-l-amber-400">
                                        <div className="flex items-center gap-5">
                                            {g.foto_url ? <img src={g.foto_url} className="w-12 h-12 rounded-xl object-cover" alt="" /> : <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center"><Receipt size={20} /></div>}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">{g.numero}</span><span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span></div>
                                                <p className="font-black text-sm text-slate-900 uppercase">{g.proveedor || g.concepto}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{g.concepto} • {g.fecha}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right"><p className="text-lg font-black text-slate-900">{Number(g.total).toFixed(2)} €</p><p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Base: {Number(g.base_imponible).toFixed(2)} €</p></div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setEditando(g); setForm({ ...g } as any); setFotoPreview(g.foto_url || null); setModalOpen(true); }} className="p-2 text-slate-300 hover:text-blue-500"><Edit3 size={14} /></button><button onClick={() => eliminar(g.id!)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button></div>
                                        </div>
                                    </div>
                                );
                            })}</div>}
                </div>
                <div className="bg-slate-900 p-8 rounded-[40px] text-white space-y-6 shadow-2xl h-fit">
                    <h3 className="text-lg font-black tracking-tight uppercase">Resumen</h3>
                    <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Gastos</p><p className="text-3xl font-black text-white tracking-tighter">{totalMes.toFixed(2)} €</p></div>
                    <div className="pt-4 border-t border-slate-800 space-y-2">
                        {Object.entries(CATEGORIAS).map(([k, v]) => { const t = gastos.filter(g => g.categoria === k).reduce((s, g) => s + Number(g.total), 0); return t > 0 ? <div key={k} className="flex justify-between text-sm"><span className="text-slate-400 font-bold">{v.label}</span><span className="font-black text-white">{t.toFixed(2)} €</span></div> : null; })}
                    </div>
                    <div className="pt-4 border-t border-slate-800"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Nº Gastos</p><p className="text-2xl font-black text-amber-400">{gastos.length}</p></div>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[300] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50"><h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editando ? 'Editar Gasto' : 'Nuevo Gasto'}</h3><button onClick={() => setModalOpen(false)} className="p-4 bg-white rounded-2xl text-slate-300 hover:text-red-500 border border-slate-100"><X size={20} /></button></div>
                        <div className="p-8 space-y-6 overflow-y-auto flex-1">
                            {!editando && (
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`premium-card p-6 flex flex-col items-center gap-3 cursor-pointer border-2 border-dashed transition-all ${analizando ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-300'}`}>
                                        {analizando ? <Loader2 size={32} className="text-blue-500 animate-spin" /> : <Camera size={32} className="text-blue-500" />}
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{analizando ? 'Analizando...' : 'Foto de Ticket'}</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={analizarTicket} disabled={analizando} />
                                    </label>
                                    <label className="premium-card p-6 flex flex-col items-center gap-3 cursor-pointer border-2 border-dashed border-slate-100 hover:border-purple-300 transition-all">
                                        <FileUp size={32} className="text-purple-500" />
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Subir PDF</span>
                                        <input type="file" accept=".pdf" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => updateForm('pdf_url', reader.result as string); reader.readAsDataURL(file); } }} />
                                    </label>
                                </div>
                            )}
                            {fotoPreview && <div className="rounded-2xl overflow-hidden border border-slate-100"><img src={fotoPreview} className="w-full max-h-48 object-contain bg-slate-50" alt="Ticket" /></div>}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Proveedor</label><input value={form.proveedor} onChange={e => updateForm('proveedor', e.target.value)} className="premium-input" placeholder="Leroy Merlin, Repsol..." /></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Categoría</label><select value={form.categoria} onChange={e => updateForm('categoria', e.target.value)} className="premium-input">{Object.entries(CATEGORIAS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                                <div className="md:col-span-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Concepto</label><input value={form.concepto} onChange={e => updateForm('concepto', e.target.value)} className="premium-input" placeholder="Azulejos reforma baño" /></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Base Imponible (€)</label><input type="number" step="0.01" value={form.base_imponible} onChange={e => updateForm('base_imponible', parseFloat(e.target.value) || 0)} className="premium-input" /></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">% IVA</label><input type="number" step="1" value={form.iva_porcentaje} onChange={e => updateForm('iva_porcentaje', parseFloat(e.target.value) || 0)} className="premium-input" /></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">IVA (€)</label><input type="number" step="0.01" value={form.iva.toFixed(2)} readOnly className="premium-input bg-slate-50 text-slate-400" /></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Total (€)</label><input type="number" step="0.01" value={form.total.toFixed(2)} readOnly className="premium-input bg-slate-50 font-black text-slate-900" /></div>
                            </div>
                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Notas</label><input value={form.notas} onChange={e => updateForm('notas', e.target.value)} className="premium-input" placeholder="Observaciones..." /></div>
                        </div>
                        <div className="p-8 flex gap-4 bg-white border-t border-slate-50">
                            <button onClick={() => setModalOpen(false)} className="flex-1 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50 border border-slate-50">Cancelar</button>
                            <button onClick={guardar} className="flex-1 bg-amber-500 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-amber-100 flex items-center justify-center gap-3 hover:bg-amber-600 active:scale-95 border-none"><Save size={16} /> {editando ? 'Guardar' : 'Registrar Gasto'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
