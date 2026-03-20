"use client";
import { useState, useRef } from "react";
import { Wallet, Plus, Save, Share2, FileText, CheckCircle2 } from "lucide-react";
import SignaturePad from "@/components/SignaturePad";
import { generarPDFRecibo } from "@/lib/pdfGenerator";

export default function RecibosPage() {
    const [paso, setPaso] = useState(1);
    const [datos, setDatos] = useState({ cliente: "", cantidad: 0, concepto: "", firma: "" });
    const [mostrandoFirma, setMostrandoFirma] = useState(false);
    const [pdfGenerado, setPdfGenerado] = useState(false);

    const handleSaveFirma = (signature: string) => {
        setDatos({ ...datos, firma: signature });
        setMostrandoFirma(false);
    };

    const sharePDF = async () => {
        const doc = await generarPDFRecibo(datos);
        const pdfBlob = doc.output("blob");
        const file = new File([pdfBlob], `recibo-${datos.cliente}.pdf`, { type: "application/pdf" });

        if (navigator.share) {
            try {
                await navigator.share({
                    files: [file],
                    title: "Recibo de Pago - Urbano Reformas",
                    text: `Aquí tienes tu recibo por la entrega de ${datos.cantidad} €`,
                });
            } catch (err) {
                doc.save(`recibo-${datos.cliente}.pdf`);
            }
        } else {
            doc.save(`recibo-${datos.cliente}.pdf`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-10 pb-24">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Recibos</h1>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest text-blue-500">Gestión de Cobros y Entregas</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Wallet size={24} />
                </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-8">
                {!pdfGenerado ? (
                    <>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre del Cliente</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Ej: Juan Pérez"
                                    value={datos.cliente}
                                    onChange={(e) => setDatos({ ...datos, cliente: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cantidad (€)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="0.00"
                                        onChange={(e) => setDatos({ ...datos, cantidad: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Concepto</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="Ej: Anticipo Cocina"
                                        value={datos.concepto}
                                        onChange={(e) => setDatos({ ...datos, concepto: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Validación y Firma</label>
                            {datos.firma ? (
                                <div className="relative group cursor-pointer" onClick={() => setMostrandoFirma(true)}>
                                    <img src={datos.firma} alt="Firma" className="w-full h-32 object-contain bg-slate-50 rounded-2xl border border-slate-100" />
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-all flex items-center justify-center">
                                        <span className="opacity-0 group-hover:opacity-100 text-[10px] font-black uppercase text-slate-500">Cambiar Firma</span>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setMostrandoFirma(true)}
                                    className="w-full h-32 flex flex-col items-center justify-center gap-2 border-4 border-dashed border-slate-100 rounded-[32px] text-slate-300 hover:border-blue-200 hover:text-blue-400 transition-all"
                                >
                                    <Plus size={32} />
                                    <span className="font-black uppercase text-[10px] tracking-widest">Pulsar para firmar</span>
                                </button>
                            )}
                        </div>

                        <button
                            disabled={!datos.cliente || !datos.cantidad || !datos.firma}
                            onClick={() => setPdfGenerado(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 text-white p-6 rounded-[32px] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-blue-100 active:scale-95"
                        >
                            Generar Recibo PDF
                        </button>
                    </>
                ) : (
                    <div className="text-center space-y-10 py-6 animate-in zoom-in-95">
                        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto shadow-sm">
                            <CheckCircle2 size={48} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Recibo Listo</h2>
                            <p className="text-slate-400 font-bold text-sm mt-2 uppercase tracking-widest">Documento oficial generado con éxito</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <button
                                onClick={sharePDF}
                                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-[32px] font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-blue-100"
                            >
                                <Share2 size={24} />
                                Compartir / Enviar Copia
                            </button>
                            <button
                                onClick={() => setPdfGenerado(false)}
                                className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors"
                            >
                                Crear otro recibo
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {mostrandoFirma && (
                <SignaturePad onSave={handleSaveFirma} onClose={() => setMostrandoFirma(false)} />
            )}
        </div>
    );
}
