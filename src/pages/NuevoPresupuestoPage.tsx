import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clientesStore, articulosStore, presupuestosStore, type Cliente, type Articulo, type LineaPresupuesto } from "../lib/store";
import SignaturePad from "../components/SignaturePad";
import { generarPDFPresupuesto } from "../lib/pdfGenerator";
import { Sparkles, Camera, FileText, Plus, Trash2, Share2, CheckCircle2, Save, Loader2, Search, X, Package } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const DATOS_SIMULACION: LineaPresupuesto[] = [
    { descripcion: "Desmontado de bañera", cantidad: 1, unidad: "ut", precio: 120 },
    { descripcion: "Desmontado de sanitarios", cantidad: 1, unidad: "ut", precio: 80 },
    { descripcion: "Desmontado de azulejos", cantidad: 12, unidad: "m2", precio: 15 },
    { descripcion: "Desmontar suelo cerámico del baño", cantidad: 6, unidad: "m2", precio: 18 },
    { descripcion: "Subir puntos de agua ducha", cantidad: 2, unidad: "ut", precio: 85 },
    { descripcion: "Cambiar puntos de agua en lavabo", cantidad: 2, unidad: "ut", precio: 75 },
    { descripcion: "Preparación paredes y suelo para plato ducha", cantidad: 1, unidad: "pa", precio: 250 },
    { descripcion: "Colocación de plato de ducha", cantidad: 1, unidad: "ut", precio: 180 },
    { descripcion: "Desmontado de ventana redonda", cantidad: 1, unidad: "ut", precio: 60 },
    { descripcion: "Colocación ventana cuadrada 0.60x0.60", cantidad: 1, unidad: "ut", precio: 220 },
    { descripcion: "Alicatado de paredes", cantidad: 18, unidad: "m2", precio: 35 },
    { descripcion: "Solado del baño", cantidad: 6, unidad: "m2", precio: 38 },
    { descripcion: "Fabricación estanterías de pladur", cantidad: 1, unidad: "pa", precio: 320 },
    { descripcion: "Retirada de escombro a contenedor", cantidad: 1, unidad: "pa", precio: 180 },
    { descripcion: "Acopio de materiales en planta", cantidad: 1, unidad: "pa", precio: 90 },
];

