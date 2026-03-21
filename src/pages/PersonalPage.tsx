import { useState, useEffect } from "react";
import { Users, Phone, Mail, Award, CheckCircle2, MoreHorizontal, Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { personalStore, type Personal } from "../lib/store";

export default function PersonalPage() {
    const [equipo, setEquipo] = useState<Personal[]>([]);
    const [cargando, setCargando] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [editando, setEditando] = useState<Personal | null>(null);
    const [formData, setFormData] = useState<Omit<Personal, 'id'>>({
        nombre: "",
        cargo: "",
        email: "",
        telefono: "",
        status: "Disponible"
    });

    const cargar = async () => {
        setCargando(true);
        const data = await personalStore.getAll();
        setEquipo(data);
        setCargando(false);
    };

    useEffect(() => { cargar(); }, []);

    const abrirModal = (p?: Personal) => {
        if (p) {
            setEditando(p);
            setFormData({
                nombre: p.nombre,
                cargo: p.cargo,
                email: p.email,
                telefono: p.telefono,
                status: p.status
            });
        } else {
            setEditando(null);
            setFormData({
                nombre: "",
                cargo: "",
                email: "",
                telefono: "",
                status: "Disponible"
            });
        }
        setModalAbierto(true);
    };

    const guardar = async () => {
        if (!formData.nombre || !formData.cargo) return;

        if (editando?.id) {
            await personalStore.update(editando.id, formData);
        } else {
            await personalStore.create(formData);
        }
        setModalAbierto(false);
        cargar();
    };

    const eliminar = async (id: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar a este profesional?")) {
            await personalStore.remove(id);
            cargar();
        }
    };

    return (
        <div className="space-y-12 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Equipo Humano</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Gestión de Personal y Peones</p>
                </div>
                <button onClick={() => abrirModal()} className="premium-button flex items-center gap-3">
                    <Plus size={18} /> Añadir Profesional
                </button>
            </header>

            <div className="premium-card overflow-hidden shadow-xl border border-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-[9px] uppercase tracking-[0.15em] font-black text-slate-400 border-b border-slate-100">
                                <th className="px-6 py-4">Profesional</th>
                                <th className="px-6 py-4">Contacto</th>
                                <th className="px-6 py-4 text-center">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-[13px] font-bold text-slate-700 bg-white">
                            {cargando ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                                    </td>
                                </tr>
                            ) : equipo.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-slate-400 uppercase text-[10px] tracking-widest font-black">
                                        No hay profesionales registrados
                                    </td>
                                </tr>
                            ) : equipo.map((p) => (
                                <tr key={p.id} className="hover:bg-blue-50/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all text-sm font-black shadow-sm border border-slate-100 border-b-2 flex-shrink-0">
                                                {p.nombre.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors">{p.nombre}</span>
                                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-0.5">{p.cargo}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-[11px] text-slate-400 font-bold group-hover:text-slate-600">
                                            {p.email && <span className="flex items-center gap-2"><Mail size={12} className="text-slate-300" /> {p.email}</span>}
                                            {p.telefono && <span className="flex items-center gap-2"><Phone size={12} className="text-slate-300" /> {p.telefono}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'Disponible' ? 'bg-emerald-50 text-emerald-600' : p.status === 'En Obra' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'Disponible' ? 'bg-emerald-500' : p.status === 'En Obra' ? 'bg-blue-500' : 'bg-slate-400'} ${p.status !== 'Baja' ? 'animate-pulse' : ''}`} />
                                                {p.status}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => abrirModal(p)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all hover:text-blue-500" title="Editar"><Edit2 size={16} /></button>
                                            <button onClick={() => eliminar(p.id!)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all hover:text-red-500" title="Eliminar"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL EDITOR */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[300] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editando ? 'Editar Profesional' : 'Añadir Profesional'}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Completa la ficha del equipo</p>
                            </div>
                            <button onClick={() => setModalAbierto(false)} className="p-3 bg-white rounded-xl text-slate-300 hover:text-red-500 border border-slate-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Nombre Completo *</label>
                                    <input value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} className="premium-input" placeholder="Ej: Juan Pérez" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Cargo / Especialidad *</label>
                                    <input value={formData.cargo} onChange={e => setFormData({ ...formData, cargo: e.target.value })} className="premium-input" placeholder="Ej: Oficial de Primera" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
                                        <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="premium-input" placeholder="email@urbano.es" />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Teléfono</label>
                                        <input value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} className="premium-input" placeholder="+34 600..." />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Estado Actual</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })} className="premium-input">
                                        <option value="Disponible">Disponible</option>
                                        <option value="En Obra">En Obra</option>
                                        <option value="Baja">Baja</option>
                                    </select>
                                </div>
                            </div>

                            <button onClick={guardar} className="w-full bg-slate-900 text-white p-5 rounded-[24px] flex items-center justify-center gap-3 font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95 group">
                                <Save size={18} className="group-hover:animate-bounce" /> {editando ? 'Actualizar Ficha' : 'Dar de Alta'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
