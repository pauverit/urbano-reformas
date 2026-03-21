import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientesStore, presupuestosStore, facturasStore, type Cliente, type Presupuesto, type Factura } from "../lib/store";
import { ArrowLeft, User, Building2, Phone, Mail, FileText, Receipt, CheckCircle2, Clock } from "lucide-react";

export default function ClienteFichaPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [cargando, setCargando] = useState(true);
    const [pestana, setPestana] = useState<'presupuestos' | 'facturas'>('presupuestos');

    useEffect(() => {
        if (!id) return;
        (async () => {
            setCargando(true);
            const cl = await clientesStore.getById(id);
            if (cl) setCliente(cl);

            const pres = await presupuestosStore.getAll();
            setPresupuestos(pres.filter(p => p.cliente_id === id));

            const facts = await facturasStore.getAll();
            setFacturas(facts.filter(f => f.cliente_id === id));

            setCargando(false);
        })();
    }, [id]);

    if (cargando) {
        return <div className="p-20 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>Cargando ficha del cliente...</div>;
    }

    if (!cliente) {
        return <div className="p-20 text-center"><p className="text-xl font-black text-slate-800 uppercase">Cliente no encontrado</p><button onClick={() => navigate('/clientes')} className="mt-4 text-blue-500 font-bold uppercase text-[10px]">Volver</button></div>;
    }

    const formatCurrency = (n: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

    return (
        <div className="space-y-8 page-transition pb-20">
            {/* Cabecera */}
            <header className="flex items-center gap-4">
                <button onClick={() => navigate('/clientes')} className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-blue-600 transition-all"><ArrowLeft size={18} /></button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Ficha de Cliente</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic mt-1">Centro 360°</p>
                </div>
            </header>

            {/* Tarjeta de Info Principal */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
                <div className="w-24 h-24 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-4xl font-black shadow-inner flex-shrink-0 border-4 border-white">
                    {cliente.nombre.charAt(0)}
                </div>
                <div className="flex-1 space-y-4 z-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">{cliente.nombre}</h2>
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-md text-[10px] font-black uppercase tracking-widest mt-2">{cliente.nif || 'Sin NIF'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-bold"><Phone size={16} className="text-slate-300" /> {cliente.telefono || '—'}</div>
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-bold"><Mail size={16} className="text-slate-300" /> {cliente.email || '—'}</div>
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-bold"><Building2 size={16} className="text-slate-300" /> {cliente.poblacion ? `${cliente.poblacion} (${cliente.cp})` : '—'}</div>
                    </div>
                </div>
            </div>

            {/* Pestañas & Contenido */}
            <div className="space-y-6">
                <div className="flex gap-4 border-b border-slate-200">
                    <button onClick={() => setPestana('presupuestos')} className={`pb-4 px-2 uppercase text-[10px] tracking-widest font-black transition-all ${pestana === 'presupuestos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Presupuestos ({presupuestos.length})</button>
                    <button onClick={() => setPestana('facturas')} className={`pb-4 px-2 uppercase text-[10px] tracking-widest font-black transition-all ${pestana === 'facturas' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>Facturas ({facturas.length})</button>
                </div>

                {/* Lista de Presupuestos */}
                {pestana === 'presupuestos' && (
                    presupuestos.length === 0 ? <p className="text-center p-10 font-bold text-slate-400 text-[11px] uppercase tracking-widest bg-white rounded-3xl border border-dashed border-slate-200">No hay presupuestos para este cliente.</p> :
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50">
                                    <tr className="text-[9px] uppercase tracking-[0.15em] font-black text-slate-400 border-b border-slate-100">
                                        <th className="px-6 py-4">Fecha</th>
                                        <th className="px-6 py-4">Estado</th>
                                        <th className="px-6 py-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-[13px] font-bold text-slate-700">
                                    {presupuestos.map(p => (
                                        <tr key={p.id} className="hover:bg-blue-50/40 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3"><FileText size={16} className="text-blue-400" />{p.fecha}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-black rounded-lg ${p.estado === 'aceptado' || p.estado === 'facturado' ? 'bg-emerald-100 text-emerald-700' : p.estado === 'enviado' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black">{formatCurrency(p.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                )}

                {/* Lista de Facturas */}
                {pestana === 'facturas' && (
                    facturas.length === 0 ? <p className="text-center p-10 font-bold text-slate-400 text-[11px] uppercase tracking-widest bg-white rounded-3xl border border-dashed border-slate-200">No hay facturas para este cliente.</p> :
                        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50">
                                    <tr className="text-[9px] uppercase tracking-[0.15em] font-black text-slate-400 border-b border-slate-100">
                                        <th className="px-6 py-4">Núm / Fecha</th>
                                        <th className="px-6 py-4">Estado</th>
                                        <th className="px-6 py-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-[13px] font-bold text-slate-700">
                                    {facturas.map(f => (
                                        <tr key={f.id} className="hover:bg-amber-50/40 transition-colors">
                                            <td className="px-6 py-4 flex items-center gap-3"><Receipt size={16} className="text-amber-400" /><div><span className="block text-slate-900">{f.numero || 'Borrador'}</span><span className="text-[9px] text-slate-400 uppercase tracking-widest">{f.fecha}</span></div></td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-[9px] uppercase tracking-widest font-black rounded-lg ${f.estado === 'cobrada' ? 'bg-emerald-100 text-emerald-700' : f.estado === 'pendiente' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {f.estado === 'cobrada' ? <CheckCircle2 size={10} className="inline mr-1" /> : <Clock size={10} className="inline mr-1" />}
                                                    {f.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black">{formatCurrency(f.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                )}
            </div>
        </div>
    );
}
