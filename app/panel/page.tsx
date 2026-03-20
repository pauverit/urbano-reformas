import { FileText, TrendingUp, Users, Clock } from "lucide-react";

const estadisticas = [
    { nombre: "Presupuestos Activos", valor: "12", icono: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { nombre: "Facturación Mes", valor: "15.420 €", icono: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { nombre: "Equipo en Obra", valor: "6", icono: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { nombre: "Pendientes de Cobro", valor: "3.200 €", icono: Clock, color: "text-orange-600", bg: "bg-orange-50" },
];

export default function PanelPage() {
    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Panel de Control</h1>
                    <p className="text-slate-400 font-semibold mt-1 uppercase text-xs tracking-widest text-blue-500">Gestión Centralizada - Urbano Reformas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {estadisticas.map((stat) => (
                    <div key={stat.nombre} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 group">
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                            <stat.icono size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.nombre}</p>
                            <p className="text-3xl font-black text-slate-900 mt-1">{stat.valor}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
                    <h2 className="text-2xl font-black text-slate-900 mb-8">Obras Recientes</h2>
                    <div className="divide-y divide-slate-50">
                        {[
                            { id: 1, nombre: "Reforma Cocina Calle Mayor", estado: "En curso", fecha: "Hace 2 horas", color: "blue" },
                            { id: 2, nombre: "Baño Completo Urb. El Bosque", estado: "Presupuestado", fecha: "Hace 1 día", color: "slate" },
                            { id: 3, nombre: "Alisado Paredes Chalet Pozuelo", estado: "Terminado", fecha: "Hace 3 días", color: "emerald" },
                        ].map((obra) => (
                            <div key={obra.id} className="flex items-center justify-between py-6 group cursor-pointer">
                                <div>
                                    <p className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{obra.nombre}</p>
                                    <p className="text-sm font-medium text-slate-400">{obra.fecha}</p>
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${obra.color === "blue" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                        obra.color === "emerald" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-100"
                                    }`}>
                                    {obra.estado}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                    <h2 className="text-2xl font-black text-slate-900 mb-8">Agenda del Día</h2>
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300">
                            <Clock size={24} />
                        </div>
                        <p className="text-slate-400 font-bold text-sm px-6">No hay tareas programadas para hoy</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
