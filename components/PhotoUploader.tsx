"use client";

import { useState } from "react";
import { Upload, Camera, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

interface PhotoUploaderProps {
    onAnalysisComplete: (data: any) => void;
}

export default function PhotoUploader({ onAnalysisComplete }: PhotoUploaderProps) {
    const [cargando, setCargando] = useState(false);
    const [vistaPrevia, setVistaPrevia] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Vista previa
        const reader = new FileReader();
        reader.onloadend = () => setVistaPrevia(reader.result as string);
        reader.readAsDataURL(file);

        // Análisis
        setCargando(true);
        try {
            const base64 = await fileToBase64(file);
            const res = await fetch("/api/analyze-image", {
                method: "POST",
                body: JSON.stringify({
                    image: base64.split(",")[1],
                    mimeType: file.type,
                }),
            });
            const data = await res.json();
            onAnalysisComplete(data);
        } catch (error) {
            console.error("Fallo en el análisis:", error);
        } finally {
            setCargando(false);
        }
    };

    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    return (
        <div className="bg-white p-16 rounded-[40px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center transition-all hover:border-blue-200 group">
            {!vistaPrevia ? (
                <>
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                        <Upload size={40} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Sube una foto o boceto</h3>
                    <p className="text-slate-400 font-bold text-sm mb-10 max-w-sm leading-relaxed">
                        Nuestra IA detectará metros de encimera, puntos de luz y estado de paredes automáticamente.
                    </p>
                    <label className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-blue-100 cursor-pointer active:scale-95">
                        <Camera size={24} />
                        <span className="uppercase tracking-widest text-xs">Seleccionar Imagen</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </>
            ) : (
                <div className="w-full max-w-xl">
                    <div className="relative rounded-[32px] overflow-hidden shadow-2xl mb-8 border-8 border-white">
                        <img src={vistaPrevia} alt="Vista previa" className="w-full h-80 object-cover" />
                        {cargando && (
                            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-10 text-center">
                                <Loader2 className="animate-spin mb-6 text-blue-400" size={56} />
                                <p className="font-black text-xl tracking-tight mb-2 uppercase">Analizando...</p>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Sparkles size={14} className="text-blue-400" /> Ingeniería Visionaria
                                </p>
                            </div>
                        )}
                        {!cargando && (
                            <div className="absolute top-6 right-6 bg-emerald-500 text-white p-3 rounded-2xl shadow-xl animate-in zoom-in-50 duration-500">
                                <CheckCircle2 size={32} />
                            </div>
                        )}
                    </div>
                    {!cargando && (
                        <button
                            onClick={() => { setVistaPrevia(null); }}
                            className="text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition-colors"
                        >
                            Cargar una imagen diferente
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
