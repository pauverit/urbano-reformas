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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {equipo.map((p) => (
                    <div key={p.nombre} className="premium-card p-10 group hover:bg-slate-950 transition-all duration-500">
                        <div className="flex items-start justify-between mb-8">
                            <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                <Users size={28} />
                            </div>
                            <button className="text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase group-hover:text-white transition-colors">{p.nombre}</h3>
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest group-hover:text-blue-400 transition-colors italic">{p.r}</p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-50 group-hover:border-slate-800 space-y-4">
                            <div className="flex items-center gap-3 text-slate-400 text-sm group-hover:text-slate-300">
                                <Mail size={16} />
                                <span className="font-bold">{p.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 text-sm group-hover:text-slate-300">
                                <Phone size={16} />
                                <span className="font-bold">+34 600 000 000</span>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.status === 'Disponible' ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500/10' : 'bg-blue-50 text-blue-500 group-hover:bg-blue-500/10'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'Disponible' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                {p.status}
                            </div>
                            <div className="flex gap-2">
                                <Award size={18} className="text-slate-100 group-hover:text-blue-500 transition-colors" />
                                <CheckCircle2 size={18} className="text-slate-100 group-hover:text-emerald-500 transition-colors" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
