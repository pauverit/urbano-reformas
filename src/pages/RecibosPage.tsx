import { useState } from "react";
import { Receipt, Plus, Download, Share2, Wallet, Users, FileText } from "lucide-react";
import SignaturePad from "../components/SignaturePad";
import { generarPDFRecibo } from "../lib/pdfGenerator";

export default function RecibosPage() {
    const [mostrandoFirma, setMostrandoFirma] = useState(false);
    const [firma, setFirma] = useState<string | null>(null);

    const recibos = [
        { id: "REC-001", cliente: "Ana Martínez", concepto: "Entrega a cuenta Reforma Cocina", total: 1500, fecha: "20/03/2026" },
        { id: "REC-002", cliente: "Juan Pérez", concepto: "Pago Materiales Alisado", total: 450, fecha: "19/03/2026" },
    ];

    const handleSaveFirma = async (signature: string) => {
        setFirma(signature);
        setMostrandoFirma(false);

        const data = {
            cliente: "Ana Martínez",
            concepto: "Entrega a cuenta Reforma Cocina",
            importe: 4500,
            entrega: 1500,
            restante: 3000,
            firma: signature
        };

        const doc = await generarPDFRecibo(data);
        doc.save("recibo-urbano.pdf");
    };

    return (
        <div className="space-y-12 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Recibos</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Gestión de Cobros y Entregas a Cuenta</p>
                </div>
                <button onClick={() => setMostrandoFirma(true)} className="premium-button flex items-center gap-3">
                    <Plus size={18} /> Nuevo Recibo (Firma)
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                    {recibos.map((r) => (
                        <div key={r.id} className="premium-card p-8 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all border-l-4 border-l-emerald-500">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <Receipt size={24} />
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{r.cliente}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.concepto}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-xl font-black text-slate-900 tracking-tighter">{r.total} €</p>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{r.fecha}</p>
                                </div>
                                <button className="p-3 bg-slate-50 rounded-xl text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-all">
                                    <Download size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900 p-10 rounded-[40px] text-white space-y-8 shadow-2xl shadow-blue-100">
                        <div className="flex items-center gap-4 text-blue-400">
                            <Wallet size={32} />
                            <h3 className="text-xl font-black tracking-tight uppercase">Resumen Caja</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Cobrado (Mes)</p>
                                <p className="text-4xl font-black text-white tracking-tighter">8.450 €</p>
                            </div>
                            <div className="pt-6 border-t border-slate-800">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Pendiente de Cobro</p>
                                <p className="text-2xl font-black text-amber-500 tracking-tighter">14.200 €</p>
                            </div>
                        </div>
                        <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-blue-500/20 border-none">Generar Informe Mensual</button>
                    </div>
                </div>
            </div>

            {mostrandoFirma && (
                <SignaturePad onSave={handleSaveFirma} onClose={() => setMostrandoFirma(false)} />
            )}
        </div>
    );
}
