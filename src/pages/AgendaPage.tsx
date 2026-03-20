import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function AgendaPage() {
    const dias = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"];
    const fechas = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className="space-y-12 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Agenda Obra</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Planificación Semanal de Proyectos</p>
                </div>
                <button className="premium-button flex items-center gap-3">
                    <Plus size={18} /> Agendar Trabajo
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                <div className="lg:col-span-3 premium-card p-10 bg-white">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Marzo 2026</h3>
                        <div className="flex gap-2">
                            <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors border border-slate-100">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors border border-slate-100">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {dias.map(d => (
                            <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest pb-4">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {fechas.map(f => (
                            <div key={f} className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border border-slate-50 transition-all cursor-pointer group ${f === 20 ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-100' : 'hover:bg-slate-50'}`}>
                                <span className={`text-sm font-black ${f === 20 ? 'text-white' : 'text-slate-900'}`}>{f}</span>
                                {f % 5 === 0 && <div className={`w-1 h-1 rounded-full ${f === 20 ? 'bg-white' : 'bg-blue-500'}`}></div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                        <Clock className="text-blue-500" /> Trabajos Hoy
                    </h3>
                    <div className="space-y-6">
                        {[1, 2].map(i => (
                            <div key={i} className="premium-card p-8 border-l-4 border-l-blue-500 bg-slate-950 text-white shadow-2xl">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">09:00 - 14:00</p>
                                <p className="font-bold text-lg leading-tight uppercase mb-4">Fontanería y Desagües: Chalet La Moraleja</p>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">
                                    <MapPin size={12} /> Calle del Nacedero, 12
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
