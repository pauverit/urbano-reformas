import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";

export default function AgendaPage() {
    const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const diasCalendario = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className="max-w-7xl mx-auto space-y-12 page-transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Agenda de Obras</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Planificación Semanal y Mensual</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-lg font-black text-slate-900 uppercase">Marzo 2026</h2>
                    <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 premium-card p-1">
                    <div className="grid grid-cols-7 border-b border-slate-50">
                        {dias.map((dia) => (
                            <div key={dia} className="py-6 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">{dia}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-px bg-slate-50">
                        {diasCalendario.map((dia) => (
                            <div key={dia} className={`bg-white h-32 p-4 transition-all hover:bg-slate-50 cursor-pointer group relative ${dia === 20 ? 'ring-2 ring-blue-500 ring-inset z-10' : ''}`}>
                                <span className={`text-xs font-black ${dia === 20 ? 'text-blue-600' : 'text-slate-400'}`}>{dia}</span>
                                {dia === 20 && (
                                    <div className="mt-2 space-y-1">
                                        <div className="bg-blue-600 h-1.5 w-full rounded-full"></div>
                                        <div className="bg-emerald-500 h-1.5 w-2/3 rounded-full"></div>
                                    </div>
                                )}
                                {dia === 15 && (
                                    <div className="mt-2">
                                        <div className="bg-amber-400 h-1.5 w-full rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="premium-card p-8 bg-slate-950 text-white border-none shadow-2xl shadow-slate-100">
                        <h3 className="text-xl font-black uppercase tracking-tight mb-8">Trabajos de Hoy</h3>
                        <div className="space-y-6">
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-blue-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">09:00 - 13:00</span>
                                </div>
                                <p className="font-black text-base uppercase leading-tight">Fontanería Baño</p>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <MapPin size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Calle Mayor 12</span>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Clock size={16} className="text-emerald-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">14:00 - 18:00</span>
                                </div>
                                <p className="font-black text-base uppercase leading-tight">Pintura Cocina</p>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <MapPin size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Urb. El Bosque</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-8 bg-blue-600 text-white border-none flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Próxima Gran Obra</p>
                            <p className="text-xl font-black uppercase leading-tight">Chalé Las Rozas</p>
                            <p className="text-[10px] font-bold mt-2 opacity-50 uppercase tracking-widest">Inicio: 1 de Abril</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <ChevronRight size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
