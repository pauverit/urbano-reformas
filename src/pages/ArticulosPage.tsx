import { useState, useEffect } from "react";
import { articulosStore, type Articulo } from "../lib/store";
import { Plus, Search, Edit3, Trash2, X, Save, Package, Tag } from "lucide-react";

export default function ArticulosPage() {
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editando, setEditando] = useState<Articulo | null>(null);
    const [form, setForm] = useState({ descripcion: "", unidad: "ut", precio: 0 });
    const [cargando, setCargando] = useState(true);

    const cargar = async () => { setCargando(true); setArticulos(await articulosStore.getAll()); setCargando(false); };
    useEffect(() => { cargar(); }, []);

    const filtrados = articulos.filter(a => a.descripcion.toLowerCase().includes(busqueda.toLowerCase()));

    const abrirModal = (art?: Articulo) => {
        if (art) {
            setEditando(art);
            setForm({ descripcion: art.descripcion, unidad: art.unidad, precio: art.precio });
        } else {
            setEditando(null);
            setForm({ descripcion: "", unidad: "ut", precio: 0 });
        }
        setModalOpen(true);
    };

    const guardar = async () => {
        if (!form.descripcion.trim()) return;
        if (editando) {
            await articulosStore.update(editando.id!, form);
        } else {
            await articulosStore.create(form);
        }
        await cargar();
        setModalOpen(false);
    };

    const eliminar = async (id: string) => {
        if (confirm("¿Eliminar este artículo?")) {
            await articulosStore.remove(id);
            await cargar();
        }
    };

    return (
        <div className="space-y-10 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Artículos</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Catálogo de Trabajos y Materiales</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group flex-1 md:w-64">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input type="text" placeholder="BUSCAR ARTÍCULO..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-100 transition-all outline-none" />
                    </div>
                    <button onClick={() => abrirModal()} className="premium-button flex items-center gap-3">
                        <Plus size={18} /> Nuevo Artículo
                    </button>
                </div>
            </header>

            {cargando ? (
                <div className="premium-card p-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">Cargando artículos...</p></div>
            ) : filtrados.length === 0 ? (
                <div className="premium-card p-20 text-center space-y-4">
                    <Package size={48} className="mx-auto text-slate-200" />
                    <p className="text-xl font-black text-slate-300 uppercase">Sin artículos registrados</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Pulsa "Nuevo Artículo" para crear tu catálogo</p>
                </div>
            ) : (
                <div className="premium-card overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                                <th className="px-8 py-5">Descripción</th>
                                <th className="px-6 py-5 text-center">Unidad</th>
                                <th className="px-6 py-5 text-right">Precio Ud.</th>
                                <th className="px-8 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtrados.map(a => (
                                <tr key={a.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center"><Tag size={18} /></div>
                                            <span className="font-bold text-sm text-slate-900 uppercase">{a.descripcion}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{a.unidad}</td>
                                    <td className="px-6 py-5 text-right font-black text-slate-900">{Number(a.precio).toFixed(2)} €</td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => abrirModal(a)} className="p-2 text-slate-300 hover:text-blue-500"><Edit3 size={16} /></button>
                                            <button onClick={() => eliminar(a.id!)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[300] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editando ? "Editar Artículo" : "Nuevo Artículo"}</h3>
                            <button onClick={() => setModalOpen(false)} className="p-4 bg-white rounded-2xl text-slate-300 hover:text-red-500 transition-all border border-slate-100"><X size={20} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Descripción del trabajo / material *</label>
                                <input value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="premium-input" placeholder="Ej: Alicatado de paredes" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Unidad</label>
                                    <select value={form.unidad} onChange={e => setForm({ ...form, unidad: e.target.value })} className="premium-input">
                                        <option value="ut">Unidad (ut)</option>
                                        <option value="m2">Metro² (m²)</option>
                                        <option value="ml">Metro lineal (ml)</option>
                                        <option value="m3">Metro³ (m³)</option>
                                        <option value="kg">Kilogramo (kg)</option>
                                        <option value="h">Hora (h)</option>
                                        <option value="pa">Partida Alzada (pa)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Precio Unitario (€)</label>
                                    <input type="number" step="0.01" value={form.precio} onChange={e => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })} className="premium-input" />
                                </div>
                            </div>
                        </div>
                        <div className="p-8 flex items-center gap-4 bg-white border-t border-slate-50">
                            <button onClick={() => setModalOpen(false)} className="flex-1 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50 transition-all border border-slate-50">Cancelar</button>
                            <button onClick={guardar} className="flex-1 bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-95 border-none">
                                <Save size={16} /> {editando ? "Guardar" : "Crear Artículo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
