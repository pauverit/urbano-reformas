import { Users, UserPlus } from "lucide-react";

export default function PersonalPage() {
    const equipo = [
        { id: 1, nombre: "Jose Miguel", cargo: "Capataz", estado: "En Obra Cocina", color: "bg-blue-50 text-blue-600 border-blue-100" },
        { id: 2, nombre: "Juan Pérez", cargo: "Peón Especialista", estado: "En Obra Baño", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        { id: 3, nombre: "Antonio García", cargo: "Peón", estado: "Disponible", color: "bg-slate-50 text-slate-500 border-slate-100" },
        { id: 4, nombre: "Ricardo San", cargo: "Peón", estado: "En Obra Pozuelo", color: "bg-purple-50 text-purple-600 border-purple-100" },
    ];

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestión de Personal</h1>
                    <p className="text-slate-400 font-semibold mt-1 uppercase text-xs tracking-widest text-blue-500">Equipo de Trabajo y Asignaciones</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-100 active:scale-95">
                    <UserPlus size={20} />
                    <span>Añadir Operario</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo / Función</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Actual</th>
                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {equipo.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-8 py-6 font-bold text-slate-800 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                        <Users size={18} />
                                    </div>
                                    {p.nombre}
                                </td>
                                <td className="px-8 py-6 text-slate-500 font-medium">{p.cargo}</td>
                                <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${p.color}`}>
                                        {p.estado}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase tracking-wider">Gestionar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
