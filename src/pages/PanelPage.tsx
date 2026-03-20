import {
    Plus,
    Search,
    MapPin,
    Calendar,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PanelPage() {
    const estadisticas = [
        { titulo: "Obras Activas", valor: "12", cambio: "+2", icono: MapPin, color: "bg-blue-500" },
        { titulo: "Presupuestos", valor: "45", cambio: "+8", icono: TrendingUp, color: "bg-emerald-500" },
        { titulo: "Personal", valor: "28", cambio: "0", icono: CheckCircle2, color: "bg-indigo-500" },
        { titulo: "Pendiente", valor: "14k €", cambio: "-5%", icono: AlertCircle, color: "bg-amber-500" },
    ];

    return (
        <div className="space-y-12 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Panel de Control</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Visión General de Urbano Reformas</p>
                </div>
                <Link to="/presupuestos/new" className="premium-button flex items-center gap-3">
                    <Plus size={18} /> Nuevo Presupuesto
                </Link>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {estadisticas.map((stat) => (
                    <div key={stat.titulo} className="premium-card p-8 group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg`}>
                                <stat.icono size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                {stat.cambio}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{stat.titulo}</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.valor}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Obras en Curso</h3>
                        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">Ver todas →</button>
                    </div>

                    {[1, 2, 3].map((i) => (
                        <div key={i} className="premium-card p-8 flex items-center justify-between hover:bg-slate-50 transition-all border-l-4 border-l-blue-500 group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[24px] bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 text-lg uppercase tracking-tight">Reforma Integral Calle Serrano {i}</p>
                                    <div className="flex items-center gap-4 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-500" /> Finaliza en 2 sem.</span>
                                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-emerald-500" /> 75% completado</span>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden sm:block w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-[75%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Agenda Hoy</h3>
                        <Calendar size={20} className="text-slate-300" />
                    </div>
                    <div className="bg-slate-950 p-10 rounded-[40px] text-white space-y-8 shadow-2xl shadow-blue-100/20 border border-slate-800">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative pl-8 border-l-2 border-slate-800 last:mb-0 mb-8 items-start group">
                                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform"></div>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-2">09:30 AM</p>
                                <p className="font-bold text-sm leading-tight text-slate-100 group-hover:text-white transition-colors uppercase">Reunión de Obra: Pintura y Acabados</p>
                                <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Polígono Ind. San Fernando</p>
                            </div>
                        ))}
                        <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">Abrir Agenda Completa</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
