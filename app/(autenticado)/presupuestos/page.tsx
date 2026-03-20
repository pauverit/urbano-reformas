import Link from "next/link";
import { Plus, FileText, Search, Filter, Sparkles, ArrowRight, Clock } from "lucide-react";

export default function PresupuestosPage() {
    const presupuestos = [
        { id: "PR-2026-001", cliente: "Reforma Cocina Calle Mayor", fecha: "20/03/2026", total: 4500, estado: "En curso", color: "text-blue-600", bg: "bg-blue-50" },
        { id: "PR-2026-002", cliente: "Baño Completo Urb. El Bosque", fecha: "19/03/2026", total: 2800, estado: "Presupuestado", color: "text-amber-600", bg: "bg-amber-50" },
        { id: "PR-2026-003", cliente: "Alisado Paredes Pozuelo", fecha: "15 Mar", total: 1200, estado: "Terminado", color: "text-emerald-600", bg: "bg-emerald-50" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 page-transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Presupuestos</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Histórico y Nuevas Estimaciones</p>
                </div>
                <Link
                    href="/presupuestos/new"
                    className="premium-button flex items-center gap-3"
                >
                    <Plus size={18} />
                    <span>Crear Nuevo Pto</span>
                </Link>
            </div>

            <div className="premium-card p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full flex items-center gap-4 px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl">
                    <Search size={18} className="text-slate-300" />
                    <input
                        type="text"
                        placeholder="Buscar por cliente o referencia..."
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-800 placeholder:text-slate-300"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-5 bg-white border border-slate-100 rounded-3xl text-slate-300 hover:text-blue-500 transition-colors shadow-sm">
                        <Filter size={18} />
                    </button>
                    <button className="p-5 bg-slate-950 text-white rounded-3xl hover:bg-slate-900 transition-colors shadow-xl shadow-slate-200">
                        <Sparkles size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {presupuestos.map((pto) => (
                    <div key={pto.id} className="premium-card p-10 group hover:border-blue-100 transition-all cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/20 rounded-full blur-3xl translate-x-10 translate-y-[-10px]"></div>

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                            <div className="flex items-center gap-8">
                                <div className={`w-16 h-16 ${pto.bg} ${pto.color} rounded-[28px] flex items-center justify-center transition-all group-hover:scale-110`}>
                                    <FileText size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-1">{pto.cliente}</h3>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{pto.id}</span>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 focus:text-slate-400 transition-colors">
                                            <Clock size={12} /> {pto.fecha}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-12">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Estimado</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{pto.total.toLocaleString()} €</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${pto.estado === 'En curso' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                            pto.estado === 'Terminado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                                        }`}>
                                        {pto.estado}
                                    </span>
                                    <div className="p-4 bg-slate-50 text-slate-300 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-2">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