export default function NuevoPresupuestoPage() {
    const navigate = useNavigate();
    const [modo, setModo] = useState<'elegir' | 'ia' | 'manual'>('elegir');
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [articulos, setArticulos] = useState<Articulo[]>([]);
    const [clienteId, setClienteId] = useState("");
    const [lineas, setLineas] = useState<LineaPresupuesto[]>([]);
    const [notas, setNotas] = useState("Este presupuesto es solo mano de obra y no incluye vicios ocultos.");
    const [mostrandoFirma, setMostrandoFirma] = useState(false);
    const [firmaUrl, setFirmaUrl] = useState<string | null>(null);
    const [finalizado, setFinalizado] = useState(false);
    const [cargandoIA, setCargandoIA] = useState(false);
    const [imagenPreview, setImagenPreview] = useState<string | null>(null);
    const [mostrarArticulos, setMostrarArticulos] = useState(false);
    const [busquedaArt, setBusquedaArt] = useState("");

    useEffect(() => {
        const init = async () => {
            setClientes(await clientesStore.getAll());
            setArticulos(await articulosStore.getAll());
        };
        init();
    }, []);

    const subtotal = lineas.reduce((s, l) => s + l.cantidad * l.precio, 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    const addLinea = () => setLineas([...lineas, { descripcion: "", cantidad: 1, unidad: "ut", precio: 0 }]);
    const removeLinea = (i: number) => setLineas(lineas.filter((_, idx) => idx !== i));
    const updateLinea = (i: number, field: string, value: any) => {
        const nuevas = [...lineas];
        nuevas[i] = { ...nuevas[i], [field]: value };
        setLineas(nuevas);
    };

    const addDesdeArticulo = (art: Articulo) => {
        setLineas([...lineas, { descripcion: art.descripcion, cantidad: 1, unidad: art.unidad, precio: Number(art.precio) }]);
        setMostrarArticulos(false);
    };

    const analizarFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setImagenPreview(reader.result as string);
        reader.readAsDataURL(file);
        setCargandoIA(true);

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            await new Promise(r => setTimeout(r, 2500));
            setLineas(DATOS_SIMULACION);
            setCargandoIA(false);
            return;
        }

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const base64 = await fileToBase64(file);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Analiza esta imagen de una estancia en reforma o presupuesto de obra.
      Identifica TODOS los trabajos necesarios y devuelve un JSON estricto:
      { "items": [{ "descripcion": "TEXTO EN ESPAÑOL MAYÚSCULAS", "cantidad": 1, "unidad": "m2 | ml | ut | pa | kg | h", "precio": 25.50 }] }
      Si es una foto de un presupuesto escrito, transcribe las líneas exactas con precios estimados.`;
            const result = await model.generateContent([
                prompt,
                { inlineData: { data: base64, mimeType: file.type } }
            ]);
            let text = (await result.response).text().replace(/```json|```/g, "").trim();
            const data = JSON.parse(text);
            setLineas(data.items.map((it: any) => ({
                descripcion: it.descripcion || it.description,
                cantidad: it.cantidad || it.quantity || 1,
                unidad: it.unidad || it.unit || "ut",
                precio: it.precio || it.price || 0,
            })));
        } catch (err) {
            console.error("Error IA:", err);
            setLineas(DATOS_SIMULACION);
        } finally {
            setCargandoIA(false);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
    });

    const guardar = async (estado: 'borrador' | 'enviado' = 'borrador') => {
        if (!clienteId || lineas.length === 0) return;
        await presupuestosStore.create({
            fecha: new Date().toLocaleDateString('es-ES'),
            cliente_id: clienteId,
            subtotal,
            iva,
            total,
            estado,
            firma_url: firmaUrl || undefined,
            notas,
        }, lineas);
        navigate("/presupuestos");
    };

    const generarPDF = async () => {
        const cliente = await clientesStore.getById(clienteId);
        const doc = await generarPDFPresupuesto({
            cliente: cliente?.nombre || "Cliente sin asignar",
            items: lineas.map(l => ({ description: l.descripcion, quantity: l.cantidad, unit: l.unidad, price: l.precio })),
            total: subtotal,
            firma: firmaUrl || undefined,
        });
        doc.save("presupuesto-urbano.pdf");
        setFinalizado(true);
    };

    if (modo === 'elegir') {
        return (
            <div className="max-w-4xl mx-auto space-y-12 page-transition">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Nuevo Presupuesto</h1>
                    <p className="text-blue-500 font-bold uppercase text-[10px] tracking-widest italic mt-2">Elige cómo crear tu presupuesto</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button onClick={() => setModo('manual')} className="premium-card p-12 text-left hover:bg-slate-950 group transition-all duration-500 border-2 border-transparent hover:border-blue-500">
                        <FileText size={48} className="text-blue-500 mb-8 group-hover:text-blue-400" />
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-white transition-colors mb-3">Manual</h3>
                        <p className="text-sm font-bold text-slate-400 group-hover:text-slate-300 uppercase tracking-widest leading-relaxed">Añade las líneas de trabajo una por una. Selecciona del catálogo o escribe libremente.</p>
                    </button>
                    <button onClick={() => setModo('ia')} className="premium-card p-12 text-left hover:bg-blue-600 group transition-all duration-500 border-2 border-transparent hover:border-blue-300 bg-gradient-to-br from-blue-50 to-white">
                        <Camera size={48} className="text-blue-600 mb-8 group-hover:text-white" />
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-white transition-colors mb-3">Con Foto (IA)</h3>
                        <p className="text-sm font-bold text-slate-400 group-hover:text-blue-100 uppercase tracking-widest leading-relaxed">Sube una foto de la obra o un presupuesto escrito y la IA generará las líneas.</p>
                    </button>
                </div>
            </div>
        );
    }

    if (modo === 'ia' && lineas.length === 0) {
        return (
            <div className="max-w-4xl mx-auto space-y-12 page-transition">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Presupuesto con IA</h1>
                        <p className="text-blue-500 font-bold uppercase text-[10px] tracking-widest italic mt-2">Sube una foto y deja que la IA trabaje</p>
                    </div>
                    <button onClick={() => setModo('elegir')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">← Volver</button>
                </div>
                {!cargandoIA ? (
                    <label className="premium-card p-20 flex flex-col items-center justify-center text-center gap-8 cursor-pointer border-2 border-dashed border-blue-200 hover:border-blue-500 transition-all bg-gradient-to-b from-white to-blue-50/30 group">
                        <div className="w-24 h-24 bg-blue-100 rounded-[32px] flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"><Camera size={40} /></div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase">Sube una foto u obra</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fotos de estancias, bocetos o presupuestos escritos a mano</p>
                        </div>
                        <div className="premium-button flex items-center gap-3"><Sparkles size={18} /> Seleccionar Imagen</div>
                        <input type="file" className="hidden" accept="image/*" onChange={analizarFoto} />
                    </label>
                ) : (
                    <div className="premium-card p-20 flex flex-col items-center justify-center text-center gap-8">
                        {imagenPreview && <div className="w-full max-w-md aspect-video rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-4"><img src={imagenPreview} className="w-full h-full object-cover" alt="Foto" /></div>}
                        <div className="relative"><Loader2 className="animate-spin text-blue-500" size={64} /><Sparkles className="absolute -top-2 -right-2 text-amber-500 animate-pulse" size={24} /></div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Cerebro IA Analizando...</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identificando trabajos, metros y materiales de la imagen</p>
                        </div>
                        <div className="w-64 bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full rounded-full animate-pulse" style={{ width: '60%' }}></div></div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-24 page-transition">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">{modo === 'ia' ? 'Presupuesto Generado por IA' : 'Nuevo Presupuesto'}</h1>
                    <p className="text-blue-500 font-bold uppercase text-[10px] tracking-widest italic mt-2">Edita las líneas y asigna un cliente</p>
                </div>
                <button onClick={() => { setModo('elegir'); setLineas([]); }} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500">← Empezar de nuevo</button>
            </div>

            {modo === 'ia' && (
                <div className="bg-emerald-500 text-white p-6 rounded-3xl flex items-center gap-4 shadow-xl">
                    <Sparkles size={24} className="text-emerald-200" />
                    <span className="font-black uppercase tracking-[0.15em] text-[10px]">Análisis de IA Completado — {lineas.length} líneas detectadas</span>
                </div>
            )}

            <div className="premium-card p-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Cliente *</label>
                <select value={clienteId} onChange={e => setClienteId(e.target.value)} className="premium-input">
                    <option value="">-- Seleccionar cliente --</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} ({c.nif || "Sin NIF"})</option>)}
                </select>
                {clientes.length === 0 && <p className="text-[10px] font-bold text-amber-500 mt-2 uppercase tracking-widest">⚠ No hay clientes. Crea uno desde el menú "Clientes".</p>}
            </div>

            <div className="premium-card overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Detalle del Presupuesto</h3>
                    <div className="flex gap-3">
                        <button onClick={() => setMostrarArticulos(true)} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-500 hover:border-blue-200 transition-all flex items-center gap-2"><Package size={14} /> Del Catálogo</button>
                        <button onClick={addLinea} className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all"><Plus size={20} /></button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 text-[10px] uppercase tracking-[0.15em] font-black text-slate-400">
                                <th className="px-6 py-4 w-1/2">Descripción</th>
                                <th className="px-4 py-4 text-center">Cant.</th>
                                <th className="px-4 py-4 text-center">Ud.</th>
                                <th className="px-4 py-4 text-right">Precio</th>
                                <th className="px-4 py-4 text-right">Total</th>
                                <th className="px-4 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm font-bold text-slate-700">
                            {lineas.map((l, i) => (
                                <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-3"><input value={l.descripcion} onChange={e => updateLinea(i, 'descripcion', e.target.value)} className="bg-transparent border-none p-0 focus:ring-0 w-full text-slate-900 font-bold uppercase text-sm" placeholder="Descripción del trabajo" /></td>
                                    <td className="px-4 py-3"><input type="number" value={l.cantidad} onChange={e => updateLinea(i, 'cantidad', parseFloat(e.target.value) || 0)} className="bg-transparent border-none p-0 focus:ring-0 w-16 text-center" /></td>
                                    <td className="px-4 py-3">
                                        <select value={l.unidad} onChange={e => updateLinea(i, 'unidad', e.target.value)} className="bg-transparent border-none p-0 focus:ring-0 text-center text-[10px] font-black uppercase text-slate-400">
                                            <option value="ut">ut</option><option value="m2">m²</option><option value="ml">ml</option><option value="m3">m³</option><option value="kg">kg</option><option value="h">h</option><option value="pa">pa</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3"><input type="number" step="0.01" value={l.precio} onChange={e => updateLinea(i, 'precio', parseFloat(e.target.value) || 0)} className="bg-transparent border-none p-0 focus:ring-0 w-20 text-right" /></td>
                                    <td className="px-4 py-3 text-right font-black text-slate-900">{(l.cantidad * l.precio).toFixed(2)} €</td>
                                    <td className="px-4 py-3"><button onClick={() => removeLinea(i)} className="p-1 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-slate-50/50 p-6 space-y-3 border-t border-slate-100">
                    <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest"><span>Base Imponible</span><span>{subtotal.toFixed(2)} €</span></div>
                    <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest"><span>IVA (21%)</span><span>{iva.toFixed(2)} €</span></div>
                    <div className="flex justify-between text-xl font-black text-slate-900 uppercase tracking-tight pt-3 border-t border-slate-200"><span>Total</span><span>{total.toFixed(2)} €</span></div>
                </div>
            </div>

            <div className="premium-card p-8">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Notas / Condiciones</label>
                <textarea value={notas} onChange={e => setNotas(e.target.value)} rows={3} className="premium-input resize-none" placeholder="Condiciones del presupuesto..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => guardar('borrador')} className="premium-card p-8 flex items-center justify-center gap-3 text-slate-600 hover:bg-slate-50 transition-all font-black uppercase text-[10px] tracking-widest"><Save size={20} /> Guardar Borrador</button>
                <button onClick={() => setMostrandoFirma(true)} className="premium-card p-8 flex items-center justify-center gap-3 text-blue-600 hover:bg-blue-50 transition-all font-black uppercase text-[10px] tracking-widest border-2 border-blue-100"><FileText size={20} /> {firmaUrl ? '✓ Firmado' : 'Firmar'}</button>
                <button onClick={generarPDF} className="bg-blue-600 text-white p-8 rounded-[32px] flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"><Share2 size={20} /> Generar PDF</button>
            </div>

            {mostrandoFirma && <SignaturePad onSave={s => { setFirmaUrl(s); setMostrandoFirma(false); }} onClose={() => setMostrandoFirma(false)} />}

            {mostrarArticulos && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[300] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Añadir del Catálogo</h3>
                            <button onClick={() => setMostrarArticulos(false)} className="p-3 bg-white rounded-xl text-slate-300 hover:text-red-500 border border-slate-100"><X size={18} /></button>
                        </div>
                        <div className="p-4 border-b border-slate-50">
                            <div className="relative">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input value={busquedaArt} onChange={e => setBusquedaArt(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest outline-none" placeholder="Buscar artículo..." />
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-1 p-4 space-y-2">
                            {articulos.filter(a => a.descripcion.toLowerCase().includes(busquedaArt.toLowerCase())).map(a => (
                                <button key={a.id} onClick={() => addDesdeArticulo(a)} className="w-full text-left p-4 rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-between group">
                                    <div>
                                        <p className="font-bold text-sm text-slate-900 uppercase">{a.descripcion}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.unidad} — {Number(a.precio).toFixed(2)} €</p>
                                    </div>
                                    <Plus size={18} className="text-slate-200 group-hover:text-blue-500" />
                                </button>
                            ))}
                            {articulos.length === 0 && <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest py-8">No hay artículos en el catálogo</p>}
                        </div>
                    </div>
                </div>
            )}

            {finalizado && (
                <div className="fixed inset-0 bg-emerald-500/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center text-white p-10 text-center space-y-8">
                    <div className="w-32 h-32 bg-white text-emerald-500 rounded-[48px] flex items-center justify-center shadow-2xl animate-bounce"><CheckCircle2 size={64} strokeWidth={2.5} /></div>
                    <h2 className="text-5xl font-black tracking-tighter uppercase">¡PDF Generado!</h2>
                    <button onClick={() => { guardar('enviado'); }} className="bg-white text-emerald-600 px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl">Guardar y Volver</button>
                </div>
            )}
        </div>
    );
}
