import { Users, Phone, Mail, Award, CheckCircle2, MoreHorizontal, Plus } from "lucide-react";

export default function PersonalPage() {
    const equipo = [
        { nombre: "Carlos Urbano", r: "Arquitecto / Capatáz", email: "carlos@urbano.es", status: "Disponible" },
        { nombre: "Miguel Ángel", r: "Oficial de Primera", email: "miguel@urbano.es", status: "En Obra" },
        { nombre: "José Luis", r: "Peón Especialista", email: "joseluis@urbano.es", status: "En Obra" },
        { nombre: "Dani Gómez", r: "Fontanero / Electricista", email: "dani@urbano.es", status: "Disponible" },
    ];

    return (
        <div className="space-y-12 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Equipo Humano</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Gestión de Personal y Peones</p>
                </div>
                <button className="premium-button flex items-center gap-3">
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
                            {equipo.map((p) => (
                                <tr key={p.nombre} className="hover:bg-blue-50/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all text-sm font-black shadow-sm border border-slate-100 border-b-2 flex-shrink-0">
                                                {p.nombre.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900 group-hover:text-blue-700 transition-colors">{p.nombre}</span>
                                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-0.5">{p.r}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-[11px] text-slate-400 font-bold group-hover:text-slate-600">
                                            {p.email && <span className="flex items-center gap-2"><Mail size={12} className="text-slate-300" /> {p.email}</span>}
                                            <span className="flex items-center gap-2"><Phone size={12} className="text-slate-300" /> +34 600 000 000</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'Disponible' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'Disponible' ? 'bg-emerald-500' : 'bg-blue-500'} animate-pulse`} />
                                                {p.status}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all hover:text-blue-500"><Award size={16} /></button>
                                            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all hover:text-emerald-500"><CheckCircle2 size={16} /></button>
                                            <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all hover:text-slate-700"><MoreHorizontal size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
