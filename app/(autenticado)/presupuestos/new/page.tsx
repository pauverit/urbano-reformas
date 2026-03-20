"use client";
import React, { useState } from "react";
import PhotoUploader from "@/components/PhotoUploader";
import BudgetTable from "@/components/BudgetTable";
import SignaturePad from "@/components/SignaturePad";
import { Sparkles, Info, FileText, Share2, CheckCircle2 } from "lucide-react";
import { generarPDFPresupuesto } from "@/lib/pdfGenerator";

export default function NuevoPresupuestoPage() {
    const [datosAnalisis, setDatosAnalisis] = useState<any | null>(null);
    const [mostrandoFirma, setMostrandoFirma] = useState(false);
    const [firmaCliente, setFirmaCliente] = useState<string | null>(null);
    const [presupuestoFinalizado, setPresupuestoFinalizado] = useState(false);

    const handleAnalisisCompleto = (data: any) => {
        setDatosAnalisis(data);
    };

    const handleSaveFirma = (signature: string) => {
        setFirmaCliente(signature);
        setMostrandoFirma(false);
    };

    const finalizarYCompartir = async () => {
        const data = {
            cliente: "Cliente Solicitante",
            items: datosAnalisis.items,
            total: datosAnalisis.items.reduce((sum: number, it: any) => sum + (it.quantity * it.price), 0),
            firma: firmaCliente || undefined
        };

        const doc = await generarPDFPresupuesto(data);
        const pdfBlob = doc.output("blob");
        const file = new File([pdfBlob], "presupuesto-urbano.pdf", { type: "application/pdf" });

        if (navigator.share) {
            try {
                await navigator.share({
                    files: [file],
                    title: "Presupuesto Urbano Reformas",
                    text: "Adjuntamos el presupuesto solicitado para su reforma.",
                });
            } catch (err) {
                doc.save("presupuesto-urbano.pdf");
            }
        } else {
            doc.save("presupuesto-urbano.pdf");
        }
        setPresupuestoFinalizado(true);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Nuevo Presupuesto</h1>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest text-blue-500">Inteligencia Artificial aplicada a la Reforma</p>
            </div>

            {!datosAnalisis ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    <div className="lg:col-span-2">
                        <PhotoUploader onAnalysisComplete={handleAnalisisCompleto} />
                    </div>
                    <div className="space-y-8">
                        <div className="bg-blue-600 p-10 rounded-3xl text-white border-none shadow-2xl shadow-blue-100 flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <Sparkles size={28} />
                                </div>
                                <h3 className="font-black text-xl tracking-tight">IA de Visión</h3>
                            </div>
                            <p className="text-blue-100 text-sm leading-relaxed font-medium">
                                Sube una foto de la estancia o un boceto de obra. Nuestra IA identificará metros, puntos de luz y estado de paredes al instante.
                            </p>
                            <ul className="text-[10px] text-blue-200 space-y-3 font-black uppercase tracking-widest">
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> Encimeras y paramentos</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> Puntos eléctricos y fontanería</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-white rounded-full"></div> Estado y alisado de paredes</li>
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-blue-50">
                            <div className="flex gap-4">
                                <Info size={24} className="text-blue-500 shrink-0" />
                                <p className="text-xs text-slate-500 font-bold leading-relaxed italic">
                                    "El ojo del profesional pone el 10% final. Revisa los datos detectados por la IA antes de confirmar."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="bg-emerald-500 text-white p-6 rounded-3xl flex items-center justify-between shadow-xl shadow-emerald-50 border-none">
                        <div className="flex items-center gap-4">
                            <Sparkles size={24} className="text-emerald-200" />
                            <span className="font-black uppercase tracking-[0.2em] text-xs">Análisis con Gemini 1.5 Flash Completado</span>
                        </div>
                        <div className="px-4 py-1.5 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest">
                            Confianza: {datosAnalisis.confidence_score || "Alta"}
                        </div>
                    </div>

                    <BudgetTable initialItems={datosAnalisis.items || []} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Firma de Conformidad</h3>
                            {firmaCliente ? (
                                <div className="relative border-4 border-dashed border-emerald-100 rounded-3xl p-4 bg-emerald-50/30 overflow-hidden">
                                    <img src={firmaCliente} alt="Firma" className="h-40 mx-auto object-contain" />
                                    <button
                                        onClick={() => setMostrandoFirma(true)}
                                        className="absolute top-4 right-4 text-[10px] font-black uppercase text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm"
                                    >
                                        Cambiar
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setMostrandoFirma(true)}
                                    className="w-full h-48 border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center gap-3 text-slate-300 hover:border-blue-200 hover:text-blue-500 transition-all group"
                                >
                                    <div className="p-4 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors">
                                        <FileText size={32} />
                                    </div>
                                    <span className="font-black uppercase text-xs tracking-widest">Pulsar para firmar en pantalla</span>
                                </button>
                            )}
                        </div>

                        <div className="bg-blue-600 p-10 rounded-[40px] shadow-2xl shadow-blue-100 flex flex-col justify-center text-center space-y-6 text-white">
                            <h3 className="text-2xl font-black tracking-tight">¿Todo listo?</h3>
                            <p className="text-blue-100 text-sm font-medium">Genera el PDF oficial con la firma del cliente y compártelo al instante.</p>
                            <button
                                onClick={finalizarYCompartir}
                                className="w-full bg-white text-blue-600 p-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-3"
                            >
                                <Share2 size={24} />
                                Generar y Enviar PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mostrandoFirma && (
                <SignaturePad onSave={handleSaveFirma} onClose={() => setMostrandoFirma(false)} />
            )}

            {presupuestoFinalizado && (
                <div className="fixed inset-0 bg-emerald-500/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center text-white p-10 text-center space-y-8 animate-in fade-in duration-500">
                    <div className="w-32 h-32 bg-white text-emerald-500 rounded-[48px] flex items-center justify-center shadow-2xl animate-bounce">
                        <CheckCircle2 size={64} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter">¡Presupuesto Enviado!</h2>
                    <p className="max-w-md text-emerald-100 font-bold text-lg">El documento PDF ha sido generado y compartido correctamente.</p>
                    <button
                        onClick={() => window.location.href = "/panel"}
                        className="bg-white text-emerald-600 px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl"
                    >
                        Volver al Panel
                    </button>
                </div>
            )}
        </div>
    );
}
