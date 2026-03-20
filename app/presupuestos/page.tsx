import Link from "next/link";
import { Plus, FileText, Search, Filter } from "lucide-react";

export default function PresupuestosPage() {
    const presupuestos = [
        { id: "PR-2026-001", cliente: "Reforma Cocina Calle Mayor", fecha: "20/03/2026", total: 4500, estado: "En curso" },
        { id: "PR-2026-002", cliente: "Baño Completo Urb. El Bosque", fecha: "19/03/2026", total: 2800, estado: "Presupuestado" },
        { id: "PR-2026-003", cliente: "Alisado Paredes Pozuelo", fecha: "15/03/2026", total: 1200, estado: "Terminado" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Presupuestos</h1>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest text-blue-500">Histórico y Nuevas Estimaciones</p>
                </div>
                <Link
                    href="/presupuestos/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[28px] font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-100 active:scale-95"
                >
                    <Plus size={24} />
                    <span className="uppercase tracking-widest text-xs">Crear Nuevo</span>
                </Link>
            </div>

            <div className="flex items-center gap-4 bg-white p-3 rounded-[32px] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-2xl text-slate-400">
                    <Search size={18} />
                    <input type="text" placeholder="Buscar presupuesto..." className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600 placeholder:text-slate-300" />
                </div>
                <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-blue-500 transition-colors">
                    <Filter size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {presupuestos.map((pto) => (
                    <div key={pto.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:border-blue-100 transition-all group cursor-pointer">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                    <FileText size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase group-hover:text-blue-600 transition-colors leading-none mb-1">{pto.cliente}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{pto.id}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pto.fecha}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 border-slate-50 pt-6 md:pt-0">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Obra</p>
                                    <p className="text-2xl font-black text-slate-900 tracking-tighter">{pto.total.toFixed(2)} €</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${pto.estado === "En curso" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                        pto.estado === "Terminado" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                    }`}>
                                    {pto.estado}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
