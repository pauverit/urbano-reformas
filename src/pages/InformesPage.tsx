import { useState, useEffect } from "react";
import { facturasStore, gastosStore, clientesStore, type Factura, type Gasto, type Cliente } from "../lib/store";
import { BarChart3, TrendingUp, TrendingDown, Download, FileText, Receipt } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const TRIMESTRES = [
    { label: "1T (Ene-Mar)", meses: ["01", "02", "03"] },
    { label: "2T (Abr-Jun)", meses: ["04", "05", "06"] },
    { label: "3T (Jul-Sep)", meses: ["07", "08", "09"] },
    { label: "4T (Oct-Dic)", meses: ["10", "11", "12"] },
];

export default function InformesPage() {
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [gastos, setGastos] = useState<Gasto[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [trimestre, setTrimestre] = useState(0);
    const [anio, setAnio] = useState(new Date().getFullYear().toString());
    const [cargando, setCargando] = useState(true);

    useEffect(() => { (async () => { setCargando(true); setFacturas(await facturasStore.getAll()); setGastos(await gastosStore.getAll()); setClientes(await clientesStore.getAll()); setCargando(false); })(); }, []);

    const mesesTrim = TRIMESTRES[trimestre].meses;
    const matchFecha = (fecha: string) => mesesTrim.some(m => fecha.includes(`/${m}/`) && fecha.includes(anio));

    const facturasT = facturas.filter(f => matchFecha(f.fecha));
    const gastosT = gastos.filter(g => matchFecha(g.fecha));

    const ivaRepercutido = facturasT.reduce((s, f) => s + Number(f.iva), 0);
    const ivaSoportado = gastosT.reduce((s, g) => s + Number(g.iva), 0);
    const resultadoIVA = ivaRepercutido - ivaSoportado;
    const ingresos = facturasT.reduce((s, f) => s + Number(f.total), 0);
    const totalGastos = gastosT.reduce((s, g) => s + Number(g.total), 0);
    const beneficio = ingresos - totalGastos;

    const getCliente = (id: string) => clientes.find(c => c.id === id);

    const exportarPDF = () => {
        const doc = new jsPDF();
        const pw = doc.internal.pageSize.getWidth();
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pw, 40, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(`INFORME ${TRIMESTRES[trimestre].label} ${anio}`, 20, 26);

        let y = 55;
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(14);
        doc.text("RESUMEN IVA", 20, y);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`IVA Repercutido (facturas): ${ivaRepercutido.toFixed(2)} EUR`, 20, y + 10);
        doc.text(`IVA Soportado (gastos): ${ivaSoportado.toFixed(2)} EUR`, 20, y + 17);
        doc.setFont("helvetica", "bold");
        doc.text(`Resultado: ${resultadoIVA >= 0 ? 'A pagar' : 'A devolver'}: ${Math.abs(resultadoIVA).toFixed(2)} EUR`, 20, y + 27);

        y += 40;
        doc.setFontSize(14);
        doc.text("FACTURAS EMITIDAS", 20, y);
        if (facturasT.length > 0) {
            autoTable(doc, {
                startY: y + 5,
                head: [["N", "Fecha", "Cliente", "Base", "IVA", "Total"]],
                body: facturasT.map(f => [f.numero || '', f.fecha, getCliente(f.cliente_id)?.nombre || '-', `${Number(f.subtotal).toFixed(2)}`, `${Number(f.iva).toFixed(2)}`, `${Number(f.total).toFixed(2)}`]),
                theme: "striped", headStyles: { fillColor: [37, 99, 235], fontSize: 8 }, styles: { fontSize: 7 },
            });
            y = (doc as any).lastAutoTable.finalY + 10;
        } else { doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.text("Sin facturas en este periodo", 20, y + 8); y += 15; }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("GASTOS", 20, y);
        if (gastosT.length > 0) {
            autoTable(doc, {
                startY: y + 5,
                head: [["N", "Fecha", "Proveedor", "Concepto", "Base", "IVA", "Total"]],
                body: gastosT.map(g => [g.numero || '', g.fecha, g.proveedor, g.concepto, `${Number(g.base_imponible).toFixed(2)}`, `${Number(g.iva).toFixed(2)}`, `${Number(g.total).toFixed(2)}`]),
                theme: "striped", headStyles: { fillColor: [245, 158, 11], fontSize: 8 }, styles: { fontSize: 7 },
            });
        }

        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text("Urbano Reformas — Informe generado electrónicamente", pw / 2, 289, { align: "center" });

        doc.save(`informe-${TRIMESTRES[trimestre].label}-${anio}.pdf`);
    };

    return (
        <div className="space-y-10 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div><h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Informes</h1><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">IVA Trimestral, Resumen de Ingresos y Gastos para Gestoría</p></div>
                <button onClick={exportarPDF} className="premium-button flex items-center gap-3"><Download size={18} /> Exportar PDF</button>
            </header>

            <div className="flex items-center gap-4">
                <div className="flex bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    {TRIMESTRES.map((t, i) => (
                        <button key={i} onClick={() => setTrimestre(i)} className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${trimestre === i ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}>{t.label}</button>
                    ))}
                </div>
                <input type="text" value={anio} onChange={e => setAnio(e.target.value)} className="premium-input w-24 text-center" placeholder="2026" />
            </div>

            {cargando ? <div className="premium-card p-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div></div> : (
                <>
                    {/* Tarjetas resumen */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="premium-card p-8 border-l-4 border-l-blue-500">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">IVA Repercutido</p>
                            <p className="text-3xl font-black text-blue-600 tracking-tighter">{ivaRepercutido.toFixed(2)} €</p>
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">{facturasT.length} facturas</p>
                        </div>
                        <div className="premium-card p-8 border-l-4 border-l-amber-500">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">IVA Soportado</p>
                            <p className="text-3xl font-black text-amber-600 tracking-tighter">{ivaSoportado.toFixed(2)} €</p>
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">{gastosT.length} gastos</p>
                        </div>
                        <div className={`premium-card p-8 border-l-4 ${resultadoIVA >= 0 ? 'border-l-red-500' : 'border-l-emerald-500'}`}>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{resultadoIVA >= 0 ? 'IVA a Pagar' : 'IVA a Devolver'}</p>
                            <p className={`text-3xl font-black tracking-tighter ${resultadoIVA >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>{Math.abs(resultadoIVA).toFixed(2)} €</p>
                        </div>
                        <div className={`premium-card p-8 border-l-4 ${beneficio >= 0 ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Beneficio Neto</p>
                            <p className={`text-3xl font-black tracking-tighter ${beneficio >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{beneficio.toFixed(2)} €</p>
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">{ingresos.toFixed(2)} ingresos — {totalGastos.toFixed(2)} gastos</p>
                        </div>
                    </div>

                    {/* Detalle facturas */}
                    <div className="premium-card overflow-hidden">
                        <div className="p-6 bg-slate-50/50 flex items-center gap-3"><FileText size={18} className="text-blue-500" /><h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Facturas del Trimestre</h3></div>
                        {facturasT.length === 0 ? <div className="p-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin facturas en este periodo</div> : (
                            <table className="w-full text-left">
                                <thead><tr className="bg-slate-50/80 text-[10px] uppercase tracking-[0.15em] font-black text-slate-400"><th className="px-6 py-3">Nº</th><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3 text-right">Base</th><th className="px-4 py-3 text-right">IVA</th><th className="px-4 py-3 text-right">Total</th></tr></thead>
                                <tbody className="divide-y divide-slate-50">{facturasT.map(f => <tr key={f.id} className="text-sm"><td className="px-6 py-3 font-black text-blue-500">{f.numero}</td><td className="px-4 py-3 font-bold text-slate-500">{f.fecha}</td><td className="px-4 py-3 font-bold text-slate-900 uppercase">{getCliente(f.cliente_id)?.nombre || '—'}</td><td className="px-4 py-3 text-right font-bold">{Number(f.subtotal).toFixed(2)} €</td><td className="px-4 py-3 text-right font-bold text-slate-400">{Number(f.iva).toFixed(2)} €</td><td className="px-4 py-3 text-right font-black">{Number(f.total).toFixed(2)} €</td></tr>)}</tbody>
                            </table>
                        )}
                    </div>

                    {/* Detalle gastos */}
                    <div className="premium-card overflow-hidden">
                        <div className="p-6 bg-slate-50/50 flex items-center gap-3"><Receipt size={18} className="text-amber-500" /><h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Gastos del Trimestre</h3></div>
                        {gastosT.length === 0 ? <div className="p-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin gastos en este periodo</div> : (
                            <table className="w-full text-left">
                                <thead><tr className="bg-slate-50/80 text-[10px] uppercase tracking-[0.15em] font-black text-slate-400"><th className="px-6 py-3">Nº</th><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Proveedor</th><th className="px-4 py-3">Categoría</th><th className="px-4 py-3 text-right">Base</th><th className="px-4 py-3 text-right">IVA</th><th className="px-4 py-3 text-right">Total</th></tr></thead>
                                <tbody className="divide-y divide-slate-50">{gastosT.map(g => <tr key={g.id} className="text-sm"><td className="px-6 py-3 font-black text-amber-500">{g.numero}</td><td className="px-4 py-3 font-bold text-slate-500">{g.fecha}</td><td className="px-4 py-3 font-bold text-slate-900 uppercase">{g.proveedor}</td><td className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">{g.categoria}</td><td className="px-4 py-3 text-right font-bold">{Number(g.base_imponible).toFixed(2)} €</td><td className="px-4 py-3 text-right font-bold text-slate-400">{Number(g.iva).toFixed(2)} €</td><td className="px-4 py-3 text-right font-black">{Number(g.total).toFixed(2)} €</td></tr>)}</tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
