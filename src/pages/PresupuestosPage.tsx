import { Search, Plus, FileText, ChevronRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";

export default function PresupuestosPage() {
    const presupuestos = [
        { id: "P2024-001", cliente: "Ana Martínez", obra: "Reforma Cocina y Suelo", total: 4500, estado: "Aceptado", fecha: "20/03/2026", progreso: 100 },
        { id: "P2024-002", cliente: "Juan Pérez", obra: "Pintura y Alisado", total: 1200, estado: "Pendiente", fecha: "18/03/2026", progreso: 40 },
        { id: "P2024-003", cliente: "Laura Gómez", obra: "Reforma Baño Principal", total: 3800, estado: "En Proceso", fecha: "15/03/2026", progreso: 15 },
        { id: "P2024-004", cliente: "Roberto Ruiz", obra: "Instalación Eléctrica", total: 950, estado: "Aceptado", fecha: "10/03/2026", progreso: 100 },
    ];

    return (
        <div className="space-y-12 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Presupuestos</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Ventas, Propuestas e Inteligencia Artificial</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group flex-1 md:w-64">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                        <input type="text" placeholder="BUSCAR PRESUPUESTO..." className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-100 transition-all outline-none" />
                    </div>
                    <Link to="/presupuestos/new" className="premium-button shadow-blue-500/20 flex items-center gap-3">
                        <Plus size={18} /> Crear Nuevo
                    </Link>
                </div>
            </header>

            <div className="flex items-center gap-4 py-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {["Todos", "Aceptados", "Pendientes", "En Proceso"].map((f) => (
                    <button key={f} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${f === 'Todos' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
                        {f}
                    </button>
                ))}
                <button className="ml-auto p-2 bg-white rounded-xl border border-slate-100 text-slate-300 hover:text-blue-500 transition-colors">
                    <Filter size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {presupuestos.map((p) => (
                    <div key={p.id} className="premium-card group hover:translate-x-1">
                        <div className="flex flex-col lg:flex-row lg:items-center p-8 gap-8">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full">{p.id}</span>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Fecha: {p.fecha}</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase group-hover:text-blue-600 transition-colors truncate">{p.obra}</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                        <span className="text-[10px] font-black">{p.cliente.charAt(0)}</span>
                                    </div>
                                    <p className="font-bold text-sm text-slate-500 uppercase tracking-tight">{p.cliente}</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row lg:items-center gap-10">
                                <div className="space-y-2 lg:text-right">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Importe Total</p>
                                    <p className="text-2xl font-black text-slate-900 tracking-tighter">{p.total.toLocaleString("es-ES")} €</p>
                                </div>

                                <div className="w-40 space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
                                        <span className={p.estado === 'Aceptado' ? 'text-emerald-500' : 'text-amber-500'}>{p.estado}</span>
                                        <span className="text-slate-300">{p.progreso}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${p.estado === 'Aceptado' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${p.progreso}%` }}></div>
                                    </div>
                                </div>

                                <button className="p-4 bg-slate-50 rounded-2xl text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
