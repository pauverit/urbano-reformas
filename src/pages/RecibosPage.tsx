import { useState, useEffect } from "react";
import { recibosStore, facturasStore, clientesStore, presupuestosStore, type Recibo, type Factura, type Cliente, type Presupuesto } from "../lib/store";
import { Receipt, Plus, Wallet, X, Save } from "lucide-react";
import SignaturePad from "../components/SignaturePad";
import { generarPDFRecibo } from "../lib/pdfGenerator";

export default function RecibosPage() {
    const [recibos, setRecibos] = useState<Recibo[]>([]);
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [mostrandoFirma, setMostrandoFirma] = useState(false);
    const [form, setForm] = useState({ documentoId: "", tipoDocumento: "presupuesto", concepto: "", importe: 0 });
    const [firmaTemp, setFirmaTemp] = useState<string | null>(null);
    const [cargando, setCargando] = useState(true);

    const cargar = async () => {
        setCargando(true);
        setRecibos(await recibosStore.getAll());
        setFacturas(await facturasStore.getAll());
        setPresupuestos(await presupuestosStore.getAll());
        setClientes(await clientesStore.getAll());
        setCargando(false);
    };
    useEffect(() => { cargar(); }, []);

    const getCliente = (id: string) => clientes.find(c => c.id === id);
    const totalCobrado = recibos.reduce((s, r) => s + Number(r.importe), 0);

    const crearRecibo = async () => {
        if (!form.documentoId || !form.importe) return;

        let clienteId = "";
        let docRefTotal = 0;
        let pRef = form.tipoDocumento === 'presupuesto' ? form.documentoId : undefined;
        let fRef = form.tipoDocumento === 'factura' ? form.documentoId : undefined;
        let numeroTexto = "";

        if (form.tipoDocumento === 'factura') {
            const f = facturas.find(x => x.id === form.documentoId);
            if (!f) return;
            clienteId = f.cliente_id;
            docRefTotal = f.total;
            numeroTexto = f.numero || "";
        } else {
            const p = presupuestos.find(x => x.id === form.documentoId);
            if (!p) return;
            clienteId = p.cliente_id;
            docRefTotal = p.total;
            numeroTexto = p.numero || "";
        }

        const recibo = await recibosStore.create({
            fecha: new Date().toLocaleDateString('es-ES'),
            factura_id: fRef,
            presupuesto_id: pRef,
            cliente_id: clienteId,
            concepto: form.concepto || `Entrega a cuenta ${numeroTexto}`,
            importe: form.importe,
            firma_url: firmaTemp || undefined
        });

        const cliente = getCliente(clienteId);
        const doc = await generarPDFRecibo({
            cliente: cliente?.nombre || "Cliente",
            concepto: form.concepto || `Entrega a cuenta ${numeroTexto}`,
            importe: Number(docRefTotal),
            entrega: form.importe,
            restante: Number(docRefTotal) - form.importe,
            firma: firmaTemp || undefined
        });

        doc.save(`recibo-${recibo?.numero || 'nuevo'}.pdf`);
        await cargar(); setModalOpen(false); setFirmaTemp(null); setForm({ documentoId: "", tipoDocumento: "presupuesto", concepto: "", importe: 0 });
    };

    return (
        <div className="space-y-10 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div><h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Recibos</h1><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Gestión de Cobros y Entregas a Cuenta</p></div>
                <button onClick={() => setModalOpen(true)} className="premium-button flex items-center gap-3"><Plus size={18} /> Nuevo Recibo</button>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-4">
                    {cargando ? <div className="premium-card p-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div></div>
                        : recibos.length === 0 ? <div className="premium-card p-20 text-center space-y-4"><Receipt size={48} className="mx-auto text-slate-200" /><p className="text-xl font-black text-slate-300 uppercase">Sin recibos</p></div>
                            : recibos.map(r => {
                                const cliente = getCliente(r.cliente_id);
                                return (
                                    <div key={r.id} className="premium-card p-6 flex items-center justify-between group border-l-4 border-l-emerald-500">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all"><Receipt size={24} /></div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1"><span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">{r.numero}</span>{r.firma_url && <span className="text-[10px] font-black text-blue-400 bg-blue-50 px-2 py-0.5 rounded-full">✓ Firmado</span>}</div>
                                                <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{cliente?.nombre || "—"}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.concepto}</p>
                                            </div>
                                        </div>
                                        <div className="text-right"><p className="text-xl font-black text-slate-900 tracking-tighter">{Number(r.importe).toFixed(2)} €</p><p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{r.fecha}</p></div>
                                    </div>
                                );
                            })}
                </div>
                <div className="bg-slate-900 p-10 rounded-[40px] text-white space-y-8 shadow-2xl h-fit">
                    <div className="flex items-center gap-4 text-blue-400"><Wallet size={32} /><h3 className="text-xl font-black tracking-tight uppercase">Resumen Caja</h3></div>
                    <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Cobrado</p><p className="text-4xl font-black text-white tracking-tighter">{totalCobrado.toFixed(2)} €</p></div>
                    <div className="pt-6 border-t border-slate-800"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Recibos Emitidos</p><p className="text-2xl font-black text-emerald-400 tracking-tighter">{recibos.length}</p></div>
                </div>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[300] flex items-center justify-center p-6">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 shrink-0"><h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nuevo Recibo</h3><button onClick={() => setModalOpen(false)} className="p-4 bg-white rounded-2xl text-slate-300 hover:text-red-500 border border-slate-100"><X size={20} /></button></div>
                        <div className="p-8 space-y-6 overflow-y-auto">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Vincular a *</label>
                                <select
                                    value={form.documentoId ? `${form.tipoDocumento}-${form.documentoId}` : ""}
                                    onChange={e => {
                                        if (!e.target.value) {
                                            setForm({ ...form, tipoDocumento: "presupuesto", documentoId: "" });
                                            return;
                                        }
                                        const parts = e.target.value.split('-');
                                        const tipo = parts[0];
                                        const id = parts.slice(1).join('-');
                                        setForm({ ...form, tipoDocumento: tipo, documentoId: id });
                                    }}
                                    className="premium-input"
                                >
                                    <option value="">-- Seleccionar documento --</option>
                                    <optgroup label="PRESUPUESTOS">
                                        {presupuestos.map(p => {
                                            const cl = getCliente(p.cliente_id);
                                            return <option key={p.id} value={`presupuesto-${p.id}`}>{p.numero} — {cl?.nombre || "—"} — {Number(p.total).toFixed(2)} €</option>;
                                        })}
                                    </optgroup>
                                    <optgroup label="FACTURAS">
                                        {facturas.map(f => {
                                            const cl = getCliente(f.cliente_id);
                                            return <option key={f.id} value={`factura-${f.id}`}>{f.numero} — {cl?.nombre || "—"} — {Number(f.total).toFixed(2)} €</option>;
                                        })}
                                    </optgroup>
                                </select>
                            </div>
                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Concepto</label><input value={form.concepto} onChange={e => setForm({ ...form, concepto: e.target.value })} className="premium-input" placeholder="Ej: Entrega a cuenta reforma" /></div>
                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Importe (€) *</label><input type="number" step="0.01" value={form.importe} onChange={e => setForm({ ...form, importe: parseFloat(e.target.value) || 0 })} className="premium-input" /></div>
                            <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Firma del Cliente</label>
                                {firmaTemp ? <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/30 rounded-2xl p-4 relative"><img src={firmaTemp} alt="Firma" className="h-24 mx-auto" /><button onClick={() => setMostrandoFirma(true)} className="absolute top-2 right-2 text-[10px] font-black text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">Cambiar</button></div>
                                    : <button onClick={() => setMostrandoFirma(true)} className="w-full h-24 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-widest hover:border-blue-200 hover:text-blue-500 transition-all">Pulsar para firmar</button>}</div>
                        </div>
                        <div className="p-8 flex gap-4 bg-white border-t border-slate-50 shrink-0">
                            <button onClick={() => setModalOpen(false)} className="flex-1 px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50 border border-slate-50">Cancelar</button>
                            <button onClick={crearRecibo} className="flex-1 bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 hover:bg-emerald-700 active:scale-95 border-none disabled:opacity-50" disabled={!form.documentoId || !form.importe}><Save size={16} /> Crear y Descargar</button>
                        </div>
                    </div>
                </div>
            )}
            {mostrandoFirma && <SignaturePad onSave={s => { setFirmaTemp(s); setMostrandoFirma(false); }} onClose={() => setMostrandoFirma(false)} />}
        </div>
    );
}
