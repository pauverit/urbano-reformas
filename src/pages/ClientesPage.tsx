import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientesStore, type Cliente } from "../lib/store";
import { Plus, Search, Edit3, Trash2, X, Save, Users, Building2, Phone, Mail } from "lucide-react";

export default function ClientesPage() {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editando, setEditando] = useState<Cliente | null>(null);
    const [form, setForm] = useState({ nombre: "", nif: "", direccion: "", cp: "", poblacion: "", provincia: "", telefono: "", email: "" });
    const [cargando, setCargando] = useState(true);

    const cargar = async () => { setCargando(true); setClientes(await clientesStore.getAll()); setCargando(false); };
    useEffect(() => { cargar(); }, []);

    const filtrados = clientes.filter(c =>
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.nif.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirModal = (cliente?: Cliente) => {
        if (cliente) {
            setEditando(cliente);
            setForm({ nombre: cliente.nombre, nif: cliente.nif, direccion: cliente.direccion, cp: cliente.cp, poblacion: cliente.poblacion, provincia: cliente.provincia, telefono: cliente.telefono, email: cliente.email });
        } else {
            setEditando(null);
            setForm({ nombre: "", nif: "", direccion: "", cp: "", poblacion: "", provincia: "", telefono: "", email: "" });
        }
        setModalOpen(true);
    };

    const guardar = async () => {
        if (!form.nombre.trim()) return;
        if (editando) {
            await clientesStore.update(editando.id!, form);
        } else {
            await clientesStore.create(form);
        }
        await cargar();
        setModalOpen(false);
    };

    const eliminar = async (id: string) => {
        if (confirm("¿Eliminar este cliente?")) {
            await clientesStore.remove(id);
            await cargar();
        }
    };

    return (
        <div className="space-y-10 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Clientes</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Registro de Clientes y Datos Fiscales</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group flex-1 md:w-64">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input type="text" placeholder="BUSCAR CLIENTE O NIF..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-100 transition-all outline-none" />
                    </div>
                    <button onClick={() => abrirModal()} className="premium-button flex items-center gap-3">
                        <Plus size={18} /> Nuevo Cliente
                    </button>
                </div>
            </header>

            {cargando ? (
                <div className="premium-card p-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">Cargando clientes...</p></div>
            ) : filtrados.length === 0 ? (
                <div className="premium-card p-20 text-center space-y-4">
                    <Users size={48} className="mx-auto text-slate-200" />
                    <p className="text-xl font-black text-slate-300 uppercase">Sin clientes registrados</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Pulsa "Nuevo Cliente" para empezar</p>
                </div>
            ) : (
                <div className="premium-card overflow-hidden shadow-xl border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 text-[9px] uppercase tracking-[0.15em] font-black text-slate-400 border-b border-slate-100">
                                    <th className="px-6 py-4">Cliente / Empresa</th>
                                    <th className="px-6 py-4 text-center">NIF / CIF</th>
                                    <th className="px-6 py-4">Contacto</th>
                                    <th className="px-6 py-4">Ubicación</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-[13px] font-bold text-slate-700 bg-white">
                                {filtrados.map(c => (
                                    <tr key={c.id} className="hover:bg-blue-50/40 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all text-sm font-black shadow-sm border border-slate-100 border-b-2">
                                                    {c.nombre.charAt(0)}
                                                </div>
                                                <span className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer" onClick={() => navigate(`/clientes/${c.id}`)}>{c.nombre}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-slate-400 uppercase text-center text-[11px]">{c.nif || "—"}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-[11px] text-slate-400 font-bold group-hover:text-slate-600">
                                                {c.telefono && <span className="flex items-center gap-2"><Phone size={12} className="text-slate-300" /> {c.telefono}</span>}
                                                {c.email && <span className="flex items-center gap-2"><Mail size={12} className="text-slate-300" /> {c.email}</span>}
                                                {!c.telefono && !c.email && "—"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 flex flex-col gap-1 text-[11px] text-slate-400 font-bold uppercase group-hover:text-slate-600 mt-2">
                                            {c.poblacion && <span className="flex items-center gap-2"><Building2 size={12} className="text-slate-300" /> {c.poblacion} {c.provincia ? `(${c.provincia})` : ''}</span>}
                                            {!c.poblacion && "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => navigate(`/clientes/${c.id}`)} className="px-4 py-2 bg-blue-50 text-[9px] text-blue-600 uppercase tracking-widest font-black rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-100">Ver Ficha</button>
                                                <button onClick={() => abrirModal(c)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all hover:text-blue-500"><Edit3 size={16} /></button>
                                                <button onClick={() => eliminar(c.id!)} className="p-2 text-slate-400 hover:bg-red-50 rounded-lg transition-all hover:text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[300] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editando ? "Editar Cliente" : "Nuevo Cliente"}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Datos Fiscales y de Contacto</p>
                            </div>
                            <button onClick={() => setModalOpen(false)} className="p-4 bg-white rounded-2xl text-slate-300 hover:text-red-500 transition-all border border-slate-100"><X size={20} /></button>
                        </div>
                        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nombre / Razón Social *</label>
                                    <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="premium-input" placeholder="Ej: José García López" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">NIF / CIF</label>
                                    <input value={form.nif} onChange={e => setForm({ ...form, nif: e.target.value })} className="premium-input" placeholder="12345678A" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Teléfono</label>
                                    <input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="premium-input" placeholder="+34 600 000 000" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Dirección</label>
                                    <input value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} className="premium-input" placeholder="Calle Gran Vía, 12, 3ºB" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Código Postal</label>
                                    <input value={form.cp} onChange={e => setForm({ ...form, cp: e.target.value })} className="premium-input" placeholder="28001" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Población</label>
                                    <input value={form.poblacion} onChange={e => setForm({ ...form, poblacion: e.target.value })} className="premium-input" placeholder="Madrid" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Provincia</label>
                                    <input value={form.provincia} onChange={e => setForm({ ...form, provincia: e.target.value })} className="premium-input" placeholder="Madrid" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email</label>
                                    <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="premium-input" placeholder="cliente@email.com" />
                                </div>
                            </div>
                        </div>
                        <div className="p-8 flex items-center gap-4 bg-white border-t border-slate-50">
                            <button onClick={() => setModalOpen(false)} className="flex-1 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50 transition-all border border-slate-50">Cancelar</button>
                            <button onClick={guardar} className="flex-1 bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-95 border-none">
                                <Save size={16} /> {editando ? "Guardar Cambios" : "Crear Cliente"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
