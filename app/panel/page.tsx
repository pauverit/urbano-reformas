import {
    TrendingUp,
    Users,
    Clock,
    FileText,
    ArrowUpRight,
    Calendar as CalendarIcon,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

const estadisticas = [
    { nombre: "Presupuestos Activos", valor: "12", cambio: "+2 este mes", icono: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { nombre: "Facturación Mes", valor: "15.420 €", cambio: "+12.5%", icono: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { nombre: "Personal en Obra", valor: "6", cambio: "100% activos", icono: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { nombre: "Pendientes de Cobro", valor: "3.200 €", cambio: "-5% vs mes ant.", icono: Clock, color: "text-amber-600", bg: "bg-amber-50" },
];

const obrasRecientes = [
    { id: 1, cliente: "Reforma Cocina Calle Mayor", fecha: "Hoy, 10:30", estado: "En curso", progreso: 65 },
    { id: 2, cliente: "Baño Completo Urb. El Bosque", fecha: "Ayer, 17:00", estado: "Presupuestado", progreso: 0 },
    { id: 3, cliente: "Alisado Paredes Pozuelo", fecha: "15 Mar", estado: "Terminado", progreso: 100 },
];

export default function PanelPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-12 page-transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Panel de Control</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Gestión Centralizada • Urbano Reformas</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Estado del Sistema</p>
                        <p className="text-xs font-black text-emerald-500 uppercase flex items-center justify-end gap-1">
                            <CheckCircle2 size={12} /> Operativo
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm text-slate-400">
                        <CalendarIcon size={20} />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {estadisticas.map((stat) => (
                    <div key={stat.nombre} className="premium-card p-8 group hover:scale-[1.02] transition-transform">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-colors group-hover:bg-slate-900 group-hover:text-white`}>
                                <stat.icon size={24} />
                            </div>
                            <ArrowUpRight className="text-slate-200 group-hover:text-slate-400 transition-colors" size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.nombre}</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{stat.valor}</h3>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{stat.cambio}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Obras Recientes */}
                <div className="lg:col-span-2 premium-card p-10">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Obras Recientes</h3>
                        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">Ver Todo</button>
                    </div>
                    <div className="space-y-6">
                        {obrasRecientes.map((obra) => (
                            <div key={obra.id} className="group p-6 rounded-[28px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                <div className="flex items-center justify-between gap-6 mb-4">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300 shadow-sm group-hover:border-blue-100 group-hover:text-blue-500 transition-all">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-slate-900 tracking-tight uppercase mb-0.5">{obra.cliente}</p>
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{obra.fecha}</p>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${obra.estado === 'En curso' ? 'bg-blue-50 text-blue-600' :
                                            obra.estado === 'Terminado' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        {obra.estado}
                                    </span>
                                </div>
                                {obra.progreso > 0 && (
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex items-center">
                                        <div
                                            className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${obra.progreso}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notificaciones / Agenda */}
                <div className="premium-card p-10 bg-slate-950 text-white border-none shadow-2xl shadow-blue-100">
                    <h3 className="text-xl font-black tracking-tight uppercase mb-10">Agenda del Día</h3>
                    <div className="space-y-8">
                        <div className="flex gap-6 items-start group cursor-pointer">
                            <div className="flex flex-col items-center">
                                <p className="text-[10px] font-black tracking-widest opacity-50 uppercase">09:00</p>
                                <div className="w-0.5 h-12 bg-white/10 my-2"></div>
                            </div>
                            <div className="pt-0.5">
                                <p className="font-black text-sm uppercase tracking-tight mb-1 group-hover:text-blue-400 transition-colors">Entrega Material</p>
                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Obra Cocina - Azulejos</p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start group cursor-pointer">
                            <div className="flex flex-col items-center">
                                <p className="text-[10px] font-black tracking-widest opacity-50 uppercase">12:30</p>
                                <div className="w-0.5 h-12 bg-white/10 my-2"></div>
                            </div>
                            <div className="pt-0.5">
                                <p className="font-black text-sm uppercase tracking-tight mb-1 group-hover:text-blue-400 transition-colors">Visita Cliente</p>
                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Pozuelo - Firma Pto</p>
                            </div>
                        </div>

                        <div className="bg-white/10 p-6 rounded-3xl border border-white/5 mt-10">
                            <div className="flex items-center gap-4 mb-3">
                                <AlertCircle size={18} className="text-amber-400" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Aviso Urgente</p>
                            </div>
                            <p className="text-xs font-medium leading-relaxed opacity-70">Hay 2 peones sin asignar para la obra de la próxima semana.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
