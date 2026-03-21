import { useState, useEffect } from "react";
import { presupuestosStore, clientesStore, facturasStore, recibosStore, type Presupuesto, type Cliente, type Recibo } from "../lib/store";
import { Plus, FileText, CheckCircle2, Send, Receipt } from "lucide-react";
import { Link } from "react-router-dom";

const ESTADO_COLORES: Record<string, { bg: string; text: string }> = {
    borrador: { bg: "bg-slate-100", text: "text-slate-500" },
    enviado: { bg: "bg-blue-50", text: "text-blue-600" },
    aceptado: { bg: "bg-emerald-50", text: "text-emerald-600" },
    facturado: { bg: "bg-purple-50", text: "text-purple-600" },
};

export default function PresupuestosPage() {
    const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [recibos, setRecibos] = useState<Recibo[]>([]);
    const [filtro, setFiltro] = useState("todos");
    const [cargando, setCargando] = useState(true);

    const cargar = async () => { setCargando(true); setPresupuestos(await presupuestosStore.getAll()); setClientes(await clientesStore.getAll()); setRecibos(await recibosStore.getAll()); setCargando(false); };
    useEffect(() => { cargar(); }, []);

    const getCliente = (id: string) => clientes.find(c => c.id === id);
    const filtrados = filtro === "todos" ? presupuestos : presupuestos.filter(p => p.estado === filtro);

    const cambiarEstado = async (id: string, estado: Presupuesto['estado']) => {
        await presupuestosStore.update(id, { estado });
        await cargar();
    };

    const pasarAFactura = async (pres: Presupuesto) => {
        await facturasStore.create({
            fecha: new Date().toLocaleDateString('es-ES'),
            presupuesto_id: pres.id!,
            cliente_id: pres.cliente_id,
            subtotal: pres.subtotal,
            iva: pres.iva,
            total: pres.total,
            estado: 'pendiente',
        }, pres.lineas || []);
        await presupuestosStore.update(pres.id!, { estado: 'facturado' });
        await cargar();
    };

    return (
        <div className="space-y-10 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Presupuestos</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Ventas, Propuestas e Inteligencia Artificial</p>
                </div>
                <Link to="/presupuestos/new" className="premium-button flex items-center gap-3">
                    <Plus size={18} /> Crear Nuevo
                </Link>
            </header>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {["todos", "borrador", "enviado", "aceptado", "facturado"].map(f => (
                    <button key={f} onClick={() => setFiltro(f)} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${filtro === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
                        {f === "todos" ? "Todos" : f.charAt(0).toUpperCase() + f.slice(1)}
                        {f !== "todos" && <span className="ml-2 opacity-60">({presupuestos.filter(p => p.estado === f).length})</span>}
                    </button>
                ))}
            </div>

            {cargando ? (
                <div className="premium-card p-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div></div>
            ) : filtrados.length === 0 ? (
                <div className="premium-card p-20 text-center space-y-4">
                    <FileText size={48} className="mx-auto text-slate-200" />
                    <p className="text-xl font-black text-slate-300 uppercase">Sin presupuestos</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Crea tu primer presupuesto con IA o manualmente</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtrados.map(p => {
                        const cliente = getCliente(p.cliente_id);
                        const color = ESTADO_COLORES[p.estado] || ESTADO_COLORES.borrador;

                        const recibosPto = recibos.filter(r => r.presupuesto_id === p.id);
                        const entregado = recibosPto.reduce((sum, r) => sum + Number(r.importe), 0);
                        const restante = Number(p.total) - entregado;

                        return (
                            <div key={p.id} className="premium-card group">
                                <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full">{p.numero}</span>
                                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${color.bg} ${color.text}`}>{p.estado}</span>
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{p.fecha}</span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                            {cliente?.nombre || "Cliente sin asignar"}
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{(p.lineas || []).length} líneas de trabajo</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total (IVA incl.)</p>
                                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{Number(p.total).toFixed(2)} €</p>
                                            {entregado > 0 && (
                                                <div className="mt-2 flex flex-col items-end gap-1">
                                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-widest">
                                                        Cobrado: {entregado.toFixed(2)} €
                                                    </span>
                                                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md uppercase tracking-widest">
                                                        Pte: {restante.toFixed(2)} €
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-4 items-center">
                                            <select
                                                value={p.estado}
                                                onChange={(e) => cambiarEstado(p.id!, e.target.value as any)}
                                                className="text-[10px] font-black uppercase tracking-widest bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-3 py-2 cursor-pointer outline-none hover:border-blue-400 focus:border-blue-500 transition-all"
                                            >
                                                <option value="borrador">Borrador</option>
                                                <option value="enviado">Enviado</option>
                                                <option value="aceptado">Aceptado</option>
                                                <option value="facturado">Facturado</option>
                                            </select>

                                            {p.estado === 'aceptado' && (
                                                <button onClick={() => pasarAFactura(p)} className="p-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all border border-purple-100" title="Generar Factura">
                                                    <Receipt size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
