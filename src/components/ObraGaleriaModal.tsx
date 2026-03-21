import { useState, useEffect } from "react";
import { obraFotosStore, type ObraFoto } from "../lib/store";
import { X, Camera, Trash2, Loader2, ImagePlus } from "lucide-react";

interface Props {
    presupuestoId: string;
    onClose: () => void;
}

export default function ObraGaleriaModal({ presupuestoId, onClose }: Props) {
    const [fotos, setFotos] = useState<ObraFoto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [subiendo, setSubiendo] = useState(false);
    const [fase, setFase] = useState<'antes' | 'durante' | 'despues'>('durante');

    const cargar = async () => {
        setCargando(true);
        setFotos(await obraFotosStore.getAllByPresupuesto(presupuestoId));
        setCargando(false);
    };

    useEffect(() => {
        cargar();
    }, [presupuestoId]);

    const handleSubirFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSubiendo(true);

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            await obraFotosStore.create({
                presupuesto_id: presupuestoId,
                url: base64,
                titulo: file.name,
                fase: fase,
                fecha: new Date().toLocaleDateString('es-ES')
            });
            await cargar();
            setSubiendo(false);
        };
        reader.readAsDataURL(file);
    };

    const handleEliminar = async (id: string) => {
        if (confirm("¿Estás seguro de que quieres eliminar esta foto?")) {
            await obraFotosStore.remove(id);
            await cargar();
        }
    };

    const agruparPorFase = (f: 'antes' | 'durante' | 'despues') => fotos.filter(foto => foto.fase === f);

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[400] flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
                {/* Cabecera */}
                <div className="p-6 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50/50 gap-4">
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">Galería de la Obra</h3>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sube fotos del progreso</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            value={fase}
                            onChange={e => setFase(e.target.value as any)}
                            className="premium-input bg-white h-full max-w-[140px]"
                        >
                            <option value="antes">Fase: ANTES</option>
                            <option value="durante">Fase: DURANTE</option>
                            <option value="despues">Fase: DESPUÉS</option>
                        </select>
                        <label className="flex-1 sm:flex-none cursor-pointer bg-blue-500 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95">
                            {subiendo ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                            {subiendo ? 'Subiendo...' : 'Capturar'}
                            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleSubirFoto} disabled={subiendo} />
                        </label>
                        <button onClick={onClose} className="p-4 bg-white rounded-2xl text-slate-300 hover:text-red-500 border border-slate-100">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Grid de Fotos */}
                <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-slate-50/30">
                    {cargando ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : fotos.length === 0 ? (
                        <div className="text-center py-20 px-4">
                            <ImagePlus size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-lg font-black text-slate-400 uppercase">Sin fotos todavia</p>
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2 max-w-sm mx-auto">Toma unas fotos del estado inicial para tener el "Antes y Después"</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {['antes', 'durante', 'despues'].map((faseItem) => {
                                const fotosFase = agruparPorFase(faseItem as any);
                                if (fotosFase.length === 0) return null;
                                return (
                                    <div key={faseItem}>
                                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">{fotosFase.length}</span>
                                            Fase {faseItem}
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {fotosFase.map(foto => (
                                                <div key={foto.id} className="relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-105 transition-all border border-slate-100 bg-white">
                                                    <a href={foto.url} target="_blank" rel="noreferrer">
                                                        <img src={foto.url} alt={foto.titulo || 'Foto de obra'} className="w-full aspect-square object-cover" />
                                                    </a>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                        <p className="text-white text-[10px] font-bold tracking-widest uppercase truncate">{foto.fecha}</p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEliminar(foto.id!); }}
                                                        className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all backdrop-blur-md"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
