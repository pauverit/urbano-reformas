import { Wallet, Plus, Download, Share2, CheckCircle2, User, Euro } from "lucide-react";

export default function RecibosPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 page-transition">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">Recibos & Pagos</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Gestión de Cobros y Entregas</p>
                </div>
                <button className="premium-button flex items-center gap-3">
                    <Plus size={18} />
                    <span>Nuevo Recibo</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="premium-card p-10 bg-white border-none shadow-2xl shadow-blue-50">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recibo Reciente</h3>
                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Firmado</span>
                        </div>

                        <div className="space-y-10">
                            <div className="grid grid-cols-2 gap-10">
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">CLIENTE</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                            <User size={18} />
                                        </div>
                                        <p className="font-black text-lg text-slate-800 uppercase tracking-tight leading-none">Juan Pérez</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">CANTIDAD</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                            <Euro size={18} />
                                        </div>
                                        <p className="font-black text-3xl text-slate-900 tracking-tighter leading-none">1.250,00 €</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">CONCEPTO</p>
                                <p className="font-bold text-slate-600 leading-relaxed italic">"Entrega a cuenta para inicio de obra en Cocina - Calle Mayor. Incluye compra de materiales y señales."</p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-50">
                                <button className="w-full sm:w-auto bg-slate-900 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-slate-100">
                                    <Download size={18} /> Descargar PDF
                                </button>
                                <button className="w-full sm:w-auto bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all">
                                    <Share2 size={18} /> Compartir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="premium-card p-10 bg-blue-600 text-white border-none shadow-2xl shadow-blue-100">
                        <h3 className="text-xl font-black uppercase tracking-tight mb-6">Próximos Cobros</h3>
                        <div className="space-y-6">
                            <div className="bg-white/10 p-5 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">Pozuelo - Obra 2</p>
                                <p className="text-lg font-black tracking-tight leading-none">850,00 €</p>
                                <p className="text-[9px] font-bold text-blue-200 mt-2">Vence en 2 días</p>
                            </div>
                            <div className="bg-white/10 p-5 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">Baño El Bosque</p>
                                <p className="text-lg font-black tracking-tight leading-none">2.100,00 €</p>
                                <p className="text-[9px] font-bold text-blue-200 mt-2">Vence mañana</p>
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-8 border-none bg-slate-900 flex flex-col items-center justify-center text-center py-12">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-4 shadow-xl">
                            <CheckCircle2 size={24} />
                        </div>
                        <p className="text-white font-black uppercase text-xs tracking-widest mb-1">Total Recuperado</p>
                        <p className="text-emerald-400 text-3xl font-black tracking-tighter">154.200 €</p>
                        <p className="text-slate-500 text-[9px] font-bold uppercase mt-2 tracking-widest">Año 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
