import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Check, X, RotateCcw } from 'lucide-react';

interface SignaturePadProps {
    onSave: (signature: string) => void;
    onClose: () => void;
}

export default function SignaturePad({ onSave, onClose }: SignaturePadProps) {
    const sigCanvas = useRef<SignatureCanvas>(null);

    const clear = () => sigCanvas.current?.clear();

    const save = () => {
        if (sigCanvas.current?.isEmpty()) return;
        const dataURL = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
        if (dataURL) onSave(dataURL);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Firma Digital</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Validez Legal • Urbano Reformas</p>
                    </div>
                    <button onClick={onClose} className="p-4 bg-white rounded-2xl text-slate-300 hover:text-red-500 transition-all border border-slate-100 shadow-sm overflow-hidden">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 bg-slate-50">
                    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-inner overflow-hidden">
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="#0f172a"
                            canvasProps={{
                                className: "w-full h-80 cursor-crosshair"
                            }}
                        />
                    </div>
                </div>

                <div className="p-8 flex items-center gap-4 bg-white">
                    <button
                        onClick={clear}
                        className="flex-1 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 border border-slate-50"
                    >
                        <RotateCcw size={16} /> Borrar Todo
                    </button>
                    <button
                        onClick={save}
                        className="flex-1 bg-blue-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-95 border-none"
                    >
                        <Check size={16} /> Confirmar Firma
                    </button>
                </div>
            </div>
        </div>
    );
}
