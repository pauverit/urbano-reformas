import { Users, UserPlus, Shield, Hammer, MapPin, Mail } from "lucide-react";

export default function PersonalPage() {
    const equipo = [
        { id: 1, nombre: "Jose Miguel", cargo: "Capataz", estado: "En Obra Cocina", email: "jm@urbano.com", color: "bg-blue-50 text-blue-600 border-blue-100" },
        { id: 2, nombre: "Rita", cargo: "Arquitecta", estado: "En Oficina", email: "rita@urbano.com", color: "bg-purple-50 text-purple-600 border-purple-100" },
        { id: 3, nombre: "Andrés", cargo: "Peón Especialista", estado: "En Obra Baño", email: "andres@urbano.com", color: "bg-amber-50 text-amber-600 border-amber-100" },
        { id: 4, nombre: "Lucía", cargo: "Administración", estado: "En Oficina", email: "lucia@urbano.com", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 page-transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Equipo Humano</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Gestión de Personal y Peones</p>
                </div>
                <button className="premium-button flex items-center gap-3">
                    <UserPlus size={18} />
                    <span>Añadir Miembro</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {equipo.map((persona) => (
                    <div key={persona.id} className="premium-card p-10 group hover:scale-[1.02] transition-transform">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-300 mb-6 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all shadow-sm border border-slate-100 ring-4 ring-transparent group-hover:ring-blue-50">
                                <Users size={32} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">{persona.nombre}</h3>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-6">{persona.cargo}</p>

                            <div className="w-full space-y-4 pt-6 border-t border-slate-50">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <MapPin size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{persona.estado}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Mail size={14} />
                                    <span className="text-[10px] font-bold lowercase tracking-normal truncate">{persona.email}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-8">
                                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                    <Shield size={14} />
                                </button>
                                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-amber-50 hover:text-amber-600 transition-colors">
                                    <Hammer size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
