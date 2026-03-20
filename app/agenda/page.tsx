import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

export default function AgendaPage() {
    const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const diasCalendario = Array.from({ length: 31 }, (_, i) => i + 1);

    const obras = [
        { dia: 15, nombre: "Cocina Calle Mayor", color: "bg-blue-500" },
        { dia: 18, nombre: "Baño El Bosque", color: "bg-emerald-500" },
        { dia: 18, nombre: "Entregas Material", color: "bg-amber-500" },
        { dia: 22, nombre: "Alisado Pozuelo", color: "bg-purple-500" },
    ];

    return (
        <div className="space-y-10 max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Agenda de Obras</h1>
                    <p className="text-slate-400 font-semibold mt-1 uppercase text-xs tracking-widest text-blue-500">Planificación y Cronograma</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><ChevronLeft size={20} /></button>
                    <span className="font-black px-6 text-lg text-slate-700">Marzo 2026</span>
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
                    {dias.map(dia => (
                        <div key={dia} className="py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {dia}
                        </div>
                    ))}
                </div>
                <div className="flex-1 grid grid-cols-7 auto-rows-fr">
                    {diasCalendario.map(dia => {
                        const obrasDelDia = obras.filter(o => o.dia === dia);
                        return (
                            <div key={dia} className="min-h-[140px] p-3 border-r border-b border-slate-50 last:border-r-0 relative hover:bg-slate-50/50 transition-colors group">
                                <span className="text-xs font-black text-slate-300 group-hover:text-blue-400 transition-colors">{dia}</span>
                                <div className="mt-3 space-y-1.5">
                                    {obrasDelDia.map((obra, idx) => (
                                        <div key={idx} className={`${obra.color} text-white text-[9px] p-2 rounded-lg shadow-sm font-black truncate cursor-pointer hover:scale-[1.02] transition-transform uppercase tracking-tighter`}>
                                            {obra.nombre}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
