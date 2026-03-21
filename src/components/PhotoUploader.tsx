import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Upload, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';

interface PhotoUploaderProps {
    onAnalysisComplete: (data: any) => void;
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export default function PhotoUploader({ onAnalysisComplete }: PhotoUploaderProps) {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => setImage(reader.result as string);
        reader.readAsDataURL(file);

        setLoading(true);
        try {
            const base64Data = await fileToBase64(file);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            const prompt = `Analiza esta imagen de una estancia en reforma o boceto de obra. 
      Identifica los elementos necesarios para un presupuesto de reforma (metros de pared, puntos de luz, desescombro, etc).
      Devuelve un JSON estrictamente con este formato:
      {
        "items": [
          { "description": "Descripción del trabajo en ESPAÑOL", "quantity": 10, "unit": "m2", "price": 25.50 }
        ],
        "confidence_score": "Alta/Media/Baja"
      }`;

            const result = await model.generateContent([
                prompt,
                { inlineData: { data: base64Data, mimeType: file.type } }
            ]);

            const response = await result.response;
            let text = response.text();
            text = text.replace(/```json|```/g, "").trim();
            const data = JSON.parse(text);
            onAnalysisComplete(data);
        } catch (error) {
            console.error("Error analizando con IA:", error);
        } finally {
            setLoading(false);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div className="premium-card p-10 flex flex-col items-center justify-center text-center gap-8 min-h-[500px] border-2 border-dashed border-blue-100 hover:border-blue-400 transition-all group bg-gradient-to-b from-white to-blue-50/20">
            {!image ? (
                <>
                    <div className="w-24 h-24 bg-blue-600/5 rounded-[32px] flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-blue-50">
                        <Upload size={40} />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Sube una foto u obra</h3>
                        <p className="text-sm text-slate-400 font-bold max-w-sm uppercase tracking-widest leading-relaxed">Nuestra IA analizará metros y materiales al instante para generar el presupuesto.</p>
                    </div>
                    <label className="premium-button cursor-pointer flex items-center gap-3">
                        <ImageIcon size={18} /> Seleccionar Imagen
                        <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
                    </label>
                </>
            ) : (
                <div className="w-full space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="relative w-full aspect-video rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
                        <img src={image} className="w-full h-full object-cover" alt="Previsualización" />
                        {loading && (
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center text-white gap-4">
                                <div className="relative">
                                    <Loader2 className="animate-spin text-blue-400" size={60} />
                                    <Sparkles className="absolute top-0 right-0 text-white animate-pulse" size={24} />
                                </div>
                                <span className="font-black uppercase tracking-[0.3em] text-xs">Cerebro AI Analizando...</span>
                            </div>
                        )}
                    </div>
                    {!loading && (
                        <button onClick={() => setImage(null)} className="text-[10px] font-black uppercase text-slate-300 tracking-widest hover:text-red-500 transition-colors">Eliminar y subir otra</button>
                    )}
                </div>
            )}
        </div>
    );
}
