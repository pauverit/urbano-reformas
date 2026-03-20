import { useState, useEffect } from "react";
import { clientesStore, type Cliente } from "../lib/store";
import { Plus, Search, Edit3, Trash2, X, Save, Users, Building2, Phone, Mail } from "lucide-react";

export default function ClientesPage() {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editando, setEditando] = useState<Cliente | null>(null);
    const [form, setForm] = useState({ nombre: "", nif: "", direccion: "", cp: "", poblacion: "", provincia: "", telefono: "", email: "" });

    useEffect(() => { setClientes(clientesStore.getAll()); }, []);

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

    const guardar = () => {
        if (!form.nombre.trim()) return;
        if (editando) {
            clientesStore.update(editando.id, form);
        } else {
            clientesStore.create(form);
        }
        setClientes(clientesStore.getAll());
        setModalOpen(false);
    };

    const eliminar = (id: string) => {
        if (confirm("¿Eliminar este cliente?")) {
            clientesStore.remove(id);
            setClientes(clientesStore.getAll());
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

            {filtrados.length === 0 ? (
                <div className="premium-card p-20 text-center space-y-4">
                    <Users size={48} className="mx-auto text-slate-200" />
                    <p className="text-xl font-black text-slate-300 uppercase">Sin clientes registrados</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Pulsa "Nuevo Cliente" para empezar</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtrados.map(c => (
                        <div key={c.id} className="premium-card p-8 group hover:bg-slate-950 transition-all duration-500">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all text-xl font-black">
                                    {c.nombre.charAt(0)}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => abrirModal(c)} className="p-2 text-slate-400 hover:text-blue-400"><Edit3 size={16} /></button>
                                    <button onClick={() => eliminar(c.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-white transition-colors">{c.nombre}</h3>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1 group-hover:text-blue-400">{c.nif || "Sin NIF"}</p>
                            <div className="mt-6 pt-6 border-t border-slate-50 group-hover:border-slate-800 space-y-3 text-sm text-slate-400 group-hover:text-slate-300">
                                {c.direccion && <div className="flex items-center gap-2"><Building2 size={14} /> <span className="font-bold truncate">{c.direccion}, {c.cp} {c.poblacion}</span></div>}
                                {c.telefono && <div className="flex items-center gap-2"><Phone size={14} /> <span className="font-bold">{c.telefono}</span></div>}
                                {c.email && <div className="flex items-center gap-2"><Mail size={14} /> <span className="font-bold truncate">{c.email}</span></div>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Crear/Editar */}
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
