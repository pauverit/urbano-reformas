import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { clientesStore, articulosStore, presupuestosStore, empresaStore, type Cliente, type Articulo, type LineaPresupuesto, type Empresa, type Presupuesto } from "../lib/store";
import SignaturePad from "../components/SignaturePad";
import { generarPDFPresupuesto } from "../lib/pdfGenerator";
import { Sparkles, Camera, FileText, Plus, Trash2, Share2, CheckCircle2, Save, Loader2, Search, X, Package, Mic, MicOff, ImagePlus } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const DATOS_SIMULACION: LineaPresupuesto[] = [
    { descripcion: "Desmontado de bañera", cantidad: 1, unidad: "ut", precio: 120 },
    { descripcion: "Desmontado de sanitarios", cantidad: 1, unidad: "ut", precio: 80 },
    { descripcion: "Desmontado de azulejos", cantidad: 12, unidad: "m2", precio: 15 },
    { descripcion: "Desmontar suelo cerámico", cantidad: 6, unidad: "m2", precio: 18 },
    { descripcion: "Subir puntos de agua ducha", cantidad: 2, unidad: "ut", precio: 85 },
    { descripcion: "Cambiar puntos de agua lavabo", cantidad: 2, unidad: "ut", precio: 75 },
    { descripcion: "Preparación paredes y suelo plato ducha", cantidad: 1, unidad: "pa", precio: 250 },
    { descripcion: "Colocación plato de ducha", cantidad: 1, unidad: "ut", precio: 180 },
    { descripcion: "Alicatado de paredes", cantidad: 18, unidad: "m2", precio: 35 },
    { descripcion: "Solado del baño", cantidad: 6, unidad: "m2", precio: 38 },
    { descripcion: "Fabricación estanterías pladur", cantidad: 1, unidad: "pa", precio: 320 },
    { descripcion: "Retirada escombro a contenedor", cantidad: 1, unidad: "pa", precio: 180 },
    { descripcion: "Acopio de materiales en planta", cantidad: 1, unidad: "pa", precio: 90 },
];

