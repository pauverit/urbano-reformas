"use client";
import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Trash2, CheckCircle2 } from "lucide-react";

interface Props {
    onSave: (signature: string) => void;
    onClose: () => void;
}

export default function SignaturePad({ onSave, onClose }: Props) {
    const sigCanvas = useRef<SignatureCanvas>(null);

    const clear = () => {
        sigCanvas.current?.clear();
    };

    const save = () => {
        if (sigCanvas.current?.isEmpty()) return;
        const dataURL = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
        if (dataURL) onSave(dataURL);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Firma Digital</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Firma en el recuadro gris</p>
                    </div>
                    <button onClick={onClose} className="text-slate-300 hover:text-slate-500 font-black uppercase text-[10px] tracking-widest">Cerrar</button>
                </div>

                <div className="p-8 bg-slate-50">
                    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 overflow-hidden touch-none h-64">
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{ className: "w-full h-full cursor-crosshair" }}
                        />
                    </div>
                </div>

                <div className="p-8 flex items-center gap-4">
                    <button
                        onClick={clear}
                        className="flex-1 px-6 py-4 rounded-2xl border border-slate-200 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <Trash2 size={16} /> Limpiar
                    </button>
                    <button
                        onClick={save}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-100 active:scale-95"
                    >
                        <CheckCircle2 size={16} /> Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