export default function NuevoPresupuestoPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [modo, setModo] = useState<'elegir' | 'ia' | 'manual'>('elegir');
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const [clienteId, setClienteId] = useState("");
    const [lineas, setLineas] = useState<LineaPresupuesto[]>([]);
    const [notas, setNotas] = useState("Este presupuesto es solo mano de obra y no incluye vicios ocultos.");
    const [mostrandoFirma, setMostrandoFirma] = useState(false);
    const [firmaUrl, setFirmaUrl] = useState<string | null>(null);
    const [finalizado, setFinalizado] = useState(false);
    const [cargandoIA, setCargandoIA] = useState(false);
    const [fotos, setFotos] = useState<{ file: File; preview: string }[]>([]);
    const [mostrarArticulos, setMostrarArticulos] = useState(false);
    const [busquedaArt, setBusquedaArt] = useState("");
    // Audio
    const [grabando, setGrabando] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [tiempoGrabacion, setTiempoGrabacion] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        (async () => {
            setClientes(await clientesStore.getAll());
            setArticulos(await articulosStore.getAll());
            setEmpresa(await empresaStore.get());

            if (id) {
                const p = await presupuestosStore.getById(id);
                if (p) {
                    setClienteId(p.cliente_id);
                    setLineas(p.lineas || []);
                    setNotas(p.notas || "");
                    setFirmaUrl(p.firma_url || null);
                    setModo('manual');
                }
            }
        })();
    }, [id]);

    const subtotal = lineas.reduce((s, l) => s + l.cantidad * l.precio, 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    const addLinea = () => setLineas([...lineas, { descripcion: "", cantidad: 1, unidad: "ut", precio: 0 }]);
    const removeLinea = (i: number) => setLineas(lineas.filter((_, idx) => idx !== i));
    const updateLinea = (i: number, field: string, value: any) => { const n = [...lineas]; n[i] = { ...n[i], [field]: value }; setLineas(n); };
    const addDesdeArticulo = (art: Articulo) => { setLineas([...lineas, { descripcion: art.descripcion, cantidad: 1, unidad: art.unidad, precio: Number(art.precio) }]); setMostrarArticulos(false); };

    // --- Multi-foto ---
    const addFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setFotos(prev => [...prev, { file, preview: reader.result as string }]);
            reader.readAsDataURL(file);
        });
    };
    const removeFoto = (i: number) => setFotos(fotos.filter((_, idx) => idx !== i));

    // --- Audio ---
    const iniciarGrabacion = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            chunksRef.current = [];
            recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
            recorder.onstop = () => { setAudioBlob(new Blob(chunksRef.current, { type: 'audio/webm' })); stream.getTracks().forEach(t => t.stop()); };
            recorder.start();
            mediaRecorderRef.current = recorder;
            setGrabando(true);
            setTiempoGrabacion(0);
            timerRef.current = setInterval(() => setTiempoGrabacion(t => t + 1), 1000);
        } catch { alert('No se pudo acceder al micrófono'); }
    };
    const pararGrabacion = () => {
        mediaRecorderRef.current?.stop();
        setGrabando(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };
    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    // --- Analizar con IA ---
    const [errorIA, setErrorIA] = useState<string | null>(null);

    const analizarConIA = async () => {
        if (fotos.length === 0 && !audioBlob) return;
        setErrorIA(null);
        setCargandoIA(true);

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey || apiKey.trim() === '') {
            setCargandoIA(false);
            setErrorIA('⚠️ Falta la API Key de Gemini. Ve a .env y añade VITE_GEMINI_API_KEY=tu_clave. Puedes obtenerla gratis en https://aistudio.google.com/apikey');
            return;
        }

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const parts: any[] = [
                `Eres un experto profesional en reformas integrales de viviendas en España con 20 años de experiencia.

ANALIZA CUIDADOSAMENTE lo que ves en las imágenes y/o lo que se dice en el audio. Presta atención a:
- Qué estancias se ven (baño, cocina, salón, habitación, terraza...)
- Estado actual (quitar bañera, cambiar azulejos, pintar, suelo, tabiques...)
- Lo que el cliente pide en el audio (si lo hay)
- Medidas aproximadas si se pueden estimar

BASE DE DATOS DE ARTÍCULOS EXISTENTES DEL CLIENTE:
${JSON.stringify(articulos.map(a => ({ descripcion: a.descripcion, precio: a.precio, unidad: a.unidad })))}

INSTRUCCIÓN VITAL: Genera un presupuesto detallado con partidas necesarias. 
Si algún trabajo coincide con un artículo de tu "BASE DE DATOS DE ARTÍCULOS", es OBLIGATORIO usar EXACTAMENTE esa "descripcion", "precio" y "unidad".
SI el trabajo no está en la base de datos, inventa tú uno realista (descripcion en MAYÚSCULAS) con precios de mercado español actuales.

Responde EXCLUSIVAMENTE con un JSON válido, sin texto adicional, sin markdown:
{"items":[{"descripcion":"DESCRIPCIÓN CLARA EN MAYÚSCULAS","cantidad":1,"unidad":"m2","precio":25.50}]}

Unidades válidas: m2, ml, ut, pa, kg, h.`
            ];

            // Añadir fotos
            for (const foto of fotos) {
                const base64 = await new Promise<string>((resolve, reject) => {
                    const r = new FileReader();
                    r.readAsDataURL(foto.file);
                    r.onload = () => resolve((r.result as string).split(',')[1]);
                    r.onerror = reject;
                });
                parts.push({ inlineData: { data: base64, mimeType: foto.file.type } });
            }

            // Añadir audio
            if (audioBlob) {
                const audioBase64 = await new Promise<string>((resolve, reject) => {
                    const r = new FileReader();
                    r.readAsDataURL(audioBlob);
                    r.onload = () => resolve((r.result as string).split(',')[1]);
                    r.onerror = reject;
                });
                parts.push({ inlineData: { data: audioBase64, mimeType: audioBlob.type || 'audio/webm' } });
            }

            console.log('🤖 Enviando a Gemini:', fotos.length, 'fotos', audioBlob ? '+ audio' : '');
            const result = await model.generateContent(parts);
            const response = await result.response;
            const text = response.text();
            console.log('🤖 Respuesta Gemini:', text);

            // Limpiar respuesta de posibles wrappers markdown
            const cleanedText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            const data = JSON.parse(cleanedText);

            if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
                throw new Error('La IA no generó líneas de presupuesto válidas');
            }

            setLineas(data.items.map((it: any) => ({
                descripcion: (it.descripcion || it.description || '').toString(),
                cantidad: Number(it.cantidad || it.quantity) || 1,
                unidad: (it.unidad || it.unit || 'ut').toString(),
                precio: Number(it.precio || it.price) || 0,
            })));

        } catch (err: any) {
            console.error("❌ Error IA:", err);
            const msg = err?.message || String(err);
            if (msg.includes('API_KEY') || msg.includes('401') || msg.includes('403')) {
                setErrorIA('❌ API Key de Gemini inválida o sin permisos. Revisa tu clave en .env');
            } else if (msg.includes('quota') || msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
                setErrorIA('⏳ Has superado el límite gratuito de Gemini. Revisa AI Studio o tu cuota.');
            } else if (msg.includes('JSON') || msg.includes('parse')) {
                setErrorIA('❌ Gemini respondió pero no en formato válido. Inténtalo de nuevo.');
            } else if (msg.includes('SAFETY') || msg.includes('blocked')) {
                setErrorIA('❌ Gemini bloqueó la respuesta por seguridad. Prueba con otra foto.');
            } else {
                setErrorIA(`❌ Error: ${msg}`);
            }
        }
        setCargandoIA(false);
    };


    const guardar = async (estado: 'borrador' | 'enviado' = 'borrador') => {
        if (!clienteId || lineas.length === 0) return;
        if (id) {
            await presupuestosStore.update(id, { cliente_id: clienteId, subtotal, iva, total, estado, firma_url: firmaUrl || undefined, notas, lineas } as any);
        } else {
            await presupuestosStore.create({ fecha: new Date().toLocaleDateString('es-ES'), cliente_id: clienteId, subtotal, iva, total, estado, firma_url: firmaUrl || undefined, notas }, lineas);
        }
        navigate("/presupuestos");
    };

    const generarPDF = async () => {
        const cliente = await clientesStore.getById(clienteId);
        const doc = await generarPDFPresupuesto({ empresa: empresa || undefined, cliente: cliente || undefined, items: lineas.map(l => ({ description: l.descripcion, quantity: l.cantidad, unit: l.unidad, price: l.precio })), total: subtotal, firma: firmaUrl || undefined });
        doc.save("presupuesto-urbano.pdf");
        setFinalizado(true);
    };

    // --- PANTALLA: Elegir modo ---
    if (modo === 'elegir') {
        return (
            <div className="max-w-4xl mx-auto space-y-12 page-transition">
                <div><h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">{id ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}</h1><p className="text-blue-500 font-bold uppercase text-[9px] tracking-widest italic mt-2">Elige cómo {id ? 'actualizar' : 'crear'} tu presupuesto</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button onClick={() => setModo('manual')} className="premium-card p-4 md:p-6 md:p-12 text-left hover:bg-slate-950 group transition-all duration-500 border-2 border-transparent hover:border-blue-500">
                        <FileText size={48} className="text-blue-500 mb-8 group-hover:text-blue-400" />
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-white transition-colors mb-3">Manual</h3>
                        <p className="text-[13px] font-bold text-slate-400 group-hover:text-slate-300 uppercase tracking-widest leading-relaxed">Añade líneas del catálogo o escribe libremente.</p>
                    </button>
                    <button onClick={() => setModo('ia')} className="premium-card p-4 md:p-6 md:p-12 text-left hover:bg-blue-600 group transition-all duration-500 border-2 border-transparent hover:border-blue-300 bg-gradient-to-br from-blue-50 to-white">
                        <Camera size={48} className="text-blue-600 mb-8 group-hover:text-white" />
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-white transition-colors mb-3">Con Fotos + Audio (IA)</h3>
                        <p className="text-[13px] font-bold text-slate-400 group-hover:text-blue-100 uppercase tracking-widest leading-relaxed">Sube varias fotos y graba las instrucciones del cliente.</p>
                    </button>
                </div>
            </div>
        );
    }

    // --- PANTALLA: IA (subir fotos + grabar audio) ---
    if (modo === 'ia' && lineas.length === 0 && !cargandoIA) {
        return (
            <div className="max-w-4xl mx-auto space-y-10 page-transition">
                <div className="flex items-center justify-between">
                    <div><h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">Presupuesto con IA</h1><p className="text-blue-500 font-bold uppercase text-[9px] tracking-widest italic mt-2">Fotos + audio = presupuesto automático</p></div>
                    <button onClick={() => { setModo('elegir'); setFotos([]); setAudioBlob(null); }} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500">← Volver</button>
                </div>

                {/* FOTOS */}
                <div className="premium-card p-5 md:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3"><Camera size={20} className="text-blue-500" /><h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Fotos de la Obra</h3></div>
                        <label className="px-5 py-3 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-blue-100 transition-all flex items-center gap-2"><ImagePlus size={16} /> Añadir Fotos<input type="file" accept="image/*" multiple className="hidden" onChange={addFotos} /></label>
                    </div>
                    {fotos.length === 0 ? (
                        <label className="block border-2 border-dashed border-blue-200 rounded-3xl p-8 md:p-16 text-center cursor-pointer hover:border-blue-500 transition-all bg-gradient-to-b from-white to-blue-50/30">
                            <Camera size={48} className="mx-auto text-blue-300 mb-4" />
                            <p className="text-xl font-black text-slate-900 uppercase mb-1">Sube fotos</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Estancias, bocetos o presupuestos escritos a mano</p>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={addFotos} />
                        </label>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {fotos.map((f, i) => (
                                <div key={i} className="relative group">
                                    <img src={f.preview} className="w-full aspect-square object-cover rounded-2xl border-2 border-white shadow-lg" alt="" />
                                    <button onClick={() => removeFoto(i)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* AUDIO */}
                <div className="premium-card p-5 md:p-8 space-y-6">
                    <div className="flex items-center gap-3"><Mic size={20} className="text-emerald-500" /><h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Grabación de Voz</h3></div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Explica lo que el cliente necesita. La IA lo interpretará junto con las fotos.</p>
                    <div className="flex items-center gap-6">
                        {!grabando ? (
                            <button onClick={iniciarGrabacion} className="flex items-center gap-3 px-8 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all border-none">
                                <Mic size={20} /> {audioBlob ? 'Grabar de nuevo' : 'Iniciar Grabación'}
                            </button>
                        ) : (
                            <button onClick={pararGrabacion} className="flex items-center gap-3 px-8 py-5 bg-red-500 text-white rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-xl shadow-red-100 hover:bg-red-600 active:scale-95 transition-all animate-pulse border-none">
                                <MicOff size={20} /> Parar ({formatTime(tiempoGrabacion)})
                            </button>
                        )}
                        {audioBlob && !grabando && (
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Audio grabado ({formatTime(tiempoGrabacion)})</span>
                                <audio controls src={URL.createObjectURL(audioBlob)} className="h-10" />
                            </div>
                        )}
                    </div>
                </div>

                {/* ERROR */}
                {errorIA && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-4 md:p-6 flex items-start gap-4">
                        <span className="text-2xl">🚨</span>
                        <div>
                            <p className="font-black text-red-700 text-[13px] uppercase tracking-tight mb-1">Error de IA</p>
                            <p className="text-red-600 text-[13px] font-bold">{errorIA}</p>
                        </div>
                    </div>
                )}

                {/* BOTÓN ANALIZAR */}
                <button onClick={analizarConIA} disabled={fotos.length === 0 && !audioBlob} className="w-full bg-blue-600 text-white p-5 md:p-8 rounded-[32px] flex items-center justify-center gap-4 font-black uppercase text-[13px] tracking-widest shadow-2xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed border-none">
                    <Sparkles size={24} /> Analizar con IA ({fotos.length} foto{fotos.length !== 1 && 's'}{audioBlob ? ' + audio' : ''})
                </button>
            </div>
        );
    }

    // --- PANTALLA: IA analizando ---
    if (cargandoIA) {
        return (
            <div className="max-w-4xl mx-auto page-transition">
                <div className="premium-card p-10 md:p-20 flex flex-col items-center justify-center text-center gap-8 bg-white border-slate-100">
                    {fotos.length > 0 && <div className="flex gap-3 justify-center flex-wrap">{fotos.slice(0, 4).map((f, i) => <img key={i} src={f.preview} className="w-24 h-24 rounded-2xl object-cover shadow-lg border-4 border-white" alt="" />)}</div>}

                    <div className="relative flex justify-center items-center py-4">
                        <img src="/metallica.png" alt="Analizando" className="h-16 md:h-20 object-contain opacity-80" />
                        <Loader2 className="absolute -right-12 animate-spin text-slate-300" size={28} />
                        <Sparkles className="absolute -top-4 -right-4 text-slate-300 animate-pulse" size={20} />
                    </div>

                    <div className="space-y-3 relative z-10 w-full max-w-md">
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Cerebro IA Analizando...</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{fotos.length} foto{fotos.length !== 1 && 's'}{audioBlob ? ' + grabación de voz' : ''} — Procesando información</p>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-6">
                            <div className="bg-slate-800 h-full rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- PANTALLA: Editor de líneas (común a IA y Manual) ---
    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-24 page-transition">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">{id ? 'Editar Presupuesto' : modo === 'ia' ? 'Presupuesto IA' : 'Nuevo Presupuesto'}</h1>
                    <p className="text-blue-500 font-bold uppercase text-[9px] tracking-widest italic mt-2">Edita las líneas y asigna un cliente</p>
                </div>
                <button onClick={() => { setModo('elegir'); setLineas([]); setFotos([]); setAudioBlob(null); }} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500">← Empezar de nuevo</button>
            </div>
            {modo === 'ia' && <div className="bg-emerald-500 text-white p-4 md:p-6 rounded-3xl flex items-center gap-4 shadow-xl"><Sparkles size={24} className="text-emerald-200" /><span className="font-black uppercase tracking-[0.15em] text-[9px]">IA completado — {lineas.length} líneas detectadas</span></div>}

            <div className="premium-card p-8">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Cliente *</label>
                <select value={clienteId} onChange={e => setClienteId(e.target.value)} className="premium-input">
                    <option value="">-- Seleccionar cliente --</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.nif || "Sin NIF"})</option>)}
                </select>
            </div>

            <div className="premium-card overflow-hidden">
                <div className="p-4 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Detalle del Presupuesto</h3>
                    <div className="flex gap-3">
                        <button onClick={() => setMostrarArticulos(true)} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 hover:border-blue-200 transition-all flex items-center gap-2"><Package size={14} /> Del Catálogo</button>
                        <button onClick={addLinea} className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all"><Plus size={20} /></button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead><tr className="bg-slate-50/80 text-[10px] uppercase tracking-[0.15em] font-black text-slate-400 border-b border-slate-100"><th className="px-5 py-3 w-1/2">Descripción</th><th className="px-3 py-3 text-center">Cant.</th><th className="px-3 py-3 text-center">Ud.</th><th className="px-3 py-3 text-right">Precio</th><th className="px-3 py-3 text-right">Total</th><th className="px-3 py-3"></th></tr></thead>
                        <tbody className="divide-y divide-slate-50 text-[12px] font-bold text-slate-700 bg-white">
                            {lineas.map((l, i) => (
                                <tr key={i} className="hover:bg-blue-50/20 transition-colors group">
                                    <td className="px-5 py-2">
                                        <input value={l.descripcion} onChange={e => updateLinea(i, 'descripcion', e.target.value)} className="bg-transparent border border-transparent hover:border-slate-200 focus:border-blue-400 p-1.5 focus:ring-0 w-full text-slate-900 font-bold uppercase text-[12px] rounded transition-colors" placeholder="Descripción" />
                                    </td>
                                    <td className="px-3 py-2">
                                        <input type="number" value={l.cantidad} onChange={e => updateLinea(i, 'cantidad', parseFloat(e.target.value) || 0)} className="bg-transparent border border-transparent hover:border-slate-200 focus:border-blue-400 p-1.5 focus:ring-0 w-16 text-center text-[12px] rounded transition-colors" />
                                    </td>
                                    <td className="px-3 py-2">
                                        <select value={l.unidad} onChange={e => updateLinea(i, 'unidad', e.target.value)} className="bg-transparent border border-transparent hover:border-slate-200 focus:border-blue-400 p-1.5 focus:ring-0 text-center text-[10px] font-black uppercase text-slate-400 rounded transition-colors cursor-pointer"><option value="ut">ut</option><option value="m2">m²</option><option value="ml">ml</option><option value="m3">m³</option><option value="kg">kg</option><option value="h">h</option><option value="pa">pa</option></select>
                                    </td>
                                    <td className="px-3 py-2">
                                        <input type="number" step="0.01" value={l.precio} onChange={e => updateLinea(i, 'precio', parseFloat(e.target.value) || 0)} className="bg-transparent border border-transparent hover:border-slate-200 focus:border-blue-400 p-1.5 focus:ring-0 w-24 text-right text-[12px] rounded transition-colors" />
                                    </td>
                                    <td className="px-3 py-2 text-right font-black text-slate-900 text-[13px]">{(l.cantidad * l.precio).toFixed(2)} €</td>
                                    <td className="px-3 py-2 text-right">
                                        <button onClick={() => removeLinea(i)} title="Eliminar línea" className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-40 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-slate-50/50 p-4 md:p-6 space-y-3 border-t border-slate-100">
                    <div className="flex justify-between text-[13px] font-bold text-slate-500 uppercase tracking-widest"><span>Base Imponible</span><span>{subtotal.toFixed(2)} €</span></div>
                    <div className="flex justify-between text-[13px] font-bold text-slate-500 uppercase tracking-widest"><span>IVA (21%)</span><span>{iva.toFixed(2)} €</span></div>
                    <div className="flex justify-between text-xl font-black text-slate-900 uppercase tracking-tight pt-3 border-t border-slate-200"><span>Total</span><span>{total.toFixed(2)} €</span></div>
                </div>
            </div>

            <div className="premium-card p-8"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Notas / Condiciones</label><textarea value={notas} onChange={e => setNotas(e.target.value)} rows={3} className="premium-input resize-none" /></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => guardar('borrador')} className="premium-card p-5 md:p-8 flex items-center justify-center gap-3 text-slate-600 hover:bg-slate-50 transition-all font-black uppercase text-[9px] tracking-widest"><Save size={20} /> {id ? 'Actualizar' : 'Guardar Borrador'}</button>
                <button onClick={() => setMostrandoFirma(true)} className="premium-card p-5 md:p-8 flex items-center justify-center gap-3 text-blue-600 hover:bg-blue-50 transition-all font-black uppercase text-[9px] tracking-widest border-2 border-blue-100"><FileText size={20} /> {firmaUrl ? '✓ Firmado' : 'Firmar'}</button>
                <button onClick={generarPDF} className="bg-blue-600 text-white p-5 md:p-8 rounded-[32px] flex items-center justify-center gap-3 font-black uppercase text-[9px] tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"><Share2 size={20} /> Generar PDF</button>
            </div>

            {mostrandoFirma && <SignaturePad onSave={s => { setFirmaUrl(s); setMostrandoFirma(false); }} onClose={() => setMostrandoFirma(false)} />}
            {mostrarArticulos && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[300] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                        <div className="p-4 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50"><h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Añadir del Catálogo</h3><button onClick={() => setMostrarArticulos(false)} className="p-3 bg-white rounded-xl text-slate-300 hover:text-red-500 border border-slate-100"><X size={18} /></button></div>
                        <div className="p-4 border-b border-slate-50"><div className="relative"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" /><input value={busquedaArt} onChange={e => setBusquedaArt(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-[9px] font-black uppercase tracking-widest outline-none" placeholder="Buscar..." /></div></div>
                        <div className="overflow-y-auto flex-1 p-4 space-y-2">
                            {articulos.filter(a => a.descripcion.toLowerCase().includes(busquedaArt.toLowerCase())).map(a => (
                                <button key={a.id} onClick={() => addDesdeArticulo(a)} className="w-full text-left p-4 rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-between group">
                                    <div><p className="font-bold text-[13px] text-slate-900 uppercase">{a.descripcion}</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{a.unidad} — {Number(a.precio).toFixed(2)} €</p></div>
                                    <Plus size={18} className="text-slate-200 group-hover:text-blue-500" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {finalizado && (
                <div className="fixed inset-0 bg-emerald-500/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center text-white p-10 text-center space-y-8">
                    <div className="w-32 h-32 bg-white text-emerald-500 rounded-[48px] flex items-center justify-center shadow-2xl animate-bounce"><CheckCircle2 size={64} strokeWidth={2.5} /></div>
                    <h2 className="text-5xl font-black tracking-tighter uppercase">¡PDF Generado!</h2>
                    <button onClick={() => guardar('enviado')} className="bg-white text-emerald-600 px-10 py-5 rounded-3xl font-black uppercase text-[9px] tracking-widest shadow-xl">Guardar y Volver</button>
                </div>
            )}
        </div>
    );
}
